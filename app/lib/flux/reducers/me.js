const initialState =
{
	name             : null,
	device           : null,
	webcamInProgress : false,
	producers        : [] // TODO: REMOVE
};

const me = (state = initialState, action) =>
{
	switch (action.type)
	{
		case 'JOIN_ROOM':
		{
			const { peerName, device } = action.payload;

			return { ...state, name: peerName, device };
		}

		case 'SET_WEBCAM_IN_PROGRESS':
		{
			const { flag } = action.payload;

			return { ...state, webcamInProgress: flag };
		}

		// TODO: REMOVE
		case 'NEW_PRODUCER':
		{
			const { producer } = action.payload;
			const newProducers = [ ...state.producers, producer.id ];

			return { ...state, producers: newProducers };
		}

		// TODO: REMOVE
		case 'PRODUCER_CLOSED':
		{
			const { producerId } = action.payload;
			const idx = state.producers.indexOf(producerId);

			if (idx === -1)
				throw new Error('PRODUCER_CLOSED error: idx === -1');

			const newProducers = state.producers.slice();

			newProducers.splice(idx, 1);

			return { ...state, producers: newProducers };
		}

		default:
			return state;
	}
};

export default me;
