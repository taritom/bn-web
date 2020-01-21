import React from "react";
import PropTypes from "prop-types";
import Bn from "bn-api-node";
import { Typography, withStyles } from "@material-ui/core";

import { dollars } from "../../../../../helpers/money";
import { fontFamilyDemiBold } from "../../../../../config/theme";
import Delete from "@material-ui/icons/Delete";
import IconButton from "../../../../elements/IconButton";

const styles = theme => ({
	root: {
		marginTop: theme.spacing.unit * 2
	},
	text: {
		fontSize: 14
	},
	title: {
		fontFamily: fontFamilyDemiBold,
		fontSize: 17,
		textTransform: "capitalize"
	},
	itemContainer: {
		marginTop: theme.spacing.unit
	},
	boldText: {
		fontFamily: fontFamilyDemiBold
	},
	icon: {
		marginLeft: 30,
		marginBottom: 5
	}
});

const typeEnums = Bn.Enums.ADJUSTMENT_TYPES;

const AdjustmentsList = props => {
	const { classes, adjustments, deleteDialog } = props;

	return (
		<div className={classes.root}>
			<Typography className={classes.title}>Manual adjustments:</Typography>
			{adjustments.map(adjustment => {
				const {
					id,
					amount_in_cents,
					displayCreatedAt,
					note,
					settlement_adjustment_type
				} = adjustment;

				return (
					<div key={id} className={classes.itemContainer}>
						<Typography className={classes.text}>
							<span className={classes.boldText}>
								{typeEnums[settlement_adjustment_type]}
							</span>{" "}
							- {displayCreatedAt}
							<IconButton className={classes.icon} onClick={deleteDialog} iconUrl="/icons/delete-gray.svg">
								Delete
							</IconButton>
						</Typography>
						<Typography className={classes.text}>
							Value: {dollars(amount_in_cents)}
						</Typography>

						<Typography className={classes.text}>
							Note: {note || "-"}
						</Typography>
					</div>
				);
			})}
		</div>
	);
};

AdjustmentsList.propTypes = {
	classes: PropTypes.object.isRequired,
	adjustments: PropTypes.array.isRequired,
	deleteDialog: PropTypes.func
};

export default withStyles(styles)(AdjustmentsList);
