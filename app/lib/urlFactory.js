'use strict';

const config = require('../config');

export function getProtooUrl(peerId, roomId)
{
	let hostname = window.location.hostname;
	let port = config.protoo.listenPort;
	let url = `ws://${hostname}:${port}/?peer-id=${peerId}&room-id=${roomId}`;

	return url;
}
