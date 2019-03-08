mdb = require('mariadb');

const Settings = require('./Settings');

function SignlanguageDB() {
}

SignlanguageDB.db_add_signlanguage = function(name) {

    const pool = mdb.createPool({host: Settings.dbHost, user: Settings.dbUser, password: Settings.dbPassword, database: Settings.dbName ,connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO signlanguage (name) VALUES ('"+name+"')").then((res) => {
		conn.end();
		resolve("[db_add_signlanguage][success]");
		return;
	    }).catch(err => {
		//handle error
		conn.end();
		reject("[db_add_signlanguage][failure1]");
		return;
	    })

	}).catch(err => {
	    reject("[db_add_signlanguage][failure2]");
	    return;
	});

    });
}

module.exports = SignlanguageDB;

