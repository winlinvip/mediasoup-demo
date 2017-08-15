import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as appPropTypes from './appPropTypes';
import * as actionCreators from '../flux/actionCreators';
import Video from './Video';

const LocalView = (props) =>
{
	const {
		me,
		micProducer,
		webcamProducer,
		onMuteMic,
		onUnmuteMic,
		onRemoveWebcam,
		onAddWebcam
	} = props;

	const muted = (
		Boolean(micProducer) &&
		micProducer.locallyPaused
	);

	const videoVisible = (
		Boolean(webcamProducer) &&
		!webcamProducer.locallyPaused &&
		!webcamProducer.remotelyPaused
	);

	return (
		<div data-component='LocalView'>
			<div className='controls'>
				{micProducer ?
					<div
						className={classnames('button', 'muted', {
							on  : muted,
							off : !muted
						})}
						onClick={() => { muted ? onUnmuteMic() : onMuteMic(); }}
					/>
					:null
				}
				<div
					className={classnames('button', 'webcam', {
						disabled : me.webcamInProgress,
						on       : Boolean(webcamProducer),
						off      : !webcamProducer
					})}
					onClick={() => { webcamProducer ? onRemoveWebcam() : onAddWebcam(); }}
				/>
			</div>

			<div className='info'>
				<p className='name'>
					{me.name}
				</p>
			</div>

			<Video
				track={webcamProducer ? webcamProducer.track : null}
				visible={videoVisible}
				mirror
			/>
		</div>
	);
};

LocalView.propTypes =
{
	me             : appPropTypes.Me.isRequired,
	micProducer    : appPropTypes.Producer,
	webcamProducer : appPropTypes.Producer,
	onMuteMic      : PropTypes.func.isRequired,
	onUnmuteMic    : PropTypes.func.isRequired,
	onRemoveWebcam : PropTypes.func.isRequired,
	onAddWebcam    : PropTypes.func.isRequired
};

const mapStateToProps = (state) =>
{
	const producersArray = Object.values(state.producers);
	const micProducer =
		producersArray.find((producer) => producer.source === 'mic');
	const webcamProducer =
		producersArray.find((producer) => producer.source === 'webcam');

	return {
		me             : state.me,
		micProducer    : micProducer,
		webcamProducer : webcamProducer
	};
};

const mapDispatchToProps = (dispatch) =>
{
	return {
		onMuteMic      : () => dispatch(actionCreators.muteMic()),
		onUnmuteMic    : () => dispatch(actionCreators.unmuteMic()),
		onRemoveWebcam : () => dispatch(actionCreators.removeWebcam()),
		onAddWebcam    : () => dispatch(actionCreators.addWebcam())
	};
};

const LocalViewContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LocalView);

export default LocalViewContainer;
