const debug = require('debug');

const APP_NAME = 'mediasoup-demo-server';

class Logger
{
	constructor(prefix)
	{
		if (prefix)
		{
			this._debug = debug(`${APP_NAME}:${prefix}`);
			this._log = debug(`${APP_NAME}:LOG:${prefix}`);
			this._warn = debug(`${APP_NAME}:WARN:${prefix}`);
			this._error = debug(`${APP_NAME}:ERROR:${prefix}`);
		}
		else
		{
			this._debug = debug(APP_NAME);
			this._log = debug(`${APP_NAME}:LOG`);
			this._warn = debug(`${APP_NAME}:WARN`);
			this._error = debug(`${APP_NAME}:ERROR`);
		}

		/* eslint-disable no-console */
		this._debug.log = console.info.bind(console);
		this._log.log = console.info.bind(console);
		this._warn.log = console.warn.bind(console);
		this._error.log = console.error.bind(console);
		/* eslint-enable no-console */
	}

	get debug()
	{
		return this._debug;
	}

	get log()
	{
		return this._log;
	}

	get warn()
	{
		return this._warn;
	}

	get error()
	{
		return this._error;
	}
}

module.exports = function(prefix)
{
	return new Logger(prefix);
};
