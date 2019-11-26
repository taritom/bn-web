import checkWebPFeature from "../helpers/checkWebPFeature";

let settings;

export const settingsFactory = () => {
	if (!settings) {
		let webUrl = process.env.REACT_APP_WEB_URL;
		if (webUrl.substring(webUrl.length - 1) == "/") {
			webUrl = webUrl.substring(0, webUrl.length - 1);
		}

		settings = {
			promoImageAspectRatio: 1920 / 1080,
			webPSupported: null, //Does the browser support next gen image formats
			webUrl,
			genericAppDownloadLink: process.env.REACT_APP_DOWNLOAD_APP,
			facebookLink: process.env.REACT_APP_FACEBOOK_URL,
			instagramLink: process.env.REACT_APP_INSTAGRAM_URL,
			twitterLink: process.env.REACT_APP_TWITTER_URL,
			appSupportLink: process.env.REACT_APP_SUPPORT_URL,
			supportFAQLink: process.env.REACT_APP_SUPPORT_FAQ_LINK,
			submitSupportLink: process.env.REACT_APP_NEW_SUPPORT_LINK,
			appStoreIos: process.env.REACT_APP_STORE_IOS,
			appStoreAndroid: process.env.REACT_APP_STORE_ANDROID
			//TODO add all process.env variables here
		};

		checkWebPFeature("lossy", isSupported => {
			settings.webPSupported = isSupported;
		});
	}

	return settings;
};

export default settingsFactory;
