import React, { Component } from "react";
import { withStyles, Typography, Hidden } from "@material-ui/core";
import LandingAppBar from "../../elements/header/LandingAppBar";
import user from "../../../stores/user";
import { fontFamilyBold } from "../../../config/theme";

const styles = theme => ({
	root: {
		backgroundColor: "#221D27",
		display: "flex",
		flexDirection: "column",
		// paddingLeft
		minHeight: 267,
		[theme.breakpoints.down("sm")]: {
			flexDirection: "column",
			minHeight: 350
		}
	},
	heading: {
		fontSize: 72,
		fontFamily: fontFamilyBold,
		color: "#fff",
		marginTop: theme.spacing.unit * 4,
		[theme.breakpoints.down("sm")]: {
			fontSize: theme.typography.fontSize * 2.9,
			paddingLeft: theme.spacing.unit * 3,
			paddingRight: theme.spacing.unit * 3
		}
	},
	headingContainer: {
		width: 1400,
		margin: "0 auto"
	},
	subHeading: {
		color: "#9DA3B4",
		fontSize: 21,
		lineSpace: 1,
		[theme.breakpoints.down("sm")]: {
			fontSize: theme.typography.fontSize * 1.4
		}
	}
});

class CityLandingHero extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { history, classes } = this.props;

		return (
			<div className={classes.root}>
				<Hidden smDown>
					<LandingAppBar
						isAuthenticated={user.isAuthenticated}
						history={history}
					/>
				</Hidden>

				<div className={classes.headingContainer}>
					<Typography className={classes.heading}>CAlifornia</Typography>
					<Typography className={classes.subHeading}>
						All the leaves are brown and the sky is grey.
					</Typography>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(CityLandingHero);
