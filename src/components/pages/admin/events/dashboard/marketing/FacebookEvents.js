import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import classNames from "classnames";
import Bigneon from "../../../../../../helpers/bigneon";
import user from "../../../../../../stores/user";
import Loader from "../../../../../elements/loaders/Loader";
import SelectGroup from "../../../../../common/form/SelectGroup";
import Button from "../../../../../elements/Button";
import { FacebookButton } from "../../../../authentication/social/FacebookButton";
import { Grid, Divider } from "@material-ui/core";
import notification from "../../../../../../stores/notifications";
import {
	fontFamily,
	fontFamilyBold,
	fontFamilyDemiBold,
	secondaryHex
} from "../../../../../../config/theme";
import addressLineSplit from "../../../../../../helpers/addressLineSplit";
import { Link } from "react-router-dom";
import servedImage from "../../../../../../helpers/imagePathHelper";
import EventDetail from "../../../../events/EventDetail";
import { displayAgeLimit } from "../../../../../../helpers/ageLimit";
import moment from "moment-timezone";
import optimizedImageUrl from "../../../../../../helpers/optimizedImageUrl";
import MaintainAspectRatio from "../../../../../elements/MaintainAspectRatio";
import Settings from "../../../../../../config/settings";
import Hidden from "@material-ui/core/Hidden";
import lineBreakHtmlToPlainText from "../../../../../../helpers/lineBreakHtmlToPlainText";

const styles = theme => ({
	root: {},
	heading: {
		fontSize: 24,
		fontFamily: fontFamilyDemiBold,
		[theme.breakpoints.down("sm")]: {
			fontSize: 20,
			lineHeight: "22px"
		}
	},
	fbGrid: {
		display: "flex",
		flexDirection: "row"
	},
	pinkSpan: {
		color: secondaryHex
	},
	demiBoldSpan: {
		fontFamily: fontFamilyDemiBold
	},
	text: {},
	smallHeading: {
		fontSize: 22,
		fontFamily: fontFamilyDemiBold
	},
	numberPoint: {
		borderRadius: "50%",
		backgroundColor: "rgba(255, 32, 177, .12)",
		marginRight: theme.spacing.unit * 2,
		minWidth: 30,
		minHeight: 30,
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	mobileHeaderImage: {
		height: "100%",
		width: "100%",
		backgroundImage: "linear-gradient(255deg, #e53d96, #5491cc)",
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
		borderRadius: 5,
		backgroundPosition: "center",
		marginTop: theme.spacing.unit * 2,
		marginBottom: theme.spacing.unit * 2
	},
	pointText: {
		color: secondaryHex,
		lineHeight: "27px",
		marginTop: 3
	},
	noteList: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		marginTop: theme.spacing.unit * 2,
		alignItems: "flex-start"
	},
	capTitleSmall: {
		textTransform: "uppercase",
		fontFamily: fontFamilyDemiBold,
		fontSize: 14
	},
	inputStyle: {
		borderRadius: 10,
		display: "flex",
		width: "100%",
		padding: theme.spacing.unit,
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit * 2,
		border: "1px solid #8080802e",
		fontSize: 19,
		color: "#000",
		outline: "none"
	},
	inputLabel: {
		fontSize: 18,
		fontFamily: fontFamily
	},
	eventDetailsRow: {
		display: "flex",
		marginTop: theme.spacing.unit * 2
	},
	iconContainer: {
		flex: 1
	},
	icon: {
		width: 22,
		height: "auto"
	},
	eventDetailContainer: {
		paddingTop: 4,
		flex: 6
	},
	eventDetailText: {
		color: "#3C383F"
	},
	eventDetailBoldText: {
		font: "inherit",
		fontFamily: fontFamilyDemiBold
	},
	eventDetailLinkText: {
		font: "inherit",
		color: secondaryHex,
		cursor: "pointer"
	},
	divider: {
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit * 4
	}
});

function htmlToPlainText(s) {
	const span = document.createElement("span");
	span.innerHTML = s;
	return span.textContent || span.innerText;
}

class FacebookEvents extends Component {
	constructor(props) {
		super(props);

		this.state = {
			eventName: null,
			pages: [],
			pageId: null,
			facebookCategory: "MUSIC_EVENT",
			isSubmitting: false,
			facebookEventId: null,
			isFacebookLinked: false,
			description: "",
			notValid: true,
			title: "",
			customAddress: null,
			locationType: "UsePageLocation",
			facebookResponseSuccess: null,
			event: null
		};
		this.checkValid = this.checkValid.bind(this);
	}

	componentDidMount() {
		this.refreshPages(true);
		this.refreshEvent();
	}

	refreshEvent() {
		const { eventId } = this.props;

		Bigneon()
			.events.read({ id: eventId })
			.then(response => {
				this.setState({
					event: response.data,
					title: htmlToPlainText(response.data.name || ""),
					description: lineBreakHtmlToPlainText(
						response.data.additional_info || ""
					),
					customAddress: response.data.venue.address,
					facebookEventId: response.data.facebook_event_id
				});
				this.checkValid();
			})
			.catch(error => {
				console.error(error);
			});
	}

	onFacebookLogin() {
		this.refreshPages();
	}

	refreshPages(ignoreErrors) {
		this.setState({ isSubmitting: true });
		Bigneon()
			.external.facebook.pages()
			.then(response =>
				this.setState({
					pages: response.data,
					isFacebookLinked: true,
					isSubmitting: false,
					pageId: response.data[0].id
				})
			)
			.catch(error => {
				if (!ignoreErrors) {
					const { message, type } = error;
					notification.show({
						message,
						variant: type === "validation_error" ? "warning" : "error"
					});
					this.setState({ isFacebookLinked: false, isSubmitting: false });
				}
			});
	}

	onSubmit() {
		const {
			pageId,
			facebookCategory,
			description,
			locationType,
			customAddress,
			title
		} = this.state;
		this.setState({ isSubmitting: true });
		Bigneon()
			.external.facebook.createEvent({
				event_id: this.props.eventId,
				title: title,
				page_id: pageId,
				category: facebookCategory,
				description,
				location_type: locationType,
				custom_address: customAddress ? customAddress : null
			})
			.then(() => {
				this.refreshEvent();
				notification.show({
					message: "Event published to Facebook",
					variant: "success"
				});
			})
			.catch(error => {
				let { message } = error;
				const { type } = error;
				if (
					error.response &&
					error.response.data &&
					error.response.data.error
				) {
					message = error.response.data.error;
				}
				notification.show({
					message,
					variant: type === "validation_error" ? "warning" : "error"
				});
				this.setState({ isSubmitting: false });
			});
	}

	checkValid() {
		const { title, description } = this.state;
		if (title.length > 0 && description.length > 0) {
			this.setState({ notValid: false });
		} else if (
			title === null ||
			title.length < 1 ||
			description === null ||
			description.length < 1
		) {
			this.setState({ notValid: true });
		}
	}

	render() {
		const {
			pages,
			pageId,
			facebookCategory,
			isSubmitting,
			isFacebookLinked,
			facebookResponseSuccess,
			facebookEventId,
			title,
			event,
			description,
			notValid
		} = this.state;

		const { classes } = this.props;

		if (!event) {
			return null;
		}

		const ageLimitText = displayAgeLimit(event.age_limit);
		const displayEventStartDate = moment
			.utc(event.event_start)
			.tz(event.venue.timezone)
			.format("dddd, MMMM Do YYYY");
		const displayDoorTime = moment
			.utc(event.door_time)
			.tz(event.venue.timezone)
			.format("h:mm A");
		const promo_image_url = event.promo_image_url
			? optimizedImageUrl(event.promo_image_url)
			: null;

		const mobilePromoImageStyle = {};
		if (promo_image_url) {
			mobilePromoImageStyle.backgroundImage = `url(${promo_image_url})`;
		}

		let pageSubTitle = [
			{
				label1: "Increase your event's reach by",
				pinkSpan: "creating a Facebook event",
				label2: ". It's easy!"
			}
		];
		let bullet1 = {
			label:
				"A Facebook user with admin access to your Facebook page needs to give Big Neon permission to create the event.",
			link: null
		};
		let bullet2 = {
			label:
				"Don't worry, we won't create the event on Facebook until you review the settings and publish the event.",
			link: null
		};

		let bullet3 = {
			label:
				"Facebook requires that your page has a physical street address set in order to publish your event."
		};

		if (facebookEventId || facebookResponseSuccess) {
			pageSubTitle = {
				label1: "Your Event has been successfully created on Facebook",
				pinkSpan: null,
				label2: null
			};
			bullet1 = {
				label: "Need to edit your Facebook event?",
				link: `https://facebook.com/${facebookEventId}`
			};
			bullet2 = {
				label: "Need to delete your Facebook event?",
				link: `https://facebook.com/${facebookEventId}`
			};
			bullet3 = null;
		}

		return (
			<div>
				<Grid container justify={"space-between"}>
					<Grid item xs={11} sm={12} md={12} lg={12}>
						<Typography
							className={classNames({
								[classes.pinkSpan]: true,
								[classes.capTitleSmall]: true
							})}
						>
							marketing
						</Typography>
					</Grid>
					<Grid item xs={11} sm={6} md={5} lg={5}>
						<Typography className={classes.heading}>
							Create this Event on Facebook
						</Typography>
						<Typography>
							{pageSubTitle.label1}{" "}
							<span
								className={classNames({
									[classes.pinkSpan]: true,
									[classes.demiBoldSpan]: true
								})}
							>
								{pageSubTitle.pinkSpan}
							</span>
							{pageSubTitle.label2}
						</Typography>
					</Grid>

					<Grid item xs={11} sm={12} md={6} lg={6}>
						<Typography className={classes.smallHeading}>
							Please note:
						</Typography>

						<div className={classes.noteList}>
							<div className={classes.numberPoint}>
								<Typography className={classes.pointText}>1</Typography>
							</div>
							<Typography>
								{bullet1.label}&nbsp;
								{bullet1.link ? (
									<a
										className={classes.pinkSpan}
										target="_blank"
										href={bullet1.link}
									>
										Edit it on Facebook
									</a>
								) : null}
							</Typography>
						</div>
						<div className={classes.noteList}>
							<div className={classes.numberPoint}>
								<Typography className={classes.pointText}>2</Typography>
							</div>
							<Typography>
								{bullet2.label}&nbsp;
								{bullet2.link ? (
									<a
										className={classes.pinkSpan}
										target="_blank"
										href={bullet2.link}
									>
										Delete your Event on Facebook
									</a>
								) : null}
							</Typography>
						</div>
						{bullet3 ? (
							<div className={classes.noteList}>
								<div className={classes.numberPoint}>
									<Typography className={classes.pointText}>3</Typography>
								</div>
								<Typography>{bullet3.label}</Typography>
							</div>
						) : null}
					</Grid>
					{isFacebookLinked && !(facebookEventId || facebookResponseSuccess) ? (
						<Grid item xs={11} sm={12} md={12} lg={12}>
							<Grid item xs={11} sm={12} md={12} lg={12}>
								<Divider style={{ marginTop: 20, marginBottom: 40 }}/>
							</Grid>
							<Typography className={classes.smallHeading}>
								Select Facebook Page
							</Typography>
							{pages ? (
								<Grid item xs={11} sm={12} md={12} lg={12}>
									<Grid item xs={11} sm={12} md={6} lg={6}>
										<SelectGroup
											items={pages.map(page => ({
												value: page.id,
												name: page.name
											}))}
											value={pageId}
											name="pageId"
											onChange={e => this.setState({ pageId: e.target.value })}
										/>
									</Grid>
									<Grid item xs={11} sm={12} md={12} lg={12}>
										<Divider style={{ marginTop: 20, marginBottom: 40 }}/>
									</Grid>
								</Grid>
							) : (
								<span>Loading pages</span>
							)}
							<Grid
								container
								justify={"space-between"}
								className={classes.fbGrid}
							>
								<Grid item xs={11} sm={12} md={5} lg={5}>
									<Typography className={classes.smallHeading}>
										Event Details:
									</Typography>
									<form action="">
										<Typography className={classes.inputLabel}>
											Facebook title <span className={classes.pinkSpan}>*</span>
										</Typography>
										<input
											value={title}
											name="title"
											className={classes.inputStyle}
											type="text"
											onChange={e =>
												this.setState({ title: e.target.value }, () =>
													this.checkValid()
												)
											}
										/>
										<Typography className={classes.inputLabel}>
											Description <span className={classes.pinkSpan}>*</span>
										</Typography>
										<textarea
											value={description}
											name="description"
											className={classes.inputStyle}
											style={{ height: 200 }}
											onChange={e =>
												this.setState({ description: e.target.value }, () =>
													this.checkValid()
												)
											}
										/>
										<Typography className={classes.inputLabel}>
											Facebook Event Category
										</Typography>
										<SelectGroup
											items={[{ value: "MUSIC_EVENT", name: "Music Event" }]}
											value={this.state.facebookCategory}
											name="facebookCategory"
											onChange={e =>
												this.setState({ facebookCategory: e.target.value })
											}
										/>
									</form>
									{facebookEventId || facebookResponseSuccess ? (
										<a
											target="_blank"
											href={`https://www.facebook.com/${facebookEventId}`}
										>
											<Button
												size="large"
												type="submit"
												variant="callToAction"
												disabled={isSubmitting}
											>
												View on Facebook
											</Button>
										</a>
									) : (
										<Button
											size="large"
											type="submit"
											variant="callToAction"
											onClick={this.onSubmit.bind(this)}
											disabled={isSubmitting || notValid}
										>
											Add event to Facebook
										</Button>
									)}
								</Grid>
								{event ? (
									<Grid item xs={11} sm={12} md={5} lg={5}>
										<br/>
										<br/>
										<Typography className={classes.inputLabel}>
											Event information
										</Typography>
										<MaintainAspectRatio
											aspectRatio={Settings().promoImageAspectRatio}
										>
											<div
												className={classes.mobileHeaderImage}
												style={mobilePromoImageStyle}
											/>
										</MaintainAspectRatio>
										<EventDetail
											classes={classes}
											iconUrl={"/icons/events-black.svg"}
										>
											<Typography className={classes.eventDetailText}>
												<span className={classes.eventDetailBoldText}>
													{displayEventStartDate}
												</span>
												<br/>
												Doors open at {displayDoorTime}
												<br/>
												{ageLimitText}
											</Typography>
										</EventDetail>
										<EventDetail
											classes={classes}
											iconUrl={"/icons/location-black.svg"}
										>
											<Typography className={classes.eventDetailBoldText}>
												{event.venue.name}
												<br/>
												{addressLineSplit(event.venue.address)}
											</Typography>
											<br/>
										</EventDetail>
									</Grid>
								) : null}
							</Grid>
						</Grid>
					) : facebookEventId || facebookResponseSuccess ? (
						<a
							target="_blank"
							href={`https://www.facebook.com/${facebookEventId}`}
						>
							<Button size="large" type="submit" variant="callToAction">
								View on Facebook
							</Button>
						</a>
					) : (
						<div>
							<FacebookButton
								scopes={["manage_pages"]}
								linkToUser={true}
								onSuccess={this.onFacebookLogin.bind(this)}
							/>
						</div>
					)}
				</Grid>
			</div>
		);
	}
}

FacebookEvents.propTypes = {
	classes: PropTypes.object.isRequired,
	eventId: PropTypes.string.isRequired
};

export default withStyles(styles)(FacebookEvents);
