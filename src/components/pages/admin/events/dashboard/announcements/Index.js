import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import moment from "moment-timezone";

import notifications from "../../../../../../stores/notifications";
import Bigneon from "../../../../../../helpers/bigneon";
import Container from "../Container";
import { fontFamilyDemiBold } from "../../../../../../config/theme";
import NewAnnouncementCard from "./NewAnnouncementCard";
import PreviewSendDialog from "./PreviewSendDialog";
import ConfirmSendDialog from "./ConfirmSendDialog";
import EmailHistory from "./EmailHistory";
import Loader from "../../../../../elements/loaders/Loader";
import user from "../../../../../../stores/user";
import splitByCamelCase from "../../../../../../helpers/splitByCamelCase";

const styles = theme => ({
	root: {},
	title: {
		fontFamily: fontFamilyDemiBold,
		fontSize: 20
	},
	explainerText: {
		fontSize: 14,
		marginTop: 20
	},
	boldText: {
		fontFamily: fontFamilyDemiBold
	},
	paddedContent: {
		paddingLeft: theme.spacing.unit * 8,
		paddingRight: theme.spacing.unit * 8,

		[theme.breakpoints.down("sm")]: {
			paddingLeft: theme.spacing.unit * 4,
			paddingRight: theme.spacing.unit * 4
		}
	}
});

class Announcements extends Component {
	constructor(props) {
		super(props);

		this.eventId = this.props.match.params.id;

		this.state = {
			numberOfRecipients: null,
			htmlBodyString: "",
			subject: "",
			errors: {},
			showPreviewDialog: false,
			previewIsSent: false,
			previewIsSending: false,
			showSendDialog: false,
			isSending: false,
			isSent: false,
			emailHistory: null
		};
	}

	componentDidMount() {
		Bigneon()
			.events.ticketHolderCount({ id: this.eventId })
			.then(response => {
				this.setState({
					numberOfRecipients: response.data
				});
			})
			.catch(error => {
				console.error(error);
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Loading ticket holders failed."
				});
			});

		Bigneon()
			.events.read({ id: this.eventId })
			.then(response => {
				const { venue } = response.data;

				//TODO we need an endpoint to get numberOfRecipients
				// this.setState({
				// 	numberOfRecipients: event.sold_held + event.sold_unreserved
				// });

				this.timezone = venue.timezone;

				this.loadEventHistory();
			})
			.catch(error => {
				console.error(error);
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Loading event details failed."
				});
			});
	}

	loadEventHistory() {
		Bigneon()
			.events.broadcasts.index({ event_id: this.eventId })
			.then(response => {
				const { data } = response.data;
				const emailHistory = [];

				const timezone = this.timezone || user.currentOrgTimezone;

				data.forEach(email => {
					const {
						id,
						created_at,
						notification_type,
						send_at,
						status,
						preview_email
					} = email;
					if (notification_type === "Custom" && !preview_email) {
						const dateFormat = "MM/DD/YY hh:mm A z";

						if (send_at) {
							//If send in past
							if (moment.utc(send_at).isBefore(moment.utc())) {
								email.sentAtDisplay = moment
									.utc(send_at)
									.tz(timezone)
									.format(dateFormat);
							} else {
								//If scheduled for future, use the status
								email.sentAtDisplay = splitByCamelCase(status);
							}
						} else {
							email.sentAtDisplay = moment
								.utc(created_at)
								.tz(timezone)
								.format(dateFormat);
						}

						emailHistory.push(email);
					}
				});

				this.setState({ emailHistory });
			})
			.catch(error => {
				console.error(error);
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Loading email history failed."
				});
			});
	}

	onPreviewSendDialog() {
		this.submitAttempted = true;

		if (!this.validateFields()) {
			return notifications.show({
				variant: "warning",
				message: "Missing email details."
			});
		}

		this.setState({ showPreviewDialog: true });
	}

	onPreviewSend(email) {
		this.setState({ previewIsSending: true });

		const { subject, htmlBodyString } = this.state;

		Bigneon()
			.events.broadcasts.create({
				event_id: this.eventId,
				name: subject,
				message: htmlBodyString,
				audience: "TicketHolders",
				channel: "Email",
				notification_type: "Custom",
				preview_email: email
			})
			.then(response => {
				this.setState({
					previewIsSending: false,
					previewIsSent: true
				});
			})
			.catch(error => {
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Failed to trigger notifications."
				});
			});
	}

	onPreviewDialogClose() {
		this.setState({ showPreviewDialog: false }, () => {
			setTimeout(() => {
				this.setState({
					previewIsSent: false,
					previewIsSending: false
				});
			}, 500);
		});
	}

	onSendDialog() {
		this.submitAttempted = true;

		if (!this.validateFields()) {
			return notifications.show({
				variant: "warning",
				message: "Missing email details."
			});
		}

		this.setState({ showSendDialog: true });
	}

	onSendDialogClose() {
		this.setState({ showSendDialog: false }, () => {
			setTimeout(() => {
				this.setState({
					isSent: false,
					isSending: false
				});
			}, 500);
		});
	}

	onSend() {
		this.setState({ isSending: true });

		const { subject, htmlBodyString } = this.state;

		Bigneon()
			.events.broadcasts.create({
				event_id: this.eventId,
				name: subject,
				message: htmlBodyString,
				audience: "TicketHolders",
				channel: "Email",
				notification_type: "Custom"
			})
			.then(response => {
				setTimeout(() => this.loadEventHistory(), 1000);

				this.setState({
					isSending: false,
					isSent: true,
					subject: "",
					htmlBodyString: ""
				});
			})
			.catch(error => {
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Failed to trigger notifications."
				});
			});
	}

	validateFields() {
		//Don't validate every field if the user has not tried to submit at least once
		if (!this.submitAttempted) {
			return true;
		}

		const errors = {};

		const { htmlBodyString, subject } = this.state;

		if (!subject) {
			errors.subject = "Missing subject";
		}

		if (!htmlBodyString) {
			errors.htmlBodyString = "Missing email body.";
		}

		this.setState({ errors });
		if (Object.keys(errors).length > 0) {
			return false;
		}

		return true;
	}

	render() {
		const { classes } = this.props;
		const {
			subject,
			htmlBodyString,
			numberOfRecipients,
			errors,
			showPreviewDialog,
			previewIsSent,
			previewIsSending,
			showSendDialog,
			isSending,
			isSent,
			emailHistory
		} = this.state;

		return (
			<Container
				eventId={this.eventId}
				subheading={"tools"}
				layout={"childrenInsideCard"}
				removeCardSidePadding
			>
				<PreviewSendDialog
					open={showPreviewDialog}
					onClose={this.onPreviewDialogClose.bind(this)}
					onSend={this.onPreviewSend.bind(this)}
					isSent={previewIsSent}
					isSending={previewIsSending}
				/>
				<ConfirmSendDialog
					open={showSendDialog}
					isSending={isSending}
					isSent={isSent}
					onSend={this.onSend.bind(this)}
					onClose={this.onSendDialogClose.bind(this)}
					numberOfRecipients={numberOfRecipients}
				/>
				<div className={classes.paddedContent}>
					<Typography className={classes.title}>
						Need to make an announcement?
					</Typography>

					<Typography className={classes.explainerText}>
						Email all current ticket holders
						{numberOfRecipients !== null ? (
							<span className={classes.boldText}> ({numberOfRecipients}) </span>
						) : null}
						to announce any major event updates including cancellation,
						postponement, rescheduled date/time, or new location.
						<br/>
						<span className={classes.boldText}>Disclaimer:</span> Not intended
						for marketing purposes.
					</Typography>
				</div>

				<NewAnnouncementCard
					onChangeBody={htmlBodyString => this.setState({ htmlBodyString })}
					onChangeSubject={e => this.setState({ subject: e.target.value })}
					subject={subject}
					htmlBodyString={htmlBodyString}
					errors={errors}
					onPreviewSend={this.onPreviewSendDialog.bind(this)}
					onSend={this.onSendDialog.bind(this)}
				/>

				<div className={classes.paddedContent}>
					<Typography className={classes.title}>Email history</Typography>
					{emailHistory ? (
						<EmailHistory emails={emailHistory}/>
					) : (
						<Loader>Loading history...</Loader>
					)}
				</div>
			</Container>
		);
	}
}

export default withStyles(styles)(Announcements);
