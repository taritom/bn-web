import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Button from "../../../../elements/Button";
import CustomButton from "../../../../elements/Button";
import notification from "../../../../../stores/notifications";
import Bigneon from "../../../../../helpers/bigneon";
import classNames from "classnames";
import Dialog from "../../../../elements/Dialog";
import { Typography } from "@material-ui/core";
import { fontFamilyDemiBold, secondaryHex } from "../../../../../config/theme";
import InputGroup from "../../../../common/form/InputGroup";
import InputAdornment from "@material-ui/core/InputAdornment";
import CustomIconButton from "../../../../elements/IconButton";

import { validEmail } from "../../../../../validators";

const styles = theme => ({
	root: {
		maxWidth: 500
	},
	content: {
		width: 400,
		alignContent: "center",
		textAlign: "center"
	},
	actionButtons: {
		display: "flex",
		justifyContent: "center"
	},
	infoText: {
		fontSize: theme.typography.fontSize * 1.125,
		textAlign: "center"
	},
	pinkText: {
		color: secondaryHex,
		fontFamily: fontFamilyDemiBold
	},
	btnStyle: {
		backgroundColor: "#EEEFFD",
		width: 35,
		height: 35
	},
	addBtn: {
		alignSelf: "flex-start",
		margin: "0 0 16px 0"
	},
	removeBtn: {
		width: 25,
		height: 25,
		padding: 0,
		margin: "0 16px 16px 0"
	},
	btnHolder: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	ctaStyle: {
		width: 220,
		marginTop: theme.spacing.unit * 2
	},
	fakeInputDisplay: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
		// borderBottom: "2px solid #D1D1D1;"
	},
	scrollContainer: {
		maxHeight: 380,
		maxWidth: 400,
		overflowY: "scroll"
	},
	dialogDesc: {
		marginTop: theme.spacing.unit * 3,
		marginBottom: theme.spacing.unit * 3,
		width: 380
	}
});

class TicketCountEmailDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listData: null,
			newSubscriberEmail: "",
			previousEmail: false,
			showFirstInput: false,
			showNewInput: false,
			showInput: false,
			errors: {}
		};

		this.onClose = this.onClose.bind(this);
		this.onEnter = this.onEnter.bind(this);
		this.handleNewEmailInput = this.handleNewEmailInput.bind(this);
		this.validateEmail = this.validateEmail.bind(this);
		this.inputRef = React.createRef();
	}

	onEnter() {
		this.refreshSubscribers(this.props.eventId);
	}

	addNewSubscriber(newEmail, saveClose) {
		const { eventId } = this.props;
		const { previousEmail } = this.state;
		if (newEmail === "" && saveClose === true) {
			this.onClose();
		} else {
			Bigneon()
				.events.reports.create({
					report_type: "TicketCounts",
					event_id: eventId,
					email: newEmail
				})
				.then(response => {
					if (previousEmail === true) {
						this.setState({
							showNewInput: true,
							previousEmail: false,
							newSubscriberEmail: ""
						});
					}
					this.refreshSubscribers(eventId);
					if (saveClose === true) {
						this.onClose();
					}
					notification.show({
						message: "Subscriber successfully added",
						variant: "success"
					});
				})
				.catch(error => {
					console.error(error);
					notification.showFromErrorResponse({
						error,
						defaultMessage: "Could not find list."
					});
				});
		}
	}

	refreshSubscribers(eventId) {
		Bigneon()
			.events.reports.index({
				event_id: eventId
			})
			.then(response => {
				const { data } = response.data;
				this.setState({
					listData: data
				});
				if (data.length < 1) {
					this.setState({ showFirstInput: true });
				}
			})
			.catch(error => {
				console.error(error);
				notification.showFromErrorResponse({
					error,
					defaultMessage: "Could not find list."
				});
			});
	}

	handleNewEmailInput() {
		const { listData, newSubscriberEmail } = this.state;

		if (listData.length > 0) {
			this.setState({ showNewInput: true }, () => {
				setTimeout(() => {
					if (this.inputRef) {
						this.inputRef.current.focus();
					}
				}, 1000);
			});
		}
		if (newSubscriberEmail.length > 0) {
			this.addNewSubscriber(newSubscriberEmail, false);
		}
	}

	handleRemoveEmail(id) {
		const { eventId } = this.props;
		Bigneon()
			.event_report_subscribers.del({
				id: id
			})
			.then(response => {
				this.refreshSubscribers(eventId);
				notification.show({
					message: "Subscriber successfully removed",
					variant: "success"
				});
			})
			.catch(error => {
				console.error(error);
				notification.showFromErrorResponse({
					error,
					defaultMessage: "Could not delete subscriber."
				});
			});
	}

	onClose() {
		const { onClose } = this.props;
		this.setState({ showNewInput: false, showFirstInput: false });
		onClose();
	}

	validateEmail() {
		const { newSubscriberEmail } = this.state;

		const errors = {};

		if (!newSubscriberEmail) {
			errors.email = "Missing email address.";
		}

		if (!validEmail(newSubscriberEmail)) {
			errors.email = "Invalid email address.";
		}

		this.setState({ errors });

		if (Object.keys(errors).length > 0) {
			return false;
		} else {
			this.setState({ previousEmail: true });
		}

		return true;
	}

	renderInputs() {
		const { classes } = this.props;

		const { listData } = this.state;
		const iconUrlDelete = "/icons/dash.svg";

		const inputs = [];
		// const newInputs = [];

		if (listData && listData.length > 0) {
			listData.forEach((listItem, index) => {
				inputs.push(
					<InputGroup
						key={index}
						value={listItem.email}
						disabled={true}
						name="email"
						autoFocus={false}
						label=""
						placeholder="admin@subscriber.com"
						type="text"
						onChange={e => {
							// this.setState({
							// 	updatedSubscriberEmail: e.target.value
							// });
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<CustomIconButton
										className={classNames({
											[classes.btnStyle]: true,
											[classes.removeBtn]: true
										})}
										iconUrl={iconUrlDelete}
										onClick={() => this.handleRemoveEmail(listItem.id)}
									/>
								</InputAdornment>
							)
						}}
						onBlur={this.validateEmail}
					/>
				);
			});
		}
		return inputs;
	}

	render() {
		const { eventId, classes } = this.props;
		const {
			newSubscriberEmail,
			showNewInput,
			showFirstInput,
			errors
		} = this.state;
		const iconUrl = "/icons/envelope.png";
		const iconUrlAdd = "/icons/add-active.svg";
		return (
			<Dialog
				onClose={this.onClose}
				onEnter={this.onEnter}
				iconUrl={iconUrl}
				title={"Ticket Count Report"}
				open={!!eventId}
			>
				<Typography className={classes.dialogDesc}>
					Recipients will receive a daily Ticket Count Report for this event
					each morning until the morning after the event ends. Enter recipient
					email addresses below.
				</Typography>
				<div className={classes.scrollContainer}>
					{this.renderInputs()}
					{showNewInput || showFirstInput ? (
						<InputGroup
							key={"new input"}
							inputRef={this.inputRef}
							value={newSubscriberEmail}
							disabled={false}
							label=""
							autoFocus
							error={errors.email}
							name="email"
							placeholder="admin@subscriber.com"
							type="text"
							onChange={e => {
								this.setState({ newSubscriberEmail: e.target.value });
							}}
							onBlur={this.validateEmail}
						/>
					) : null}
				</div>
				<div className={classes.btnHolder}>
					<CustomIconButton
						className={classNames({
							[classes.btnStyle]: true,
							[classes.addBtn]: true
						})}
						iconUrl={iconUrlAdd}
						onClick={this.handleNewEmailInput}
					/>
					<Button
						className={classes.ctaStyle}
						size={"large"}
						variant={"secondary"}
						onClick={() => {
							this.addNewSubscriber(newSubscriberEmail, true);
						}}
					>
						Save
					</Button>
				</div>
			</Dialog>
		);
	}
}

TicketCountEmailDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	onClose: PropTypes.func.isRequired,
	onSuccess: PropTypes.func
};

export default withStyles(styles)(TicketCountEmailDialog);
