import RoomClient from '../RoomClient';

// eslint-disable-next-line no-unused-vars
export default ({ dispatch, getState }) => (next) =>
{
	let client;

	return (action) =>
	{
		switch (action.type)
		{
			case 'JOIN_ROOM':
			{
				const { roomId, peerName, displayName, device } = action.payload;

				client = new RoomClient(
					{ roomId, peerName, displayName, device, dispatch });

				// TODO: TMP
				global.CLIENT = client;

				break;
			}

			case 'LEAVE_ROOM':
			{
				client.close();

				break;
			}

			case 'CHANGE_DISPLAY_NAME':
			{
				const { displayName } = action.payload;

				client.changeDisplayName(displayName);

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

			case 'CHANGE_WEBCAM':
			{
				client.changeWebcam();

				break;
			}
		}

		return next(action);
	};
};
