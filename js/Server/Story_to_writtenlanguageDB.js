mdb = require('mariadb');
moment = require('moment');

const Settings = require('./Settings');

function Story_to_writtenlanguageDB() {
}

Story_to_writtenlanguageDB.db_add_story_to_writtenlanguage = function(storyId,writtenlanguageId) {

    tim=moment().valueOf();
    tim=tim/1000;

    console.log("[db_add_story_to_writtenlanguage][storyId]["+storyId+"][writtenlanguageId]["+writtenlanguageId+"]");

    const pool = mdb.createPool({host: Settings.dbHost, user: Settings.dbUser, password: Settings.dbPassword, database: Settings.dbName ,connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO story_to_writtenlanguage (storyId,writtenlanguageId,datecreated) VALUES ("+storyId+","+writtenlanguageId+","+tim+")").then((res) => {
		conn.end();
		resolve("[db_add_story_to_writtenlanguage][success]");
		return;
	    }).catch(err => {
		//handle error
		conn.end();
		reject("[db_add_story_to_writtenlanguage][failure1]");
		return;
	    })

	}).catch(err => {
	    reject("[db_add_story_to_writtenlanguage][failure2]");
	    return;
	});

    });
}

module.exports = Story_to_writtenlanguageDB;

