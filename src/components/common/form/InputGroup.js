import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import MaskedInput from "react-text-mask";
import classnames from "classnames";
import ReactDOM from "react-dom";

import FormatInputLabel from "../../elements/form/FormatInputLabel";

const PhoneNumberInputMask = props => {
	const { inputRef, ...other } = props;

	return (
		<MaskedInput
			{...other}
			ref={inputRef}
			mask={[
				"+",
				"1",
				" ",
				/\d/,
				" ",
				"(",
				/\d/,
				/\d/,
				/\d/,
				")",
				" ",
				/\d/,
				/\d/,
				/\d/,
				"-",
				/\d/,
				/\d/,
				/\d/,
				/\d/
			]}
			placeholderChar={"\u2000"}
			showMask
			guide={false}
		/>
	);
};

PhoneNumberInputMask.propTypes = {
	inputRef: PropTypes.func.isRequired
};

const styles = theme => {
	return {
		formControl: {
			width: "100%"
		},
		input: { paddingTop: 0 },
		searchInput: {
			textAlign: "center",
			fontSize: theme.typography.body1.fontSize
		},
		errorHelperText: {
			marginTop: 0,
			paddingTop: 0,
			paddingBottom: 0,
			marginBottom: 0
		}
	};
};

class InputGroup extends Component {
	constructor(props) {
		super(props);
	}

	//TODO check if scrolling still changes with number inputs
	//Bug was in Chrome 73 https://www.chromestatus.com/features/6662647093133312
	//If it's no longer a bug these listeners can be removed and the component changed back to a stateless component
	handleWheel = e => e.preventDefault();

	componentDidMount() {
		ReactDOM.findDOMNode(this).addEventListener("wheel", this.handleWheel);
	}

	componentWillUnmount() {
		ReactDOM.findDOMNode(this).removeEventListener("wheel", this.handleWheel);
	}

	render() {
		const {
			disabled,
			classes,
			error,
			value,
			name,
			label,
			placeholder,
			type,
			isSearch,
			onChange,
			onBlur,
			onFocus,
			multiline,
			autoFocus,
			InputProps = {},
			autoComplete,
			allowNegative,
			labelProps
		} = this.props;

		if (type === "phone") {
			InputProps.inputComponent = PhoneNumberInputMask;
		}

		let onChangeEvent = onChange;
		//Stop them from entering negative numbers unless they explicitly allow them
		if (type === "number" && !allowNegative) {
			onChangeEvent = e => {
				const numberString = e.target.value;
				if (!isNaN(numberString) && Number(numberString) >= 0) {
					onChange(e);
				}
			};
		}

		return (
			<FormControl
				className={classes.formControl}
				error
				aria-describedby={`%${name}-error-text`}
			>
				<FormatInputLabel {...labelProps}>{label}</FormatInputLabel>
				<TextField
					error={!!error}
					id={name}
					type={type}
					value={value}
					onChange={onChangeEvent}
					margin="normal"
					onBlur={onBlur}
					onFocus={onFocus}
					InputProps={{
						...InputProps,
						classes: {
							input: classnames({
								[classes.input]: true,
								[classes.searchInput]: isSearch
							})
						}
					}}
					placeholder={placeholder}
					multiline={multiline}
					autoFocus={autoFocus}
					disabled={disabled}
					autoComplete={autoComplete}
					onWheel={e => e.preventDefault()}
				/>

				<FormHelperText
					className={classes.errorHelperText}
					id={`${name}-error-text`}
				>
					{error}
				</FormHelperText>
			</FormControl>
		);
	}
}
//
// const InputGroup = props => {
// 	const {
// 		disabled,
// 		classes,
// 		error,
// 		value,
// 		name,
// 		label,
// 		placeholder,
// 		type,
// 		isSearch,
// 		onChange,
// 		onBlur,
// 		onFocus,
// 		multiline,
// 		autoFocus,
// 		InputProps = {},
// 		autoComplete,
// 		allowNegative,
// 		labelProps
// 	} = props;
//
//
// };

InputGroup.defaultProps = {
	value: "",
	type: "text",
	labelProps: {}
};

InputGroup.propTypes = {
	error: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	type: PropTypes.string,
	isSearch: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	multiline: PropTypes.bool,
	autoFocus: PropTypes.bool,
	InputProps: PropTypes.object,
	disabled: PropTypes.bool,
	autoComplete: PropTypes.string,
	allowNegative: PropTypes.bool,
	labelProps: PropTypes.object
};

export default withStyles(styles)(InputGroup);
