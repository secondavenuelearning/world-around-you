mdb = require('mariadb');

const Settings = require('./Settings');

function Story_to_genreDB() {
}

Story_to_genreDB.db_add_story_to_genre = function(storyId,genreId) {

    console.log("[db_add_story_to_genre][storyId]["+storyId+"][genreId]["+genreId+"]");

    const pool = mdb.createPool({host: Settings.dbHost, user: Settings.dbUser, password: Settings.dbPassword, database: Settings.dbName ,connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO story_to_genre (storyId,genreId) VALUES ("+storyId+","+genreId+")").then((res) => {
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

