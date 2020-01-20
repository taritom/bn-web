import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";

import Button from "../../../../elements/Button";
import Dialog from "../../../../elements/Dialog";
import { Hidden, Typography } from "@material-ui/core";
import {
	fontFamilyDemiBold,
	secondaryHex
} from "../../../../../config/theme";

const styles = theme => ({
	content: {
		[theme.breakpoints.up("sm")]: {
			minWidth: 550
		}
	},
	successContent: {
		[theme.breakpoints.up("sm")]: {
			maxWidth: 400
		}
	},
	actionButtonsContainer: {
		display: "flex",
		justifyContent: "center",
		marginTop: 20
	},
	desktopOrderRow: {
		display: "flex",
		paddingLeft: 20,
		paddingRight: 20
	},
	desktopOrderRowBorder: {
		borderRadius: 6,
		border: "1px solid rgba(222, 226, 232, 0.56)",
		paddingTop: 20,
		paddingBottom: 20,
		marginTop: 10,
		marginBottom: 10
	},
	headingText: {
		color: "#939bad",
		fontSize: 14,
		fontFamily: fontFamilyDemiBold,
		textTransform: "uppercase",
		opacity: 0.7
	},
	desktopOrderDetailsContainer: {
		marginTop: 20
	},
	userText: {
		color: secondaryHex,
		fontFamily: fontFamilyDemiBold
	},
	subText: {
		color: "#8b94a7",
		fontSize: 14
	},
	formLabelText: {
		fontFamily: fontFamilyDemiBold,
		marginBottom: 8
	},
	refundAmountBox: {
		backgroundColor: "#f6f7f9",
		padding: 20,
		paddingBottom: 12,
		borderRadius: 8
	},
	refundAmountRow: {
		display: "flex",
		justifyContent: "space-between",
		marginBottom: 8
	},
	valueText: {
		fontFamily: fontFamilyDemiBold
	},
	valueTextActive: {
		color: secondaryHex
	},
	orderTotalRow: {
		backgroundColor: "#f6f7f9",
		display: "flex",
		justifyContent: "space-between",
		padding: 16,
		borderRadius: 8
	},
	orderTotalRowLabel: {
		fontFamily: fontFamilyDemiBold,
		fontSize: 14
	},
	orderTotalRowValue: {
		fontFamily: fontFamilyDemiBold,
		fontSize: 16,
		color: secondaryHex,
		textAlign: "right"
	},
	successDetailsRow: {
		marginTop: 20,
		display: "flex",
		justifyContent: "space-between"
	},
	userDetailsText: {
		fontFamily: fontFamilyDemiBold,
		color: secondaryHex
	},
	successRefundType: {
		color: "#8b94a7",
		fontSize: 14,
		textTransform: "uppercase"
	}
});

class DeleteDialog extends Component {
	constructor(props) {
		super(props);

		this.defaultState = {
			reasonVal: "empty",
			selectedRefundType: "fullRefund",
			isDeleting: false,
			selectedRefundOrderItem: {},
			refundAmountInCents: 0,
			refundSuccessDetails: null
		};

		this.state = this.defaultState;
	}

	static getDerivedStateFromProps(props, state) {
		const { selectedRefundOrderItem } = props;

		return { selectedRefundOrderItem };
	}

	render() {
		const { classes, open, order, type, onClose } = this.props;
		const {
			reasonVal,
			selectedRefundType,
			isDeleting,
			refundAmountInCents,
			refundSuccessDetails
		} = this.state;

		return (
			<Dialog
				iconUrl={"/icons/events-white.svg"}
				open={open}
				title={"Delete Adjustment"}
				onClose={onClose}
			>
				<div className={classes.content}>
					<Typography align="center">
						The manual adjustment will be deleted from the Settlement Report. Total Settlement value will be updated accordingly.
						<br/><br/>
						Please confirm that you want to delete this manual adjustment.
					</Typography>
					<div className={classes.actionButtonsContainer}>
						<Button
							style={{ marginRight: 5, width: 150 }}
							variant="default"
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							style={{ marginLeft: 5, width: 150 }}
							variant="secondary"
							disabled={isDeleting}
						>
							{isDeleting ? "Deleting..." : "Confirm"}
						</Button>
					</div>
				</div>
			</Dialog>
		);
	}
}

DeleteDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSuccess: PropTypes.func.isRequired,
	adjustment: PropTypes.array.isRequired
};

export default withStyles(styles)(DeleteDialog);
