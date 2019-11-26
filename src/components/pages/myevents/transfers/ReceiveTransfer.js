import React, { Component } from "react";
import { Hidden, Typography, withStyles } from "@material-ui/core";
import moment from "moment-timezone";
import { Link } from "react-router-dom";

import notifications from "../../../../stores/notifications";
import user from "../../../../stores/user";
import Bigneon from "../../../../helpers/bigneon";
import { observer } from "mobx-react";
import getUrlParam from "../../../../helpers/getUrlParam";
import TransferContainer from "./TransferContainer";
import Loader from "../../../elements/loaders/Loader";
import {
	fontFamilyBold,
	fontFamilyDemiBold,
	secondaryHex
} from "../../../../config/theme";
import EventCardContainer from "./EventCardContainer";
import {
	FacebookButton,
	logoutFB
} from "../../authentication/social/FacebookButton";
import Button from "../../../elements/Button";
import TermsAndConditionsLinks from "../../authentication/TermsAndConditionsLinks";
import SignupForm from "../../authentication/forms/SignupForm";
import LoginForm from "../../authentication/forms/LoginForm";
import servedImage from "../../../../helpers/imagePathHelper";
import SMSLinkForm from "../../../elements/SMSLinkForm";
import optimizedImageUrl from "../../../../helpers/optimizedImageUrl";
import Settings from "../../../../config/settings";

const styles = theme => ({
	root: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		minHeight: "90%",
		paddingBottom: 50,
		height: "100%",
		[theme.breakpoints.down("xs")]: {
			paddingTop: 20
			// justifyContent: null
		}
	},
	backgroundText: {
		color: "#FFFFFF",
		fontFamily: fontFamilyBold,
		fontSize: 28,
		textAlign: "center"
	},
	backgroundTextSmall: {
		color: "#FFFFFF",
		fontSize: 21,
		textAlign: "center"
	},
	innerCardContainer: {
		padding: 20,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",

		[theme.breakpoints.down("sm")]: {
			padding: 10
		}
	},
	optionsContainer: {
		width: "100%",
		maxWidth: 310,
		marginBottom: 30,

		[theme.breakpoints.down("sm")]: {
			marginBottom: 10
		}
	},
	authContainer: {
		maxWidth: 450
	},
	authenticateTitle: {
		fontFamily: fontFamilyDemiBold,
		fontSize: 24,
		marginTop: 20,
		marginBottom: 20,
		textAlign: "center",
		lineHeight: 1.1
	},
	switchAuthTypeText: {
		marginTop: 20,
		color: "#abadaf",
		fontSize: 14,
		textAlign: "center"
	},
	textLink: {
		cursor: "pointer",
		fontFamily: fontFamilyDemiBold,
		color: secondaryHex
	},
	profilePic: {
		width: 55,
		height: 55,
		borderRadius: 100,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "50% 50%",
		boxShadow: "0px 2px 15px 0px rgba(24, 28, 71, 0.21)",
		marginTop: 10,
		marginBottom: 10
	},
	loggedInAsText: {
		fontFamily: fontFamilyDemiBold,
		fontSize: 20
	},
	emailText: {
		color: secondaryHex,
		marginBottom: 10
	},
	logoutText: {
		fontSize: 14,
		marginBottom: 20,
		color: "#c1c1c1",
		fontFamily: fontFamilyDemiBold,
		cursor: "pointer"
	},
	unavailableContainer: {
		height: "85vh",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",

		[theme.breakpoints.down("sm")]: {
			justifyContent: "space-between",
			padding: 35,
			paddingTop: "40%"
		}
	},
	additionalText: {
		paddingLeft: theme.spacing.unit * 2,
		paddingTop: theme.spacing.unit * 2
	},
	noAppText: {
		color: "#fff",
		fontFamily: fontFamilyDemiBold,
		textAlign: "center",
		margin: "30px auto 0 auto"
	}
});

@observer
class ReceiveTransfer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			transferAuth: null,
			isAuthenticated: null,
			ticketCount: null,
			signupOrLogin: null,
			receiveSuccess: false,
			isClaiming: false,
			transferStatus: null,
			openedAppLink: false
		};
		this.scrollRef = React.createRef();
	}

	componentDidMount() {
		const transfer_key = getUrlParam("transfer_key");
		const transferAuth = {
			transfer_key,
			sender_user_id: getUrlParam("sender_user_id"),
			num_tickets: parseInt(getUrlParam("num_tickets")),
			signature: getUrlParam("signature")
		};

		this.setState({ transferAuth }, () =>
			this.loadTransferDetails(transfer_key)
		);

		this.refreshUser();
		this.handleScrollToTop();
	}

	handleScrollToTop() {
		window.scrollTo(0, 0);

		if (this.scrollRef.current) {
			this.scrollRef.current.scrollTop = 0;
		}
	}
	// window.scrollTo(0, scrollPos);

	refreshUser() {
		//If we just landed on this page, make sure the user is logged in first

		user.refreshUser(
			() => this.setState({ isAuthenticated: true }),
			() => this.setState({ isAuthenticated: false })
		);
	}

	loadTransferDetails(transferKey) {
		Bigneon()
			.transfers.read({
				id: transferKey
			})
			.then(response => {
				const {
					id,
					transfer_address,
					event_ids,
					ticket_ids,
					status, //Pending, Cancelled, Completed, EventEnded
					...rest
				} = response.data;

				this.setState({
					ticketCount: ticket_ids.length,
					transferStatus: status
				});

				//Should just have one event ID, but if there are more we'll just display the first event's image
				if (event_ids && event_ids.length > 0) {
					this.loadEventDetails(event_ids[0]);
				}
			})
			.catch(error => {
				this.setState({ isCancelling: false });
				console.error(error);
				notifications.showFromErrorResponse({
					error,
					defaultMessage: "Could not find transfer details."
				});
			});
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

	receiveTransfer() {
		const { transferAuth } = this.state;
		this.setState({ isClaiming: true });

		Bigneon()
			.tickets.transfer.receive(transferAuth)
			.then(response => {
				this.setState({
					receiveSuccess: true,
					isClaiming: false
				});
			})
			.catch(error => {
				console.error(error);
				notifications.showFromErrorResponse({
					defaultMessage: "Receiving tickets failed.",
					error
				});
			});
	}

	get title() {
		const { ticketCount } = this.state;

		const senderName = "A user"; //TODO get this from the api when it comes

		let text = `Get your tickets now!`;

		if (ticketCount !== null) {
			if (ticketCount > 1) {
				text = `${senderName} has sent you ${ticketCount} tickets... get them!`;
			}
		}

		return text;
	}

	handleOnSuccess = () => {
		this.refreshUser.bind(this);
		this.receiveTransfer();
		this.handleScrollToTop();
	};

	handleAcceptClick = () => {
		this.receiveTransfer();
		window.open(Settings().genericAppDownloadLink, "_blank");
		this.setState({ openedAppLink: true });
	};

	handleViewTicketsClick = () => {
		window.open(Settings().genericAppDownloadLink, "_blank");
	};

	handleNotYouClick = () => {
		user.onLogout(() => this.refreshUser());
		logoutFB(() => this.refreshUser());
	};

	renderAuthenticationOptions() {
		const { signupOrLogin } = this.state;

		const { classes } = this.props;

		let content = null;

		if (signupOrLogin === "signup") {
			content = (
				<div className={classes.authContainer}>
					<Typography className={classes.authenticateTitle}>Sign Up</Typography>
					<SignupForm hideTermsAndConditions onSuccess={this.handleOnSuccess}/>
					<Typography className={classes.switchAuthTypeText}>
						Already have an account?{" "}
						<span
							className={classes.textLink}
							onClick={() => this.setState({ signupOrLogin: "login" })}
						>
							Log in
						</span>
					</Typography>
				</div>
			);
		} else if (signupOrLogin === "login") {
			content = (
				<div className={classes.authContainer}>
					<LoginForm onSuccess={this.handleOnSuccess}/>
					<Typography className={classes.switchAuthTypeText}>
						Don't have an account?{" "}
						<span
							className={classes.textLink}
							onClick={() => this.setState({ signupOrLogin: "signup" })}
						>
							Sign up
						</span>
					</Typography>
				</div>
			);
		} else {
			content = (
				<React.Fragment>
					<div className={classes.optionsContainer}>
						<Typography className={classes.authenticateTitle}>
							To get your tickets create a Big Neon Account
						</Typography>

						<FacebookButton onSuccess={this.handleOnSuccess}/>

						<Button
							size={"mediumLarge"}
							style={{ width: "100%", marginTop: 10 }}
							variant={"secondary"}
							onClick={() => this.setState({ signupOrLogin: "signup" })}
						>
							Continue with email
						</Button>
					</div>
					<Typography className={classes.switchAuthTypeText}>
						Already have an account?{" "}
						<span
							className={classes.textLink}
							onClick={() => this.setState({ signupOrLogin: "login" })}
						>
							Log in
						</span>
					</Typography>
					<br/>
					<TermsAndConditionsLinks/>
				</React.Fragment>
			);
		}

		return <div className={classes.innerCardContainer}>{content}</div>;
	}

	renderCallToAction() {
		const { classes } = this.props;
		const { isClaiming } = this.state;

		const profilePicUrl = user.profilePicUrl
			? optimizedImageUrl(user.profilePicUrl)
			: servedImage("/images/profile-pic-placeholder.png");

		return (
			<div className={classes.innerCardContainer}>
				<div
					className={classes.profilePic}
					style={{ backgroundImage: `url(${profilePicUrl})` }}
					src={user.profilePicUrl}
				/>
				<Typography className={classes.loggedInAsText}>
					Currently logged in as {user.firstName} {user.lastName}
				</Typography>

				<Typography className={classes.emailText}>{user.email}</Typography>

				<Typography
					className={classes.logoutText}
					onClick={this.handleNotYouClick}
				>
					Not you? Click here.
				</Typography>

				<Hidden smUp>
					<div className={classes.optionsContainer}>
						<Button
							variant={"secondary"}
							style={{ width: "100%" }}
							onClick={this.handleAcceptClick}
							disabled={isClaiming}
						>
							{isClaiming ? "Claiming..." : "Accept tickets"}
						</Button>
					</div>
				</Hidden>
				<Hidden smDown>
					<div className={classes.optionsContainer}>
						<Button
							variant={"secondary"}
							style={{ width: "100%" }}
							onClick={this.receiveTransfer.bind(this)}
							disabled={isClaiming}
						>
							{isClaiming ? "Claiming..." : "Accept tickets"}
						</Button>
					</div>
				</Hidden>
			</div>
		);
	}

	renderTransferUnavailable() {
		const { transferStatus } = this.state;
		const { classes } = this.props;

		let explainer = (
			<Typography className={classes.backgroundText}>
				This ticket transfer has been cancelled or the transfer is no longer
				valid.
			</Typography>
		);

		let buttonLink = (
			<Link to={"/"}>
				<Button
					size={"mediumLarge"}
					variant={"whiteCTA"}
					style={{ width: "100%", marginTop: 40 }}
				>
					Find other events
				</Button>
			</Link>
		);

		if (transferStatus === "Completed") {
			explainer = (
				<div>
					<Typography className={classes.backgroundText}>
						This ticket transfer is no longer valid.
					</Typography>
					<br/>
					<Typography className={classes.backgroundTextSmall}>
						Contact the sender if you believe there was a mistake.
					</Typography>
				</div>
			);
		} else if (transferStatus === "Cancelled") {
			explainer = (
				<div>
					<Typography className={classes.backgroundText}>
						This ticket transfer has been cancelled.
					</Typography>
					<br/>
					<Typography className={classes.backgroundTextSmall}>
						Contact the sender if you believe there was a mistake.
					</Typography>
				</div>
			);
		} else if (transferStatus === "EventEnded") {
			explainer = (
				<div>
					<Typography className={classes.backgroundText}>
						We're sorry - this event has ended.
					</Typography>
					<br/>
					<Typography className={classes.backgroundTextSmall}>
						If you think this is a mistake, please contact Big Neon Customer
						Support.
					</Typography>
				</div>
			);

			buttonLink = (
				<Button
					href={Settings().submitSupportLink || Settings().appSupportLink}
					size={"mediumLarge"}
					variant={"whiteCTA"}
					style={{ width: "100%", marginTop: 40 }}
				>
					Support
				</Button>
			);
		}

		return (
			<div className={classes.unavailableContainer}>
				{explainer}
				{buttonLink}
			</div>
		);
	}

	renderContents() {
		const { isAuthenticated, transferAuth } = this.state;
		const { classes } = this.props;

		if (!transferAuth) {
			return (
				<Typography className={classes.backgroundText}>
					Invalid transfer link
				</Typography>
			);
		}

		if (isAuthenticated === null) {
			return <Loader/>;
		}

		const {
			eventName,
			eventImageUrl,
			eventAddress,
			eventDisplayTime,
			receiveSuccess,
			openedAppLink,
			transferStatus
		} = this.state;

		if (receiveSuccess) {
			return (
				<div>
					<Hidden smDown>
						<EventCardContainer
							title={
								"Transfer Accepted!" +
								"\n" +
								"Login to the app to view your tickets."
							}
							name={"Download the Big Neon App."}
							imageUrl={eventImageUrl}
							address={eventAddress}
							displayDate={eventDisplayTime}
						>
							<Typography className={classes.additionalText}>
								To receive a link to download the app enter your mobile number
								below.
							</Typography>
							<SMSLinkForm/>
						</EventCardContainer>
						<br/>
						<Typography className={classes.noAppText}>
							No app? No problem. Just show your ID at the door.
						</Typography>
					</Hidden>
					<Hidden smUp>
						<EventCardContainer
							title={
								"Transfer Accepted!" +
								"\n" +
								"Login to the app to view your tickets."
							}
							name={eventName}
							imageUrl={eventImageUrl}
							address={eventAddress}
							displayDate={eventDisplayTime}
						>
							<Button
								variant={"secondary"}
								style={{
									width: "80%",
									margin: "20px auto",
									display: "flex"
								}}
								onClick={this.handleViewTicketsClick}
							>
								View tickets
							</Button>
						</EventCardContainer>
						<br/>
						<Typography className={classes.noAppText}>
							No app? No problem. Just show your ID at the door.
						</Typography>
					</Hidden>
				</div>
			);
		}

		if (
			transferStatus === "Completed" ||
			transferStatus === "Cancelled" ||
			transferStatus === "EventEnded"
		) {
			return this.renderTransferUnavailable();
		}

		if (isAuthenticated === false) {
			return (
				<EventCardContainer
					title={this.title}
					name={eventName}
					imageUrl={eventImageUrl}
					address={eventAddress}
					displayDate={eventDisplayTime}
				>
					{this.renderAuthenticationOptions()}
				</EventCardContainer>
			);
		} else if (isAuthenticated === true && receiveSuccess === false) {
			return (
				<EventCardContainer
					title={this.title}
					name={eventName}
					imageUrl={eventImageUrl}
					address={eventAddress}
					displayDate={eventDisplayTime}
				>
					{this.renderCallToAction()}
				</EventCardContainer>
			);
		}

		if (openedAppLink === true && receiveSuccess === true)
			return (
				<EventCardContainer
					title={
						"Transfer Accepted!" +
						"\n" +
						"Login to the app to view your tickets."
					}
					name={eventName}
					imageUrl={eventImageUrl}
					address={eventAddress}
					displayDate={eventDisplayTime}
				>
					<Link to={"/"}>
						<Button
							size={"mediumLarge"}
							variant={"whiteCTA"}
							style={{ width: "100%", marginTop: 40 }}
						>
							Find other events
						</Button>
					</Link>
					<SMSLinkForm/>
				</EventCardContainer>
			);
	}

	render() {
		const { classes } = this.props;

		return (
			<TransferContainer>
				<div ref={this.scrollRef} className={classes.root}>
					{this.renderContents()}
				</div>
			</TransferContainer>
		);
	}
}

export default withStyles(styles)(ReceiveTransfer);
