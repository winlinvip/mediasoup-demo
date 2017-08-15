export const joinRoom = (peerName, roomId, device) =>
{
	return {
		type    : 'JOIN_ROOM',
		payload : { peerName, roomId, device }
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
