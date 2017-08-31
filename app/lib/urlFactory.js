export function getProtooUrl(peerName, roomId)
{
	const hostname = window.location.hostname;
	const url = `wss://${hostname}:3446/?peerName=${peerName}&roomId=${roomId}`;

	return url;
}
