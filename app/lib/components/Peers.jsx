import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as appPropTypes from './appPropTypes';
import { FadeIn } from './transitions';
import Peer from './Peer';

const Peers = ({ peers }) =>
{
	return (
		<div data-component='Peers'>
			{
				peers.map((peer) =>
				{
					return (
						<FadeIn key={peer.name} duration={1000}>
							<div className='peer-container'>
								<Peer name={peer.name} />
							</div>
						</FadeIn>
					);
				})
			}
		</div>
	);
};

Peers.propTypes =
{
	peers : PropTypes.arrayOf(appPropTypes.Peer).isRequired
};

const mapStateToProps = (state) =>
{
	const peersArray = Object.values(state.peers);

	return { peers: peersArray };
};

const PeersContainer = connect(mapStateToProps)(Peers);

export default PeersContainer;
