import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import eventResults from "../../../stores/eventResults";
import changeUrlParam from "../../../helpers/changeUrlParam";
import notifications from "../../../stores/notifications";
import servedImage from "../../../helpers/imagePathHelper";
import { Hidden } from "@material-ui/core";

const styles = theme => ({
	root: {
		display: "flex",
		justifyContent: "space-between",
		width: "100%"
	},
	noClose: {
		display: "flex",
		alignItems: "center"
	},
	input: {
		border: "none",
		fontSize: 19,
		color: "#9DA3B4",
		outline: "none"
	},
	icon: {
		marginRight: -8,
		height: 61,
		width: 61,
		marginLeft: -14,
		[theme.breakpoints.down("sm")]: {
			marginLeft: -24
		}
	},

	closeIcon: {
		marginRight: 8,
		marginLeft: -24
	}
});

class SearchToolBarInput extends Component {
	constructor(props) {
		super(props);

		this.state = {
			query: "",
			isSearching: false
		};
	}

	componentDidMount() {}

	componentWillUnmount() {
		this.componentUnmounted = true;
	}

	onEventSearch(e) {
		e.preventDefault();

		const { query, isSearching } = this.state;

		if (isSearching) {
			return;
		}

		this.setState({ isSearching: true });

		//Redirect home to show results
		this.props.history.push("/");
		//Changes the URL so link can be copy/pasted and the search bar on the home page is pre populated
		changeUrlParam("search", query);

		eventResults.refreshResults(
			{ query },
			() => {
				this.componentUnmounted || this.setState({ isSearching: false });
			},
			message => {
				this.setState({ isSearching: false });

				notifications.show({
					message,
					variant: "error"
				});
			}
		);
	}

	render() {
		const { classes } = this.props;
		const { query, isSearching } = this.state;

		return (
			<form
				noValidate
				ref={this.props.clickRef}
				autoComplete="off"
				onSubmit={this.onEventSearch.bind(this)}
				className={classes.root}
				onClick={() => this.input.focus()} //If they click near the input focus the input
			>
				<div className={classes.noClose}>
					<img
						alt="Search icon"
						className={classes.icon}
						src={servedImage("/icons/search-pink.svg")}
					/>
					<input
						ref={input => (this.input = input)}
						disabled={isSearching}
						value={query}
						onChange={e => this.setState({ query: e.target.value })}
						className={classes.input}
						placeholder="Search Events"
					/>
				</div>
				<Hidden smUp>
					<img
						alt="Search icon"
						className={classes.closeIcon}
						src={servedImage("/icons/delete-gray.svg")}
						onClick={this.props.onCloseClick}
					/>
				</Hidden>
			</form>
		);
	}
}

SearchToolBarInput.propTypes = {
	classes: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

export default withStyles(styles)(SearchToolBarInput);
