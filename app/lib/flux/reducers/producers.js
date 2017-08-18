const initialState = {};

const producers = (state = initialState, action) =>
{
	switch (action.type)
	{
		case 'NEW_PRODUCER':
		{
			const { producer } = action.payload;

			return { ...state, [producer.id]: producer };
		}

		case 'PRODUCER_CLOSED':
		{
			const { producerId } = action.payload;
			const newState = { ...state };

			delete newState[producerId];

			return newState;
		}

		case 'PRODUCER_PAUSED':
		{
			const { producerId, originator } = action.payload;
			const producer = state[producerId];
			let newProducer;

			if (originator === 'local')
				newProducer = { ...producer, locallyPaused: true };
			else
				newProducer = { ...producer, remotelyPaused: true };

			return { ...state, [producerId]: newProducer };
		}

		case 'PRODUCER_RESUMED':
		{
			const { producerId, originator } = action.payload;
			const producer = state[producerId];
			let newProducer;

			if (originator === 'local')
				newProducer = { ...producer, locallyPaused: false };
			else
				newProducer = { ...producer, remotelyPaused: false };

			return { ...state, [producerId]: newProducer };
		}

		case 'REPLACE_PRODUCER_TRACK':
		{
			const { producerId, track } = action.payload;
			const producer = state[producerId];
			const newProducer = { ...producer, track };

			return { ...state, [producerId]: newProducer };
		}

		default:
			return state;
	}
};

export default producers;
