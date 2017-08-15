import PropTypes from 'prop-types';

export const Room = PropTypes.shape(
	{
		id    : PropTypes.string.isRequired,
		state : PropTypes.oneOf(
			[
				'new',
				'connecting',
				'connected',
				'disconnected',
				'closed'
			]).isRequired
	});

export const Me = PropTypes.shape(
	{
		name             : PropTypes.string.isRequired,
		device           : PropTypes.string.isRequired,
		webcamInProgress : PropTypes.bool.isRequired,
		producers        : PropTypes.arrayOf(PropTypes.number).isRequired
	});

export const Producer = PropTypes.shape(
	{
		id             : PropTypes.number.isRequired,
		source         : PropTypes.oneOf([ 'mic', 'webcam' ]).isRequired,
		deviceLabel    : PropTypes.string,
		type           : PropTypes.oneOf([ 'front', 'back' ]),
		resolution     : PropTypes.oneOf([ 'qvga', 'vga', 'hd' ]),
		locallyPaused  : PropTypes.bool.isRequired,
		remotelyPaused : PropTypes.bool.isRequired,
		track          : PropTypes.any
	});

// export const AddressbookItem = PropTypes.shape(
// 	{
// 		id       : PropTypes.string.isRequired,
// 		name     : PropTypes.string.isRequired,
// 		favorite : PropTypes.bool,
// 		photo    : PropTypes.string,
// 		email    : PropTypes.string,
// 		phones   : PropTypes.arrayOf(PropTypes.shape(
// 		{
// 			number : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
// 				.isRequired,
// 			type   : PropTypes.string
// 		}))
// 	});

