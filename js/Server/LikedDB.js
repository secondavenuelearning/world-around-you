mdb = require('mariadb');
moment = require('moment');

function LikedDB() {
}

LikedDB.db_add_liked = function(storyId) {

    tim=moment().valueOf();
    tim=tim/1000;

    const pool = mdb.createPool({host: 'localhost', user:'root', password:'7l8n6OF#',connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO way.liked (storyId,datecreated) VALUES ("+storyId+","+tim+")").then((res) => {
		conn.end();
		resolve("[db_add_liked][success]");
		return;
	    }).catch(err => {
		//handle error
		conn.end();
		reject("[db_add_liked][failure1]");
		return;
	    })

	}).catch(err => {
	    reject("[db_add_liked][failure2]");
	    return;
	});

    });
}

module.exports = LikedDB;

