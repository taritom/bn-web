import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Button from "../../../elements/Button";
import notification from "../../../../stores/notifications";
import Bigneon from "../../../../helpers/bigneon";
import Dialog from "../../../elements/Dialog";
import { Typography } from "@material-ui/core";
import { fontFamilyDemiBold, secondaryHex } from "../../../../config/theme";

const styles = theme => ({
	content: {
		minWidth: 400,
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
	boldText: {
		fontFamily: fontFamilyDemiBold
	}
});

class CancelTransferDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isCancelling: false,
			recipientEmail: null,
			transferId: null,
			cancelSuccess: false,
			ticketIds: []
		};

		this.onClose = this.onClose.bind(this);
	}

	componentDidMount() {
		this.loadTransferDetails();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (
			this.props.transferKey &&
			prevProps.transferKey !== this.props.transferKey
		) {
			this.loadTransferDetails();
		}
	}

	loadTransferDetails() {
		const { transferKey } = this.props;

		if (!transferKey) {
			return null;
		}

		Bigneon()
			.transfers.read({
				id: transferKey
			})
			.then(response => {
				const { id, transfer_address, ticket_ids } = response.data;
				this.setState({
					recipientEmail: transfer_address,
					transferId: id,
					ticketIds: ticket_ids
				});
			})
			.catch(error => {
				this.setState({ isCancelling: false });
				console.error(error);
				notification.showFromErrorResponse({
					error,
					defaultMessage: "Could not find transfer details."
				});
			});
	}

	onClose() {
		const { isCancelling } = this.state;
		if (isCancelling) {
			return;
		}

		this.setState({ recipientEmail: null, cancelSuccess: false }, () => {
			const { onClose } = this.props;
			onClose();
		});
	}

	onCancel() {
		this.setState({ isCancelling: true });
		const { transferId } = this.state;

		Bigneon()
			.transfers.cancel({
				id: transferId
			})
			.then(response => {
				this.setState({ isCancelling: false, cancelSuccess: true }, () => {
					if (this.props.onSuccess) {
						this.props.onSuccess();
					}
				});
			})
			.catch(error => {
				this.setState({ isCancelling: false });
				console.error(error);
				notification.showFromErrorResponse({
					error,
					defaultMessage: "Ticket transfer cancel failed.",
					variant: "error"
				});
			});
	}

	renderCancelContent() {
		const { classes } = this.props;

		const { isCancelling, transferId } = this.state;

		return (
			<React.Fragment>
				<br/>
				<Typography className={classes.infoText}>
					<span className={classes.boldText}>
						Are you sure you want to cancel the transfer?
					</span>
					<br/>
					By cancelling the transfer, the ticket will be returned to the account
					of the sender.
				</Typography>
				<br/>
				<div className={classes.actionButtons}>
					<Button
						size="large"
						style={{ flex: 1, marginRight: 5 }}
						disabled={isCancelling}
						onClick={this.onClose}
					>
						Cancel
					</Button>
					<Button
						size="large"
						style={{ flex: 1, marginLeft: 5 }}
						onClick={this.onCancel.bind(this)}
						variant="secondary"
						disabled={isCancelling || !transferId}
					>
						{isCancelling ? "Cancelling..." : "Yes, Cancel the Transfer"}
					</Button>
				</div>
			</React.Fragment>
		);
	}

	renderSuccessContent() {
		const { classes } = this.props;

		return (
			<React.Fragment>
				<br/>
				<br/>
				<div className={classes.actionButtons}>
					<Button
						size="large"
						style={{ flex: 1, maxWidth: 300 }}
						onClick={this.onClose}
					>
						Close
					</Button>
				</div>
			</React.Fragment>
		);
	}

	render() {
		const { transferKey, classes, onSuccess, ...rest } = this.props;
		const { cancelSuccess } = this.state;

		return (
			<Dialog
				onClose={this.onClose}
				title={
					cancelSuccess ? "We've cancelled the transfer" : "Cancel Transfer"
				}
				open={!!transferKey}
				{...rest}
			>
				{cancelSuccess
					? this.renderSuccessContent()
					: this.renderCancelContent()}
			</Dialog>
		);
	}
}

CancelTransferDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	onClose: PropTypes.func.isRequired,
	transferKey: PropTypes.string,
	onSuccess: PropTypes.func
};

export default withStyles(styles)(CancelTransferDialog);
