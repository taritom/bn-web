import React, {Component} from "react";
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
			width: 80,
			height: 80
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
	divider: {
		marginTop: 30,
		marginBottom: 30
	},
	nameHeading: {
		[theme.breakpoints.down("sm")]: {
			fontSize: 15,
			marginBottom: 5,
			marginTop: 5
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

		let imageSrc = thumb_image_url || image_url;
		imageSrc = optimizedImageUrl(imageSrc);

		const artistSocial = (
			<div>
				{facebook_username ? (
					<SocialIconLink
						style={{ marginLeft: 6 }}
						icon={"facebook"}
						userName={facebook_username}
						size={30}
						color={"neon"}
					/>
				) : null}

				{instagram_username ? (
					<SocialIconLink
						style={{ marginLeft: 6 }}
						icon={"instagram"}
						userName={instagram_username}
						size={30}
						color={"neon"}
					/>
				) : null}
				{snapchat_username ? (
					<SocialIconLink
						style={{ marginLeft: 6 }}
						icon={"snapchat"}
						userName={snapchat_username}
						size={30}
						color={"neon"}
					/>
				) : null}

				{soundcloud_username ? (
					<SocialIconLink
						style={{ marginLeft: 6 }}
						icon={"soundcloud"}
						userName={soundcloud_username}
						size={30}
						color={"neon"}
					/>
				) : null}

				{bandcamp_username ? (
					<SocialIconLink
						style={{ marginLeft: 6 }}
						icon={"bandcamp"}
						userName={bandcamp_username}
						size={30}
						color={"neon"}
					/>
				) : null}

				{website_url ? (
					<SocialIconLink
						style={{ marginLeft: 6 }}
						icon={"website"}
						href={website_url}
						size={30}
						color={"neon"}
					/>
				) : null}

				{spotify_id ? (
					<SocialIconLink
						style={{ marginLeft: 6 }}
						icon={"spotify"}
						userName={spotify_id}
						size={30}
						color={"neon"}
					/>
				) : null}
			</div>
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
						<Grid container>
							<Grid item xs={12} sm={4} m={12} l={4}>
								<h3 className={classes.nameHeading}>{name}</h3>
							</Grid>
							<Hidden smDown>
								<Grid item xs={12} sm={8} m={12} l={8}>
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
				<Divider className={classes.divider}/>
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
