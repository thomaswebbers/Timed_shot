# Timed_shot
The code base for the timedshot server and Firefox addon


These are the steps to setup the environment and run it on Mac

1) Install database software
    Mac:    Install mysql brew install mysql  
            Sequel Ace go to the app store and download Sequel Ace

2) Setup database
    Create database table timed_shots using mysql
    Create table timed_shots_timed_shots
    Setup credentials in sequel ace detailed in app.js
        	host: 'localhost',
		    user: 'root',
		    database: 'timed_shots'
    Setup collumn names and datatypes
        time_stamp  VARCHAR
        note_text   TEXT
        image64     LONGTEXT

3) Create enviroment variables for:
    TIMED_SHOT_DB_HOST
    TIMED_SHOT_DB_NAME
    TIMED_SHOT_DB_USER

4) Install node.js
    npm install dotenv

5) Run server:
    node Timed_shot/Timed_shot_server/app.js

6) Enable browser action
    about:debugging in browser
    This firefox (this will navigate to emporary extensions)
    Select manifest.json from Timed_shot_browser_action


