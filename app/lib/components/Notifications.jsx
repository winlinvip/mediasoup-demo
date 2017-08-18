import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as appPropTypes from './appPropTypes';
import * as actionCreators from '../flux/actionCreators';
import { FadeIn } from './transitions';

const Notifications = ({ notifications, onClick }) =>
{
	return (
		<div data-component='Notifications'>
			{
				notifications.map((notification) =>
				{
					return (
						<FadeIn key={notification.id} duration={250}>
							<div
								className={classnames('notification', notification.type)}
								onClick={() => onClick(notification.id)}
							>
								<div className='icon' />
								<p className='text'>{notification.text}</p>
							</div>
						</FadeIn>
					);
				})
			}
		</div>
	);
};

Notifications.propTypes =
{
	notifications : PropTypes.arrayOf(appPropTypes.Notification).isRequired,
	onClick       : PropTypes.func.isRequired
};

const mapStateToProps = (state) =>
{
	const { notifications } = state;

	return { notifications };
};

const mapDispatchToProps = (dispatch) =>
{
	return {
		onClick : (notificationId) =>
		{
			dispatch(actionCreators.deleteNotification(notificationId));
		}
	};
};

const NotificationsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Notifications);

export default NotificationsContainer;
