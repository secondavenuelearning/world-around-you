mdb = require('mariadb');

const Settings = require('./Settings');

function Story_to_tagDB() {
}

Story_to_tagDB.db_add_story_to_tag = function(storyId,tagId) {

    console.log("[db_add_story_to_tag][storyId]["+storyId+"][tagId]["+tagId+"]");

    const pool = mdb.createPool({host: Settings.dbHost, user: Settings.dbUser, password: Settings.dbPassword, database: Settings.dbName ,connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO story_to_tag (storyId,tagId) VALUES ("+storyId+","+tagId+")").then((res) => {
		conn.end();
		resolve("[db_add_story_to_tag][success]");
		return;
	    }).catch(err => {
		//handle error
		conn.end();
		reject("[db_add_story_to_tag][failure1]");
		return;
	    })

	}).catch(err => {
	    reject("[db_add_story_to_tag][failure2]");
	    return;
	});

    });
}

module.exports = Story_to_tagDB;

