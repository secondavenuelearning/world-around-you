mdb = require('mariadb');

const Settings = require('./Settings');

function TagDB() {
}

TagDB.db_add_tag = function(name,writtenlanguageId) {

    const pool = mdb.createPool({host: Settings.dbHost, user: Settings.dbUser, password: Settings.dbPassword, database: Settings.dbName ,connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO tag (name,writtenlanguageId) VALUES ('"+name+"',"+writtenlanguageId+")").then((res) => {
		//console.log("[db_add_tag][success]");
		//console.log(res);
		conn.end();
		resolve("[db_add_tag][success]");
		return;
	    }).catch(err => {
		//console.log("[db_add_tag][bad1]");
		//handle error
		conn.end();
		reject("[db_add_tag][failure]");
		return;
	    })

	}).catch(err => {
	    //console.log("[db_add_tag][bad2]");
	    reject("[db_add_tag][failure]");
	    return;
	});

    });
}

module.exports = TagDB;

