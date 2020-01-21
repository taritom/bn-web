import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Collapse } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import PropTypes from "prop-types";

import Card from "../../../../../elements/Card";
import {
	fontFamilyDemiBold,
	secondaryHex
} from "../../../../../../config/theme";
import servedImage from "../../../../../../helpers/imagePathHelper.js";
import Divider from "../../../../../common/Divider";

const styles = theme => {
	return {
		root: {
			padding: 20,

			[theme.breakpoints.up("md")]: {
				padding: 40
			}
		},
		footer: {
			paddingLeft: 20,
			paddingRight: 20,
			paddingBottom: 16,
			paddingTop: 16,

			[theme.breakpoints.up("md")]: {
				paddingLeft: 40,
				paddingRight: 40
			}
		},
		topRow: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",

			[theme.breakpoints.down("sm")]: {
				cursor: "pointer"
			}
		},
		titleText: {
			fontFamily: fontFamilyDemiBold,
			fontSize: 19
		},
		iconContainer: {
			width: 44
		},
		icon: {
			height: 24,
			width: "auto"
		},
		dropDownIcon: {
			height: 6.5,
			width: "auto",
			display: "none",
			[theme.breakpoints.down("sm")]: {
				display: "block"
			}
		},
		desktopContainer: {
			display: "flex"
		}
	};
};

class CollapseCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			expanded: true
		};

		this.toggle = this.toggleExpand.bind(this);
	}

	toggleExpand() {
		this.setState(({ expanded }) => {
			return { expanded: !expanded };
		});
	}

	render() {
		const { classes, title, iconPath, children, footerContent } = this.props;
		const { expanded } = this.state;

		return (
			<Card>
				<div className={classes.root}>
					<Hidden smDown>
						<div className={classes.desktopContainer}>
							<div className={classes.iconContainer}>
								{iconPath ? (
									<img className={classes.icon} src={servedImage(iconPath)}/>
								) : null}
							</div>
							<div style={{ flex: 1 }}>{children}</div>
							<div className={classes.iconContainer}/>
						</div>
					</Hidden>
					<Hidden mdUp>
						<div className={classes.topRow} onClick={this.toggle}>
							<Typography className={classes.titleText}>{title}</Typography>
							<img
								src={`/icons/${expanded ? "up" : "down"}-active.svg`}
								className={classes.dropDownIcon}
							/>
						</div>
						<Collapse in={expanded}>{children}</Collapse>
					</Hidden>
				</div>
				{footerContent ? (
					<React.Fragment>
						<Divider/>
						<div className={classes.footer}>{footerContent}</div>
					</React.Fragment>
				) : null}
			</Card>
		);
	}
}

CollapseCard.propTypes = {
	classes: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	children: PropTypes.any.isRequired,
	iconPath: PropTypes.string,
	footerContent: PropTypes.any
};

export default withStyles(styles)(CollapseCard);
