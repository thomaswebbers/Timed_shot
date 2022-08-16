(function() {
	/**
	* Check and set a global guard variable.
	* If this content script is injected into the same page again,
	* it will do nothing next time.
	*/
	if (window.hasRun) {
		return;
	}
	window.hasRun = true;


	function takeTimedShot(message) {
		getTimeStamp();
	}

	function getTimeStamp() {
		console.log("content script sending message");
		browser.runtime.sendMessage({"content": "test message"});

	//TODO get timestamp of YT vid elapsed
	}


	/*
	Add notifyExtension() as a listener to click events.
	*/
	//window.addEventListener("command", takeTimedShot);

	/**
	* Listen for messages from the background script.
	* Call takeTimedShot()
	*/
	browser.runtime.onMessage.addListener(async (message) => {
		console.log(message);
	let time_stamp;
	time_stamp = document.querySelector('.ytp-time-display .ytp-time-current');
	
	//Only happens in actual webpage, when browser is opened this does not happen
	if(time_stamp === null) {
		return {response: "No timestamp could be found"};
	}

	return{response: time_stamp.textContent};

	});
})();
