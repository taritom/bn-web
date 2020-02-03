import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { fontFamilyDemiBold, secondaryHex } from "../../config/theme";
import servedImage from "../../helpers/imagePathHelper";

const styles = theme => {
	return {
		root: {
			[theme.breakpoints.down("xs")]: {
				alignItems: "center",
				justifyContent: "flex-start"
			}
		},
		mainContent: {
			display: "flex",
			marginBottom: theme.spacing.unit * 2,
			alignItems: "center",
			height: 45,
			[theme.breakpoints.down("xs")]: {
				height: 30
			}
		},
		heading: {
			color: theme.typography.headline.color,
			textTransform: "capitalize",
			fontFamily: fontFamilyDemiBold,
			fontSize: theme.typography.fontSize * 2.5,
			[theme.breakpoints.down("md")]: {
				fontSize: theme.typography.fontSize * 2.2
			},
			[theme.breakpoints.down("xs")]: {
				fontSize: theme.typography.fontSize * 1.6
			}
		},
		longHeading: {
			alignContent: "center",
			lineHeight: "75%",
			fontSize: theme.typography.fontSize * 1.57,
			[theme.breakpoints.down("xs")]: {
				fontSize: theme.typography.fontSize * 1
			}
		},
		subheading: {
			color: secondaryHex,
			textTransform: "uppercase",
			lineHeight: 0.5,
			fontSize: theme.typography.fontSize * 1.2
		},
		icon: {
			width: "auto",
			height: "100%",
			marginRight: theme.spacing.unit * 1.8
		}
	};
};

const PageHeading = props => {
	const { classes, iconUrl, children, subheading, style = {} } = props;

	//Calculate the total characters for the heading and adjust style for lengthy ones
	let totalChars = 0;
	if (typeof children === "string") {
		totalChars = children.length;
	} else if (Array.isArray(children)) {
		children.forEach(child => {
			if (typeof child === "string") {
				totalChars = totalChars + child.length;
			}
		});
	}

	const headingIsLong = totalChars > 30; //Adjust this if needed

	return (
		<div style={style} className={classes.root}>
			<div className={classes.mainContent}>
				{iconUrl ? (
					<img
						alt={children}
						src={servedImage(iconUrl)}
						className={classes.icon}
					/>
				) : null}
				<Typography
					className={classnames({
						[classes.heading]: true,
						[classes.longHeading]: headingIsLong
					})}
				>
					{children}
				</Typography>
			</div>

			{subheading ? (
				<Typography className={classes.subheading}>{subheading}</Typography>
			) : null}
		</div>
	);
};

PageHeading.propTypes = {
	classes: PropTypes.object.isRequired,
	iconUrl: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
	subheading: PropTypes.string,
	style: PropTypes.object
};

export default withStyles(styles)(PageHeading);
