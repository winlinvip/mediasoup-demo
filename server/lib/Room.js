const EventEmitter = require('events').EventEmitter;
const protooServer = require('protoo-server');
const Logger = require('./Logger');
const config = require('../config');

const MAX_BITRATE = config.mediasoup.maxBitrate || 3000000;
const MIN_BITRATE = Math.min(50000 || MAX_BITRATE);
const BITRATE_FACTOR = 0.75;

const logger = new Logger('Room');

class Room extends EventEmitter
{
	constructor(roomId, mediaServer)
	{
		logger.info('constructor() [roomId:"%s"]', roomId);

		super();
		this.setMaxListeners(Infinity);

		// Room ID.
		this._roomId = roomId;

		// Closed flag.
		this._closed = false;

		try
		{
			// Protoo Room instance.
			this._protooRoom = new protooServer.Room();

			// mediasoup Room instance.
			this._mediaRoom = mediaServer.Room(config.mediasoup.mediaCodecs);
		}
		catch (error)
		{
			this.close();

			throw error;
		}

		// Current max bitrate for all the participants.
		this._maxBitrate = MAX_BITRATE;

		this._handleMediaRoom();
	}

	get id()
	{
		return this._roomId;
	}

	get ready()
	{
		return Boolean(this._mediaRoom);
	}

	close()
	{
		logger.debug('close()');

		this._closed = true;

		// Close the protoo Room.
		if (this._protooRoom)
			this._protooRoom.close();

		// Close the mediasoup Room.
		if (this._mediaRoom)
			this._mediaRoom.close();

		// Emit 'close' event.
		this.emit('close');
	}

	logStatus()
	{
		if (!this._mediaRoom)
			return;

		logger.info(
			'logStatus() [room id:"%s", protoo peers:%s, mediasoup peers:%s]',
			this._roomId,
			this._protooRoom.peers.length,
			this._mediaRoom.peers.length);
	}

	handleConnection(peerName, transport)
	{
		logger.info('handleConnection() [peerName:"%s"]', peerName);

		if (this._protooRoom.hasPeer(peerName))
		{
			logger.warn(
				'handleConnection() | there is already a peer with same peerName, ' +
				'closing the previous one [peerName:"%s"]',
				peerName);

			const protooPeer = this._protooRoom.getPeer(peerName);

			protooPeer.close();
		}

		const protooPeer = this._protooRoom.createPeer(peerName, transport);

		this._handleProtooPeer(protooPeer);
	}

	_handleMediaRoom()
	{
		logger.debug('_handleMediaRoom()');

		this._mediaRoom.on('newpeer', (peer) =>
		{
			this._updateMaxBitrate();

			peer.on('close', () =>
			{
				this._updateMaxBitrate();
			});
		});
	}

	_handleProtooPeer(protooPeer)
	{
		logger.debug('_handleProtooPeer() [peer:"%s"]', protooPeer.id);

		protooPeer.on('request', (request, accept, reject) =>
		{
			logger.debug(
				'protoo "request" event [method:%s, peer:"%s"]',
				request.method, protooPeer.id);

			switch (request.method)
			{
				case 'mediasoup-request':
				{
					const mediasoupRequest = request.data;

					this._handleMediasoupClientRequest(
						protooPeer, mediasoupRequest, accept, reject);

					break;
				}

				case 'mediasoup-notification':
				{
					accept();

					const mediasoupNotification = request.data;

					this._handleMediasoupClientNotification(
						protooPeer, mediasoupNotification);

					break;
				}

				case 'change-display-name':
				{
					accept();

					const { displayName } = request.data;

					// Spread to others via protoo.
					this._protooRoom.spread(
						'display-name-changed',
						{
							peer :
							{
								peerName    : protooPeer.id,
								displayName : displayName
							}
						},
						[ protooPeer ]);

					break;
				}

				default:
				{
					logger.error('unknown request.method "%s"', request.method);

					reject(400, `unknown request.method "${request.method}"`);
				}
			}
		});

		protooPeer.on('close', () =>
		{
			logger.debug('protoo Peer "close" event [peer:"%s"]', protooPeer.id);

			const { mediaPeer } = protooPeer.data;

			if (mediaPeer && !mediaPeer.closed)
				mediaPeer.close();

			// If this is the latest peer in the room, close the room.
			// However wait a bit (for reconnections).
			setTimeout(() =>
			{
				if (this._mediaRoom && this._mediaRoom.closed)
					return;

				if (this._mediaRoom.peers.length === 0)
				{
					logger.info(
						'last peer in the room left, closing the room [roomId:"%s"]',
						this._roomId);

					this.close();
				}
			}, 5000);
		});
	}

	_handleMediaPeer(protooPeer, mediaPeer)
	{
		mediaPeer.on('notify', (notification) =>
		{
			protooPeer.send('mediasoup-notification', notification)
				.catch(() => {});
		});
	}

	_handleMediasoupClientRequest(protooPeer, request, accept, reject)
	{
		logger.debug(
			'mediasoup-client request [method:%s, peer:"%s"]',
			request.method, protooPeer.id);

		switch (request.method)
		{
			case 'queryRoom':
			{
				this._mediaRoom.receiveRequest(request)
					.then((response) => accept(response))
					.catch((error) => reject(500, error.toString()));

				break;
			}

			case 'join':
			{
				// TODO: Handle appData.
				const { peerName } = request;

				if (peerName !== protooPeer.id)
				{
					reject(403, 'that is not your corresponding mediasoup Peer name');

					break;
				}
				else if (protooPeer.data.mediaPeer)
				{
					reject(500, 'already have a mediasoup Peer');

					break;
				}

				this._mediaRoom.receiveRequest(request)
					.then((response) =>
					{
						accept(response);

						// Get the newly created mediasoup Peer.
						const mediaPeer = this._mediaRoom.getPeerByName(peerName);

						protooPeer.data.mediaPeer = mediaPeer;

						this._handleMediaPeer(protooPeer, mediaPeer);
					})
					.catch((error) =>
					{
						reject(500, error.toString());
					});

				break;
			}

			default:
			{
				const { mediaPeer } = protooPeer.data;

				if (!mediaPeer)
				{
					logger.error(
						'cannot handle mediasoup request, no mediasoup Peer [method:"%s"]',
						request.method);

					reject(400, 'no mediasoup Peer');
				}

				mediaPeer.receiveRequest(request)
					.then((response) => accept(response))
					.catch((error) => reject(500, error.toString()));
			}
		}
	}

	_handleMediasoupClientNotification(protooPeer, notification)
	{
		logger.debug(
			'mediasoup-client notification [method:%s, peer:"%s"]',
			notification.method, protooPeer.id);

		// NOTE: mediasoup-client just sends notifications with target 'peer',
		// so first of all, get the mediasoup Peer.
		const { mediaPeer } = protooPeer.data;

		if (!mediaPeer)
		{
			logger.error(
				'cannot handle mediasoup notification, no mediasoup Peer [method:"%s"]',
				notification.method);

			return;
		}

		mediaPeer.receiveNotification(notification);
	}

	_updateMaxBitrate()
	{
		if (this._mediaRoom.closed)
			return;

		const numPeers = this._mediaRoom.peers.length;
		const previousMaxBitrate = this._maxBitrate;
		let newMaxBitrate;

		if (numPeers <= 2)
		{
			newMaxBitrate = MAX_BITRATE;
		}
		else
		{
			newMaxBitrate = Math.round(MAX_BITRATE / ((numPeers - 1) * BITRATE_FACTOR));

			if (newMaxBitrate < MIN_BITRATE)
				newMaxBitrate = MIN_BITRATE;
		}

		if (newMaxBitrate === previousMaxBitrate)
			return;

		for (const peer of this._mediaRoom.peers)
		{
			if (!peer.capabilities || peer.closed)
				continue;

			for (const transport of peer.transports)
			{
				if (transport.closed)
					continue;

				transport.setMaxBitrate(newMaxBitrate);
			}
		}

		logger.info(
			'_updateMaxBitrate() [num peers:%s, before:%skbps, now:%skbps]',
			numPeers,
			Math.round(previousMaxBitrate / 1000),
			Math.round(newMaxBitrate / 1000));

		this._maxBitrate = newMaxBitrate;
	}
}

module.exports = Room;
