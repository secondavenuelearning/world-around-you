mdb = require('mariadb');
moment = require('moment');

const Settings = require('./Settings');

function Story_to_signlanguageDB() {
}

Story_to_signlanguageDB.db_add_story_to_signlanguage = function(storyId,signlanguageId) {

    tim=moment().valueOf();
    tim=tim/1000;

    console.log("[db_add_story_to_signlanguage][storyId]["+storyId+"][signlanguageId]["+signlanguageId+"]");

    const pool = mdb.createPool({host: Settings.dbHost, user: Settings.dbUser, password: Settings.dbPassword, database: Settings.dbName ,connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO story_to_signlanguage (storyId,signlanguageId,datecreated) VALUES ("+storyId+","+signlanguageId+","+tim+")").then((res) => {
		conn.end();
		resolve("[db_add_story_to_signlanguage][success]");
		return;
	    }).catch(err => {
		//handle error
		conn.end();
		reject("[db_add_story_to_signlanguage][failure1]");
		return;
	    })

	}).catch(err => {
	    reject("[db_add_story_to_signlanguage][failure2]");
	    return;
	});

    });
}

module.exports = Story_to_signlanguageDB;

