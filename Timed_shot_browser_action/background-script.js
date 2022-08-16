const post_endpoint = 'http://localhost:3003/timed_shot_create';

/*
const time_stamp = "Testing here some more 6:09";
const data = {time_stamp}

const post_options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify(data)
};
*/

async function postTimedShot(post_options) {
	console.log("Timed shot launches");
	const response = await fetch(post_endpoint, post_options);
	//console.log(response);
	const json_response = await response.json();
	console.log(json_response);	
}

function shortcut_message() {
  console.log("background shortcut message hoi");

  //var title = browser.i18n.getMessage("notificationTitle");
  //var content = browser.i18n.getMessage("notificationContent", message.url);

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
	
	/*
	fetch('http://localhost:3003', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then((response) => response.json())
	.then((data) => console.log(data))
	*/

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
			command: "activate_screenshot_script"
		});

		console.log("Message from the content script:");
		console.log(response.response);
		let time_stamp = response.response;

		let json_response_data = {time_stamp}
		
		let post_options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(json_response_data)
		};
		

		postTimedShot(post_options);
	}
	catch(e) {
		console.log(e);
	}
});
