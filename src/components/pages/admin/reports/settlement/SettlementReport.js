import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import moment from "moment-timezone";

import Button from "../../../../elements/Button";
import { fontFamilyDemiBold, secondaryHex } from "../../../../../config/theme";
import notifications from "../../../../../stores/notifications";
import Loader from "../../../../elements/loaders/Loader";
import Bigneon from "../../../../../helpers/bigneon";
import GrandTotalsTable from "./GrandTotalsTable";
import Card from "../../../../elements/Card";
import getUrlParam from "../../../../../helpers/getUrlParam";
import AdjustmentDialog from "./AdjustmentDialog";
import AdjustmentsList from "./AdjustmentsList";
import Bn from "bn-api-node";
import EventListTable from "./EventListTable";
import SingleEventSettlement from "./SingleEventSettlement";

const statusEnums = Bn.Enums.SETTLEMENT_STATUS;

const styles = theme => ({
	root: {
		padding: theme.spacing.unit * 4,
		marginBottom: theme.spacing.unit
	},
	boldText: {
		fontFamily: fontFamilyDemiBold
	},
	title: {
		fontFamily: fontFamilyDemiBold,
		fontSize: 28,
		marginBottom: theme.spacing.unit
	},
	subtitle: {
		fontFamily: fontFamilyDemiBold,
		color: secondaryHex,
		textTransform: "uppercase",
		fontSize: 13,
		marginBottom: theme.spacing.unit
	}
});

class SettlementReport extends Component {
	constructor(props) {
		super(props);

		this.state = {
			orgName: "",
			settlement_type: "",
			adjustments: null,
			event_entries: null,
			settlement: null,
			grandTotals: null,

			showAdjustmentDialog: false
		};
	}

	componentDidMount() {
		const settlementId = getUrlParam("id");
		if (!settlementId) {
			return notifications.show({
				message: "Report not found.",
				variant: "error"
			});
		}

		this.setState({ settlementId }, () => {
			this.loadSettlementDetails();
			this.loadOrgDetails();
		});
	}

	loadSettlementDetails(onSuccess = () => {}) {
		//If we have an ID, load those details instead of allowing them to set dates

		const { settlementId } = this.state;

		Bigneon()
			.settlements.read({ id: settlementId })
			.then(response => {
				const { adjustments, event_entries, settlement } = response.data;

				const { start_time, end_time } = settlement;

				const { organizationTimezone } = this.props;

				const dateFormat = "MMM D, YYYY z";

				const displayDateRange = `${moment
					.utc(start_time)
					.tz(organizationTimezone)
					.format(dateFormat)} - ${moment
					.utc(end_time)
					.tz(organizationTimezone)
					.format(dateFormat)}`;

				let adjustmentsInCents = 0;
				let totalFaceInCents = 0;
				let totalRevenueShareInCents = 0;
				let totalSettlementInCents = 0;

				event_entries.forEach(eventEntry => {
					const { entries } = eventEntry;
					entries.forEach(entry => {
						const {
							face_value_in_cents,
							revenue_share_value_in_cents,
							total_sales_in_cents,
							online_sold_quantity,
							fee_sold_quantity
						} = entry;

						totalFaceInCents =
							totalFaceInCents + face_value_in_cents * online_sold_quantity;
						totalRevenueShareInCents =
							totalRevenueShareInCents +
							revenue_share_value_in_cents * fee_sold_quantity;
						totalSettlementInCents =
							totalSettlementInCents + total_sales_in_cents;
					});
				});

				adjustments.forEach(adjustment => {
					const { amount_in_cents, created_at } = adjustment;
					adjustmentsInCents = adjustmentsInCents + amount_in_cents;
					adjustment.displayCreatedAt = moment
						.utc(created_at)
						.tz(organizationTimezone)
						.format(dateFormat);
				});

				totalSettlementInCents = totalSettlementInCents + adjustmentsInCents;

				const grandTotals = {
					adjustmentsInCents,
					totalFaceInCents,
					totalRevenueShareInCents,
					totalSettlementInCents
				};

				//Format dates in event_entries
				event_entries.forEach(({ event }) => {
					event.displayStartTime = moment
						.utc(event.start_time)
						.tz(organizationTimezone)
						.format(dateFormat);
					event.displayEndTime = moment
						.utc(event.end_time)
						.tz(organizationTimezone)
						.format(dateFormat);
				});

				const eventList = event_entries.map(({ event }) => event);

				this.setState(
					{
						adjustments,
						event_entries,
						settlement: { ...settlement, displayDateRange },
						grandTotals,
						eventList
					},
					onSuccess
				);
			})
			.catch(error => {
				console.error(error);
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Loading settlement report failed."
				});
			});
	}

	loadOrgDetails() {
		const { organizationId } = this.props;

		Bigneon()
			.organizations.read({ id: organizationId })
			.then(response => {
				const { name: orgName, settlement_type, ...rest } = response.data;

				this.setState({ orgName, settlement_type });
			})
			.catch(error => {
				console.error(error);
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Loading organization details failed."
				});
			});
	}

	exportToCsv() {
		notifications.show({ message: "Coming soon." });
	}

	onCloseAdjustmentDialog() {
		this.setState({ showAdjustmentDialog: false });
	}

	onAdjustmentAdded() {
		this.onCloseAdjustmentDialog();
		this.loadSettlementDetails();
	}

	render() {
		const { classes } = this.props;
		const {
			settlement_type,
			settlement,
			event_entries,
			adjustments,
			grandTotals,
			showAdjustmentDialog,
			settlementId,
			eventList
		} = this.state;

		if (!settlement) {
			return <Loader>Loading settlement report...</Loader>;
		}

		const {
			created_at,
			only_finished_events,
			status,
			start_time,
			end_time,
			displayDateRange
		} = settlement;

		return (
			<Card variant={"block"}>
				{settlementId ? (
					<AdjustmentDialog
						settlementId={settlementId}
						open={showAdjustmentDialog}
						onClose={this.onCloseAdjustmentDialog.bind(this)}
						onSuccess={this.onAdjustmentAdded.bind(this)}
					/>
				) : null}
				<div className={classes.root}>
					<div
						style={{
							display: "flex",
							minHeight: 40,
							alignItems: "flex-end"
						}}
					>
						<div>
							<Typography className={classes.subtitle}>
								Settlement report
							</Typography>
							<Typography>
								Settlement type:{" "}
								<span className={classes.boldText}>{settlement_type}</span>
							</Typography>
							<Typography>
								{only_finished_events ? "Events ended" : "Sales occurring"} from{" "}
								<span className={classes.boldText}>{displayDateRange}</span>
							</Typography>
							<Typography>
								Status:{" "}
								<span className={classes.boldText}>{statusEnums[status]}</span>
							</Typography>
						</div>

						<span style={{ flex: 1 }}/>
						<Button
							iconUrl="/icons/csv-active.svg"
							variant="text"
							onClick={this.exportToCsv.bind(this)}
						>
							Export CSV
						</Button>
					</div>

					<GrandTotalsTable
						onAddAdjustment={() =>
							this.setState({ showAdjustmentDialog: true })
						}
						{...grandTotals}
					/>

					<AdjustmentsList adjustments={adjustments}/>

					<br/>
					<br/>

					<EventListTable
						eventList={eventList}
						displayDateRange={displayDateRange}
						onlyFinishedEvents={only_finished_events}
					/>

					<br/>
					<br/>

					<Typography className={classes.title}>
						Event-by-event summary
					</Typography>

					{event_entries.map(({ event: eventDetails, entries }, index) => (
						<SingleEventSettlement
							key={index}
							eventDetails={eventDetails}
							entries={entries}
						/>
					))}
				</div>
			</Card>
		);
	}
}

SettlementReport.propTypes = {
	classes: PropTypes.object.isRequired,
	organizationId: PropTypes.string.isRequired,
	organizationTimezone: PropTypes.string.isRequired,
	onLoad: PropTypes.func,
	history: PropTypes.object.isRequired
};

export default withStyles(styles)(SettlementReport);
