#!/usr/bin/env node

'use strict';

process.title = 'mediasoup-demo-test-server';

const config = require('./config');

process.env.DEBUG = config.debug || '*LOG* *WARN* *ERROR*';

const fs = require('fs');
const https = require('https');
const url = require('url');
const protooServer = require('protoo-server');
const colors = require('colors/safe');
const repl = require('repl');
const logger = require('./lib/logger')();
const DATA = require('./test-data');

// HTTPS server for the protoo WebSocjet server.
const tls =
{
	cert : fs.readFileSync(config.tls.cert),
	key  : fs.readFileSync(config.tls.key)
};

const httpsServer = https.createServer(tls, (req, res) =>
{
	res.writeHead(404, 'Not Here');
	res.end();
});

httpsServer.listen(config.protoo.listenPort, config.protoo.listenIp, () =>
{
	logger.log('protoo WebSocket server running');
});

// Protoo WebSocket server.
const webSocketServer = new protooServer.WebSocketServer(httpsServer,
	{
		maxReceivedFrameSize     : 960000, // 960 KBytes.
		maxReceivedMessageSize   : 960000,
		fragmentOutgoingMessages : true,
		fragmentationThreshold   : 960000
	});

// Protoo Room.
const protooRoom = new protooServer.Room();

// Handle connections from clients.
webSocketServer.on('connectionrequest', (info, accept, reject) =>
{
	// The client indicates the roomId and peerName in the URL query.
	const u = url.parse(info.request.url, true);
	const roomId = u.query['roomId'];
	const peerName = u.query['peerName'];

	if (!roomId || !peerName)
	{
		logger.warn('connection request without roomId and/or peerName');

		reject(400, 'Connection request without roomId and/or peerName');

		return;
	}

	logger.log('connection request [roomId:"%s", peerName:"%s"]', roomId, peerName);

	const transport = accept();
	const protooPeer = protooRoom.createPeer(peerName, transport);

	handleProtooPeer(protooPeer);
});

function handleProtooPeer(protooPeer)
{
	protooPeer.on('request', (request, accept, reject) =>
	{
		logger.debug(
			'protoo "request" event [method:%s]', request.method);

		switch (request.method)
		{
			case 'mediasoup-request':
			{
				const mediasoupRequest = request.data;

				handleMediasoupClientRequest(mediasoupRequest, accept, reject);

				break;
			}

			case 'mediasoup-notification':
			{
				const mediasoupNotification = request.data;

				accept();
				handleMediasoupClientNotification(mediasoupNotification);

				break;
			}

			case 'change-display-name':
			{
				setTimeout(accept, 2000);
				// setTimeout(() => reject(500, 'Blablabla'), 2000);

				break;
			}

			default:
			{
				logger.error('unknown request.method "%s"', request.method);

				reject(400, `unknown request.method "${request.method}"`);
			}
		}
	});

	// Emulate mediasoup-server notifications.

	setTimeout(() =>
	{
		if (protooPeer.closed)
			return;

		protooPeer.send(
			'mediasoup-notification', DATA.BOB_NEW_PEER_NOTIFICATION);
	}, 4000);

	setTimeout(() =>
	{
		if (protooPeer.closed)
			return;

		protooPeer.send(
			'mediasoup-notification', DATA.BOB_WEBCAM_NEW_CONSUMER_NOTIFICATION);
	}, 6000);

	setTimeout(() =>
	{
		if (protooPeer.closed)
			return;

		protooPeer.send(
			'mediasoup-notification', DATA.BOB_MIC_CONSUMER_PAUSED_NOTIFICATION);
	}, 7000);

	setTimeout(() =>
	{
		if (protooPeer.closed)
			return;

		protooPeer.send(
			'mediasoup-notification', DATA.ALICE_WEBCAM_CONSUMER_PAUSED_NOTIFICATION);
	}, 8000);

	setTimeout(() =>
	{
		if (protooPeer.closed)
			return;

		protooPeer.send(
			'mediasoup-notification', DATA.ALICE_WEBCAM_CONSUMER_RESUMED_NOTIFICATION);
	}, 9000);
}

function handleMediasoupClientRequest(request, accept, reject)
{
	logger.debug(
		'mediasoup-client request [method:%s, request:%o]',
		request.method, request);

	switch (request.method)
	{
		case 'queryRoom':
		{
			accept(DATA.QUERY_ROOM_RESPONSE);

			break;
		}

		case 'joinRoom':
		{
			setTimeout(() =>
			{
				accept(DATA.JOIN_ROOM_RESPONSE);
			}, 600);

			break;
		}

		case 'createTransport':
		{
			switch (request.appData.media)
			{
				case 'SEND_MIC_WEBCAM':
					accept(DATA.CREATE_TRANSPORT_1_RESPONSE);
					break;
				case 'RECV':
					accept(DATA.CREATE_TRANSPORT_2_RESPONSE);
					break;
				default:
					reject(403, 'I DO NOT LIKE YOUR TRANSPORT REQUEST');
			}

			break;
		}

		case 'createProducer':
		{
			accept();

			break;
		}

		case 'enableConsumer':
		{
			accept();

			break;
		}

		default:
		{
			logger.error(
				'unknown mediasoup request.method "%s"', request.method);

			reject(
				400, `unknown mediasoup request.method "${request.method}"`);
		}
	}
}

function handleMediasoupClientNotification(notification)
{
	logger.debug(
		'mediasoup-client notification [method:%s, notification:%o]',
		notification.method, notification);

	switch (notification.method)
	{
		case 'leaveRoom':
		{
			// TODO

			break;
		}

		default:
		{
			logger.error(
				'unknown mediasoup notification.method "%s"', notification.method);
		}
	}
}

// Listen for keyboard input.

let terminal;

// openTerminal();

function openTerminal()
{
	stdinLog('[opening REPL Terminal...]');

	terminal = repl.start(
		{
			prompt          : 'terminal> ',
			useColors       : true,
			useGlobal       : true,
			ignoreUndefined : true
		});

	terminal.on('exit', () =>
	{
		process.exit();
	});
}

function stdinLog(msg)
{
	// eslint-disable-next-line no-console
	console.log(colors.green(msg));
}

// function stdinError(msg)
// {
// 	// eslint-disable-next-line no-console
// 	console.error(colors.red.bold('ERROR: ') + colors.red(msg));
// }
