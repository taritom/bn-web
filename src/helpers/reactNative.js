export const isReactNative = () => {
	return !!window.ReactNativeWebView;
};

export const sendMessage = (message) => {
	if (!isReactNative()) {
		console.warn("Not in embedded environment, please check `isReactNative()` first");
		return;
	}
	return window.ReactNativeWebView.postMessage(JSON.stringify(message), "*");
};

export const bindReactNativeMessageBridge = (callback) => {
	if (!isReactNative()) {
		return;
	}

	window.addEventListener("message", callback, false);
};
