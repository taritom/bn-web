import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import {
	fontFamilyDemiBold,
	secondaryHex
} from "../../../../../../config/theme";
import Card from "../../../../../elements/Card";
import { Collapse, Hidden } from "@material-ui/core";
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
		sentAtDisplay,
		...rest
	} = email;

	const emailBody = (
		<Typography
			className={classes.text}
			dangerouslySetInnerHTML={{ __html: message }}
		/>
	);

	return (
		<Card variant={"raisedLight"} className={classes.root}>
			{/*DESKTOP*/}
			<Hidden smDown>
				<div className={classes.row}>
					<Typography className={classes.dateText} style={colStyles[0]}>
						{sentAtDisplay}
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
						<Hidden smDown>
							<Divider/>
						</Hidden>
						<br/>
						<Typography className={classes.title}>Body message</Typography>
						<br/>
						{emailBody}
					</div>
				</Collapse>
			</Hidden>

			{/*MOBILE*/}
			<Hidden mdUp>
				<Typography className={classes.title}>Date Sent</Typography>
				<Typography className={classes.dateText}>{sentAtDisplay}</Typography>
				<br/>
				<Typography className={classes.title}>Subject</Typography>
				<Typography>{name}</Typography>
				<br/>
				<Typography className={classes.title}>Recipients</Typography>
				<Typography>{sent_quantity}</Typography>
				<br/>

				<Collapse in={isExpanded}>
					<div>
						<Typography className={classes.title}>Body message</Typography>
						<br/>
						{emailBody}
					</div>
				</Collapse>

				<Typography
					className={classes.expandText}
					onClick={() => onSelectToggle(id)}
				>
					{isExpanded ? "Hide details" : "Show details"}
				</Typography>
			</Hidden>
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
