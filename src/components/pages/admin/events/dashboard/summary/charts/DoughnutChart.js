import { Doughnut } from "react-chartjs-2";
import React from "react";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
	fontFamily,
	fontFamilyBold,
	fontFamilyDemiBold,
	primaryHex,
	secondaryHex
} from "../../../../../../../config/theme";
import Loader from "../../../../../../elements/loaders/Loader";
import LegendRow from "./LegendRow";

const styles = theme => {
	return {
		root: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			position: "relative"
		},
		pieContainer: {
			zIndex: 2
		},
		totalContainer: {
			left: 0,
			top: 0,
			position: "absolute",
			width: "100%",
			height: "100%",
			//backgroundColor: "rgba(255,50,0,0.25)",
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			zIndex: 0
		},
		totalLabel: {
			fontSize: 11,
			fontFamily: fontFamilyDemiBold,
			textAlign: "center",
			paddingTop: 10
		},
		totalValue: {
			fontSize: 26,
			opacity: 0.6,
			textAlign: "center"
		}
	};
};

const DoughnutRender = ({ resultSet, colors, chartTotal }) => {
	const data = {
		labels: resultSet.categories().map(c => c.category),
		datasets: resultSet.series().map(s => ({
			label: s.title,
			data: s.series.map(r => r.value),
			backgroundColor: colors,
			hoverBackgroundColor: colors
		}))
	};

	const options = {
		legend: {
			display: false
		},
		cutoutPercentage: 60,
		maintainAspectRatio: false,
		tooltips: {
			enabled: chartTotal > 0,
			custom: tooltipModel => {
				tooltipModel.backgroundColor = secondaryHex;
				tooltipModel.displayColors = false;
				tooltipModel.bodyFontSize = 11;
				tooltipModel.width = tooltipModel.width * 0.85;
			},
			callbacks: {
				label: (tooltipItem, data) => {
					const { labels } = data;
					return labels[tooltipItem.index];
				}
			}
		}
	};
	return <Doughnut height={120} width={150} data={data} options={options}/>;
};

const ChartContainer = ({ children, resultSet, classes, chartTotal }) => {
	const { loadResponse } = resultSet;
	if (!loadResponse) {
		return null;
	}

	return (
		<div className={classes.root}>
			<div className={classes.totalContainer}>
				<Typography className={classes.totalLabel}>Total</Typography>
				<Typography className={classes.totalValue}>{chartTotal}</Typography>
			</div>
			<div className={classes.pieContainer}>{children}</div>
		</div>
	);
};

const DoughnutChart = Component => ({ resultSet, error, colors }) => {
	let pieColors = colors;

	let chartTotal = 0;
	//Handle empty chart state
	if (resultSet) {
		const { loadResponse } = resultSet;

		if (loadResponse && loadResponse.query) {
			loadResponse.data.forEach(entry => {
				const keys = Object.keys(entry);

				const label = entry[keys[0]];

				if (label !== "No data") {
					const value = entry[keys[keys.length - 1]];
					chartTotal = chartTotal + Number(value);
				}
			});

			if (chartTotal == 0) {
				const { dimensions, measures } = loadResponse.query;

				const placeHolderData = {};

				dimensions.forEach(d => {
					placeHolderData[d] = "No data";
				});

				measures.forEach(m => {
					placeHolderData[m] = "1";
				});

				resultSet.loadResponse.data.push(placeHolderData);
				pieColors = ["#F5F7FA"];
			}
		}
	}

	const ChartContainerWithStyles = withStyles(styles)(props => (
		<ChartContainer {...props} colors={pieColors} chartTotal={chartTotal}/>
	));

	return (
		(resultSet && (
			<ChartContainerWithStyles resultSet={resultSet}>
				<Component
					resultSet={resultSet}
					colors={pieColors}
					chartTotal={chartTotal}
				/>
			</ChartContainerWithStyles>
		)) ||
		(error && error.toString()) || <Loader/>
	);
};

export default DoughnutChart(DoughnutRender);
