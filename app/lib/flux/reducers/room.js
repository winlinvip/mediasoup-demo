const initialState =
{
	id    : null,
	state : 'new' // new / connecting / connected / disconnected / closed
};

const room = (state = initialState, action) =>
{
	switch (action.type)
	{
		case 'JOIN_ROOM':
		{
			const { roomId } = action.payload;

			return { ...state, id: roomId };
		}

		case 'LEAVE_ROOM':
		{
			return { ...state, state: 'closed' };
		}

		case 'SET_ROOM_STATE':
		{
			const roomState = action.payload.state;

			return { ...state, state: roomState };
		}

		default:
			return state;
	}
};

export default room;
