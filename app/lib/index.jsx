import domready from 'domready';
import UrlParse from 'url-parse';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {
	applyMiddleware as applyFluxMiddleware,
	createStore as createFluxStore
} from 'redux';
import { createLogger as createReduxLogger } from 'redux-logger';
import { getDeviceInfo } from 'mediasoup-client';
import injectTapEventPlugin from 'react-tap-event-plugin';
import randomString from 'random-string';
import randomName from 'node-random-name';
import Logger from './Logger';
import * as utils from './utils';
import * as actionCreators from './flux/actionCreators';
import reducers from './flux/reducers';
import roomClientMiddleware from './flux/roomClientMiddleware';
import Room from './components/Room';

injectTapEventPlugin();

const REGEXP_FRAGMENT_ROOM_ID = new RegExp('^#roomId=([0-9a-zA-Z_-]+)$');

const logger = new Logger();

const reduxMiddlewares = [];

if (process.env.NODE_ENV === 'development')
{
	const fluxLogger = createReduxLogger(
		{
			duration  : true,
			timestamp : false,
			level     : 'log',
			logErrors : true
		});

	reduxMiddlewares.push(fluxLogger);
}

reduxMiddlewares.push(roomClientMiddleware);

const store = createFluxStore(
	reducers,
	undefined,
	applyFluxMiddleware(...reduxMiddlewares)
);

domready(() =>
{
	logger.debug('DOM ready');

	// Load stuff and run
	utils.initialize()
		.then(run);
});

function run()
{
	logger.debug('run() [environment:%s]', process.env.NODE_ENV);

	const peerName = randomString({ length: 8 }).toLowerCase();
	const urlParser = new UrlParse(window.location.href, true);
	const match = urlParser.hash.match(REGEXP_FRAGMENT_ROOM_ID);
	let roomId;

	if (match)
	{
		roomId = match[1];
	}
	else
	{
		roomId = randomString({ length: 8 }).toLowerCase();
		window.location = `#roomId=${roomId}`;
	}

	// TODO: Get displayName from cookie.
	const displayName = randomName();
	const device = getDeviceInfo();

	store.dispatch(
		actionCreators.joinRoom({ roomId, peerName, displayName, device }));

	render(
		<Provider store={store}>
			<Room />
		</Provider>,
		document.getElementById('mediasoup-demo-app-container')
	);
}

// TODO: TMP
global.STORE = store;
global.ACTION_CREATORS = actionCreators;

// setTimeout(() =>
// {
// 	global.STORE.dispatch(global.ACTION_CREATORS.joinRoom('alice', 'abcd1234'));
// }, 500);

// setTimeout(() =>
// {
// 	global.STORE.dispatch(global.ACTION_CREATORS.leaveRoom());
// }, 1000);

