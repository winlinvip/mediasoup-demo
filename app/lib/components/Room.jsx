import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ClipboardButton from 'react-clipboard.js';
import * as appPropTypes from './appPropTypes';
import * as requestActions from '../flux/requestActions';
import { FadeIn } from './transitions';
import Me from './Me';
import Peers from './Peers';
import Notifications from './Notifications';

const Room = ({ room, onRoomLinkCopy }) =>
{
	return (
		<FadeIn duration={1000}>
			<div data-component='Room'>
				<Notifications />

				<div className='state'>
					<div className={classnames('icon', room.state)} />
					<p className='text'>{room.state}</p>
				</div>

				<div className='room-link-wrapper'>
					<div className='room-link'>
						<ClipboardButton
							component='a'
							className='link'
							button-href={window.location.href}
							data-clipboard-text={window.location.href}
							onSuccess={onRoomLinkCopy}
							onClick={() => {}} // Avoid link action.
						>
							copy room link
						</ClipboardButton>
					</div>
				</div>

				<Peers />

				<div className='me-container'>
					<Me />
				</div>
			</div>
		</FadeIn>
	);
};

Room.propTypes =
{
	room           : appPropTypes.Room.isRequired,
	onRoomLinkCopy : PropTypes.func.isRequired
};

const mapStateToProps = (state) =>
{
	return { room: state.room };
};

const mapDispatchToProps = (dispatch) =>
{
	return {
		onRoomLinkCopy : () =>
		{
			dispatch(requestActions.notify(
				{
					text : 'Room link copied to the clipboard'
				}));
		}
	};
};


const RoomContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Room);

export default RoomContainer;
