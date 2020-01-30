import React, { Component } from "react";
import PropTypes from "prop-types";
import { InlineDatePicker } from "material-ui-pickers";
import {
	FormControl,
	withStyles,
	FormHelperText,
	InputAdornment,
	IconButton,
	TextField,
	MenuItem,
	Paper,
	MenuList,
	Popover,
	ClickAwayListener
} from "@material-ui/core";
import moment from "moment-timezone";
import { observer } from "mobx-react";
import FormatInputLabel from "../../elements/form/FormatInputLabel";

const placeHolders = {
	time: "hh:mm am/pm",
	date: "mm/dd/yyyy",
	"date-time": "mm/dd/yyyy hh:mm am/pm"
};

const looseMasks = {
	date: [
		//Month
		/\d/,
		/\d/,
		"/",
		//Day
		/\d/,
		/\d/,
		"/",
		//Year
		/\d/,
		/\d/,
		/\d/,
		/\d/
	]
};

const styles = theme => {
	return {
		formControl: {
			width: "100%"
			//marginTop: theme.spacing.unit
		},
		labelContainer: {
			marginBottom: theme.spacing.unit
		},
		popover: {
			maxHeight: "300px"
		},
		highlight: {
			backgroundColor: "#b2b2b2"
		}
	};
};

const timeFormat = "hh:mm A";

@observer
class DateTimePickerGroup extends Component {
	constructor(props) {
		super(props);
		const { value, timezone } = this.props;

		this.state = {
			anchorEl: null,
			timeFormatted: !value
				? ""
				: value.isValid()
					? value.format(timeFormat)
					: value.creationData().input,
			isTimeValid: !value || value.isValid(),
			displayTimezone: ""
		};
	}

	componentDidMount() {
		this.setDisplayTimezone();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { value } = this.props;

		const { isTimeValid, timeFormatted, dateFormatted } = this.state;
		const newIsTimeValid = !value || value.isValid();

		let newTimeFormatted = timeFormatted;
		if (!value) {
			newTimeFormatted = "";
		} else if (value.isValid()) {
			newTimeFormatted = value.format(timeFormat);
		} else {
			newTimeFormatted = value.creationData().input;
		}

		if (isTimeValid !== newIsTimeValid || timeFormatted !== newTimeFormatted) {
			this.setState({
				isTimeValid: newIsTimeValid,
				timeFormatted: newTimeFormatted
			});
		}

		this.setDisplayTimezone(prevState);
	}

	setDisplayTimezone(prevState = {}) {
		const { value } = this.props;

		const displayTimezone = value && value.isValid() ? value.format("z") : "";

		if (displayTimezone && prevState.displayTimezone !== displayTimezone) {
			//Set the timezone display if exists and has changed
			this.setState({ displayTimezone });
		}
	}

	openPicker = e => {
		// do not pass Event for default pickers
		this.picker.open(e);
	};

	onClick = event => {
		const { isTimeValid, timeFormatted } = this.state;
		if (isTimeValid) {
			this.setState({ anchorEl: event.currentTarget });
			setTimeout(() => {
				const timeId = timeFormatted.replace(/[^a-zA-Z0-9]+/g, "");
				const elementById = document.getElementById(timeId);
				if (elementById) {
					elementById.scrollIntoView();
				}
			}, 250);
		}
	};

	onDateChange = value => {
		const { onChange, type } = this.props;
		value.set({ seconds: 0, millisecond: 0 });
		onChange(value);
	};

	onTimeChanged = event => {
		const newValue = event.target.value;

		this.setState({ timeFormatted: newValue, anchorEl: null });

		if (moment(newValue, timeFormat, true).isValid()) {
			this.onTimeSelected(newValue);
		}
	};

	onTimeSelected = newValue => {
		const { onChange } = this.props;

		const newTime = moment.utc(newValue, timeFormat, true);
		let { value } = this.props;
		if (!value) {
			value = newTime;
		} else {
			value.set({
				hour: newTime.get("hour"),
				minute: newTime.get("minute"),
				seconds: 0,
				millisecond: 0
			});
		}

		onChange(value);
		this.setState({ anchorEl: null });
	};

	onTimePickerClose = () => {
		this.setState({ anchorEl: null });
	};

	render() {
		const {
			type,
			error,
			name,
			placeholder,
			onFocus,
			onBlur,
			classes,
			value,
			timeIncrement = 30,
			disabled,
			timezone
		} = this.props;
		const { label } = this.props;

		const additionalProps = {};
		let inputProps = {};

		if (disabled) {
			inputProps = {
				...inputProps,
				disabled,
				endAdornment: null
			};
		}

		const start = moment().set({ hour: 0, minute: 0, second: 0 });
		const end = moment(start).add(24, "hours");
		const times = [];
		while (start < end) {
			times.push(start.format("hh:mm A"));
			start.add(timeIncrement, "minutes");
		}

		const {
			anchorEl,
			timeFormatted,
			isTimeValid,
			displayTimezone
		} = this.state;

		let timezoneLabel;
		if (displayTimezone) {
			timezoneLabel = ` (${displayTimezone})`;
		}

		return (
			<FormControl
				className={classes.formControl}
				error
				aria-describedby={`%${name}-error-text`}
			>
				<span className={classes.labelContainer}>
					<FormatInputLabel>{label}</FormatInputLabel>
					{timezoneLabel}
				</span>
				{type === "date" ? (
					<InlineDatePicker
						style={{ width: "100%" }}
						id={name}
						error={!!error}
						value={value}
						onChange={v => this.onDateChange(v)}
						onBlur={onBlur}
						onFocus={onFocus}
						placeholder={placeholder || placeHolders[type]}
						format={value && value._z ? value._z.name : timezone} //See src/helpers/customPickerUtils.js for the reason the timezone is passed through as the format
						keyboard
						InputProps={inputProps}
						clearable
						{...additionalProps}
						ref={node => {
							this.picker = node;
						}}
						autoComplete="off"
					/>
				) : null}

				{type === "time" ? (
					<span>
						<TextField
							disabled={disabled}
							style={{ width: "100%" }}
							id={name}
							name={name}
							error={!isTimeValid || !!error}
							onClick={!disabled ? event => this.onClick(event) : null}
							value={timeFormatted}
							onFocus={onFocus}
							onChange={this.onTimeChanged.bind(this)}
							onBlur={onBlur}
							autoComplete={"off"}
							//TODO use pink dropdown icon from designs
							// InputProps={{
							// 	endAdornment: (
							// 		<InputAdornment position="end">
							// 			<TimeIcon />
							// 		</InputAdornment>
							// 	)
							// }}
						/>
						<Popover
							open={Boolean(anchorEl)}
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left"
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "left"
							}}
							disableAutoFocus={true}
						>
							<ClickAwayListener onClickAway={this.onTimePickerClose}>
								<Paper elevation={24} className={classes.popover}>
									<MenuList id="time-menu">
										{times.map((time, index) => (
											<MenuItem
												id={time.replace(/[^a-zA-Z0-9]+/g, "")}
												className={
													time === timeFormatted ? classes.highlight : null
												}
												key={time}
												onClick={event => this.onTimeSelected(time)}
											>
												{time}
											</MenuItem>
										))}
									</MenuList>
								</Paper>
							</ClickAwayListener>
						</Popover>
					</span>
				) : null}
				<FormHelperText id={`${name}-error-text`}>
					{!isTimeValid ? "Not a valid time (e.g. 9:30 PM)" : error}
				</FormHelperText>
			</FormControl>
		);
	}
}

DateTimePickerGroup.defaultProps = {
	timezone: "UTC"
};

DateTimePickerGroup.propTypes = {
	type: PropTypes.oneOf(["date", "time"]),
	error: PropTypes.string,
	value: PropTypes.object,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	timeIncrement: PropTypes.number,
	disabled: PropTypes.bool,
	timezone: PropTypes.string
};

export default withStyles(styles)(DateTimePickerGroup);
