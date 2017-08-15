#!/usr/bin/env node

process.title = 'mediasoup-demo-server';

const config = require('./config');

process.env.DEBUG = config.debug || '*LOG* *WARN* *ERROR*';

/* eslint-disable no-console */
console.log('- process.env.DEBUG:', process.env.DEBUG);
console.log('- config.mediasoup.logLevel:', config.mediasoup.logLevel);
console.log('- config.mediasoup.logTags:', config.mediasoup.logTags);
/* eslint-enable no-console */

const fs = require('fs');
const https = require('https');
const url = require('url');
const protooServer = require('protoo-server');
const mediasoup = require('mediasoup');
const readline = require('readline');
const colors = require('colors/safe');
const repl = require('repl');
const logger = require('./lib/logger')();
const Room = require('./lib/Room');

// Map of Room instances indexed by roomId.
const rooms = new Map();

// mediasoup server.
const mediaServer = mediasoup.Server(
	{
		numWorkers       : 1,
		logLevel         : config.mediasoup.logLevel,
		logTags          : config.mediasoup.logTags,
		rtcIPv4          : config.mediasoup.rtcIPv4,
		rtcIPv6          : config.mediasoup.rtcIPv6,
		rtcAnnouncedIPv4 : config.mediasoup.rtcAnnouncedIPv4,
		rtcAnnouncedIPv6 : config.mediasoup.rtcAnnouncedIPv6,
		rtcMinPort       : config.mediasoup.rtcMinPort,
		rtcMaxPort       : config.mediasoup.rtcMaxPort
	});

global.SERVER = mediaServer;
mediaServer.on('newroom', (room) =>
{
	global.ROOM = room;
});

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

// Handle connections from clients.
webSocketServer.on('connectionrequest', (info, accept, reject) =>
{
	// The client indicates the roomId and peerId in the URL query.
	const u = url.parse(info.request.url, true);
	const roomId = u.query['room-id'];
	const peerId = u.query['peer-id'];

	if (!roomId || !peerId)
	{
		logger.warn('connection request without roomId and/or peerId');

		reject(400, 'Connection request without roomId and/or peerId');

		return;
	}

	logger.log('connection request [roomId:"%s", peerId:"%s"]', roomId, peerId);

	// If an unknown roomId, create a new Room.
	if (!rooms.has(roomId))
	{
		logger.debug('creating a new Room [roomId:"%s"]', roomId);

		const room = new Room(roomId, mediaServer);
		const logStatusTimer = setInterval(() =>
		{
			room.logStatus();
		}, 10000);

		rooms.set(roomId, room);

		room.on('close', () =>
		{
			rooms.delete(roomId);
			clearInterval(logStatusTimer);
		});
	}

	const room = rooms.get(roomId);
	const transport = accept();

	room.createProtooPeer(peerId, transport)
		.catch((error) =>
		{
			logger.error('error creating a protoo peer: %s', error);
		});
});

// Listen for keyboard input.

let cmd;
let terminal;

function openCommandConsole()
{
	stdinLog('[opening Readline Command Console...]');

	closeCommandConsole();
	closeTerminal();

	cmd = readline.createInterface(
		{
			input  : process.stdin,
			output : process.stdout
		});

	cmd.on('SIGINT', () =>
	{
		process.exit();
	});

	readStdin();

	function readStdin()
	{
		cmd.question('cmd> ', (answer) =>
		{
			switch (answer)
			{
				case '':
				{
					readStdin();
					break;
				}

				case 'h':
				case 'help':
				{
					stdinLog('');
					stdinLog('available commands:');
					stdinLog('- h,  help       : show this message');
					stdinLog('- sd, serverdump : execute server.dump()');
					stdinLog('- rd, roomdump   : execute room.dump() for the latest created mediasoup Room');
					stdinLog('- t,  terminal   : open REPL Terminal');
					stdinLog('');
					readStdin();

					break;
				}

				case 'sd':
				case 'serverdump':
				{
					mediaServer.dump()
						.then((data) =>
						{
							stdinLog(`mediaServer.dump() succeeded:\n${JSON.stringify(data, null, '  ')}`);
							readStdin();
						})
						.catch((error) =>
						{
							stdinError(`mediaServer.dump() failed: ${error}`);
							readStdin();
						});

					break;
				}

				case 'rd':
				case 'roomdump':
				{
					if (!global.ROOM)
					{
						readStdin();
						break;
					}

					global.ROOM.dump()
						.then((data) =>
						{
							stdinLog('global.ROOM.dump() succeeded');
							stdinLog(`- peers:\n${JSON.stringify(data.peers, null, '  ')}`);
							stdinLog(`- num peers: ${data.peers.length}`);
							readStdin();
						})
						.catch((error) =>
						{
							stdinError(`global.ROOM.dump() failed: ${error}`);
							readStdin();
						});

					break;
				}

				case 't':
				case 'terminal':
				{
					openTerminal();

					break;
				}

				default:
				{
					stdinError(`unknown command: ${answer}`);
					stdinLog('press \'h\' or \'help\' to get the list of available commands');

					readStdin();
				}
			}
		});
	}
}

function openTerminal()
{
	stdinLog('[opening REPL Terminal...]');

	closeCommandConsole();
	closeTerminal();

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

function closeCommandConsole()
{
	if (cmd)
	{
		cmd.close();
		cmd = undefined;
	}
}

function closeTerminal()
{
	if (terminal)
	{
		terminal.removeAllListeners('exit');
		terminal.close();
		terminal = undefined;
	}
}

openCommandConsole();

// Export openCommandConsole function by typing 'c'.
Object.defineProperty(global, 'c',
	{
		get : function()
		{
			openCommandConsole();
		}
	});

function stdinLog(msg)
{
	// eslint-disable-next-line no-console
	console.log(colors.green(msg));
}

function stdinError(msg)
{
	// eslint-disable-next-line no-console
	console.error(colors.red.bold('ERROR: ') + colors.red(msg));
}
