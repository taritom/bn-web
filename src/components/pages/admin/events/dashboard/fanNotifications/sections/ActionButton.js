import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "../../../../../../elements/Button";

class ActionButton extends Component {
	constructor(props) {
		super(props);

		const {
			scheduledAt,
			isSending,
			isNotificationAfter,
			isEventEnded,
			isCustom,
			onAction,
			broadcastSent,
			onSendNow,
			hasEventStarted
		} = this.props;

		this.defaultState = {
			scheduledAt,
			isSending,
			isNotificationAfter,
			isEventEnded,
			isCustom,
			onAction,
			broadcastSent,
			onSendNow,
			hasEventStarted
		};

		this.state = this.defaultState;
	}

	static getDerivedStateFromProps(props, state) {
		const {
			scheduledAt,
			isSending,
			isNotificationAfter,
			isEventEnded,
			onAction,
			broadcastSent,
			onSendNow,
			hasEventStarted
		} = props;

		return {
			scheduledAt,
			isSending,
			isNotificationAfter,
			isEventEnded,
			onAction,
			broadcastSent,
			onSendNow,
			hasEventStarted
		};
	}

	render() {
		const {
			scheduledAt,
			isNotificationAfter,
			isEventEnded,
			onAction,
			broadcastSent,
			onSendNow,
			hasEventStarted
		} = this.props;

		if (scheduledAt && !broadcastSent && isNotificationAfter) {
			return (
				<Button
					variant={"whiteCTA"}
					size={"large"}
					onClick={onAction}
					disabled={isEventEnded}
				>
					Change
				</Button>
			);
		} else if(isNotificationAfter && hasEventStarted) {
			return (
				<Button
					variant={"whiteCTA"}
					size={"large"}
					onClick={onSendNow}
					disabled={isEventEnded}
				>
					Send now
				</Button>
			);
		} else {
			return null;
		}
	}
}

ActionButton.propTypes = {
	classes: PropTypes.object.isRequired,
	scheduledAt: PropTypes.string,
	isSending: PropTypes.bool.isRequired,
	isNotificationAfter: PropTypes.bool.isRequired,
	isEventEnded: PropTypes.bool.isRequired,
	broadcastSent: PropTypes.bool,
	onAction: PropTypes.func.isRequired,
	onSendNow: PropTypes.func.isRequired,
	hasEventStarted: PropTypes.bool
};

export default ActionButton;
