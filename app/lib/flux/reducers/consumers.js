const initialState = {};

const consumers = (state = initialState, action) =>
{
	switch (action.type)
	{
		case 'NEW_CONSUMER':
		{
			const { consumer } = action.payload;

			return { ...state, [consumer.id]: consumer };
		}

		case 'CONSUMER_CLOSED':
		{
			const { consumerId } = action.payload;
			const newState = { ...state };

			delete newState[consumerId];

			return newState;
		}

		case 'CONSUMER_PAUSED':
		{
			const { consumerId, originator } = action.payload;
			const consumer = state[consumerId];
			let newConsumer;

			if (originator === 'local')
				newConsumer = { ...consumer, locallyPaused: true };
			else
				newConsumer = { ...consumer, remotelyPaused: true };

			return { ...state, [consumerId]: newConsumer };
		}

		case 'CONSUMER_RESUMED':
		{
			const { consumerId, originator } = action.payload;
			const consumer = state[consumerId];
			let newConsumer;

			if (originator === 'local')
				newConsumer = { ...consumer, locallyPaused: false };
			else
				newConsumer = { ...consumer, remotelyPaused: false };

			return { ...state, [consumerId]: newConsumer };
		}

		default:
			return state;
	}
};

export default consumers;
