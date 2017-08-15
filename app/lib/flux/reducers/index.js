import { combineReducers } from 'redux';
import room from './room';
import me from './me';
import producers from './producers';

const reducers =
	combineReducers({ room, me, producers });

export default reducers;
