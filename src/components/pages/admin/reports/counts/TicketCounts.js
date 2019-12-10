import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";

import notifications from "../../../../../stores/notifications";
import Divider from "../../../../common/Divider";
import Button from "../../../../elements/Button";
import downloadCSV from "../../../../../helpers/downloadCSV";
import EventTicketCountTable from "./EventTicketCountTable";
import {
	fontFamilyDemiBold,
	primaryHex,
	secondaryHex
} from "../../../../../config/theme";
import ticketCountReport from "../../../../../stores/reports/ticketCountReport";
import { observer } from "mobx-react";
import Loader from "../../../../elements/loaders/Loader";
import TicketCountEmailDialog from "./TicketCountEmailDialog";

const styles = theme => ({
	root: {},
	pageTitle: {
		fontSize: 30,
		fontFamily: fontFamilyDemiBold
	},
	header: {
		display: "flex",
		flexDirection: "row",
		minHeight: 45,
		alignItems: "center",
		[theme.breakpoints.down("sm")]: {
			justifyContent: "flex-center",
			flexDirection: "column",
			alignItems: "flex-start"
		}
	},
	btnHolder: {
		display: "flex",
		flexDirection: "row",
		[theme.breakpoints.down("sm")]: {
			justifyContent: "flex-center",
			flexDirection: "column",
			alignItems: "flex-start"
		}
	},
	multiEventContainer: {
		marginBottom: theme.spacing.unit * 8
	},
	multiEventHeader: {
		display: "flex",
		justifyContent: "space-between"
	},
	multiEventTitle: {
		fontSize: theme.typography.fontSize * 1.4,
		fontFamily: fontFamilyDemiBold
	},
	eventNumber: {
		color: secondaryHex
	},
	subheading: {
		fontFamily: fontFamilyDemiBold,
		fontSize: 20,
		marginBottom: theme.spacing.unit
	},
	capTitleSmall: {
		textTransform: "uppercase",
		fontFamily: fontFamilyDemiBold,
		fontSize: 12,
		color: secondaryHex
	}
});

@observer
class TicketCounts extends Component {
	constructor(props) {
		super(props);

		this.state = {
			openReportEventId: null
		};
		this.onOpenEmailDialog = this.onOpenEmailDialog.bind(this);
	}

	componentDidMount() {
		this.refreshData();
	}

	onOpenEmailDialog(eventID) {
		this.setState({ openReportEventId: eventID });
	}

	componentWillUnmount() {
		ticketCountReport.setCountAndSalesData(); //Clears current results in memory
	}

	exportCSV(eventId) {
		const eventData = ticketCountReport.dataByPrice[eventId];
		if (!eventData) {
			return notifications.show({
				message: "No data to export."
			});
		}
		downloadCSV(ticketCountReport.csv(eventData), "ticket-counts-report");
	}

	refreshData() {
		//TODO date filter
		//start_utc
		//end_utc

		const { eventId, organizationId, onLoad } = this.props;

		let queryParams = { organization_id: organizationId };

		if (eventId) {
			queryParams = { ...queryParams, event_id: eventId };
		}
		ticketCountReport.fetchCountAndSalesData(queryParams, false, onLoad);
	}

	renderList() {
		const { eventId, classes } = this.props;
		const eventDataResults = ticketCountReport.dataByPrice;

		if (eventDataResults === null || ticketCountReport.isLoading) {
			return <Loader/>;
		}

		const reportEventIds = Object.keys(eventDataResults);

		if (reportEventIds.length === 0) {
			return <Typography>No events found.</Typography>;
		}

		//If we're showing a report for a specific event, only display the one result
		if (eventId) {
			const ticketCounts = eventDataResults[eventId];
			return (
				<div>
					<EventTicketCountTable
						hideDetails={true}
						ticketCounts={ticketCounts}
					/>
				</div>
			);
		}

		return (
			<div>
				{Object.keys(eventDataResults).map((reportEventId, index) => {
					const ticketCounts = eventDataResults[reportEventId];
					const eventName = ticketCounts.eventName;
					return (
						<div key={reportEventId} className={classes.multiEventContainer}>
							<div className={classes.multiEventHeader}>
								<div>
									<Typography className={classes.multiEventTitle}>
										<span className={classes.eventNumber}>{index + 1}.</span>{" "}
										{eventName}
									</Typography>
								</div>
								<div>
									<Button
										iconUrl="/icons/csv-active.svg"
										variant="text"
										onClick={() => this.exportCSV(reportEventId)}
									>
										Export CSV
									</Button>
									<Button
										href={`/exports/reports/?type=ticket_counts&event_id=${reportEventId}`}
										target={"_blank"}
										iconUrl="/icons/pdf-active.svg"
										variant="text"
									>
										Export PDF
									</Button>
									{/*<Button*/}
									{/*	onClick={() => this.onOpenEmailDialog(reportEventId)}*/}
									{/*	variant="plainWhite"*/}
									{/*>*/}
									{/*	Autocount Email*/}
									{/*</Button>*/}
								</div>
							</div>

							<Typography className={classes.subheading}>Inventory</Typography>

							<EventTicketCountTable ticketCounts={ticketCounts}/>

							<Divider style={{ marginTop: 20, marginBottom: 20 }}/>
						</div>
					);
				})}
			</div>
		);
	}

	render() {
		const { eventId, classes, printVersion, eventName } = this.props;
		const { openReportEventId } = this.state;

		if (printVersion) {
			return this.renderList();
		}

		return (
			<div className={classes.root}>
				<TicketCountEmailDialog
					onClose={() => this.setState({ openReportEventId: null })}
					eventId={openReportEventId}
				/>
				{eventId ? (
					<Typography className={classes.capTitleSmall}>
						Event ticket counts report
					</Typography>
				) : null}

				<div className={classes.header}>
					<Typography className={classes.pageTitle}>
						{eventId ? eventName : "Organization ticket counts report"}
					</Typography>
					<span style={{ flex: 1 }}/>
					{eventId ? (
						<div className={classes.btnHolder}>
							<Button
								iconUrl="/icons/csv-active.svg"
								variant="text"
								onClick={() => this.exportCSV(eventId)}
							>
								Export CSV
							</Button>
							<Button
								href={`/exports/reports/?type=ticket_counts&event_id=${eventId}`}
								target={"_blank"}
								iconUrl="/icons/pdf-active.svg"
								variant="text"
							>
								Export PDF
							</Button>
							<Button
								onClick={() => this.onOpenEmailDialog(eventId)}
								variant="plainWhite"
							>
								Autocount Email
							</Button>
						</div>
					) : null}
				</div>
				{eventId ? (
					<div>
						{/*<Typography>ID: {eventId}</Typography>*/}
						<br/>
						<br/>
						<Typography className={classes.subheading}> Inventory </Typography>
					</div>
				) : null}
				{this.renderList()}
			</div>
		);
	}
}

TicketCounts.propTypes = {
	classes: PropTypes.object.isRequired,
	organizationId: PropTypes.string.isRequired,
	eventId: PropTypes.string,
	eventName: PropTypes.string,
	printVersion: PropTypes.bool,
	onLoad: PropTypes.func
};

export default withStyles(styles)(TicketCounts);
