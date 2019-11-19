import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";

import Settings from "../../../config/settings";
import {
	callToActionBackground,
	fontFamilyDemiBold
} from "../../../config/theme";
import AppButton from "../AppButton";
import servedImage from "../../../helpers/imagePathHelper";
import Results from "../../pages/landing/cards/Results";

//TODO change external links
const rootUrl = "";
const links = [
	//{ label: "About Us", href: `${rootUrl}/about` },
	{ label: "About Us", href: `${rootUrl}/venues-and-promoters.html` },
	{
		label: "Sell Tickets",
		href: `${rootUrl}/venues-and-promoters.html#contact-chat`
	}
	//{ label: "News", href: `${rootUrl}/blog` },
	//{ label: "FAQ", href: `${rootUrl}/faq` }
];

if (Settings().appSupportLink) {
	links.push({
		label: "Support",
		href: Settings().appSupportLink
	});
}

const privacyPolicyLink = `${rootUrl}/privacy.html`;
const termsLink = `${rootUrl}/terms.html`;
const fbLink = Settings().facebookLink;
const instaLink = Settings().instagramLink;

const styles = theme => ({
	root: {
		flex: 1,
		display: "flex",
		justifyContent: "center",
		//marginTop: theme.spacing.unit * 10,
		textAlign: "center",
		backgroundColor: "#FFFFFF"
	},
	content: {
		width: "100%",
		maxWidth: 1400,
		paddingLeft: theme.spacing.unit * 2,
		paddingRight: theme.spacing.unit * 2,
		display: "flex",

		[theme.breakpoints.down("sm")]: {
			flexDirection: "column",
			alignItems: "flex-start"
		},
		justifyContent: "space-between"
	},
	copyrightContainer: {
		justifyContent: "center",
		display: "flex",
		borderTop: "1px solid #E8EAEE;",
		paddingBottom: theme.spacing.unit * 3,
		paddingTop: theme.spacing.unit * 3,
		alignItems: "center"
	},
	copyright: {
		fontSize: theme.typography.fontSize * 0.9,
		color: "#9DA3B4",
		[theme.breakpoints.down("sm")]: {
			width: "100%",
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start"
		}
	},
	copyrightSpan: {
		[theme.breakpoints.down("sm")]: {
			display: "flex",
			width: "100%",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between"
		}
	},
	smLinks: {
		fontSize: theme.typography.fontSize * 0.9,
		textTransform: "uppercase"
	},
	appLinksContainers: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		paddingBottom: theme.spacing.unit * 2
	},
	appLinkSpacer: {
		marginRight: theme.spacing.unit * 2
	},
	linksContainer: {
		display: "flex",
		justifyContent: "center",
		paddingTop: theme.spacing.unit * 2,

		[theme.breakpoints.down("sm")]: {
			paddingBottom: theme.spacing.unit,
			paddingTop: theme.spacing.unit * 3,
			flexDirection: "column",
			alignItems: "flex-start"
		}
	},
	linkContainer: {
		[theme.breakpoints.down("sm")]: {
			marginBottom: theme.spacing.unit * 2
		}
	},
	link: {
		color: "#3C383F",
		fontFamily: fontFamilyDemiBold,
		marginRight: theme.spacing.unit * 2
	},
	containerPadding: {
		paddingTop: theme.spacing.unit * 3,
		paddingBottom: theme.spacing.unit,
		[theme.breakpoints.down("sm")]: {
			paddingTop: theme.spacing.unit * 2,
			paddingBottom: 0
		}
	},
	linkLogoContainer: {
		paddingTop: theme.spacing.unit * 3,
		paddingBottom: theme.spacing.unit,
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		[theme.breakpoints.down("sm")]: {
			paddingTop: theme.spacing.unit * 2,
			paddingBottom: 0
		}
	},
	logo: {
		height: 50,
		width: "auto"
	},
	termsLink: {
		color: "#3C383F",
		marginRight: theme.spacing.unit * 3,
		fontFamily: fontFamilyDemiBold
	},
	bottomBorder: {
		height: 5,
		backgroundImage: callToActionBackground
	},
	smallImage: {
		maxWidth: 22,
		maxHeight: 27
	},
	appBtnCaption: {
		fontSize: theme.typography.fontSize * 1.2,
		lineHeight: "27px",
		fontFamily: fontFamilyDemiBold,
		paddingBottom: theme.spacing.unit
	},
	downloadBtn: {
		maxWidth: 128,
		marginTop: theme.spacing.unit * 2,
		marginRight: theme.spacing.unit,
		maxHeight: 38
	}
});

const LandingFooter = props => {
	const { classes } = props;
	const dateYear = new Date().getFullYear();
	return (
		<div className={classes.root}>
			<Grid container justify="center">
				<div className={classes.content}>
					<div className={classes.linkLogoContainer}>
						<img
							alt={"LandingFooter icon"}
							src={servedImage("/images/logo.png")}
							className={classes.logo}
						/>

						<div className={classes.linksContainer}>
							{links.map(({ label, href }, index) => (
								<Typography className={classes.linkContainer} key={index}>
									<a className={classes.link} href={href} target="_blank">
										{label}
									</a>
								</Typography>
							))}
						</div>
					</div>
					<div className={classes.containerPadding}>
						<Typography className={classes.appBtnCaption}>
							<span>
								<img
									className={classes.smallImage}
									src={servedImage("/images/handemoji.png")}
									alt="rock hand emoji
						"
								/>
							</span>
							&nbsp; Get the Bigneon app now:
						</Typography>
						<div className={classes.appLinksContainers}>
							<a href={Settings().appStoreIos} target="_blank">
								<img
									className={classes.downloadBtn}
									src={servedImage("/images/appstore-apple.png")}
									alt="App Store download button"
								/>
							</a>
							<a href={Settings().appStoreAndroid} target="_blank">
								<img
									className={classes.downloadBtn}
									src={servedImage("/images/appstore-google-play.png")}
									alt="Google Play download button"
								/>
							</a>
						</div>
					</div>
					<Hidden smUp>
						<div className={classes.containerPadding}>
							<Typography className={classes.smLinks}>
								<a
									className={classes.termsLink}
									href={instaLink}
									target="_blank"
								>
									Instagram
								</a>
							</Typography>
							<Typography className={classes.smLinks}>
								<a className={classes.termsLink} href={fbLink} target="_blank">
									Facebook
								</a>
							</Typography>
						</div>
					</Hidden>
				</div>
				<Grid item xs={12} sm={12} md={12} lg={12}>
					<div className={classes.copyrightContainer}>
						<div className={classes.content}>
							<Typography className={classes.copyright}>
								<span className={classes.copyrightSpan}>
									<a
										className={classes.termsLink}
										href={privacyPolicyLink}
										target="_blank"
									>
										Privacy Policy
									</a>
									<a
										className={classes.termsLink}
										href={termsLink}
										target="_blank"
									>
										Terms of Use
									</a>
								</span>
								Copyright {dateYear}. BigNeon, Inc. All Rights Reserved.
							</Typography>
							<Hidden smDown>
								<Typography className={classes.smLinks}>
									<a
										className={classes.termsLink}
										href={instaLink}
										target="_blank"
									>
										Instagram
									</a>
									<a
										className={classes.termsLink}
										href={fbLink}
										target="_blank"
									>
										Facebook
									</a>
								</Typography>
							</Hidden>
						</div>
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

LandingFooter.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LandingFooter);
