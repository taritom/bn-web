import React, { Component } from "react";
import { Typography, withStyles, Grid, Hidden } from "@material-ui/core";

import notifications from "../../../../../../stores/notifications";
import Bigneon from "../../../../../../helpers/bigneon";
import {
	fontFamilyDemiBold,
	secondaryHex
} from "../../../../../../config/theme";
import SelectGroup from "../../../../../common/form/SelectGroup";
import moment from "moment-timezone";
import servedImage from "../../../../../../helpers/imagePathHelper";
import {
	TIME_FORMAT_YYYY_MM_DD_NO_TIMEZONE,
	TIME_FORMAT_MM_DD_YYYY_NO_TIMEZONE
} from "../../../../../../helpers/time";
import SendDialog from "./sections/SendDialog";
import MobileView from "./sections/MobileView";
import DesktopView from "./sections/DesktopView";

const styles = theme => ({
	root: {},
	parentHeading: {
		color: secondaryHex,
		fontFamily: fontFamilyDemiBold,
		textTransform: "uppercase",
		fontSize: theme.typography.fontSize * 0.8
	},
	heading: {
		fontFamily: fontFamilyDemiBold,
		fontSize: theme.typography.fontSize * 1.4
	},
	headingContainer: {
		padding: "30px 10px"
	},
	description: {
		fontSize: theme.typography.fontSize * 1.1
	},
	descriptionHeading: {
		fontFamily: fontFamilyDemiBold
	},
	actionButtonContainer: {
		marginTop: theme.spacing.unit * 2,
		marginBottom: theme.spacing.unit * 2,
		[theme.breakpoints.down("xs")]: {
			textAlign: "center",
			marginTop: 0,
			marginBottom: 0
		}
	},
	dialogContainer: {
		textAlign: "center",
		marginBottom: theme.spacing.unit * 2,
		marginTop: theme.spacing.unit * 2
	},
	pinkText: {
		color: secondaryHex
	},
	speech: {
		width: "80%",
		float: "right",
		[theme.breakpoints.down("xs")]: {
			width: "100%",
			float: "none"
		}
	},
	content: {
		marginTop: 20,
		maxWidth: 540
	},
	notificationBg: {
		backgroundColor: "#F5F7FA",
		padding: theme.spacing.unit * 1,
		borderRadius: 8,
		textAlign: "center"
	},
	percentage: {
		color: "#C4C3C5",
		fontSize: 14,
		float: "right"
	},
	greyText: {
		color: "#C4C3C5",
		fontSize: 14
	},
	blackText: {
		color: "#3C383F",
		fontSize: 14
	},
	progressBar: {
		borderRadius: 10,
		backgroundColor: "#F5F7FA",
		height: 8
	},
	mobileContainer: {
		padding: "40px 20px"
	},
	actionInfoContainer: {
		paddingTop: 40
	}
});

class Index extends Component {
	constructor(props) {
		super(props);

		this.eventId = this.props.match.params.id;

		this.state = {
			event_start: null,
			door_time: null,
			event_end: null,
			canTrigger: null,
			isSending: false,
			openConfirmDialog: false,
			isCustom: false,
			broadcastSent: false,
			errors: {},
			broadcastData: {},
			eventStart: null,
			eventEnd: null,
			times: [],
			timezone: null,
			sendAt: "",
			scheduledAt: null,
			scheduleProgress: null,
			scheduleSent: null,
			broadcastId: null,
			isNotificationAfter: true,
			isEventEnded: false,
			datesOptions: [],
			hasEventStarted: true,
			count: 1
		};
	}

	componentDidMount() {
		const { broadcastSent, scheduleProgress, scheduleSent } = this.state;
		//TODO check if the event is running before enabling the button
		this.setState({ canTrigger: true });

		this.loadNotificationDetails();

		!broadcastSent ? this.autoLoadProgress() : null;
	}

	loop = () => {
		let { count } = this.state;
 		setTimeout(() => {
			this.fetchNotificationQuantity();
			count++;
			if (count < 12) {
				this.loop();
			}
		}, count * 5000);
	};

	autoLoadProgress() {
		this.loop();
	}

	fetchNotificationQuantity() {
		Bigneon()
			.events.broadcasts.index({ event_id: this.eventId })
			.then(response => {
				const { data } = response.data;
				data.forEach(
					({ notification_type, sent_quantity, opened_quantity }) => {
						if (notification_type === "LastCall") {
							this.setState({
								scheduleProgress: opened_quantity,
								scheduleSent: sent_quantity
							});
						}
					}
				);
			})
			.catch(error => {
				console.error(error);
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Loading existing notifications failed."
				});
			});
	}

	loadEventBroadcast() {
		const { timezone } = this.state;
		Bigneon()
			.events.broadcasts.index({ event_id: this.eventId })
			.then(response => {
				const { data } = response.data;
				let broadcastSent = true;
				data.forEach(
					({
						id,
						notification_type,
						status,
						send_at,
						sent_quantity,
						updated_at,
						opened_quantity
					}) => {
						if (notification_type === "LastCall") {
							broadcastSent = status !== "Pending" && status !== "InProgress";
							const scheduledAt = send_at !== null ? send_at : updated_at;

							const isNotificationAfter = !!moment
								.utc(scheduledAt)
								.isAfter(moment.utc());
							this.setState({
								isNotificationAfter,
								broadcastSent,
								scheduledAt,
								scheduleProgress: opened_quantity,
								scheduleSent: sent_quantity,
								broadcastId: id,
								sendAt: moment
									.utc(scheduledAt)
									.tz(timezone)
									.format(TIME_FORMAT_MM_DD_YYYY_NO_TIMEZONE)
							});
							if (!isNotificationAfter) {
								this.autoLoadProgress();
							}
						}
					}
				);
			})
			.catch(error => {
				console.error(error);
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Loading existing notifications failed."
				});
			});
	}

	loadNotificationDetails() {
		Bigneon()
			.events.read({ id: this.eventId })
			.then(response => {
				const {
					event_start,
					door_time,
					event_end,
					venue,
					status
				} = response.data;
				const hasEventStarted = !!moment.utc(door_time).isBefore(moment.utc());
				this.setState(
					{
						event_start,
						door_time,
						event_end,
						eventStart: moment
							.utc(door_time)
							.tz(venue.timezone)
							.format(TIME_FORMAT_MM_DD_YYYY_NO_TIMEZONE),
						eventEnd: moment
							.utc(event_end)
							.tz(venue.timezone)
							.format(TIME_FORMAT_MM_DD_YYYY_NO_TIMEZONE),
						timezone: venue.timezone,
						isEventEnded: status === "Closed",
						hasEventStarted
					},

					() => {
						this.loadEventBroadcast();

						const dates = this.fifteenInterval();
						const setArray = new Set(dates);
						const datesArray = Array.from(setArray);

						const datesOptions = datesArray.map(date => ({
							value: date,
							label: date
						}));

						this.setState({ datesOptions });
					}
				);
			})
			.catch(error => {
				console.error(error);
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Loading event details failed."
				});
			});
	}

	sendNow(e) {
		const { updateNotification, broadcastId, timezone } = this.state;
		e.preventDefault();
		let broadcastData = {};

		this.submitAttempted = true;

		this.setState({ isSending: true });

		if (updateNotification && broadcastId) {
			broadcastData = {
				id: broadcastId,
				notification_type: "LastCall",
				send_at: null
			};
		} else {
			broadcastData = {
				event_id: this.eventId,
				channel: "PushNotification",
				notification_type: "LastCall",
				send_at: null
			};
		}

		updateNotification
			? this.updateNotification(broadcastData)
			: this.createNotification(broadcastData);
	}

	onSend(e) {
		const { sendAt, updateNotification, broadcastId, timezone } = this.state;
		e.preventDefault();
		let broadcastData = {};

		this.submitAttempted = true;

		if (!this.validateFields()) {
			notifications.show({
				message: "Invalid field.",
				variant: "warning"
			});
			return false;
		}

		this.setState({ isSending: true });
		const send_at = moment
			.tz(sendAt, TIME_FORMAT_MM_DD_YYYY_NO_TIMEZONE, timezone)
			.utc()
			.format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
		broadcastData = {
			send_at,
			notification_type: "LastCall"
		};
		if (updateNotification && broadcastId) {
			broadcastData = {
				...broadcastData,
				id: broadcastId
			};
		} else {
			broadcastData = {
				...broadcastData,
				event_id: this.eventId,
				channel: "PushNotification"
			};
		}

		updateNotification
			? this.updateNotification(broadcastData)
			: this.createNotification(broadcastData);
	}

	createNotification(broadcastData) {
		Bigneon()
			.events.broadcasts.create(broadcastData)
			.then(response => {
				this.setState({
					isSending: false,
					openConfirmDialog: false,
					lastCallMessage: "",
					errors: {}
				});
				this.submitAttempted = false;
				notifications.show({
					message: "Notification created!",
					variant: "success"
				});
				this.loadEventBroadcast();
			})
			.catch(error => {
				this.setState({
					isSending: false
				});
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Failed to create notification."
				});
			});
	}

	updateNotification(broadcastData) {
		Bigneon()
			.broadcasts.update(broadcastData)
			.then(response => {
				this.setState({
					isSending: false,
					openConfirmDialog: false,
					lastCallMessage: "",
					errors: {}
				});
				this.submitAttempted = false;
				notifications.show({
					message: "Notification updated!",
					variant: "success"
				});
				this.loadEventBroadcast();
			})
			.catch(error => {
				this.setState({
					isSending: false
				});
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Failed to update notifications."
				});
			});
	}

	onDialogClose() {
		this.setState({
			openConfirmDialog: false,
			errors: {}
		});
	}

	onAction() {
		this.setState({
			broadcastSent: true,
			updateNotification: true
		});
	}

	onSendNow() {
		this.setState({ openConfirmDialog: true, isCustom: false });
	}

	validateFields() {
		const { sendAt } = this.state;
		//Don't validate every field if the user has not tried to submit at least once
		if (!this.submitAttempted) {
			return true;
		}

		const errors = {};

		if (!sendAt) {
			errors.sendAt = "Select a date and time.";
		}

		this.setState({ errors });
		if (Object.keys(errors).length > 0) {
			return false;
		}

		return true;
	}

	fifteenInterval() {
		const {
			door_time,
			event_end,
			eventStart,
			eventEnd,
			times,
			timezone
		} = this.state;
		const start = moment.utc(door_time);
		const end = moment.utc(event_end);
		// round starting minutes up to nearest 15 (12 --> 15, 17 --> 30)
		// note that 59 will round up to 60, and moment.js handles that correctly
		start.minutes(Math.ceil(start.minutes() / 15) * 15);
		while (start < end) {
			if (start.isAfter(moment.utc())) {
				times.push(
					start.tz(timezone).format(TIME_FORMAT_MM_DD_YYYY_NO_TIMEZONE)
				);
			}
			start.add(15, "minutes");
		}
		return times;
	}

	renderTimes() {
		const {
			eventStart,
			eventEnd,
			sendAt,
			errors,
			scheduledAt,
			broadcastSent,
			isNotificationAfter,
			isEventEnded,
			timezone,
			datesOptions
		} = this.state;

		if (eventStart === null || eventEnd === null) {
			return <Typography variant="body1">Loading times...</Typography>;
		}

		if (!scheduledAt && broadcastSent) {
			return null;
		}

		if (!isNotificationAfter || !isEventEnded) {
			return (
				<SelectGroup
					value={sendAt}
					items={datesOptions}
					name={"sendAt"}
					error={errors.sendAt}
					onChange={e => {
						this.setState({
							sendAt: e.target.value
						});
					}}
				/>
			);
		}
	}

	render() {
		const { classes } = this.props;
		const {
			openConfirmDialog,
			isSending,
			broadcastSent,
			scheduleProgress,
			scheduledAt,
			eventStart,
			eventEnd,
			timezone,
			isNotificationAfter,
			isEventEnded,
			scheduleSent,
			isCustom,
			hasEventStarted
		} = this.state;

		const Details = (
			<Grid container>
				<Grid item xs={12} md={7}>
					<Typography className={classes.description}>
						<span className={classes.descriptionHeading}>
							How does it work?
						</span>
						<br/>
						Last Call Notifications are optimized to drive food and beverage
						sales by intelligently engaging your attendees prior to the close of
						service to entice them to make a purchase.{" "}
						<span className={classes.pinkText}>
							This can only be used once during your event.
						</span>
						<br/>
						<br/>
						All attendees who have enabled notifications on their devices will
						receive the following Last Call notification on their device at the
						time set above.
					</Typography>
				</Grid>
				<Grid item xs={12} md={5}>
					<img
						className={classes.speech}
						src={servedImage("/images/fan-notification-speech-bubble.png")}
					/>
				</Grid>
			</Grid>
		);

		return (
			<div>
				<SendDialog
					classes={classes}
					openConfirmDialog={openConfirmDialog}
					isSending={isSending}
					onDialogClose={this.onDialogClose.bind(this)}
					sendNow={this.sendNow.bind(this)}
					validateFields={this.validateFields.bind(this)}
				/>
				<Hidden smDown>
					<DesktopView
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
						isSending={isSending}
						isCustom={isCustom}
						renderTimes={this.renderTimes()}
						onSend={this.onSend.bind(this)}
						onAction={this.onAction.bind(this)}
						onSendNow={this.onSendNow.bind(this)}
						details={Details}
						eventId={this.eventId}
						hasEventStarted={hasEventStarted}
					/>
				</Hidden>
				<Hidden mdUp>
					<MobileView
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
						isSending={isSending}
						isCustom={isCustom}
						renderTimes={this.renderTimes()}
						onSend={this.onSend.bind(this)}
						onAction={this.onAction.bind(this)}
						onSendNow={this.onSendNow.bind(this)}
						details={Details}
						eventId={this.eventId}
						hasEventStarted={hasEventStarted}
					/>
				</Hidden>
			</div>
		);
	}
}

export default withStyles(styles)(Index);
