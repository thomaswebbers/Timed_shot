console.log('Start data-fetch script');

const entry_container = 'entry-container';

const get_users_endpoint = 'http://localhost:3003/timed_shots';
const get_options = {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json'
	},
}

let fetched_entries;
let download_button = document.getElementById('download-image-button');
	
function generateHtmlEntryBlock(fetched_entries){
	let container = document.getElementById(entry_container);

	fetched_entries.forEach(element => {
		let time_stamp = element.time_stamp;
		let imageURI = element.image64;
		let note_text = element.note_text;
		console.log(time_stamp);

		//Creating the entry
		console.log(element);
		let entry = document.createElement("div");
		entry.classList.add('entry');

		//Time stamp
		let time_stamp_para = document.createElement("p");
		let time_stamp_div = document.createElement("div");
		time_stamp_div.className = "entry-time-stamp";
		let time_stamp_node = document.createTextNode(time_stamp);
		time_stamp_para.appendChild(time_stamp_node);
		time_stamp_div.appendChild(time_stamp_para);
		entry.appendChild(time_stamp_div);

		//container.appendChild(entry.appendChild(para.appendChild(text_node)));


		//Image
		let img = document.createElement("img");
		let img_div = document.createElement("div");
		img_div.className = "entry-image";
		img.src = imageURI;
		img_div.appendChild(img);
		entry.appendChild(img_div);

		//Note text
		let note_para = document.createElement("p");
		let note_div = document.createElement("div");
		note_div.className = "entry-note";
		let note_node = document.createTextNode(note_text);
		note_para.appendChild(note_node);
		note_div.appendChild(note_para);
		entry.appendChild(note_div);


		//Add entry to container
		container.appendChild(entry);

		
	});
}

//Calls users GET async
getUsers()
.catch(error => {
	console.error(error);
});

async function getUsers() {
	const response = await fetch(get_users_endpoint, get_options);
	const json_response = await response.json();
	fetched_entries = json_response.entries;
	//console.log(typeof(fetched_entries));
	console.log(fetched_entries);
	console.log(fetched_entries[0]);

	generateHtmlEntryBlock(fetched_entries);
}

download_button.addEventListener("click", () => {
	console.log("Button does click");

	fetched_entries.forEach(element => {
		var image = element.image64;
		var a = document.createElement('a');
		a.href = image;
		a.download = image; 
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	})

	//might need to use interval if its too many images for now without interval to prevent a slowdown
	/*
	var i = 0;
	var id = setInterval( function() {

		if ( i >= fetched_entries.length ) {
		clearInterval( id );
		return;
		}

	console.log(fetched_entries);	

	var image = fetched_entries[i++];
	i++;
	var a = document.createElement('a');
	console.log( image )
	a.href = image.src
	a.download = image.src
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);

	})
	*/
})