import React, { Component } from "react";
import { withStyles } from "@material-ui/core";

import InputGroup from "../../../../common/form/InputGroup";
import Button from "../../../../elements/Button";
import user from "../../../../../stores/user";
import notifications from "../../../../../stores/notifications";
import { validPhone } from "../../../../../validators";
import Bigneon from "../../../../../helpers/bigneon";
import removePhoneFormatting from "../../../../../helpers/removePhoneFormatting";
import moment from "moment-timezone";
import SelectGroup from "../../../../common/form/SelectGroup";
import Grid from "@material-ui/core/Grid";
import Settings from "../../../../../config/settings";

const styles = theme => ({});

class OrganizationUpdate extends Component {
	constructor(props) {
		super(props);

		//Check if we're editing an existing organization
		this.state = {
			name: "",
			owner_user_id: "",
			phone: "",
			address: "",
			city: "",
			state: "",
			country: "United States",
			postal_code: "",
			timezone: moment.tz.guess(),
			errors: {},
			isSubmitting: false,
			showApiKeys: false,
			states: {}
		};
	}

	componentDidMount() {
		const { organizationId } = this.props;

		if (organizationId) {
			Bigneon()
				.organizations.read({ id: organizationId })
				.then(response => {
					const {
						owner_user_id,
						name,
						phone,
						address,
						city,
						state,
						country,
						postal_code,
						timezone
					} = response.data;

					this.setState({
						name: name || "",
						owner_user_id: owner_user_id || "",
						phone: phone || "",
						address: address || "",
						city: city || "",
						state: state || "",
						country: country || "",
						postal_code: postal_code || "",
						timezone: timezone || moment.tz.guess()
					});
				})
				.catch(error => {
					console.error(error);

					this.setState({ isSubmitting: false });
					notifications.showFromErrorResponse({
						defaultMessage: "Loading organization details failed.",
						error
					});
				});
		}

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

	validateFields() {
		//Don't validate every field if the user has not tried to submit at least once
		if (!this.submitAttempted) {
			return true;
		}

		const { name, address, eventFee, timezone } = this.state;
		const phone = removePhoneFormatting(this.state.phone);

		const errors = {};

		const required = [
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

		if (!name) {
			errors.name = "Missing organization name.";
		}

		if (!address) {
			errors.address = "Missing street address.";
		}

		if (!phone) {
			errors.phone = "Missing phone number.";
		} else if (!validPhone(phone)) {
			errors.phone = "Invalid phone number.";
		}

		this.setState({ errors });

		return Object.keys(errors).length <= 0;
	}

	createNewOrganization(params, onSuccess) {
		Bigneon()
			.organizations.create(params)
			.then(response => {
				const { id } = response.data;
				onSuccess(id);

				//After a new org is created, assume the user wants to select it
				user.loadAllPossibleOrgs();
				user.setCurrentOrganizationRolesAndScopes(id);
			})
			.catch(error => {
				console.error(error);
				this.setState({ isSubmitting: false });

				notifications.showFromErrorResponse({
					defaultMessage: "Create organization failed.",
					error
				});
			});
	}

	updateOrganization(id, params, onSuccess) {
		//Remove owner_user_id
		Bigneon()
			.organizations.update({ id, ...params })
			.then(() => {
				onSuccess(id);
			})
			.catch(error => {
				this.setState({ isSubmitting: false });

				notifications.showFromErrorResponse({
					defaultMessage: "Update organization failed.",
					error
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
			owner_user_id,
			name,
			phone,
			address,
			city,
			state,
			country,
			postal_code,
			timezone
		} = this.state;
		const { organizationId } = this.props;

		const orgDetails = {
			name,
			phone,
			address,
			city,
			state,
			country,
			postal_code,
			timezone
		};

		//If we're updating an existing org
		if (organizationId) {
			this.updateOrganization(organizationId, orgDetails, () => {
				this.setState({ isSubmitting: false });

				notifications.show({
					message: "Organization updated",
					variant: "success"
				});

				this.props.history.push(`/admin/organizations/${organizationId}`);
			});

			return;
		}

		//Got the user ID, now create the organization
		this.createNewOrganization(orgDetails, organizationId => {
			notifications.show({
				message: "Organization created",
				variant: "success"
			});

			this.setState({ isSubmitting: false }, () => {
				this.props.history.push(`/admin/organizations/${organizationId}`);
			});
		});
	}

	renderTimezones() {
		//TODO This is an exact duplicate of src/components/pages/admin/venues/Venue.js lets keep the code DRY
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
				label={"Timezone"}
				onBlur={this.validateFields.bind(this)}
				onChange={e => this.setState({ timezone: e.target.value })}
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

	render() {
		const {
			name,
			address = "",
			city = "",
			country = "",
			postal_code = "",
			phone,
			errors,
			isSubmitting
		} = this.state;

		const { organizationId } = this.props;

		return (
			<div>
				<form noValidate autoComplete="off" onSubmit={this.onSubmit.bind(this)}>
					<InputGroup
						error={errors.name}
						value={name}
						name="name"
						label="Organization name *"
						type="text"
						onChange={e => this.setState({ name: e.target.value })}
						onBlur={this.validateFields.bind(this)}
					/>

					<InputGroup
						error={errors.phone}
						value={phone}
						name="phone"
						label="Phone number *"
						type="phone"
						onChange={e => this.setState({ phone: e.target.value })}
						onBlur={this.validateFields.bind(this)}
					/>

					{this.renderTimezones()}

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

					<Button
						disabled={isSubmitting}
						type="submit"
						style={{ marginRight: 10, marginTop: 20 }}
						variant="callToAction"
					>
						{isSubmitting
							? organizationId
								? "Creating..."
								: "Updating..."
							: organizationId
								? "Update"
								: "Create"}
					</Button>
				</form>
			</div>
		);
	}
}

export default withStyles(styles)(OrganizationUpdate);
