import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { RIEInput } from 'riek';
import * as appPropTypes from './appPropTypes';

const PeerInfo = ({ isMe, peer, onSetDisplayName }) =>
{
	return (
		<div data-component='PeerInfo'>
			{isMe ?
				<RIEInput
					value={peer.displayName || 'Edit Your Name'}
					propName='displayName'
					className='displayName editable'
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
				:
				<span className='displayName'>
					{peer.displayName}
				</span>
			}

			<div className='row'>
				<span
					className={classnames(
						'device-icon',
						peer.device.name.replace(/ +/g, '')
					)}
				/>
				<span className='device-version'>
					{peer.device.name} {peer.device.version}
				</span>
			</div>
		</div>
	);
};

PeerInfo.propTypes =
{
	isMe : PropTypes.bool,
	peer : PropTypes.oneOfType(
		[ appPropTypes.Me, appPropTypes.Peer ]).isRequired,
	onSetDisplayName : PropTypes.func
};

export default PeerInfo;
