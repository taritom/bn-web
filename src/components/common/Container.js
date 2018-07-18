import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import MenuIcon from "@material-ui/icons/Menu";

import MenuContent from "./MenuContent";
import RightHeaderMenu from "./RightHeaderMenu";

const drawerWidth = 240;

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "100%",
		zIndex: 1,
		overflow: "hidden",
		position: "relative",
		display: "flex",
		width: "100%"
	},
	appBar: {
		position: "absolute",
		marginLeft: drawerWidth,
		[theme.breakpoints.up("md")]: {
			width: `calc(100% - ${drawerWidth}px)`
		}
	},
	headerImage: {
		width: 200
	},
	navIconHide: {
		[theme.breakpoints.up("md")]: {
			display: "none"
		}
	},
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: drawerWidth,
		[theme.breakpoints.up("md")]: {
			position: "relative"
		}
	},
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing.unit * 3
	}
});

class Container extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobileOpen: false
		};
	}

	handleDrawerToggle() {
		this.setState(state => ({ mobileOpen: !state.mobileOpen }));
	}

	renderContent(toolBarSpace = true) {
		const { classes, children } = this.props;

		return (
			<main className={classes.content}>
				{toolBarSpace ? <div className={classes.toolbar} /> : null}
				{children}
			</main>
		);
	}

	render() {
		const { classes } = this.props;

		//TODO this will come from an observable
		const isAuthenticated = true;

		//If they're not logged in don't render menus yet
		if (!isAuthenticated) {
			return this.renderContent(false);
		}

		const drawer = (
			<div>
				{/* <div className={classes.toolbar} /> */}
				<MenuContent toggleDrawer={this.handleDrawerToggle.bind(this)} />
			</div>
		);

		return (
			<div className={classes.root}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={this.handleDrawerToggle.bind(this)}
							className={classes.navIconHide}
						>
							<MenuIcon color="action" />
						</IconButton>
						<div style={{ flex: 1 }}>
							<Hidden mdUp implementation="css">
								<img
									alt="Header logo"
									className={classes.headerImage}
									src="/images/bn-logo-text.png"
								/>
							</Hidden>
						</div>

						<RightHeaderMenu />
					</Toolbar>
				</AppBar>
				<Hidden mdUp>
					<Drawer
						variant="temporary"
						anchor={"left"}
						open={this.state.mobileOpen}
						onClose={this.handleDrawerToggle.bind(this)}
						classes={{
							paper: classes.drawerPaper
						}}
						ModalProps={{
							keepMounted: true // Better open performance on mobile.
						}}
					>
						{drawer}
					</Drawer>
				</Hidden>
				<Hidden smDown implementation="css">
					<Drawer
						variant="permanent"
						open
						classes={{
							paper: classes.drawerPaper
						}}
					>
						{drawer}
					</Drawer>
				</Hidden>
				{this.renderContent()}
			</div>
		);
	}
}

Container.propTypes = {
	classes: PropTypes.object.isRequired,
	children: PropTypes.element.isRequired
};

export default withStyles(styles)(Container);
