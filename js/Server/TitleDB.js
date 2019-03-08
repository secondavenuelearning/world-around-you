mdb = require('mariadb');

const Settings = require('./Settings');

function TitleDB() {
}

TitleDB.db_add_title = function(name,writtenlanguageId,storyId) {

    const pool = mdb.createPool({host: Settings.dbHost, user: Settings.dbUser, password: Settings.dbPassword, database: Settings.dbName ,connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO title (name,writtenlanguageId,storyId) VALUES ('"+name+"',"+writtenlanguageId+","+storyId+")").then((res) => {
		//console.log("[db_add_title][success]");
		//console.log(res);
		conn.end();
		resolve("[db_add_title][success]");
		return;
	    }).catch(err => {
		//console.log("[db_add_title][bad1]");
		//handle error
		conn.end();
		reject("[db_add_title][failure]");
		return;
	    })

	}).catch(err => {
	    //console.log("[db_add_title][bad2]");
	    reject("[db_add_title][failure]");
	    return;
	});

    });
}

module.exports = TitleDB;

