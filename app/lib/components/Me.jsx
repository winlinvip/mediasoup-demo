import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { RIEInput } from 'riek';
import * as appPropTypes from './appPropTypes';
import * as actionCreators from '../flux/actionCreators';
import Video from './Video';

const Me = (props) =>
{
	const {
		connected,
		me,
		micProducer,
		webcamProducer,
		onSetDisplayName,
		onMuteMic,
		onUnmuteMic,
		onRemoveWebcam,
		onAddWebcam
	} = props;

	let micState;

	if (!me.canSendMic)
		micState = 'unsupported';
	else if (!micProducer)
		micState = 'unsupported';
	else if (!micProducer.locallyPaused)
		micState = 'on';
	else if (micProducer.locallyPaused)
		micState = 'off';

	let webcamState;

	if (!me.canSendWebcam)
		webcamState = 'unsupported';
	else if (webcamProducer)
		webcamState = 'on';
	else
		webcamState = 'off';

	const videoVisible = (
		Boolean(webcamProducer) &&
		!webcamProducer.locallyPaused &&
		!webcamProducer.remotelyPaused
	);

	return (
		<div data-component='Me'>
			{connected ?
				<div className='controls'>
					<div
						className={classnames('button', 'mic', micState)}
						onClick={() =>
						{
							micState === 'on' ? onMuteMic() : onUnmuteMic();
						}}
					/>

					<div
						className={classnames('button', 'webcam', webcamState, {
							disabled : me.webcamInProgress
						})}
						onClick={() =>
						{
							webcamState === 'on' ? onRemoveWebcam() : onAddWebcam();
						}}
					/>
				</div>
				:null
			}

			<div className='info'>
				<RIEInput
					value={me.displayName || 'Edit Your Name'}
					propName='displayName'
					className='displayName'
					classLoading='loading'
					classInvalid='invalid'
					shouldBlockWhileLoading
					editProps={{
						maxLength   : 20,
						autoCorrect : false,
						spellCheck  : false
					}}
					validate={(string) => string.length >= 3}
					change={({ displayName }) => onSetDisplayName(displayName)}
				/>

				<div className='row'>
					<span
						className={classnames(
							'device-icon',
							me.device.name.replace(/ +/g, '')
						)}
					/>
					<span className='device-version'>{me.device.name} {me.device.version}</span>
				</div>


			</div>

			<Video
				track={webcamProducer ? webcamProducer.track : null}
				visible={videoVisible}
				mirror
			/>
		</div>
	);
};

Me.propTypes =
{
	connected        : PropTypes.bool.isRequired,
	me               : appPropTypes.Me.isRequired,
	micProducer      : appPropTypes.Producer,
	webcamProducer   : appPropTypes.Producer,
	onSetDisplayName : PropTypes.func.isRequired,
	onMuteMic        : PropTypes.func.isRequired,
	onUnmuteMic      : PropTypes.func.isRequired,
	onRemoveWebcam   : PropTypes.func.isRequired,
	onAddWebcam      : PropTypes.func.isRequired
};

const mapStateToProps = (state) =>
{
	const producersArray = Object.values(state.producers);
	const micProducer =
		producersArray.find((producer) => producer.source === 'mic');
	const webcamProducer =
		producersArray.find((producer) => producer.source === 'webcam');

	return {
		connected      : state.room.state === 'connected',
		me             : state.me,
		micProducer    : micProducer,
		webcamProducer : webcamProducer
	};
};

const mapDispatchToProps = (dispatch) =>
{
	return {
		onSetDisplayName : (displayName) =>
		{
			dispatch(actionCreators.setDisplayName(displayName));
		},
		onMuteMic      : () => dispatch(actionCreators.muteMic()),
		onUnmuteMic    : () => dispatch(actionCreators.unmuteMic()),
		onRemoveWebcam : () => dispatch(actionCreators.removeWebcam()),
		onAddWebcam    : () => dispatch(actionCreators.addWebcam())
	};
};

const MeContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Me);

export default MeContainer;
