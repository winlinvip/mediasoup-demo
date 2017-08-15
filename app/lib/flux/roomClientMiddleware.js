import RoomClient from '../RoomClient';

// eslint-disable-next-line no-unused-vars
export default ({ getState, dispatch }) => (next) =>
{
	// TODO: Useful?
	// function isRoomClosed()
	// {
	// 	return getState().room.state === 'closed';
	// }

	let client;

	return (action) =>
	{
		switch (action.type)
		{
			case 'JOIN_ROOM':
			{
				const { peerName, roomId } = action.payload;

				client = new RoomClient({ dispatch, peerName, roomId });

				// TODO: TMP
				global.CLIENT = client;

				break;
			}

			case 'LEAVE_ROOM':
			{
				client.close();

				break;
			}

			case 'MUTE_MIC':
			{
				client.muteMic();

				break;
			}

			case 'UNMUTE_MIC':
			{
				client.unmuteMic();

				break;
			}

			case 'REMOVE_WEBCAM':
			{
				client.removeWebcam();

				break;
			}

			case 'ADD_WEBCAM':
			{
				client.addWebcam();

				break;
			}
		}

		return next(action);
	};
};
