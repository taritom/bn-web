import { observable, computed, action } from "mobx";
import moment from "moment";
import notifications from "./notifications";
import Bigneon from "../helpers/bigneon";
import {
	formatEventDataForInputs,
	formatEventDataForSaving
} from "../components/pages/admin/events/updateSections/Details";
import {
	formatArtistsForInputs,
	formatArtistsForSaving
} from "../components/pages/admin/events/updateSections/Artists";
import {
	formatTicketDataForInputs,
	formatTicketDataForSaving
} from "../components/pages/admin/events/updateSections/Tickets";

//TODO separate artists and ticketTypes into their own stores

const freshEvent = formatEventDataForInputs({});

class EventUpdate {
	@observable
	id = null;

	@observable
	organizationId = null;

	@observable
	event = freshEvent;

	@observable
	organization = {};

	@observable
	venue = {};

	@observable
	artists = [];

	@observable
	ticketTypes = [];

	@observable
	ticketTypeActiveIndex = null;

	@action
	loadDetails(id) {
		this.id = id;

		Bigneon()
			.events.read({ id })
			.then(response => {
				const { artists, organization, venue, ...event } = response.data;
				const { organization_id } = event;
				this.event = formatEventDataForInputs(event);
				this.artists = formatArtistsForInputs(artists);
				this.venue = venue;
				this.organizationId = organization_id;

				this.loadTicketTypes();
			})
			.catch(error => {
				console.error(error);
				let message = "Loading event details failed.";
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

	@action
	loadTicketTypes(ticket_types) {
		if (!this.id) {
			//No event yet, add one ticket by default
			this.addTicketType();
		}
		Bigneon()
			.events.ticketTypes.index({ event_id: this.id })
			.then(response => {
				const { data, paging } = response.data; //@TODO Implement pagination
				const ticket_types = data;

				let ticketTypes = [];
				if (ticket_types) {
					ticketTypes = formatTicketDataForInputs(ticket_types);
				}

				this.ticketTypes = ticketTypes;
				this.ticketTypeActiveIndex = ticketTypes.length - 1;

				//If there are no ticketType, add one
				if (this.ticketTypes.length < 1) {
					this.addTicketType();
				}
			})
			.catch(error => {
				console.error(error);

				let message = "Loading event ticket types failed.";
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

	@action
	addTicketType() {
		//const endDate = this.event.eventDate ? this.event.eventDate : new Date(); //FIXME this will most certainly not work. If a user changes the event date this first ticket type date needs to change.
		let ticketTypes = this.ticketTypes;
		const startDate = moment();
		const endDate = moment(this.event.eventDate).add(1, "days");

		const ticketType = {
			name: "",
			description: "",
			capacity: "",
			priceAtDoor: "",
			increment: 1,
			limitPerPerson: 10,
			startDate,
			endDate,
			pricing: [
				{
					id: "",
					ticketId: "", //TODO remove this if not needed
					name: "Default price point",
					startDate,
					endDate,
					value: ""
				}
			]
		};

		ticketTypes.push(ticketType);

		this.ticketTypes = ticketTypes;
		this.ticketTypeActiveIndex = ticketTypes.length - 1;
	}

	@action
	ticketTypeActivate(index) {
		this.ticketTypeActiveIndex = index;
	}

	@action
	updateTicketType(index, details) {
		let ticketTypes = this.ticketTypes;

		ticketTypes[index] = { ...ticketTypes[index], ...details };

		//On new events update the last pricing point to match the end date of the ticketType
		if (!this.id && details.hasOwnProperty("endDate")) {
			ticketTypes[index].pricing[
				ticketTypes[index].pricing.length - 1
			].endDate = moment(details.endDate);
		}

		this.ticketTypes = ticketTypes;
	}

	@action
	deleteTicketType(index) {
		let ticketTypes = this.ticketTypes;
		ticketTypes.splice(index, 1);
		this.ticketTypes = ticketTypes;
	}

	@action
	addTicketPricing(index) {
		let { ticketTypes } = this;

		let { pricing } = ticketTypes[index];
		let startDate = moment(ticketTypes[index].startDate);
		let endDate = moment(ticketTypes[index].endDate);

		if (pricing.length) {
			startDate = moment(pricing[pricing.length - 1].endDate);
			endDate = moment(ticketTypes[index].endDate);
		}

		pricing.push({
			id: "",
			ticketId: "",
			name: "",
			startDate,
			endDate,
			value: 0
		});

		ticketTypes[index].pricing = pricing;
		this.ticketTypes = ticketTypes;
	}

	@action
	removeTicketPricing(ticketTypeIndex, ticketPriceIndex) {
		let { ticketTypes } = this;

		let { pricing } = ticketTypes[ticketTypeIndex];
		pricing.splice(ticketPriceIndex, 1);

		ticketTypes[ticketTypeIndex].pricing = pricing;
		this.ticketTypes = ticketTypes;
	}

	@action
	updateEvent(eventDetails) {
		if (!this.id && eventDetails.hasOwnProperty("eventDate")) {
			eventDetails.showTime = moment(eventDetails.eventDate).set({
				hour: this.event.showTime.get("hour"),
				minute: this.event.showTime.get("minute"),
				second: this.event.showTime.get("second")
			});
		}

		this.event = { ...this.event, ...eventDetails };

		//If they're updating the ID, update the root var
		const { id } = eventDetails;
		if (id) {
			this.id = id;
		}
		//Only automatically propagate the eventDate to ticketTypes on new events
		if (!this.id && eventDetails.hasOwnProperty("showTime")) {
			const { showTime } = eventDetails;
			this.ticketTypes.forEach((ticketType, index) => {
				this.updateTicketType(index, { endDate: moment(showTime) });
			});
		}
	}

	@action
	updateOrganizationId(organizationId) {
		this.organizationId = organizationId;
	}

	@action
	updateArtists(artists) {
		this.artists = artists;
	}

	@action
	addArtist(id) {
		let artists = this.artists;
		artists.push({ id, setTime: null });
		this.artists = artists;
	}

	@action
	changeArtistSetTime(index, setTime) {
		let artists = this.artists;
		artists[index].setTime = setTime;
		this.artists = artists;
	}

	@action
	removeArtist(index) {
		let artists = this.artists;
		artists.splice(index, 1);
		this.artists = artists;
	}

	@action
	async saveEventDetails(onId = {}) {
		this.hasSubmitted = true;

		let id = this.id;
		const { artists, event, organizationId, ticketTypes } = this;

		const formattedEventDetails = formatEventDataForSaving(
			event,
			organizationId
		);

		if (id) {
			const saveEventResponse = await this.saveEvent({
				...formattedEventDetails,
				id
			});

			if (!saveEventResponse.result) {
				return saveEventResponse;
			}
		} else {
			const newEventResponse = await this.createNewEvent(formattedEventDetails);
			if (!newEventResponse.result) {
				return newEventResponse;
			}

			this.id = newEventResponse.result;
		}

		onId(this.id);

		if (artists && artists.length > 0) {
			const formattedArtists = formatArtistsForSaving(artists);

			const artistsResult = await this.saveArtists(formattedArtists);
			if (!artistsResult.result) {
				return artistsResult;
			}
		}

		const formattedTicketTypes = formatTicketDataForSaving(ticketTypes);
		for (let index = 0; index < formattedTicketTypes.length; index++) {
			const ticketType = formattedTicketTypes[index];
			const saveTicketResponse = await this.saveTicketType(ticketType);
			if (!saveTicketResponse.result) {
				return saveTicketResponse;
			}
		}

		return { result: true, error: false };
	}

	async saveEvent(params) {
		return new Promise(resolve => {
			Bigneon()
				.events.update({ ...params, id: this.id })
				.then(id => {
					resolve({ result: id, error: false });
				})
				.catch(error => {
					console.error(error);
					notifications.show({
						message: "Update event failed.",
						variant: "error"
					});
					resolve({ result: false, error });
				});
		});
	}

	async createNewEvent(params) {
		return new Promise(resolve => {
			Bigneon()
				.events.create(params)
				.then(response => {
					const { id } = response.data;
					resolve({ result: id, error: false });
				})
				.catch(error => {
					console.error(error);
					notifications.show({
						message: "Create event failed.",
						variant: "error"
					});
					resolve({ result: false, error });
				});
		});
	}

	async saveArtists(artistsToSave) {
		return new Promise(resolve => {
			Bigneon()
				.events.artists.update({ event_id: this.id, artists: artistsToSave })
				.then(() => {
					resolve({ result: true, error: false });
				})
				.catch(error => {
					console.error(error);
					notifications.show({
						message: "Updating artists failed.",
						variant: "error"
					});
					resolve({ result: false, error });
				});
		});
	}

	async saveTicketType(ticketType) {
		const { id } = ticketType;
		const event_id = this.id;
		if (!event_id) {
			return { result: false, error: "Event ID is not set yet" };
		}

		if (id) {
			return new Promise(resolve => {
				Bigneon()
					.events.ticketTypes.update({
						id,
						event_id,
						...ticketType
					})
					.then(() => {
						resolve({ result: id, error: false });
					})
					.catch(error => {
						console.error(error);
						resolve({ result: false, error });
					});
			});
		} else {
			return new Promise(resolve => {
				Bigneon()
					.events.ticketTypes.create({
						event_id,
						...ticketType
					})
					.then(result => {
						resolve({ result, error: false });
					})
					.catch(error => {
						console.error(error);
						resolve({ result: false, error });
					});
			});
		}
	}

	@action
	clearDetails() {
		this.id = null;
		this.event = freshEvent;
		this.artists = [];
		this.venue = {};
		this.organizationId = null;
		this.ticketTypes = [];
		this.ticketTypeActiveIndex = null;

		this.addTicketType();
	}
}

const eventUpdateStore = new EventUpdate();

export default eventUpdateStore;
