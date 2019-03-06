mdb = require('mariadb');
moment = require('moment');

function StoryDB() {
}

StoryDB.db_add_story = function(author,descriptionId,coverimage,visible,data) {

    console.log("[db_add_story][author]["+author+"][descriptionId]["+descriptionId+"][coverimage]["+coverimage+"][visible]["+visible+"][data]["+data+"]");

    tim=moment().valueOf();
    tim=tim/1000;

    const pool = mdb.createPool({host: 'localhost', user:'root', password:'7l8n6OF#',connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO way.story (author,descriptionId,coverimage,visible,data,datecreated) VALUES ('"+author+"',"+descriptionId+",'"+coverimage+"',"+visible+",'"+data+"',"+tim+")").then((res) => {
		conn.end();
		resolve("[db_add_story][success]");
		return;
	    }).catch(err => {
		//handle error
		conn.end();
		reject("[db_add_story][failure1]");
		return;
	    })

	}).catch(err => {
	    reject("[db_add_story][failure2]");
	    return;
	});

    });
}

module.exports = StoryDB;

