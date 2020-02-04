import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, LinearProgress, Typography } from "@material-ui/core";
import servedImage from "../../../../../../../helpers/imagePathHelper";

class NotificationProgress extends Component {

	constructor(props) {
		super(props);

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
			renderTimes
		} = this.props;

		this.defaultState = {
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
			renderTimes
		};

		this.state = this.defaultState;
	}

	static getDerivedStateFromProps(props, state) {
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
			renderTimes
		} = props;

		return {
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
			renderTimes
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
			isNotificationAfter,
			isEventEnded,
			scheduleSent,
			renderTimes
		} = this.props;

		let completed = 0;
		if (scheduleProgress <= 0) {
			completed = 0;
		} else {
			completed = (scheduleProgress / scheduleSent) * 100;
		}

		if (scheduledAt && !broadcastSent) {
			return (
				<Grid container alignItems="center" spacing={24}>
					<Grid item xs={1}>
						<img
							style={{ height: 28, width: 28 }}
							className={classes.icon}
							src={servedImage("/icons/drinks-pink.svg")}
						/>
					</Grid>
					<Grid item xs={11}>
						<Typography className={classes.descriptionHeading}>
							Notifications Opened{" "}
							<span className={classes.percentage}>
								{scheduleProgress === null ? "0" : completed}%
							</span>
						</Typography>
						<LinearProgress
							variant="determinate"
							value={completed}
							color={"secondary"}
							className={classes.progressBar}
						/>
					</Grid>
					<Grid item xs={12} style={{ padding: "0 12px" }}>
						<Grid container>
							<Grid item xs={4}>
								<Typography className={classes.greyText}>
									People received:{" "}
									<span className={classes.blackText}>
										{scheduleSent === null ? "0" : scheduleSent}
									</span>
								</Typography>
							</Grid>
							<Grid item xs={1}>
								<Typography className={classes.greyText}>|</Typography>
							</Grid>
							<Grid item xs={7}>
								<Typography className={classes.greyText}>
									Event Period:{" "}
									<span className={classes.blackText}>
										{eventStart ? eventStart : ""} -
										{eventEnd ? eventEnd : ""}
									</span>
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			);
		} else {
			return (
				<Grid container alignItems="center" spacing={24}>
					<Grid item xs={1}>
						<img
							style={{ height: 28, width: 28 }}
							className={classes.icon}
							src={servedImage("/icons/drinks-pink.svg")}
						/>
					</Grid>
					<Grid item xs={9} md={4}>
						<Typography className={classes.descriptionHeading}>
							{isEventEnded ? "Event has ended" : "Schedule the Last Call"}
						</Typography>
					</Grid>
					<Grid item xs={12} md={4}>
						{isEventEnded ? null : renderTimes}
					</Grid>
				</Grid>
			);
		}
	}
}

NotificationProgress.propTypes = {
	classes: PropTypes.object.isRequired,
	broadcastSent: PropTypes.bool.isRequired,
	scheduleProgress: PropTypes.number,
	scheduleAt: PropTypes.string,
	eventStart: PropTypes.string,
	eventEnd: PropTypes.string,
	timezone: PropTypes.string,
	isNotificationAfter: PropTypes.bool.isRequired,
	isEventEnded: PropTypes.bool.isRequired,
	scheduleSent: PropTypes.number,
	renderTimes: PropTypes.object
};

export default NotificationProgress;
