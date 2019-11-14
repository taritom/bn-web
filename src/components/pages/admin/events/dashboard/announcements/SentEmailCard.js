import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import {
	fontFamilyDemiBold,
	secondaryHex
} from "../../../../../../config/theme";
import Card from "../../../../../elements/Card";
import { Collapse } from "@material-ui/core";
import Divider from "../../../../../common/Divider";
import splitByCamelCase from "../../../../../../helpers/splitByCamelCase";

const styles = theme => ({
	root: {
		paddingTop: 17,
		paddingBottom: 17,
		paddingLeft: 25,
		paddingRight: 25,

		marginTop: 6,
		marginBottom: 6
	},
	row: {
		display: "flex"
	},
	dateText: {
		color: "#9DA3B4",
		fontSize: 14
	},
	text: {
		fontSize: 14
	},
	expandText: {
		cursor: "pointer",
		fontSize: 14,
		color: secondaryHex
	},
	title: {
		fontFamily: fontFamilyDemiBold
	}
});

const SentEmailCard = ({
	classes,
	colStyles,
	onSelectToggle,
	isExpanded,
	...email
}) => {
	const {
		id,
		created_at,
		message,
		name,
		opened_quantity,
		progress,
		send_at,
		sent_quantity,
		status,
		updated_at,
		sendAtDisplay,
		...rest
	} = email;

	return (
		<Card variant={"raisedLight"} className={classes.root}>
			<div className={classes.row}>
				<Typography className={classes.dateText} style={colStyles[0]}>
					{sendAtDisplay || splitByCamelCase(status)}
				</Typography>
				<Typography className={classes.text} style={colStyles[1]}>
					{name}
				</Typography>
				<Typography className={classes.text} style={colStyles[2]}>
					{sent_quantity}
				</Typography>
				<Typography
					className={classes.expandText}
					style={colStyles[3]}
					onClick={() => onSelectToggle(id)}
				>
					{isExpanded ? "Hide details" : "Show details"}
				</Typography>
			</div>
			<Collapse in={isExpanded}>
				<div>
					<Divider/>
					<br/>
					<Typography className={classes.title}>Body message</Typography>
					<br/>

					<Typography
						className={classes.text}
						dangerouslySetInnerHTML={{ __html: message }}
					/>
				</div>
			</Collapse>
		</Card>
	);
};

SentEmailCard.propTypes = {
	classes: PropTypes.object.isRequired,
	isExpanded: PropTypes.bool.isRequired,
	colStyles: PropTypes.array.isRequired,
	onSelectToggle: PropTypes.func.isRequired
};

export default withStyles(styles)(SentEmailCard);
