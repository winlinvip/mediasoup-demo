export const joinRoom = ({ roomId, peerName, displayName, device }) =>
{
	return {
		type    : 'JOIN_ROOM',
		payload : { roomId, peerName, displayName, device }
	};
};

export const leaveRoom = () =>
{
	return {
		type : 'LEAVE_ROOM'
	};
};

export const setRoomState = (state) =>
{
	return {
		type    : 'SET_ROOM_STATE',
		payload : { state }
	};
};

export const setMediaCapabilities = ({ canSendMic, canSendWebcam }) =>
{
	return {
		type    : 'SET_MEDIA_CAPABILITIES',
		payload : { canSendMic, canSendWebcam }
	};
};

export const setDisplayName = (displayName) =>
{
	return {
		type    : 'SET_DISPLAY_NAME',
		payload : { displayName }
	};
};

export const newProducer = (producer) =>
{
	return {
		type    : 'NEW_PRODUCER',
		payload : { producer }
	};
};

export const producerClosed = (producerId) =>
{
	return {
		type    : 'PRODUCER_CLOSED',
		payload : { producerId }
	};
};

export const producerPaused = (producerId, originator) =>
{
	return {
		type    : 'PRODUCER_PAUSED',
		payload : { producerId, originator }
	};
};

export const producerResumed = (producerId, originator) =>
{
	return {
		type    : 'PRODUCER_RESUMED',
		payload : { producerId, originator }
	};
};

export const muteMic = () =>
{
	return {
		type : 'MUTE_MIC'
	};
};

export const unmuteMic = () =>
{
	return {
		type : 'UNMUTE_MIC'
	};
};

export const removeWebcam = () =>
{
	return {
		type : 'REMOVE_WEBCAM'
	};
};

export const addWebcam = () =>
{
	return {
		type : 'ADD_WEBCAM'
	};
};

export const setWebcamInProgress = (flag) =>
{
	return {
		type    : 'SET_WEBCAM_IN_PROGRESS',
		payload : { flag }
	};
};

export const newPeer = (peer) =>
{
	return {
		type    : 'NEW_PEER',
		payload : { peer }
	};
};

export const peerClosed = (peerName) =>
{
	return {
		type    : 'PEER_CLOSED',
		payload : { peerName }
	};
};

export const newConsumer = (consumer) =>
{
	return {
		type    : 'NEW_CONSUMER',
		payload : { consumer }
	};
};

export const consumerClosed = (consumerId, peerName) =>
{
	return {
		type    : 'CONSUMER_CLOSED',
		payload : { consumerId, peerName }
	};
};

export const consumerPaused = (consumerId, originator) =>
{
	return {
		type    : 'CONSUMER_PAUSED',
		payload : { consumerId, originator }
	};
};

export const consumerResumed = (consumerId, originator) =>
{
	return {
		type    : 'CONSUMER_RESUMED',
		payload : { consumerId, originator }
	};
};

export const consumerGotTrack = (consumerId, track) =>
{
	return {
		type    : 'CONSUMER_GOT_TRACK',
		payload : { consumerId, track }
	};
};
