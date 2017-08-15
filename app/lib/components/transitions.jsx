import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

const FadeIn = ({ duration, children }) => (
	<CSSTransition
		in
		classNames='FadeIn'
		timeout={duration || 1000}
		appear
	>
		{children}
	</CSSTransition>
);

FadeIn.propTypes =
{
	duration : PropTypes.number,
	children : PropTypes.any
};

export { FadeIn };
