import React from 'react';
import { connect } from 'react-redux';
import * as appPropTypes from './appPropTypes';
import { FadeIn } from './transitions';
import LocalView from './LocalView';

const Room = ({ room }) =>
{
	return (
		<FadeIn duration={1000}>
			<div data-component='Room'>
				<h1>ROOM ID: {room.id}</h1>
				<h2>ROOM STATE: {room.state}</h2>

				<div className='local-view-container'>
					<LocalView />
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
