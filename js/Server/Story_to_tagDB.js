mdb = require('mariadb');
moment = require('moment');

function Story_to_tagDB() {
}

Story_to_tagDB.db_add_story_to_tag = function(storyId,tagId) {

    tim=moment().valueOf();
    tim=tim/1000;

    console.log("[db_add_story_to_tag][storyId]["+storyId+"][tagId]["+tagId+"]");

    const pool = mdb.createPool({host: 'localhost', user:'root', password:'7l8n6OF#',connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO way.story_to_tag (storyId,tagId,datecreated) VALUES ("+storyId+","+tagId+","+tim+")").then((res) => {
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

