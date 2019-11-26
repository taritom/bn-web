import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { observer } from "mobx-react";
import IconButton from "@material-ui/core/IconButton";

import Card from "../../../../elements/Card";
import Bigneon from "../../../../../helpers/bigneon";
import notifications from "../../../../../stores/notifications";
import Loader from "../../../../elements/loaders/Loader";
import reportDateRangeHeading from "../../../../../helpers/reportDateRangeHeading";
import { fontFamilyDemiBold } from "../../../../../config/theme";
import Bn from "bn-api-node";

const styles = theme => ({
	root: {},
	cardInnerContainer: {
		padding: theme.spacing.unit * 3,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center"
	},
	createdDateText: {
		fontFamily: fontFamilyDemiBold,
		fontSize: theme.typography.fontSize * 1.1
	}
});

const Spacer = () => <div style={{ marginTop: 20 }}/>;

const statusEnums = Bn.Enums.SETTLEMENT_STATUS;

@observer
class SettlementReportList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reports: null
		};
	}

	componentDidMount() {
		const { organizationId, organizationTimezone } = this.props;
		const dateFormat = "ddd, MMM Do YYYY";
		const rangeDateFormat = "MMM DD, YYYY";

		Bigneon()
			.organizations.settlements.index({ organization_id: organizationId })
			.then(response => {
				const { data, paging } = response.data; //TODO pagination
				const reports = [];

				data.forEach(
					({
						created_at,
						start_time,
						end_time,
						only_finished_events,
						...rest
					}) => {
						const startDate = moment.utc(start_time).tz(organizationTimezone);
						const endDate = moment.utc(end_time).tz(organizationTimezone);

						//Back one day if needed for display
						if (startDate.diff(endDate, "days") > 1) {
							endDate.add("d", -1);
						}

						const displayDateRange = `${startDate.format(
							rangeDateFormat
						)} to ${endDate.format(rangeDateFormat)}`;

						// const createdAtMoment = moment
						// 	.utc(created_at)
						// 	.tz(organizationTimezone);

						reports.push({
							...rest,
							createdAtMoment: endDate, //Order by the date the report ends for
							displayCreatedAt: endDate.format(dateFormat),
							displayDateRange,
							isPostEventSettlement: only_finished_events
						});
					}
				);

				reports.sort((a, b) => {
					if (a.createdAtMoment.diff(b.createdAtMoment) < 0) {
						return 1;
					} else {
						return -1;
					}
				});

				this.setState({ reports });
			})
			.catch(error => {
				console.error(error);
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Loading settlement reports failed."
				});
			});
	}

	render() {
		const { reports } = this.state;
		if (reports === null) {
			return <Loader>Loading settlement reports...</Loader>;
		}

		const { classes } = this.props;

		return (
			<div>
				{reports.map(report => {
					const {
						id,
						displayCreatedAt,
						displayDateRange,
						isPostEventSettlement,
						status
					} = report;

					return (
						<div key={id}>
							<Link to={`/admin/reports/settlement?id=${id}`}>
								<Card variant={"block"}>
									<div className={classes.cardInnerContainer}>
										<div>
											<Typography className={classes.createdDateText}>
												{displayCreatedAt}
											</Typography>
											<Typography>
												{isPostEventSettlement ? "Events" : "Tickets sold"} from{" "}
												{displayDateRange}
												{/*({statusEnums[status]})*/}
											</Typography>
										</div>
										<div>
											<img src={"/icons/chart-gray.svg"}/>
										</div>
									</div>
								</Card>
							</Link>
							<Spacer/>
						</div>
					);
				})}
			</div>
		);
	}
}

SettlementReportList.propTypes = {
	classes: PropTypes.object.isRequired,
	organizationId: PropTypes.string.isRequired,
	organizationTimezone: PropTypes.string.isRequired
};

export default withStyles(styles)(SettlementReportList);
