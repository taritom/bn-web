import React, { Component } from "react";
import { Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import Card from "../../../../../../elements/Card";
import NotificationProgress from "./NotificationProgress";
import ScheduleButton from "./ScheduleButton";
import ActionButton from "./ActionButton";
import Container from "../../Container";

class MobileView extends Component {
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
			onSendNow,
			hasEventStarted
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
			onSendNow,
			hasEventStarted
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
			onSendNow,
			hasEventStarted
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
			onSendNow,
			hasEventStarted
		};
	}

	render() {
		const {
			classes,
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
			onSend,
			onAction,
			details,
			eventId,
			onSendNow,
			hasEventStarted
		} = this.props;

		return (
			<Container
				eventId={eventId}
				subheading={"tools"}
				layout={"childrenOutsideNoCard"}
			>
				<div className={classes.headingContainer}>
					<Typography className={classes.parentHeading}>
						Fan Notifications
					</Typography>
					<Typography className={classes.heading}>Last Call</Typography>
				</div>
				<Card className={classes.mobileContainer}>
					<Grid container alignItems="center">
						<Grid item xs={12}>
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
						<Grid item xs={12} className={classes.actionInfoContainer}>
							<Grid container alignItems="center" justify="flex-end">
								<Grid item xs={12}>
									<ScheduleButton
										classes={classes}
										scheduledAt={scheduledAt}
										isSending={isSending}
										isNotificationAfter={isNotificationAfter}
										isEventEnded={isEventEnded}
										timezone={timezone}
										onSend={onSend}
									/>
								</Grid>
								<Grid item xs={12}>
									<div className={classes.actionButtonContainer}>
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
											hasEventStarted={hasEventStarted}
										/>
									</div>
								</Grid>
							</Grid>
						</Grid>
					</Grid>

					{!canTrigger ? (
						<Typography className={classes.description}>
							<span className={classes.descriptionHeading}>Why Not?</span> Last
							call notifications can only be triggered during your event.
						</Typography>
					) : null}

					<br/>
					<br/>
					{details}
				</Card>
			</Container>
		);
	}
}

MobileView.propTypes = {
	classes: PropTypes.object.isRequired,
	canTrigger: PropTypes.bool,
	broadcastSent: PropTypes.bool,
	scheduleProgress: PropTypes.number,
	scheduledAt: PropTypes.string,
	eventStart: PropTypes.string,
	eventEnd: PropTypes.string,
	timezone: PropTypes.string,
	isNotificationAfter: PropTypes.bool,
	hasEventStarted: PropTypes.bool,
	isEventEnded: PropTypes.bool,
	scheduleSent: PropTypes.number,
	isSending: PropTypes.bool,
	isCustom: PropTypes.bool,
	renderTimes: PropTypes.object,
	onSend: PropTypes.func,
	onSendNow: PropTypes.func,
	onAction: PropTypes.func,
	details: PropTypes.object,
	eventId: PropTypes.string
};

export default MobileView;