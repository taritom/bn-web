import ReactGA from "react-ga";
import user from "../stores/user";

const ga = {
	name: "ga",
	// true if GA has been initialized at least once
	enabled: false,
	disabledWarning:
		"No Google analytics key provided. Google Analytics is disabled.",
	primaryKey: "",
	secondaryKey: "",

	addTrackingKey(key) {
		if (!this.primaryKey) {
			this.primaryKey = key;

			//First GA key added
			ReactGA.initialize(key);
		} else if (!this.secondaryKey) {
			this.secondaryKey = key;

			ReactGA.initialize(key, {
				gaOptions: {
					name: "secondaryKey"
				},
				debug: false
			});

			//Needs a delay after initializing the secondary api key.
			//Primary key would have already tracked a page hit at this point
			setTimeout(() => {
				const uri = window.location.pathname + window.location.search;

				ReactGA.pageview(uri, ["secondaryKey"]);
			}, 500);
		}
		// Load the enhanced ecommerce plugin
		ReactGA.plugin.require("ec");
		this.enabled = true;

		if (window[`ga-disable-${key}`]) {
			delete window[`ga-disable-${key}`];
		}
	},

	pageView() {
		const uri = window.location.pathname + window.location.search;

		ReactGA.pageview(uri);

		if (this.secondaryKey) {
			ReactGA.pageview(uri, ["secondaryKey"]);
		}
	},

	removeTrackingKey(key) {
		window[`ga-disable-${key}`] = true;

		if (key === this.primaryKey) {
			this.primaryKey = "";
		}

		if (key === this.secondaryKey) {
			this.secondaryKey = "";
		}
	},

	track(category, action, data) {
		//TODO track for all key names
		ReactGA.ga("send", "event", category, action, data);

		if (this.secondaryKey) {
			ReactGA.ga("secondaryKey.send", "event", category, action, data);
		}
	},

	viewContent(ids, urlParams, eventName, organizationId, category) {
		ids.forEach(id => {
			ReactGA.plugin.execute("ec", "addProduct", {
				id: id,
				name: eventName,
				brand: organizationId,
				category: category
			});
		});

		ReactGA.plugin.execute("ec", "setAction", "detail");

		ReactGA.ga("send", "pageview");
	},

	addImpressions(eventList, listName) {
		eventList.forEach((eventInfo, index) => {
			ReactGA.plugin.execute("ec", "addImpression", {
				id: eventInfo.id,
				name: eventInfo.name,
				category: eventInfo.event_type,
				brand: eventInfo.organization_id,
				list: listName,
				position: index + 1
			});
		});

		ReactGA.ga("send", "pageview");
	},

	eventClick(id, name, category, organizationId, listPosition, list) {
		ReactGA.plugin.execute("ec", "addProduct", {
			id: id,
			name: name,
			category: category,
			brand: organizationId,
			position: listPosition
		});

		ReactGA.plugin.execute("ec", "setAction", "click", {
			list: list
		});

		ReactGA.ga("send", "event", "UX", "click", "Results");
	},

	initiateCheckout(ids, urlParams, currency, items, value) {
		if (items && Array.isArray(items)) {
			items.forEach(item => {
				ReactGA.plugin.execute("ec", "addProduct", {
					id: item.id,
					name: item.name,
					category: item.category,
					brand: item.organizationId,
					variant: item.ticketTypeName,
					price: item.price,
					quantity: item.quantity
				});
			});
		}

		ReactGA.plugin.execute("ec", "setAction", "checkout", { step: 1 });
		ReactGA.ga("send", "pageview");
	},

	purchaseCompleted(ids, urlParams, currency, items, value) {
		if (items && Array.isArray(items)) {
			items.forEach(item => {
				ReactGA.plugin.execute("ec", "addProduct", {
					id: item.id,
					name: item.name,
					category: item.category,
					brand: item.organizationId,
					variant: item.ticketTypeName,
					price: item.price,
					quantity: item.quantity
				});
			});
		}

		ReactGA.plugin.execute("ec", "setAction", "purchase", {});
	},

	identify(user) {
		// https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id#user_id
		ReactGA.set("userId", user.id);
		ReactGA.ga("send", "event", "authentication", "user-id available");

		if (this.secondaryKey) {
			ReactGA.ga(
				"secondaryKey.send",
				"event",
				"authentication",
				"user-id available"
			);
		}
	},

	trackLoadTime(milliseconds) {
		ReactGA.timing({
			category: "Initial Load",
			variable: "load",
			value: milliseconds, // in milliseconds
			label: "First component mount"
		});
	}
};

const gtag = {
	name: "gtag",
	gtag: null,
	enabled: true,
	id: "",
	labels: [],
	addTrackingKey(providerOptions) {
		window.dataLayer = window.dataLayer || [];
		this.gtag = function() {
			window.dataLayer.push(arguments);
		};
		this.gtag("js", new Date());

		this.gtag("config", providerOptions.id);
		this.id = providerOptions.id;
		this.labels = providerOptions.labels;
		this.enabled = true;
	},
	removeTrackingKey(id) {
		this.id = null;
		this.labels = [];
		this.enabled = false;
		this.gtag = null;
	},
	purchaseCompleted(ids, urlParams, currency, items, value) {
		this.labels.forEach(label => {
			this.gtag("event", "conversion", {
				send_to: `${this.key}/${label}`,
				value,
				currency,
				transaction_id: ids

			});
		});
	}
};

const bigneon = {
	name: "bigneon",
	enabled: true,
	addTrackingKey(baseUrl) {
		this.baseUrl = baseUrl;
	},
	track(data) {
		const uri = encodeURIComponent(
			window.location.pathname + window.location.search
		);

		const img = document.createElement("img");
		img.height = 0;
		img.width = 0;
		img.style.display = "block";
		// Use Google analytics to get a unique id per
		// client

		const baseUrl = this.baseUrl;

		const trackingData = user.getCampaignTrackingData();
		let clientId = trackingData.clientId || "";
		let source = trackingData["utm_source"] || "";
		let medium = trackingData["utm_medium"] || "";

		if (ReactGA && ReactGA.ga()) {
			ReactGA.ga()(function(tracker) {
				clientId = tracker.get("clientId") || clientId;
				source = source || tracker.get("source") || "";
				medium = medium || tracker.get("medium") || "";
			});
		}

		const referrer = trackingData.referrer || document.referrer;
		const nonce = Math.random()
			.toString(36)
			.substr(2, 5);
		img.src =
			baseUrl +
			`/a/t?n=${nonce}&url=${uri}&client_id=${clientId}&source=${source}&medium=${medium}&referrer=${referrer}&` +
			data;
		document.body.insertBefore(img, document.body.firstChild);
	},
	eventClick(id, name, category, organizationId, listPosition, list) {
		this.track("event_id=" + id);
	},
	pageView() {
		// No tracking without an event id
	},
	viewContent(ids, urlParams, eventName, organizationId, category) {
		this.track(`event_id=${ids}`);
	}
};

const facebook = {
	keys: [],
	name: "facebook",
	enabled: false,
	loaded: false,

	load() {
		// Facebook snippet
		/* eslint-disable */
		!(function(f, b, e, v, n, t, s) {
			if (f.fbq) return;
			n = f.fbq = function() {
				n.callMethod
					? n.callMethod.apply(n, arguments)
					: n.queue.push(arguments);
			};
			if (!f._fbq) f._fbq = n;
			n.push = n;
			n.loaded = !0;
			n.version = "2.0";
			n.queue = [];
			t = b.createElement(e);
			t.async = !0;
			t.src = v;
			s = b.getElementsByTagName(e)[0];
			s.parentNode.insertBefore(t, s);
		})(
			window,
			document,
			"script",
			"https://connect.facebook.net/en_US/fbevents.js"
		);
		/* eslint-enable */

		// Script creates an array queue which will resolve calls once the script is loaded
		// so this can be marked as loaded synchronously
		this.loaded = true;
	},

	addTrackingKey(key) {
		if (!this.loaded) {
			this.load();
		}

		// Support for multiple pixel ids: https://developers.facebook.com/docs/facebook-pixel/advanced/#multipixels
		window.fbq("init", key);
		this.keys.push(key);

		this.enabled = true;
	},

	removeTrackingKey(key) {
		const index = this.keys.indexOf(key);
		if (index > -1) {
			this.keys.splice(index, 1);
		}
	},

	pageView() {
		this.keys.forEach(k => {
			window.fbq("trackSingle", k, "PageView");
		});
	},

	track(type, data) {
		this.keys.forEach(k => {
			window.fbq("trackSingle", k, type, data);
		});
	},

	identify(user) {
		this.keys.forEach(k => {
			window.fbq("setUserProperties", k, user);
		});
	},

	viewContent(ids, urlParams) {
		this.track("ViewContent", {
			content_ids: ids,
			eventref: urlParams["fb_oea"]
		});
	},

	initiateCheckout(ids, urlParams, currency, items, value) {
		this.track("InitiateCheckout", {
			content_ids: ids,
			currency,
			num_items: items.length,
			value,
			content_type: "product",
			eventref: urlParams["fb_oea"]
		});
	},

	purchaseCompleted(ids, urlParams, currency, items, value) {
		this.track("Purchase", {
			content_ids: ids,
			currency,
			num_items: items.length,
			value,
			content_type: "product",
			eventref: urlParams["fb_oea"]
		});
	}
};

const segment = {
	name: "segment",
	enabled: false,
	disabledWarning: "No Segment write key given. Segment is disabled.",
	referrer: "",

	load(key) {
		if (this.segment) {
			// Already loaded - cannot be invoked twice
			return;
		}

		const analytics = (this.segment = []);

		if (analytics.initialize) {
			return;
		}

		// A list of the methods in Analytics.js to stub.
		analytics.methods = [
			"trackSubmit",
			"trackClick",
			"trackLink",
			"trackForm",
			"pageview",
			"identify",
			"reset",
			"group",
			"track",
			"ready",
			"alias",
			"debug",
			"page",
			"once",
			"off",
			"on"
		];

		// Define a factory to create stubs. These are placeholders
		// for methods in Analytics.js so that you never have to wait
		// for it to load to actually record data. The `method` is
		// stored as the first argument, so we can replay the data.
		analytics.factory = function(method) {
			return function() {
				const args = Array.prototype.slice.call(arguments);
				args.unshift(method);
				analytics.push(args);
				return analytics;
			};
		};

		// For each of our methods, generate a queueing stub.
		for (let i = 0; i < analytics.methods.length; i++) {
			const key = analytics.methods[i];
			analytics[key] = analytics.factory(key);
		}

		// Define a method to load Analytics.js from our CDN,
		// and that will be sure to only ever load it once.
		analytics.load = function(key, options) {
			return new Promise((resolve, _reject) => {
				// Create an async script element based on your key.
				const script = document.createElement("script");
				script.type = "text/javascript";
				script.async = true;
				script.src =
					"https://cdn.segment.com/analytics.js/v1/" +
					key +
					"/analytics.min.js";
				script.onload = () => {
					resolve();
				};

				// Insert our script next to the first script element.
				const first = document.getElementsByTagName("script")[0];
				first.parentNode.insertBefore(script, first);
				analytics._loadOptions = options;
			});
		};

		// Add a version to keep track of what's in the wild.
		analytics.SNIPPET_VERSION = "4.1.0";

		// Load Analytics.js with your key, which will automatically
		// load the tools you've enabled for your account. Boosh!
		return analytics.load(key);
	},

	addTrackingKey(key) {
		if (!this.loaded) {
			this.loaded = true; // Assume loading succeeds
			this.load(key);
			this.pageView();
			this.enabled = true;
		} else {
			console.warn(
				"Implementation of segment currently does not support multiple segment keys"
			);
		}
	},

	removeTrackingKey(_key) {
		console.warn("removeTrackingKey is no supported by Segment");
	},

	pageView() {
		const { location } = window;
		this.segment.page({
			path: location.pathname,
			referrer: this.referrer,
			search: location.search,
			url: location.href
		});

		//For next page track
		this.referrer = window.location.href;
	},

	track(event, properties, options, callback) {
		this.segment.track(event, properties, options, callback);
	},

	identify({ id, firstName, lastName, email, method }) {
		this.segment.identify(id, { firstName, lastName, email });

		//If this function is called from login/sign up it needs additional tracking functions
		switch (method) {
			case "login":
				this.segment.track("Signed In");
				break;
			case "signup":
				this.segment.track("Signed Up");
				break;
		}
	}
};

const providers = [facebook, ga, segment, bigneon, gtag];

const init = () => {
	const providerOptions = {
		ga: process.env.REACT_APP_GOOGLE_ANALYTICS_KEY,
		segment: process.env.REACT_APP_SEGMENT_KEY,
		bigneon: process.env.REACT_APP_BIGNEON_ANALYTICS_URL,
		gtag: null
	};

	Object.keys(providerOptions).forEach(k => {
		const opts = providerOptions[k];

		addTrackingKey(k, opts);
	});
};

const addTrackingKey = (providerName, options) => {
	const provider = getProvider(providerName);
	if (!provider) {
		console.error(`No analytics provider named '${providerName}'`);
		return;
	}

	// If falsey option passed the provider is disabled
	if (!options) {
		console.warn(
			provider.disabledWarning ||
				`Tracking for ${providerName} has been disabled.`
		);
		return;
	}

	provider.addTrackingKey(options);
};

const removeTrackingKey = (providerName, key) => {
	const provider = getProvider(providerName);
	if (!provider) {
		console.error(`No analytics provider named '${providerName}'`);
		return;
	}

	provider.removeTrackingKey(key);
};

const getProvider = name => providers.find(p => p.name === name);

const page = (...args) => {
	const enabledProviders = providers.filter(p => p.enabled);
	enabledProviders.forEach(p => p.pageView ? p.pageView(...args) : {});
};

// Identify for all enabled analytics providers
// @param user object {id, firstName, lastName, email, method}
const identify = user => {
	const enabledProviders = providers.filter(p => p.enabled);
	enabledProviders.forEach(p => (p.identify ? p.identify(user) : null));
};

//Track load times if a provider has the `trackLoadTime` function
const trackPageLoadTime = milliseconds => {
	const enabledProviders = providers.filter(p => p.enabled);
	enabledProviders.forEach(p =>
		p.trackLoadTime ? p.trackLoadTime(milliseconds) : null
	);
};

const addImpressions = (eventList, listName) => {
	const enabledProviders = providers.filter(p => p.enabled);
	enabledProviders.forEach(p => {
		if (p.addImpressions) {
			p.addImpressions(eventList, listName);
		}
	});
};

const eventClick = (id, name, category, organizationId, listPosition, list) => {
	const enabledProviders = providers.filter(p => p.enabled);
	enabledProviders.forEach(p => {
		if (p.eventClick) {
			p.eventClick(id, name, category, organizationId, listPosition, list);
		}
	});
};

const viewContent = (ids, urlParams, eventName, organizationName, category) => {
	const enabledProviders = providers.filter(p => p.enabled);
	enabledProviders.forEach(p => {
		if (p.viewContent) {
			p.viewContent(ids, urlParams, eventName, organizationName, category);
		}
	});
};

const initiateCheckout = (ids, urlParams, currency, items, value) => {
	const enabledProviders = providers.filter(p => p.enabled);
	enabledProviders.forEach(p => {
		if (p.initiateCheckout) {
			p.initiateCheckout(ids, urlParams, currency, items, value);
		}
	});
};

const purchaseCompleted = (ids, urlParams, currency, items, value) => {
	const enabledProviders = providers.filter(p => p.enabled);
	enabledProviders.forEach(p => {
		if (p.purchaseCompleted) {
			p.purchaseCompleted(ids, urlParams, currency, items, value);
		}
	});
};
export default {
	init,
	addTrackingKey,
	addImpressions,
	eventClick,
	removeTrackingKey,
	page,
	identify,
	trackPageLoadTime,
	initiateCheckout,
	purchaseCompleted,
	viewContent
};
