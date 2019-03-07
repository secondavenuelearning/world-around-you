mdb = require('mariadb');
moment = require('moment');

const Settings = require('./Settings');

function ViewDB() {
}

ViewDB.db_add_view = function(storyId) {

    tim=moment().valueOf();
    tim=tim/1000;

    const pool = mdb.createPool({host: Settings.dbHost, user: Settings.dbUser, password: Settings.dbPassword, database: Settings.dbName ,connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO view (storyId,datecreated) VALUES ("+storyId+","+tim+")").then((res) => {
		conn.end();
		resolve("[db_add_view][success]");
		return;
	    }).catch(err => {
		//handle error
		conn.end();
		reject("[db_add_view][failure1]");
		return;
	    })

	}).catch(err => {
	    reject("[db_add_view][failure2]");
	    return;
	});

    });
}

module.exports = ViewDB;

