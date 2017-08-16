import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class Video extends React.Component
{
	constructor(props)
	{
		super(props);

		// Latest received video track.
		// @type {MediaStreamTrack}
		this._track = null;
	}

	render()
	{
		const { visible, mirror } = this.props;

		return (
			<div data-component='Video'>
				<video
					ref='video'
					className={classnames({ hidden: !visible, mirror })}
					autoPlay
					muted
				/>
			</div>
		);
	}

	componentDidMount()
	{
		const { track } = this.props;

		this._setTrack(track);
	}

	componentWillReceiveProps(nextProps)
	{
		const { track } = nextProps;

		this._setTrack(track);
	}

	_setTrack(track)
	{
		if (track === this._track)
			return;

		this._track = track;

		const { video } = this.refs;

		if (track)
		{
			const stream = new MediaStream;

			stream.addTrack(track);
			video.srcObject = stream;
		}
		else
		{
			video.srcObject = null;
		}
	}
}

Video.propTypes =
{
	track   : PropTypes.any,
	visible : PropTypes.bool.isRequired,
	mirror  : PropTypes.bool
};
