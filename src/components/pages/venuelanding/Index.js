import React, { Component } from "react";
import { withStyles, Typography, Grid, Hidden } from "@material-ui/core";
import { observer } from "mobx-react";
import LandingAppBar from "../../elements/header/LandingAppBar";
import user from "../../../stores/user";
import VenueLandingHero from "./Hero";
import eventResults from "../../../stores/eventResults";
import Loader from "../../elements/loaders/Loader";
import AltResults from "../../elements/event/AltResults";
import notifications from "../../../stores/notifications";
import getUrlParam from "../../../helpers/getUrlParam";

const styles = theme => ({
	root: {}
});

@observer
class VenueLanding extends Component {
	constructor(props) {
		super(props);
		this.state = {
			venueFromUrl: getUrlParam("venuename")
		};
	}

	componentWillMount() {
		eventResults.changeFilter("name", "MSG");
		// eventResults.changeFilter("state", venueFromUrl);
		eventResults.refreshResults(
			() => {},
			message => {
				notifications.show({
					message,
					variant: "error"
				});
			}
		);
	}

	render() {
		const { history, classes } = this.props;
		return (
			<div className={classes.root}>
				<Hidden smDown>
					<LandingAppBar
						isAuthenticated={user.isAuthenticated}
						history={history}
					/>
				</Hidden>

				<VenueLandingHero history={history}/>

				<Grid
					container
					justify="center"
					style={{ maxWidth: 1600, margin: "0 auto" }}
				>
					<Grid item xs={11} sm={11} lg={10}>
						{eventResults.isLoading ? (
							<Loader>Finding events...</Loader>
						) : (
							<AltResults/>
						)}
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles)(VenueLanding);
