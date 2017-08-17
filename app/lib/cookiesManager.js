import jsCookie from 'js-cookie';

const USER_COOKIE = 'mediasoup-demo.user';

export function getUser()
{
	return jsCookie.getJSON(USER_COOKIE);
}

export function setUser({ displayName })
{
	jsCookie.set(USER_COOKIE, { displayName });
}
