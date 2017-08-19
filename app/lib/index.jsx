import domready from 'domready';
import UrlParse from 'url-parse';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {
	applyMiddleware as applyFluxMiddleware,
	createStore as createFluxStore
} from 'redux';
import thunk from 'redux-thunk';
import { createLogger as createReduxLogger } from 'redux-logger';
import { getDeviceInfo } from 'mediasoup-client';
import injectTapEventPlugin from 'react-tap-event-plugin';
import randomString from 'random-string';
import randomName from 'node-random-name';
import Logger from './Logger';
import * as utils from './utils';
import * as cookiesManager from './cookiesManager';
import * as requestActions from './flux/requestActions';
import * as stateActions from './flux/stateActions';
import reducers from './flux/reducers';
import roomClientMiddleware from './flux/roomClientMiddleware';
import Room from './components/Room';

const REGEXP_FRAGMENT_ROOM_ID = new RegExp('^#roomId=([0-9a-zA-Z_-]+)$');

const logger = new Logger();
const reduxMiddlewares = [];

reduxMiddlewares.push(thunk);

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

injectTapEventPlugin();

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

	// Get displayName from cookie.
	const userCookie = cookiesManager.getUser() || {};
	const displayName = userCookie.displayName || randomName();

	// Get current device.
	const device = getDeviceInfo();

	// NOTE: I don't like this.
	store.dispatch(
		requestActions.joinRoom({ roomId, peerName, displayName, device }));

	// NOTE: I don't like this.
	store.dispatch(
		stateActions.setMe({ peerName, displayName, device }));

	render(
		<Provider store={store}>
			<Room />
		</Provider>,
		document.getElementById('mediasoup-demo-app-container')
	);
}
