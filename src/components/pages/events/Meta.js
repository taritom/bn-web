import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import Settings from "../../../config/settings";
import { dollars } from "../../../helpers/money";
import optimizedImageUrl from "../../../helpers/optimizedImageUrl";
import moment from "moment-timezone";

const URL_DATE_FORMAT = moment.HTML5_FMT.DATETIME_LOCAL_MS;
//Reference: https://github.com/nfl/react-helmet
const structuredEventData = (
	{
		venue,
		artists,
		type,
		id,
		name,
		additional_info,
		promo_image_url,
		event_start,
		event_end,
		ticket_types,
		publish_date,
		...event
	},
	ticketSelectionUrl
) => {
	const { timezone } = venue || {};
	const offers = [];
	if (ticket_types) {
		ticket_types.forEach(tt => {
			const { status, ticket_pricing, start_date } = tt;

			if (ticket_pricing && status === "Published") {
				let availability;

				//Not all of our ticket status translate to the 'availability' field
				//Reference: https://schema.org/ItemAvailability/
				switch (status) {
					case "Published":
						availability = "InStock";
						break;
					case "TicketsAtTheDoor":
						availability = "InStoreOnly";
						break;
					case "SoldOut":
						availability = "SoldOut";
						break;
					case "OffSale":
						availability = "OutOfStock";
						break;
					case "OnSaleSoon":
					case "UseAccessCode":
					case "Free":
					case "Rescheduled":
					case "Cancelled":
					case "Ended":
					default:
						availability = false;
				}

				if (availability) {
					const { price_in_cents } = ticket_pricing;
					let startDate = moment
						.utc(start_date || publish_date, URL_DATE_FORMAT)
						.tz(timezone);
					if (startDate < moment.utc("1900-01-02T00:00:00")) {
						startDate = moment.utc(publish_date, URL_DATE_FORMAT).tz(timezone);
					}

					startDate = startDate.format();

					offers.push({
						"@type": "Offer",
						url: ticketSelectionUrl,
						price: price_in_cents ? dollars(price_in_cents, true, "") : "",
						priceCurrency: "USD",
						availability,
						validFrom: startDate
					});
				}
			}
		});
	}

	const startDate = moment
		.utc(event_start, URL_DATE_FORMAT)
		.tz(timezone)
		.format();
	const endDate = moment
		.utc(event_end, URL_DATE_FORMAT)
		.tz(timezone)
		.format();
	const result = {
		"@context": "https://schema.org",
		"@type": "Event",
		name,
		description:
			additional_info ||
			"Big Neon - Mobile-first event ticketing. We’re relentlessly focused on serving the needs of independent live music promoters.",
		startDate,
		endDate,
		location: {
			"@type": "Place",
			name: venue.name,
			address: {
				"@type": "PostalAddress",
				streetAddress: venue.address,
				addressLocality: venue.city,
				postalCode: venue.postal_code,
				addressRegion: venue.state,
				addressCountry: venue.country
			}
		},
		image: [promo_image_url],
		performer: artists.map(({ artist }) => ({
			"@type": "MusicGroup",
			name: artist.name
		}))
	};

	offers.length > 0 ? (result.offers = offers) : null;

	return result;
};

const structuredBreadcrumbData = (
	name,
	landingUrl,
	eventUrl,
	ticketSelectionUrl = ""
) => {
	const itemListElement = [
		{
			"@type": "ListItem",
			position: 1,
			name: "Concert Tickets",
			item: landingUrl
		},
		{
			"@type": "ListItem",
			position: 2,
			name: name,
			item: eventUrl
		}
	];

	//If we're on the ticket selection page, it's 3 breadcrumbs deep
	if (ticketSelectionUrl) {
		itemListElement.push({
			"@type": "ListItem",
			position: 3,
			name: `Buy tickets - ${name}`,
			item: ticketSelectionUrl
		});
	}

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement
	};
};

const Meta = props => {
	const {
		venue,
		artists,
		type,
		id,
		name,
		additional_info,
		promo_image_url,
		doorTime,
		showTime,
		organization,
		event_start,
		event_end,
		ticket_types,
		slug,
		...event
	} = props;

	const landingUrl = Settings().webUrl;
	const slugEventUrl = `${landingUrl}/tickets/${slug}`;
	const ticketSelectionUrl = `${slugEventUrl}/tickets`;

	const promoImageUrl = promo_image_url
		? optimizedImageUrl(promo_image_url)
		: `${landingUrl}/site/images/bigneon-screen-app.png`;

	let googleStructuredData;
	let googleBreadcrumbData;

	let cutDesc = "";
	if (additional_info) {
		cutDesc = additional_info.slice(0, 100);
	}

	const formattedDate = moment
		.utc(event_start)
		.tz(venue.timezone)
		.format("dddd, MMMM Do YYYY");

	const headlineArtist = artists.find(artist => artist.importance === 0);
	const headliner = headlineArtist ? headlineArtist.artist.name : null;

	const { name: organizationName = "" } = organization || {};

	let title = headliner
		? `${headliner} Tickets to ${organizationName} in ${venue.city} - Big Neon`
		: `${name} in ${venue.city} - Big Neon`;

	const sameText = `in ${
		venue.city
	} - ${formattedDate} - Doors ${doorTime}, Show ${showTime}`;

	const description = headliner
		? `${name} - ${headliner} Tickets and ${headliner} Concert Tickets to ${organizationName} ${sameText}`
		: `${name} - Tickets to ${organizationName} ${sameText}`;

	//If they're at a later stage of the event checkout, adjust title accordingly
	switch (type) {
		case "eventView":
			googleStructuredData = structuredEventData(props, ticketSelectionUrl);
			googleBreadcrumbData = structuredBreadcrumbData(
				name,
				landingUrl,
				slugEventUrl,
				""
			);
			break;
		case "selection":
			title = `Buy tickets - ${title}`;
			googleStructuredData = structuredEventData(props, ticketSelectionUrl);
			googleBreadcrumbData = structuredBreadcrumbData(
				name,
				landingUrl,
				slugEventUrl,
				ticketSelectionUrl
			);

			break;
		case "checkout":
			title = `Checkout - ${title}`;
			break;
		case "success":
			title = `Success - ${title}`;
			break;
		default:
			title = `${title}`;
	}

	return (
		<Helmet
			title={title}
			meta={[
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					property: "og:url",
					content: slugEventUrl
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:image",
					content: promoImageUrl
				},
				{
					name: "twitter:site",
					content: "bigneon.com"
				},
				{
					name: "twitter:creator",
					content: "bigneon"
				},
				{
					name: "twitter:title",
					content: title
				},
				{
					name: "twitter:image",
					content: promoImageUrl
				},
				{
					name: "description",
					content: description
				}
			]}
			link={[
				{
					rel: "canonical",
					href: slugEventUrl
				},
				{
					rel: "image_src",
					href: promoImageUrl
				}
			]}
		>
			{googleBreadcrumbData ? (
				<script type="application/ld+json">
					{JSON.stringify(googleBreadcrumbData)}
				</script>
			) : null}
			{googleStructuredData ? (
				<script type="application/ld+json">
					{JSON.stringify(googleStructuredData)}
				</script>
			) : null}
		</Helmet>
	);
};

Meta.propTypes = {
	type: PropTypes.oneOf(["eventView", "selection", "checkout", "success"])
		.isRequired,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	additional_info: PropTypes.string,
	promo_image_url: PropTypes.string,
	event_start: PropTypes.string.isRequired,
	event_end: PropTypes.string.isRequired,
	venue: PropTypes.object.isRequired,
	artists: PropTypes.array.isRequired
};

export default Meta;
