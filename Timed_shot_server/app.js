const express = require('express')
const res = require('express/lib/response')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql2')
const cors = require('cors')
const dotenv = require('dotenv').config(); // This MUST be at the very top of the file

app.use(express.json({limit: "16mb"}))

app.use(cors())

//TODO add back in later when extension ready to ship
/*app.use(
	cors ({
		//origin: "null",
		//origin: "*",
		//todo change to proper origin when live
		origin: "moz-extension://d07f1e99-96a0-4934-8ff4-1ce222c06d0d",
		method: ["GET", "POST"],
	})
)
*/

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))

app.use(morgan('short'))

app.use(express.static('./public'))


//============= API CALLS ===============

const timed_shots_database = "timed_shots"

function getConnection() 
{
	return mysql.createConnection({
		host: process.env.TIMED_SHOT_DB_HOST,
		user: process.env.TIMED_SHOT_DB_USER,
		database: process.env.TIMED_SHOT_DB_NAME
	})
}

app.get("/", (req, res) => {
	console.log("Received GET request on root, nothing to be send")

	res.send({
		"Response": "Hello from server timed shot API"
	})
})

//TODO broken path fix later
app.get("/timed_shots", (req, res) => {
	console.log("Received GET request for ALL timed shot entries")

	const queryString = "SELECT * FROM " + timed_shots_database
	getConnection().query(queryString, (err, rows, fields ) => {
		if (err) {
			console.log("Failed to query for all entries: " + err)
			res.sendStatus(500)
			res.end()
			return
		}

		if (rows.length == 0) {
			console.log("Failed to return any data, make sure your query is correct")
			res.sendStatus(404)
			res.end()
			return
		}

		res.json({
			status: "Success!!!",
			entries: rows 
		})
	})
})

//Todo change to match appropriate body with screenshot and maybe text
app.post("/timed_shot_create", (req, res) => {
	console.log("Received POST request");
	const data = req.body;
	console.log(data);

	const timeStamp = data.time_stamp
	const imageEncoded = data.image64
	const noteText = data.note_text;

	console.log(timeStamp);
	console.log(imageEncoded);
	console.log(noteText);

	const queryString = "INSERT INTO " + timed_shots_database + " (time_stamp, image64, note_text) VALUES (?, ?, ?)"
	getConnection().query(queryString, [timeStamp, imageEncoded, noteText], (err, results, fields) => {
		if (err) {
			console.log("Failed to insert a new entry: " + err)
			res.sendStatus(500)
			return
		}

		//res.header("Access-Control-Allow-Origin", "moz-extension://d07f1e99-96a0-4934-8ff4-1ce222c06d0d");

		res.json({
			status: "Success!!!",
			time_stamp: timeStamp,
			base64: imageEncoded,
			note_text: noteText
		})
	

		console.log("Inserted a new timed shot entry with id:  ", results.insertId)
	})
})

app.listen(3003, () => {
	console.log(process.env)
	console.log("Timed shot app server is up and listening on 3003...")
})
