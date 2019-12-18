//testing netlify
import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import moment from "moment-timezone";

import InputGroup from "../../../common/form/InputGroup";
import SelectGroup from "../../../common/form/SelectGroup";
import Button from "../../../elements/Button";
import notifications from "../../../../stores/notifications";
import Bigneon from "../../../../helpers/bigneon";
import { validPhone } from "../../../../validators";
import PageHeading from "../../../elements/PageHeading";
import removePhoneFormatting from "../../../../helpers/removePhoneFormatting";
import cloudinaryWidget from "../../../../helpers/cloudinaryWidget";
import Settings from "../../../../config/settings";
import user from "../../../../stores/user";

const styles = theme => ({
	paper: {
		padding: theme.spacing.unit,
		marginBottom: theme.spacing.unit
	},
	venueImage: {
		width: "100%",
		height: 300,
		backgroundRepeat: "no-repeat",
		backgroundSize: "50% 50%",
		borderRadius: theme.shape.borderRadius
	}
});

class Venue extends Component {
	constructor(props) {
		super(props);

		//Check if we're editing an existing venue
		let venueId = null;
		if (props.match && props.match.params && props.match.params.id) {
			venueId = props.match.params.id;
		}

		this.state = {
			venueId,
			imageUrl: "",
			name: "",
			address: "",
			city: "",
			state: "",
			country: "United States",
			postal_code: "",
			place_id: "",
			phone: "",
			organizationId: "",
			timezone: moment.tz.guess(),
			organizations: null,
			errors: {},
			isSubmitting: false,
			showManualEntry: false,
			regionOptions: null,
			regionId: "none",
			states: []
		};
	}

	componentDidMount() {
		const { venueId } = this.state;

		if (venueId) {
			Bigneon()
				.venues.read({ id: venueId })
				.then(response => {
					const {
						name,
						address,
						city,
						country,
						state,
						postal_code,
						phone,
						region_id,
						promo_image_url,
						timezone
					} = response.data;

					this.setState({
						name: name || "",
						address: address || "",
						city: city || "",
						country: country || "",
						state: state || "",
						postal_code: postal_code || "",
						phone: phone || "",
						regionId: region_id || "none",
						imageUrl: promo_image_url,
						timezone: timezone || moment.tz.guess()
					});
				})
				.catch(error => {
					console.error(error);
					this.setState({ isSubmitting: false });

					notifications.showFromErrorResponse({
						defaultMessage: "Loading venue details failed.",
						error
					});
				});
		}

		Bigneon()
			.regions.index()
			.then(response => {
				const { data, paging } = response.data; //@TODO Implement pagination

				const regionOptions = [{ value: "none", label: "No Region" }].concat(
					data.map(r => ({
						value: r.id,
						label: r.name
					}))
				);

				this.setState({ regionOptions });
			})
			.catch(error => {
				console.error(error);
				notifications.showFromErrorResponse({
					defaultMessage: "Loading regions failed.",
					error
				});
			});
		Bigneon()
			.organizations.index()
			.then(response => {
				const { data, paging } = response.data; //@TODO Implement pagination
				this.setState({ organizations: data });
			})
			.catch(error => {
				console.error(error);

				notifications.showFromErrorResponse({
					defaultMessage: "Loading organizations failed.",
					error
				});
			});

		fetch(Settings().webUrl + "/countries.json")
			.then(response => response.json())
			.then(
				(result) => {
					const states = [];
					result.forEach(country => {
						if (country.name === "United States") {
							Object.keys(country.province_codes).forEach(code => {
								states.push({
									value: country.province_codes[code],
									label: code + " (" + country.province_codes[code] + ")"
								});
							});
						}
					});
					this.setState({ states });
				},
				(error) => {
					console.error(error);

					notifications.showFromErrorResponse({
						defaultMessage: "Loading states failed.",
						error
					});
				}
			);
	}

	uploadWidget() {
		cloudinaryWidget(
			result => {
				const imgResult = result[0];
				const { secure_url } = imgResult;
				this.setState({ imageUrl: secure_url });
			},
			error => {
				console.error(error);

				notifications.show({
					message: "Image failed to upload.",
					variant: "error"
				});
			},
			["venue-images"],
			{
				cropping: true,
				cropping_coordinates_mode: "custom",
				cropping_aspect_ratio: 2.0
			}
		);
	}

	createNewVenue(params, onSuccess) {
		Bigneon()
			.venues.create(params)
			.then(response => {
				const { id } = response.data;
				onSuccess(id);
			})
			.catch(error => {
				console.error(error);
				this.setState({ isSubmitting: false });

				let message = "Create venue failed.";
				if (
					error.response &&
					error.response.data &&
					error.response.data.error
				) {
					message = error.response.data.error;
				}

				notifications.show({
					message,
					variant: "error"
				});
			});
	}

	updateVenue(id, params, onSuccess) {
		Bigneon()
			.venues.update({ ...params, id })
			.then(() => {
				onSuccess(id);
			})
			.catch(error => {
				console.error(error);
				this.setState({ isSubmitting: false });

				let message = "Update venue failed.";
				if (
					error.response &&
					error.response.data &&
					error.response.data.error
				) {
					message = error.response.data.error;
				}

				notifications.show({
					message,
					variant: "error"
				});
			});
	}

	onSubmit(e) {
		e.preventDefault();

		this.submitAttempted = true;

		if (!this.validateFields()) {
			this.setState({ showManualEntry: true });
			return false;
		}

		const {
			venueId,
			regionId,
			name,
			organizationId,
			phone,
			address,
			city,
			state,
			country,
			place_id,
			postal_code,
			timezone,
			latitude = null,
			longitude = null,
			imageUrl
		} = this.state;

		const venueDetails = {
			region_id: regionId === "none" ? undefined : regionId,
			name,
			phone,
			address,
			city,
			state,
			country,
			postal_code,
			google_place_id: place_id,
			latitude,
			longitude,
			promo_image_url: imageUrl,
			timezone
		};

		//If we're updating an existing venue
		if (venueId) {
			this.updateVenue(venueId, venueDetails, id => {
				notifications.show({
					message: "Venue updated",
					variant: "success"
				});

				this.props.history.push("/admin/venues");
			});

			return;
		}

		this.createNewVenue(
			{ ...venueDetails, organization_id: organizationId },
			id => {
				notifications.show({
					message: "Venue created",
					variant: "success"
				});

				this.props.history.push("/admin/venues");
			}
		);
	}

	renderOrganizations() {
		const { organizationId, organizations, errors } = this.state;
		if (organizations === null) {
			return <Typography variant="body1">Loading organizations...</Typography>;
		}

		const organizationOptions = organizations.map(organization => ({
			value: organization.id,
			label: organization.name
		}));

		return (
			<SelectGroup
				value={organizationId}
				items={organizationOptions}
				error={errors.organizationId}
				name={"organization"}
				label={"Organization *"}
				onChange={e => this.setState({ organizationId: e.target.value })}
			/>
		);
	}

	renderTimezones() {
		const { timezone, errors } = this.state;
		const timezones = moment.tz.names().map(name => ({
			value: name,
			label: name
		}));
		return (
			<SelectGroup
				value={timezone}
				items={timezones}
				error={errors.timezone}
				name={"timezone"}
				label={"Timezone *"}
				onBlur={this.validateFields.bind(this)}
				onChange={e => this.setState({ timezone: e.target.value })}
			/>
		);
	}

	renderRegions() {
		const { regionId, regionOptions, errors } = this.state;

		if (regionOptions === null) {
			return <Typography variant="body1">Loading regions...</Typography>;
		}

		return (
			<SelectGroup
				value={regionId}
				items={regionOptions}
				error={errors.regionId}
				name={"region"}
				label={"Region"}
				onChange={e => this.setState({ regionId: e.target.value })}
			/>
		);
	}

	renderStates() {
		const { state, states, errors } = this.state;

		return (
			<SelectGroup
				value={state}
				items={states}
				error={errors.state}
				name={"state"}
				label={"State *"}
				onChange={e => this.setState({ state: e.target.value })}
			/>
		);
	}

	validateFields() {
		//Don't validate every field if the user has not tried to submit at least once
		if (!this.submitAttempted) {
			return null;
		}

		const { organizationId, venueId } = this.state;
		const phone = removePhoneFormatting(this.state.phone);

		const errors = {};
		const required = [
			"name",
			"address",
			"city",
			"state",
			"country",
			"postal_code",
			"timezone"
		];
		required.forEach(field => {
			if (!this.state[field]) {
				errors[field] = `Missing ${field}.`;
			}
		});

		if (!venueId) {
			if (!organizationId) {
				errors.organizationId = "Select an organization.";
			}
		}

		if(phone){
			if (!validPhone(phone)) {
				errors.phone = "Invalid phone number.";
			}
		}

		this.setState({ errors });

		return Object.keys(errors).length <= 0;
	}

	render() {
		const {
			venueId,
			imageUrl,
			name,
			phone,
			errors,
			isSubmitting,
			address = "",
			city = "",
			postal_code = "",
			country = ""
		} = this.state;

		const { classes } = this.props;

		return (
			<div>
				<PageHeading iconUrl="/icons/venues-active.svg">
					Venue details
				</PageHeading>

				<Grid container spacing={24}>
					<Grid item xs={12} sm={10} lg={8}>
						<Card className={classes.paper}>
							<form
								noValidate
								autoComplete="off"
								onSubmit={this.onSubmit.bind(this)}
							>
								<CardContent>
									<CardMedia
										className={classes.venueImage}
										image={imageUrl || "/icons/venues-gray.svg"}
										title={name}
									/>
									<Button
										style={{ width: "100%" }}
										onClick={this.uploadWidget.bind(this)}
									>
										Upload image
									</Button>

									<InputGroup
										error={errors.name}
										value={name}
										name="name"
										label="Venue name *"
										type="text"
										onChange={e => this.setState({ name: e.target.value })}
										onBlur={this.validateFields.bind(this)}
									/>
									{!venueId ? this.renderOrganizations() : null}
									{this.renderTimezones()}
									{this.renderRegions()}
									<InputGroup
										error={errors.phone}
										value={phone}
										name="phone"
										label="Phone number"
										type="phone"
										onChange={e => this.setState({ phone: e.target.value })}
										onBlur={this.validateFields.bind(this)}
									/>
									<InputGroup
										error={errors.address}
										value={address}
										name="address"
										label="Street address *"
										type="text"
										onChange={e => this.setState({ address: e.target.value })}
										onBlur={this.validateFields.bind(this)}
									/>
									<Grid container spacing={24}>
										<Grid item xs={12} sm={3}>
											<InputGroup
												error={errors.city}
												value={city}
												name="city"
												label="City *"
												type="text"
												onChange={e => this.setState({ city: e.target.value })}
												onBlur={this.validateFields.bind(this)}
											/>
										</Grid>
										<Grid item xs={12} sm={3}>
											{this.renderStates()}
										</Grid>
										<Grid item xs={12} sm={3}>
											<InputGroup
												error={errors.postal_code}
												value={postal_code}
												name="postal_code"
												label="Zip *"
												type="text"
												onChange={e => this.setState({ postal_code: e.target.value })}
												onBlur={this.validateFields.bind(this)}
											/>
										</Grid>
										<Grid item xs={12} sm={3}>
											<InputGroup
												error={errors.country}
												value={country}
												name="country"
												label="Country *"
												type="text"
												onChange={e => this.setState({ country: e.target.value })}
												onBlur={this.validateFields.bind(this)}
												disabled={!user.isSuper}
											/>
										</Grid>
									</Grid>
								</CardContent>

								<CardActions>
									<Button
										disabled={isSubmitting}
										type="submit"
										variant="callToAction"
									>
										{isSubmitting
											? venueId
												? "Creating..."
												: "Updating..."
											: venueId
												? "Update"
												: "Create"}
									</Button>
								</CardActions>
							</form>
						</Card>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles)(Venue);
