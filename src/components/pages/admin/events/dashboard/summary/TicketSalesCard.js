import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Hidden, Collapse } from "@material-ui/core";
import PropTypes from "prop-types";

import CollapseCard from "./CollapseCard";
import {
	fontFamilyDemiBold,
	secondaryHex
} from "../../../../../../config/theme";
import TicketSalesChart from "./charts/TicketSalesChart";
import ticketCountReport from "../../../../../../stores/reports/ticketCountReport";
import EventTicketCountTable from "../../../reports/counts/EventTicketCountTable";
import moment from "moment";
import Loader from "../../../../../elements/loaders/Loader";

const styles = theme => {
	return {
		root: {},
		titleText: {
			fontFamily: fontFamilyDemiBold,
			fontSize: 19,
			marginBottom: 20
		},
		showHideLink: {
			fontSize: 14,
			color: secondaryHex,
			fontFamily: fontFamilyDemiBold,
			textAlign: "center",
			cursor: "pointer"
		},
		tableContainer: {
			paddingBottom: 20,
			paddingTop: 20
		},
		dropDownIcon: {
			height: "auto",
			width: 9,
			marginLeft: 8,
			marginBottom: 1
		}
	};
};

class TicketSalesCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ticketCounts: null,
			showTicketCounts: false
		};
	}

	refreshData() {
		const { organization_id, id } = this.props;
		const queryParams = { organization_id, event_id: id };

		ticketCountReport.fetchCountAndSalesData(queryParams, false, () => {
			const ticketCounts = ticketCountReport.dataByPrice[id];

			this.setState({ ticketCounts });
		});
	}

	render() {
		const {
			classes,
			token,
			on_sale,
			event_end,
			venue,
			cubeApiUrl,
			name,
			organization_id,
			id,
			publish_date,
			...rest
		} = this.props;

		const title = "Ticket Sales";

		const { ticketCounts, showTicketCounts } = this.state;
		if (!ticketCounts) {
			this.refreshData();
		}

		const footerContent = (
			<React.Fragment>
				<Typography
					className={classes.showHideLink}
					onClick={() => this.setState({ showTicketCounts: !showTicketCounts })}
				>
					{showTicketCounts ? "Hide" : "Show"} Ticket Type Breakdown
					<img
						src={`/icons/${showTicketCounts ? "up" : "down"}-active.svg`}
						className={classes.dropDownIcon}
					/>
				</Typography>
				<Collapse in={showTicketCounts}>
					{ticketCounts ? (
						<div className={classes.tableContainer}>
							<EventTicketCountTable
								ticketCounts={ticketCounts}
								hideDetails={true}
							/>
						</div>
					) : (
						<Loader>Loading Ticket Type Breakdown</Loader>
					)}
				</Collapse>
			</React.Fragment>
		);

		return (
			<CollapseCard
				title={title}
				className={classes.root}
				iconPath={"/icons/graph.png"}
				footerContent={footerContent}
			>
				<div className={classes.root}>
					<Hidden smDown>
						<Typography className={classes.titleText}>{title}</Typography>
					</Hidden>

					<TicketSalesChart
						cubeApiUrl={cubeApiUrl}
						token={token}
						timezone={venue.timezone}
						startDate={publish_date}
						endDate={event_end}
					/>
				</div>
			</CollapseCard>
		);
	}
}

TicketSalesCard.propTypes = {
	classes: PropTypes.object.isRequired,
	token: PropTypes.string.isRequired,
	on_sale: PropTypes.string.isRequired,
	event_end: PropTypes.string.isRequired,
	venue: PropTypes.object.isRequired,
	cubeApiUrl: PropTypes.string.isRequired
};

export default withStyles(styles)(TicketSalesCard);
