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

const styles = theme => ({
	ticketContainer: {
		marginBottom: 40
	},
	qrContainer: {
		padding: 10
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
				{tickets.map((ticket, index) => {
					const ticketType = "General access";

					return (
						<div key={index} className={classes.ticketContainer}>
							<EventCardContainer
								name={`1 x ${ticketType} - ${eventName}`}
								imageUrl={eventImageUrl}
								address={eventAddress}
								displayDate={eventDisplayTime}
								imageStyle={{ height: 200 }}
							>
								<div className={classes.qrContainer}>
									<QRCode
										style={{ width: "100%", height: "auto" }}
										size={300}
										value={"TODO"}
									/>
								</div>
							</EventCardContainer>
						</div>
					);
				})}
			</TransferContainer>
		);
	}
}

export default withStyles(styles)(Tickets);
