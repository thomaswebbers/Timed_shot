'use strict';
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

	function make_screen_shot() {
		var canvas = document.createElement('canvas');
		var video = document.querySelector('.video-stream.html5-main-video');
		var ctx = canvas.getContext('2d');

		// Change the size here
		canvas.width = parseInt(video.offsetWidth);
		canvas.height = parseInt(video.offsetHeight);
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		canvas.crossOrigin = "anonymous";
		
		return canvas.toDataURL('image/jpeg');
	};

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
		var video = document.querySelector('.video-stream.html5-main-video');
		video.pause();

		let note_prompt = prompt("Write note here");
		video.play();
		//let note_prompt = "Dikke tieten kartoffel salad";
		let time_stamp;
		time_stamp = document.querySelector('.ytp-time-display .ytp-time-current');
	
		//Only happens in actual webpage, when browser is opened this does not happen
		if(time_stamp === null) {
			return {response: "No timestamp could be found"};
		}

		let image_html = make_screen_shot();
		console.log(image_html);

		if(image_html === null) {
			return {response: "No video could be found, or error getting base 64 image"};
		}

		return {
			time_stamp: time_stamp.textContent,
			image64: image_html,
			note_text: note_prompt
		};
	});
})();
