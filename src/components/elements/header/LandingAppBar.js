import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import classnames from "classnames";

import {
	fontFamilyDemiBold,
	secondaryHex,
	toolBarHeight
} from "../../../config/theme";
import AppBarLogo from "./AppBarLogo";
import Button from "../Button";
import { Slide, Typography } from "@material-ui/core";
import Settings from "../../../config/settings";
import user from "../../../stores/user";
import layout from "../../../stores/layout";
import Hidden from "@material-ui/core/Hidden";
import SearchToolBarInput from "./SearchToolBarInput";
import BoxOfficeLink from "./BoxOfficeLink";
import CurrentOrganizationMenu from "./CurrentOrganizationMenu";
import CartHeaderLink from "../../common/cart/CartHeaderLink";
import RightUserMenu from "./RightUserMenu";
import servedImage from "../../../helpers/imagePathHelper";

const eventImageHeight = 45;

const styles = theme => {
	return {
		toolBar: {
			display: "flex",
			justifyContent: "center",
			paddingRight: theme.spacing.unit * 2,

			paddingLeft: theme.spacing.unit * 2,
			...toolBarHeight
		},
		barContent: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",

			width: "100%",
			maxWidth: 1400
		},
		rightMenuOptions: {
			alignItems: "center",
			display: "flex"
		},
		eventDetailsContainer: {
			display: "flex",
			flex: 1,
			alignItems: "center",
			paddingRight: theme.spacing.unit * 4,
			paddingLeft: theme.spacing.unit * 4
			//
			// borderStyle: "solid",
			// borderColor: "blue",
			// borderWidth: 0.5
		},
		searchContainer: {
			border: "1.2px solid #9DA3B433",
			borderRadius: "10px",
			width: 410,
			height: 43,
			display: "flex",
			backgroundColor: "#fff",
			padding: theme.spacing.unit * 2,
			justifyContent: "flex-start",
			alignItems: "center",
			// marginTop: 25,
			[theme.breakpoints.up("sm")]: {
				justifyContent: "flex-center"
			}
		},
		mobileHeaderImage: {
			height: eventImageHeight,
			width: eventImageHeight * Settings().promoImageAspectRatio,
			backgroundImage: "linear-gradient(255deg, #e53d96, #5491cc)",
			backgroundRepeat: "no-repeat",
			backgroundSize: "cover",
			backgroundPosition: "center",
			borderRadius: 4
		},
		textContainer: {
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			paddingLeft: theme.spacing.unit * 2
		},
		eventTitle: {
			fontFamily: fontFamilyDemiBold
		},
		subHeading: {
			fontSize: theme.typography.fontSize * 0.8,
			color: "#9DA3B4",
			lineHeight: 1
		},
		authButtonText: {
			fontFamily: fontFamilyDemiBold
		},
		signUpText: {
			color: secondaryHex
		}
	};
};

const showOnScrollHeight = 450;

class LandingAppBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false,
			displayTime: ""
		};

		this.onWindowScroll = this.onWindowScroll.bind(this);
	}

	componentDidMount() {
		window.addEventListener("scroll", this.onWindowScroll);
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.onWindowScroll);
	}

	onWindowScroll() {
		if (window.pageYOffset > showOnScrollHeight && !this.state.show) {
			this.setState({ show: true });
		} else if (window.pageYOffset < showOnScrollHeight && this.state.show) {
			this.setState({ show: false });
		}
	}

	onAuth(type) {
		user.showAuthRequiredDialog(() => {}, type);
	}

	render() {
		const { classes, isAuthenticated, history } = this.props;

		const { show, displayTime } = this.state;

		return (
			<AppBar>
				<Toolbar className={classes.toolBar}>
					<div className={classes.barContent}>
						<Link to={"/"} onClick={this.forceUpdate}>
							<AppBarLogo/>
						</Link>

						<Hidden smDown>
							<Slide direction="down" in={show}>
								<div className={classes.searchContainer}>
									<SearchToolBarInput history={history}/>
								</div>
							</Slide>
						</Hidden>

						<span className={classes.rightMenuOptions}>
							<Hidden smDown>
								<BoxOfficeLink/>
								<CurrentOrganizationMenu/>
								<CartHeaderLink/>
							</Hidden>
							<RightUserMenu history={history}/>
						</span>
					</div>
				</Toolbar>
			</AppBar>
		);
	}
}

LandingAppBar.propTypes = {
	isAuthenticated: PropTypes.oneOf([true, false, null])
};

export default withStyles(styles)(LandingAppBar);
