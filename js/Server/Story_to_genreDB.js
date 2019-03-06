mdb = require('mariadb');
moment = require('moment');

const Settings = require('./Settings');

function Story_to_genreDB() {
}

Story_to_genreDB.db_add_story_to_genre = function(storyId,genreId) {

    tim=moment().valueOf();
    tim=tim/1000;

    console.log("[db_add_story_to_genre][storyId]["+storyId+"][genreId]["+genreId+"]");

    const pool = mdb.createPool({host: Settings.dbHost, user: Settings.dbUser, password: Settings.dbPassword, database: Settings.dbName ,connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO story_to_genre (storyId,genreId,datecreated) VALUES ("+storyId+","+genreId+","+tim+")").then((res) => {
		conn.end();
		resolve("[db_add_story_to_genre][success]");
		return;
	    }).catch(err => {
		//handle error
		conn.end();
		reject("[db_add_story_to_genre][failure1]");
		return;
	    })

	}).catch(err => {
	    reject("[db_add_story_to_genre][failure2]");
	    return;
	});

    });
}

module.exports = Story_to_genreDB;

