import PropTypes from 'prop-types';

export const Room = PropTypes.shape(
	{
		id    : PropTypes.string.isRequired,
		state : PropTypes.oneOf(
			[
				'new',
				'connecting',
				'connected',
				'closed'
			]).isRequired
	});

export const Me = PropTypes.shape(
	{
		name             : PropTypes.string.isRequired,
		device           : PropTypes.string.isRequired,
		canSendMic       : PropTypes.bool.isRequired,
		canSendWebcam    : PropTypes.bool.isRequired,
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

export const Peer = PropTypes.shape(
	{
		name      : PropTypes.string.isRequired,
		device    : PropTypes.string.isRequired,
		consumers : PropTypes.arrayOf(PropTypes.number).isRequired
	});

export const Consumer = PropTypes.shape(
	{
		id             : PropTypes.number.isRequired,
		peerName       : PropTypes.string.isRequired,
		source         : PropTypes.oneOf([ 'mic', 'webcam' ]).isRequired,
		supported      : PropTypes.bool.isRequired,
		locallyPaused  : PropTypes.bool.isRequired,
		remotelyPaused : PropTypes.bool.isRequired,
		track          : PropTypes.any
	});
