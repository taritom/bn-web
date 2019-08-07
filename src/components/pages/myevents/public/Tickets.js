import React, { Component } from "react";
import { Typography, withStyles, CardMedia, Grid } from "@material-ui/core";
import QRCode from "qrcode.react";

import notifications from "../../../../stores/notifications";
import Bigneon from "../../../../helpers/bigneon";
import Loader from "../../../elements/loaders/Loader";
import TransferContainer from "../transfers/TransferContainer";
import Card from "../../../elements/Card";
import EventCardContainer from "../transfers/EventCardContainer";
import moment from "moment-timezone";
import getUrlParam from "../../../../helpers/getUrlParam";
import { primaryHex } from "../../../../config/theme";

const styles = theme => ({
	card: {
		padding: 20
	}
});

class Tickets extends Component {
	constructor(props) {
		super(props);

		this.state = {
			tickets: null
		};
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({
				tickets: [{ id: "test" }, { id: "test2" }, { id: "test3" }]
			});
		}, 1000);

		const eventId = getUrlParam("event_id");
		if (eventId) {
			this.loadEventDetails(eventId);
		}
	}

	loadEventDetails(id) {
		Bigneon()
			.events.read({ id })
			.then(response => {
				const { name, promo_image_url, venue, event_start } = response.data;

				this.setState({
					eventName: name,
					eventImageUrl: promo_image_url,
					eventAddress: `${venue.name}, ${venue.address}, ${venue.city}`,
					eventDisplayTime: moment
						.utc(event.event_start)
						.tz(venue.timezone)
						.format("ddd, MMM Do YYYY")
				});
			})
			.catch(error => {
				this.setState({ isCancelling: false });
				console.error(error);
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Failed to load event."
				});
			});
	}

	render() {
		const {
			tickets,
			eventName,
			eventImageUrl,
			eventAddress,
			eventDisplayTime
		} = this.state;
		const { classes } = this.props;

		if (!tickets) {
			return <Loader>Loading tickets...</Loader>;
		}

		return (
			<TransferContainer>
				<EventCardContainer
					title={"Show these tickets to the door person."}
					name={eventName}
					imageUrl={eventImageUrl}
					address={eventAddress}
					displayDate={eventDisplayTime}
				>
					<QRCode size={"100%"} fgColor={primaryHex} value={"TODO"}/>
				</EventCardContainer>
				{/*<Grid container spacing={24} justify={"center"}>*/}
				{/*	<Grid item xs={12} sm={10} md={8} lg={6}>*/}
				{/*		<Card className={classes.card}>*/}
				{/*			<div>External tickets</div>*/}
				{/*		</Card>*/}
				{/*	</Grid>*/}
				{/*</Grid>*/}
			</TransferContainer>
		);
	}
}

export default withStyles(styles)(Tickets);
