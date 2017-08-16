import React from 'react';
import { connect } from 'react-redux';
import * as appPropTypes from './appPropTypes';
import Video from './Video';

const Peer = ({ peer }) =>
{
	const videoVisible = true; // TODO

	return (
		<div data-component='Peer'>
			<div className='info'>
				<p className='name'>
					{peer.name}
				</p>
			</div>

			<Video
				track={null}
				visible={videoVisible}
			/>
		</div>
	);
};

Peer.propTypes =
{
	peer : appPropTypes.Peer.isRequired
};

const mapStateToProps = (state, { name }) =>
{
	const peer = state.peers[name];

	return { peer };
};

const PeerContainer = connect(mapStateToProps)(Peer);

export default PeerContainer;
