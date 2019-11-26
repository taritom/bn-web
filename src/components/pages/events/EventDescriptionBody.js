import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import {
	textColorPrimary,
	secondaryHex,
	fontFamilyDemiBold,
	fontFamilyBold
} from "../../../config/theme";
import ArtistSummary from "../../elements/event/ArtistSummary";
import { Link } from "react-router-dom";
import LinkifyReact from "linkifyjs/react";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
	root: {
		paddingLeft: theme.spacing.unit * 10,
		paddingRight: theme.spacing.unit * 5,
		paddingTop: theme.spacing.unit * 5,
		paddingBottom: theme.spacing.unit * 10,

		[theme.breakpoints.down("md")]: {
			paddingLeft: theme.spacing.unit * 5,
			paddingRight: theme.spacing.unit * 2,
			paddingTop: theme.spacing.unit * 2,
			paddingBottom: theme.spacing.unit * 5
		}
	},
	eventDetailText: {
		color: textColorPrimary
	},
	artistsContainer: {
		paddingTop: theme.spacing.unit * 4
	},
	eventDescriptionLink: {
		color: secondaryHex
	},
	similarArtists: {
		marginTop: theme.spacing.unit * 4,
		marginBottom: theme.spacing.unit * 2
	},
	boldSpan: {
		fontFamily: fontFamilyDemiBold
	},
	bnLink: {
		color: secondaryHex,
		textDecoration: "underline"
	},
	artistsPerforming: {
		marginBottom: 0,
		marginTop: 0
	},
	divider: {
		marginTop: 30,
		marginBottom: 30
	}
});

const EventDescriptionBody = props => {
	const { classes, children, artists, eventIsCancelled, organization } = props;

	const headlineArtist = artists.find(artist => artist.importance === 0);
	const headliner = headlineArtist ? headlineArtist.artist.name : null;

	return (
		<div className={classes.root}>
			{eventIsCancelled ? (
				<div>
					Sorry, this event is no longer available.{" "}
					<Link to={"/"}>Browse other events</Link>
				</div>
			) : null}

			{children}

			{headliner ? (
				<Typography className={classes.similarArtists}>
					<span className={classes.boldSpan}>
						Looking for events similar to {headliner} tickets?
					</span>{" "}
					Browse all concerts & events at this venue on&nbsp;
					<Link to={`/organizations/${organization.slug}`} className={classes.bnLink}>
						Big Neon
					</Link>
				</Typography>
			) : null}

			{artists && artists.length !== 0 ? (
				<Grid
					className={classes.artistsContainer}
					spacing={32}
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
				>
					<Grid item xs={12} style={{ paddingBottom: 0, paddingTop: 0 }}>
						<h3 className={classes.artistsPerforming}>Artists Performing</h3>
					</Grid>
					{artists.map(({ artist, importance }, index) => (
						<Grid item xs={12} key={index}>
							<ArtistSummary headliner={importance === 0} {...artist}/>
							{ (artists.length === index + 1) ? "" : <Divider className={classes.divider}/> }
						</Grid>
					))}
				</Grid>
			) : null}
		</div>
	);
};

EventDescriptionBody.defaultProps = {};

EventDescriptionBody.propTypes = {
	classes: PropTypes.object.isRequired,
	children: PropTypes.object,
	artists: PropTypes.array,
	eventIsCancelled: PropTypes.bool
};

export default withStyles(styles)(EventDescriptionBody);
