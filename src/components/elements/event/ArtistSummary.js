import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import SupportingArtistsLabel from "../../pages/events/SupportingArtistsLabel";
import {
	fontFamilyBold,
	fontFamilyDemiBold,
	secondaryHex
} from "../../../config/theme";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import optimizedImageUrl from "../../../helpers/optimizedImageUrl";
import ReadMoreAdditionalInfo from "./ReadMoreAdditionalInfo";
import SocialIconLink from "../social/SocialIconLink";

const styles = theme => ({
	root: {},
	media: {
		width: 119,
		height: 119,
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
		backgroundPosition: "center",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",

		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		borderRadius: 10,
		[theme.breakpoints.down("md")]: {
			width: 70,
			height: 70
		},
		[theme.breakpoints.only("lg")]: {
			width: 100,
			height: 100
		}
	},
	mediaTopRow: {},
	mediaBottomRow: {
		display: "flex",
		justifyContent: "space-between"
	},
	socialLinks: {
		paddingRight: theme.spacing.unit * 4,

		[theme.breakpoints.down("xl")]: {
			paddingRight: theme.spacing.unit * 2
		},
		[theme.breakpoints.down("lg")]: {
			paddingRight: theme.spacing.unit / 2
		}
	},
	name: {
		color: "#FFFFFF",
		fontFamily: fontFamilyDemiBold,
		fontSize: theme.typography.fontSize * 1.5
	},
	content: {
		padding: theme.spacing.unit * 2,
		[theme.breakpoints.down("lg")]: {
			padding: theme.spacing.unit
		}
	},
	bio: {
		lineHeight: 1.5,
		color: "#656d78",
		fontSize: theme.typography.fontSize
	},
	nameHeading: {
		marginBottom: 5,
		marginTop: 5,
		[theme.breakpoints.down("sm")]: {
			fontSize: 15
		}
	},
	headline: {
		color: "#B1B5C3",
		marginTop: 0,
		marginBottom: 0,
		[theme.breakpoints.down("lg")]: {
			fontSize: 12
		}
	},
	socialGrid: {
		[theme.breakpoints.up("md")]: {
			justifyContent: "flex-end"
		}
	}
});

class ArtistSummary extends Component {
	render() {
		const {
			classes,
			headliner,
			name,
			bio,
			thumb_image_url,
			bandcamp_username,
			facebook_username,
			image_url,
			instagram_username,
			snapchat_username,
			soundcloud_username,
			spotify_id,
			website_url,
			youtube_video_urls,
			theme
		} = this.props;

		let imageSrc = thumb_image_url || image_url || "/images/artist-placeholder.png";
		imageSrc = optimizedImageUrl(imageSrc);

		const artistSocial = (
			<Grid container
				  direction="row"
				  alignItems="center"
				  spacing={8}
				  className={classes.socialGrid}
			>
				{facebook_username ? (
					<Grid item xs={2} md={3} lg={2}>
						<SocialIconLink
							style={{ marginLeft: 6 }}
							icon={"facebook"}
							userName={facebook_username}
							size={40}
							color={"neon"}
						/>
					</Grid>
				) : null}

				{instagram_username ? (
					<Grid item xs={2} md={3} lg={2}>
						<SocialIconLink
							style={{ marginLeft: 6 }}
							icon={"instagram"}
							userName={instagram_username}
							size={40}
							color={"neon"}
						/>
					</Grid>
				) : null}
				{snapchat_username ? (
					<Grid item xs={2} md={3} lg={2}>
						<SocialIconLink
							style={{ marginLeft: 6 }}
							icon={"snapchat"}
							userName={snapchat_username}
							size={40}
							color={"neon"}
						/>
					</Grid>
				) : null}

				{soundcloud_username ? (
					<Grid item xs={2} md={3} lg={2}>
						<SocialIconLink
							style={{ marginLeft: 6 }}
							icon={"soundcloud"}
							userName={soundcloud_username}
							size={40}
							color={"neon"}
						/>
					</Grid>
				) : null}

				{bandcamp_username ? (
					<Grid item xs={2} md={3} lg={2}>
						<SocialIconLink
							style={{ marginLeft: 6 }}
							icon={"bandcamp"}
							userName={bandcamp_username}
							size={40}
							color={"neon"}
						/>
					</Grid>
				) : null}

				{website_url ? (
					<Grid item xs={2} md={3} lg={2}>
						<SocialIconLink
							style={{ marginLeft: 6 }}
							icon={"website"}
							href={website_url}
							size={40}
							color={"neon"}
						/>
					</Grid>
				) : null}

				{spotify_id ? (
					<Grid item xs={2} md={3} lg={2}>
						<SocialIconLink
							style={{ marginLeft: 6 }}
							icon={"spotify"}
							userName={spotify_id}
							size={40}
							color={"neon"}
						/>
					</Grid>
				) : null}
			</Grid>
		);

		return (
			<div>
				<Grid container spacing={24}>
					<Grid item xs={3}>
						<div
							className={classes.media}
							style={{
								backgroundImage: `url(${imageSrc})`
							}}
						>
						</div>
					</Grid>
					<Grid item xs={9}>
						<Grid container
							  alignItems="center"
						>
							<Grid item xs={12} sm={3} m={12} lg={3}>
								{ headliner ? <h6 className={classes.headline}>HEADLINER</h6> : "" }
								<h3 className={classes.nameHeading}>{name}</h3>
							</Grid>
							<Hidden smDown>
								<Grid item xs={12} sm={9} m={12} lg={9}>
									{artistSocial}
								</Grid>
							</Hidden>
						</Grid>
						<ReadMoreAdditionalInfo>
							{bio}
						</ReadMoreAdditionalInfo>
						<Hidden mdUp>
							{artistSocial}
						</Hidden>
					</Grid>
				</Grid>
			</div>
		);
	}
}

ArtistSummary.propTypes = {
	classes: PropTypes.object.isRequired,
	headliner: PropTypes.bool,
	name: PropTypes.string.isRequired
};

export default withStyles(styles)(ArtistSummary);
