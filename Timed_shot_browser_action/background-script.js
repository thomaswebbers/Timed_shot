const post_endpoint = 'http://localhost:3003/timed_shot_create';

async function postTimedShot(post_options) {
	console.log("Timed shot launches");
	const response = await fetch(post_endpoint, post_options);
	//console.log(response);
	const json_response = await response.json();
	console.log(json_response);
}

function shortcut_message() {
	console.log("background shortcut message hoi");



	browser.notifications.create({
		"type": "basic",
		"iconUrl": browser.extension.getURL("icons/timed_shot-48.png"),
		"title": "This is a title",
		"message": "Hello again from message, not listened"
	});
}

function onError(error) {
	console.error(`Error: ${error}`);
}


/**
 * Fired when a registered command is activated using a keyboard shortcut.
 *
 * In this extension, there is only one registered command: "Ctrl+Shift+E".
 * On Mac, this command will automatically be converted to "Command+Shift+E".
 */
browser.commands.onCommand.addListener(async (command) => {

	try {
		//first get info from browser
		shortcut_message();

		console.log("Before script complete");

		let tabs = await browser.tabs.query({
			currentWindow: true,
			active: true
		});

		let tab = tabs[0];


		let response = await browser.tabs.sendMessage(tab.id, {
			command: "activate_screenshot_script in background"
		});

		console.log("Message from the content script:");
		console.log(response.time_stamp);
		console.log(response.base64);
		console.log(response.note_text);

		let time_stamp = response.time_stamp;
		let image64 = response.image64;
		let note_text = response.note_text;

		let json_response_data = { time_stamp, image64, note_text }

		let post_options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(json_response_data)
		};


		postTimedShot(post_options);
	}
	catch (e) {
		console.log(e);
	}
});
