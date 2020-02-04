import React, { Component } from "react";
import { Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import NotificationProgress from "./NotificationProgress";
import ScheduleButton from "./ScheduleButton";
import ActionButton from "./ActionButton";
import Container from "../../Container";

class DesktopView extends Component {
	constructor(props) {
		super(props);

		const {
			canTrigger,
			broadcastSent,
			scheduleProgress,
			scheduledAt,
			eventStart,
			eventEnd,
			timezone,
			isNotificationAfter,
			isEventEnded,
			scheduleSent,
			isSending,
			isCustom,
			renderTimes,
			onSendNow
		} = this.props;

		this.defaultState = {
			canTrigger,
			broadcastSent,
			scheduleProgress,
			scheduledAt,
			eventStart,
			eventEnd,
			timezone,
			isNotificationAfter,
			isEventEnded,
			scheduleSent,
			isSending,
			isCustom,
			renderTimes,
			onSendNow
		};

		this.state = this.defaultState;
	}

	static getDerivedStateFromProps(props, state) {
		const {
			canTrigger,
			broadcastSent,
			scheduleProgress,
			scheduledAt,
			eventStart,
			eventEnd,
			timezone,
			isNotificationAfter,
			isEventEnded,
			scheduleSent,
			isSending,
			isCustom,
			renderTimes,
			onSendNow
		} = props;

		return {
			canTrigger,
			broadcastSent,
			scheduleProgress,
			scheduledAt,
			eventStart,
			eventEnd,
			timezone,
			isNotificationAfter,
			isEventEnded,
			scheduleSent,
			isSending,
			isCustom,
			renderTimes,
			onSendNow
		};
	}

	render() {
		const {
			classes,
			broadcastSent,
			scheduleProgress,
			scheduledAt,
			eventStart,
			eventEnd,
			timezone,
			isNotificationAfter,
			isEventEnded,
			scheduleSent,
			isSending,
			isCustom,
			renderTimes,
			onSend,
			onAction,
			details,
			eventId,
			onSendNow
		} = this.props;

		return (
			<Container
				eventId={eventId}
				subheading={"tools"}
				layout={"childrenInsideCard"}
			>
				<Typography className={classes.parentHeading}>
					Fan Notifications
				</Typography>
				<Typography className={classes.heading}>Last Call</Typography>
				<Grid container alignItems="center" spacing={24}>
					<Grid item xs={12} md={7}>
						<NotificationProgress
							classes={classes}
							broadcastSent={broadcastSent}
							scheduleProgress={scheduleProgress}
							scheduledAt={scheduledAt}
							eventStart={eventStart}
							eventEnd={eventEnd}
							timezone={timezone}
							isNotificationAfter={isNotificationAfter}
							isEventEnded={isEventEnded}
							scheduleSent={scheduleSent}
							renderTimes={renderTimes}
						/>
					</Grid>
					<Grid item xs={12} md={5}>
						<Grid container alignItems="center" justify="flex-end">
							<Grid item xs={6}>
								<div className={classes.actionButtonContainer}>
									<ScheduleButton
										classes={classes}
										scheduledAt={scheduledAt}
										isSending={isSending}
										isNotificationAfter={isNotificationAfter}
										isEventEnded={isEventEnded}
										timezone={timezone}
										onSend={onSend}
										broadcastSent={broadcastSent}
									/>
								</div>
							</Grid>
							<Grid item xs={4}>
								<ActionButton
									classes={classes}
									scheduledAt={scheduledAt}
									isSending={isSending}
									isNotificationAfter={isNotificationAfter}
									isEventEnded={isEventEnded}
									isCustom={isCustom}
									onAction={onAction}
									onSendNow={onSendNow}
									broadcastSent={broadcastSent}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				<br/>
				<br/>
				{details}
			</Container>
		);
	}
}

DesktopView.propTypes = {
	classes: PropTypes.object.isRequired,
	canTrigger: PropTypes.bool,
	broadcastSent: PropTypes.bool,
	scheduleProgress: PropTypes.number,
	scheduledAt: PropTypes.string,
	eventStart: PropTypes.string,
	eventEnd: PropTypes.string,
	timezone: PropTypes.string,
	isNotificationAfter: PropTypes.bool,
	isEventEnded: PropTypes.bool,
	scheduleSent: PropTypes.number,
	isSending: PropTypes.bool,
	isCustom: PropTypes.bool,
	renderTimes: PropTypes.object,
	onSend: PropTypes.func,
	onAction: PropTypes.func,
	onSendNow: PropTypes.func,
	details: PropTypes.object,
	eventId: PropTypes.string
};

export default DesktopView;