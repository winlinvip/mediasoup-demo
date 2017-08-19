const initialState =
{
	state : 'new' // new / connecting / connected / disconnected / closed
};

const room = (state = initialState, action) =>
{
	switch (action.type)
	{
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
