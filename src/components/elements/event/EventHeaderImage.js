import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import SupportingArtistsLabel from "../../pages/events/SupportingArtistsLabel";
import { fontFamilyBold, fontFamilyDemiBold } from "../../../config/theme";
import DateFlag from "./DateFlag";
import user from "../../../stores/user";
import nl2br from "../../../helpers/nl2br";
import { displayAgeLimit } from "../../../helpers/ageLimit";
import optimizedImageUrl from "../../../helpers/optimizedImageUrl";
import TwoColumnLayout from "../../pages/events/TwoColumnLayout";

const styles = theme => {
	return {
		coverImageContainer: {
			width: "100%",
			overflow: "hidden",
			position: "relative"
		},
		coverImage: {
			width: "105%",
			backgroundColor: "linear-gradient(to top, #000000, rgba(0, 0, 0, 0))",
			backgroundRepeat: "no-repeat",
			backgroundSize: "cover",
			backgroundPosition: "center",
			position: "absolute"
		},
		blurryImage: {
			WebkitFilter: "blur(25px)",
			filter: "blur(25px)",
			left: -25,
			right: -25,
			top: -10,
			bottom: -25
		},
		noCoverImage: {
			backgroundImage: "linear-gradient(255deg, #972863, #335a7e)"
		},
		contentContainer: {
			position: "absolute",
			left: 0
		},
		content: {
			display: "flex",
			flexDirection: "column",
			justifyContent: "flex-end",
			paddingBottom: 20
		},
		eventNameText: {
			color: "#FFFFFF",
			fontFamily: fontFamilyBold,
			marginBottom: theme.spacing.unit,
			fontSize: theme.typography.fontSize * 3,
			lineHeight: 0.9,
			paddingRight: 20
		},
		eventNameTextLong: {
			fontSize: theme.typography.fontSize * 1.8,
			lineHeight: 0.9
		},
		topLineInfoText: {
			//marginTop: theme.spacing.unit * 2,
			color: "#FFFFFF",
			textTransform: "uppercase",
			fontFamily: fontFamilyBold,
			fontSize: theme.typography.fontSize * 1.1,
			lineHeight: 1,
			marginBottom: theme.spacing.unit
		},
		withArtistsText: {
			color: "#BFC4D2",
			fontSize: 19,
			lineHeight: "31px",
			paddingRight: 20
		}
	};
};

const EventHeaderImage = props => {
	const {
		classes,
		cover_image_url,
		height,
		name,
		venue = {},
		top_line_info,
		organization = {},
		artists = []
	} = props;

	//Adjust these thresholds as needed
	const charCount = 65;
	const eventNameIsLong = name.length > charCount;

	const headlineArtist = artists.find(artist => artist.importance === 0);
	const headliner = headlineArtist ? headlineArtist.artist.name : null;

	return (
		<div className={classes.coverImageContainer} style={{ height }}>
			<div
				className={classNames({
					[classes.coverImage]: true,
					[classes.blurryImage]: !!cover_image_url,
					[classes.noCoverImage]: !cover_image_url
				})}
				title={headliner}
				style={{
					backgroundImage: cover_image_url
						? `linear-gradient(to top, #000000, rgba(0, 0, 0, 0)),url(${optimizedImageUrl(
							cover_image_url
						  )})`
						: null,
					height: height * 1.1
				}}
			/>

			<TwoColumnLayout
				rootClass={classes.contentContainer}
				col1={(
					<div className={classes.content} style={{ height }}>
						{top_line_info ? (
							<Typography className={classes.topLineInfoText}>
								{nl2br(top_line_info)}
							</Typography>
						) : null}
						{headliner ? (
							<Typography
								variant={"display1"}
								className={classNames({
									[classes.eventNameText]: true,
									[classes.eventNameTextLong]: eventNameIsLong
								})}
							>
								{name}
							</Typography>
						) : (
							<Typography
								variant={"display1"}
								className={classNames({
									[classes.eventNameText]: true,
									[classes.eventNameTextLong]: eventNameIsLong
								})}
							>
								{name}
							</Typography>
						)}

						<Typography variant={"title"} className={classes.withArtistsText}>
							<SupportingArtistsLabel eventName={name} artists={artists}/>
						</Typography>
					</div>
				)}
			/>
		</div>
	);
};

EventHeaderImage.defaultProps = {
	height: 450,
	variant: "simple"
};

EventHeaderImage.propTypes = {
	classes: PropTypes.object.isRequired,
	cover_image_url: PropTypes.string,
	height: PropTypes.number,
	name: PropTypes.string.isRequired,
	top_line_info: PropTypes.string,
	artists: PropTypes.array.isRequired
};

export default withStyles(styles)(EventHeaderImage);
