import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";

import Bigneon from "../../../../../../helpers/bigneon";
import user from "../../../../../../stores/user";
import Loader from "../../../../../elements/loaders/Loader";
import SelectGroup from "../../../../../common/form/SelectGroup";
import Button from "../../../../../elements/Button";
import { FacebookButton } from "../../../../authentication/social/FacebookButton";
import Grid from "@material-ui/core/Grid";
import notification from "../../../../../../stores/notifications";
import InputGroup from "../../../../../common/form/InputGroup";

const styles = theme => ({
	root: {}
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
			customAddress: null,
			locationType: "UsePageLocation"
		};
	}

	componentDidMount() {
		const { eventId } = this.props;

		this.refreshPages(true);
		Bigneon()
			.events.read({ id: eventId })
			.then(response => {
				this.setState({
					description: htmlToPlainText(response.data.additional_info || ""),
					customAddress: response.data.venue.address,
					facebookEventId: response.data.facebook_event_id
				});
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
			customAddress
		} = this.state;
		this.setState({ isSubmitting: true });
		Bigneon()
			.external.facebook.createEvent({
				event_id: this.props.eventId,
				page_id: pageId,
				category: facebookCategory,
				description,
				location_type: locationType,
				custom_address: locationType === "CustomAddress" ? customAddress : null
			})
			.then(response => {
				this.setState({ isSubmitting: false, isFacebookLinked: true });
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

	render() {
		const {
			pages,
			pageId,
			facebookCategory,
			isSubmitting,
			isFacebookLinked,
			facebookEventId,
			description,
			locationType,
			customAddress
		} = this.state;

		return (
			<div>
				<Grid container>
					<Grid item xs={12} sm={6} md={6} lg={6}>
						<h1>Create Facebook Event</h1>
						<p>
							Increase your event's reach by{" "}
							<strong>creating a Facebook event</strong>. It's easy!
						</p>
						{isFacebookLinked ? (
							<div>
								<p>Select Facebook Page</p>
								{pages ? (
									<SelectGroup
										items={pages.map(page => ({
											value: page.id,
											name: page.name
										}))}
										value={pageId}
										name="pageId"
										onChange={e => this.setState({ pageId: e.target.value })}
									/>
								) : (
									<span>Loading pages</span>
								)}
								<p>Facebook Event Category</p>
								<SelectGroup
									items={[{ value: "MUSIC_EVENT", name: "Music Event" }]}
									value={facebookCategory}
									name="facebookCategory"
									onChange={e =>
										this.setState({ facebookCategory: e.target.value })
									}
								/>

								<InputGroup
									value={description}
									name="description"
									label="Description *"
									type="text"
									onChange={e => this.setState({ description: e.target.value })}
								/>

								<p>Address</p>
								<p>
									<em>
										You must have set up a street address on your Facebook page
										to use it as a location
									</em>
								</p>
								<SelectGroup
									items={[
										{
											name: "Use Facebook page's location",
											value: "UsePageLocation"
										},
										{ name: "Custom address", value: "CustomAddress" }
									]}
									value={locationType}
									name="locationType"
									onChange={e =>
										this.setState({ locationType: e.target.value })
									}
								/>
								<InputGroup
									value={customAddress}
									name="customAddress"
									label="Address *"
									type="text"
									disabled={locationType === "UsePageLocation"}
									onChange={e =>
										this.setState({ customAddress: e.target.value })
									}
								/>
								<Button
									size="large"
									type="submit"
									variant="callToAction"
									onClick={this.onSubmit.bind(this)}
									disabled={isSubmitting}
								>
									Publish
								</Button>
							</div>
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
					<Grid item xs={12} sm={12} md={6} lg={6}>
						<h2>Please Note:</h2>
						<ul>
							<li>
								A user with admin privileges for your Facebook page needs to
								give Big Neon permission to create the event
							</li>
							<li>
								Don't worry, we won't create the event until you review the
								settings and tell us to
							</li>
						</ul>
					</Grid>
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
