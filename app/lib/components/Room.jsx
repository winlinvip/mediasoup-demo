import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import ClipboardButton from 'react-clipboard.js';
import * as appPropTypes from './appPropTypes';
import { FadeIn } from './transitions';
import Me from './Me';
import Peers from './Peers';

const Room = ({ room }) =>
{
	return (
		<FadeIn duration={1000}>
			<div data-component='Room'>
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
							onSuccess={() => {}}
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
	room : appPropTypes.Room.isRequired
};

const mapStateToProps = (state) =>
{
	return { room: state.room };
};

const RoomContainer = connect(mapStateToProps)(Room);

export default RoomContainer;
