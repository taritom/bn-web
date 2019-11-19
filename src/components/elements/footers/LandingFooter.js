import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import Settings from "../../../config/settings";
import {
	callToActionBackground,
	fontFamilyDemiBold,
	fontFamily,
	fontFamilyBold
} from "../../../config/theme";
import servedImage from "../../../helpers/imagePathHelper";

//TODO change external links
const rootUrl = "";
const aboutLink = `${rootUrl}/venues-and-promoters.html`;
const infoLinks = [
	{
		label: "Terms of Use",
		href: `${rootUrl}/terms.html`
	},
	{
		label: "Privacy Policy",
		href: `${rootUrl}/privacy.html`
	}
];
const custLinks = [
	{
		label: "Sell Tickets",
		href: `${rootUrl}/venues-and-promoters.html#contact-chat`
	}
];
const smLinks = [
	{
		href: Settings().facebookLink,
		imgUrl: "facebook-icon.png"
	},
	{
		href: Settings().instagramLink,
		imgUrl: "instagram-icon.png"
	},
	{
		href: Settings().twitterLink,
		imgUrl: "twitter-icon.png"
	}
];

if (Settings().appSupportLink) {
	custLinks.push({
		label: "Support",
		href: Settings().appSupportLink
	});
}

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
		alignItems: "center",
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
		fontSize: 12,
		color: "#9DA3B4",
		opacity: 0.8,
		[theme.breakpoints.down("sm")]: {
			width: "100%",
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start",
			marginTop: theme.spacing.unit * 3
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
		fontFamily: fontFamily,
		fontSize: 18,
		textTransform: "capitalize"
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
	},
	footerContentBlock: {
		marginTop: theme.spacing.unit * 5,
		textAlign: "left",
		[theme.breakpoints.down("sm")]: {
			marginTop: theme.spacing.unit * 2
		}
	},
	footerLinkTitle: {
		fontSize: 20,
		lineHeight: "23px",
		marginBottom: theme.spacing.unit * 5,
		fontFamily: fontFamilyBold,
		[theme.breakpoints.down("sm")]: {
			marginBottom: theme.spacing.unit * 2
		}
	},
	footerLinkContainer: {
		display: "flex",
		flexDirection: "column"
	}
});

const LandingFooter = props => {
	const { classes } = props;
	const dateYear = new Date().getFullYear();
	return (
		<div className={classes.root}>
			<Grid container justify="center">
				<div className={classes.content}>
					<Grid item xs={6} sm={6} md={2} lg={2}>
						<div className={classes.footerContentBlock}>
							<Typography className={classes.footerLinkTitle}>
								About Big Neon
							</Typography>
							<div className={classes.footerLinkContainer}>
								<a className={classes.link} href={aboutLink}>
									About Us
								</a>
							</div>
						</div>
					</Grid>
					<Grid item xs={6} sm={6} md={2} lg={2}>
						<div className={classes.footerContentBlock}>
							<Typography className={classes.footerLinkTitle}>
								Customers
							</Typography>
							<div className={classes.footerLinkContainer}>
								{custLinks.map(({ label, href }, index) => (
									<a
										key={index}
										className={classes.link}
										href={href}
										target="_blank"
									>
										{label}
									</a>
								))}
							</div>
						</div>
					</Grid>
					<Grid item xs={6} sm={6} md={2} lg={2}>
						<div className={classes.footerContentBlock}>
							<Typography className={classes.footerLinkTitle}>
								Further Info
							</Typography>
							<div className={classes.footerLinkContainer}>
								{infoLinks.map(({ label, href }, index) => (
									<a
										key={index}
										className={classes.link}
										href={href}
										target="_blank"
									>
										{label}
									</a>
								))}
							</div>
						</div>
					</Grid>
					<Grid item xs={6} sm={6} md={2} lg={2}>
						<div className={classes.footerContentBlock}>
							<Typography className={classes.footerLinkTitle}>
								Follow Us
							</Typography>
							<div className={classes.footerSMLinkContainer}>
								{smLinks.map(({ imgUrl, href }, index) => (
									<a key={index} href={href} target="_blank">
										<img
											className={classes.smIcon}
											src={servedImage(`/icons/${imgUrl}`)}
											alt="Social Media Icon Button"
										/>
									</a>
								))}
							</div>
						</div>
					</Grid>
					<Grid item xs={12} sm={12} md={4} lg={4}>
						<div className={classes.footerContentBlock}>
							<Typography className={classes.footerLinkTitle}>title</Typography>
							<div className={classes.footerLinkContainer}>link</div>
						</div>
					</Grid>
				</div>
				<Grid item xs={12} sm={12} md={12} lg={12}>
					<div className={classes.copyrightContainer}>
						<div className={classes.content}>
							<img
								alt={"LandingFooter icon"}
								src={servedImage("/images/logo.png")}
								className={classes.logo}
							/>
							<Typography className={classes.copyright}>
								Copyright {dateYear}. BigNeon, Inc. All Rights Reserved.
							</Typography>
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
