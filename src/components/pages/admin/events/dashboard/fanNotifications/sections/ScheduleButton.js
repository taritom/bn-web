import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment-timezone";
import { Typography } from "@material-ui/core";
import Button from "../../../../../../elements/Button";
import { TIME_FORMAT_YYYY_MM_DD_NO_TIMEZONE, TIME_FORMAT_MM_DD_YYYY_NO_TIMEZONE } from "../../../../../../../helpers/time";

class ScheduleButton extends Component {
	constructor(props) {
		super(props);

		const {
			scheduledAt,
			isSending,
			broadcastSent,
			isSchedule,
			isNotificationAfter,
			isEventEnded,
			timezone,
			classes,
			onSend
		} = this.props;

		this.defaultState = {
			scheduledAt,
			isSending,
			broadcastSent,
			isSchedule,
			isNotificationAfter,
			isEventEnded,
			timezone,
			classes,
			onSend
		};

		this.state = this.defaultState;
	}

	static getDerivedStateFromProps(props, state) {
		const {
			scheduledAt,
			isSending,
			broadcastSent,
			isSchedule,
			isNotificationAfter,
			isEventEnded,
			timezone,
			classes,
			onSend
		} = props;

		return {
			scheduledAt,
			isSending,
			broadcastSent,
			isSchedule,
			isNotificationAfter,
			isEventEnded,
			timezone,
			classes,
			onSend
		};
	}

	render() {
		const {
			scheduledAt,
			isSending,
			broadcastSent,
			isSchedule,
			isNotificationAfter,
			isEventEnded,
			timezone,
			classes,
			onSend
		} = this.props;

		if (scheduledAt && !broadcastSent) {
			return (
				<Typography className={classes.notificationBg}>
					Notification scheduled
					{scheduledAt ? (
						<span>
							&nbsp;for <span className={classes.pinkText}>
								{scheduledAt ? moment.utc(scheduledAt).tz(timezone).format(TIME_FORMAT_MM_DD_YYYY_NO_TIMEZONE) : null}
							</span>
						</span>
					) : null}
				</Typography>
			);
		} else {
			if(isEventEnded) {
				return null;
			} else {
				return (
					<Button
						variant={"secondary"}
						size={"large"}
						disabled={isSending}
						onClick={onSend}
						style={{ width: "100%" }}
					>
						{isSending && isSchedule ? "Sending..." : "Schedule Last Call"}
					</Button>
				);
			}
		}
	}
}

ScheduleButton.propTypes = {
	classes: PropTypes.object.isRequired,
	scheduledAt: PropTypes.string,
	isSending: PropTypes.bool.isRequired,
	isNotificationAfter: PropTypes.bool.isRequired,
	isEventEnded: PropTypes.bool.isRequired,
	timezone: PropTypes.string,
	onSend: PropTypes.func.isRequired,
	broadcastSent: PropTypes.bool
};

export default ScheduleButton;
