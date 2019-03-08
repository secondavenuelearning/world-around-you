mdb = require('mariadb');

const Settings = require('./Settings');

function GenreDB() {
}

GenreDB.db_add_genre = function(name,writtenlanguageId) {

    const pool = mdb.createPool({host: Settings.dbHost, user: Settings.dbUser, password: Settings.dbPassword, database: Settings.dbName ,connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO genre (name,writtenlanguageId) VALUES ('"+name+"',"+writtenlanguageId+")").then((res) => {
		//console.log("[db_add_genre][success]");
		//console.log(res);
		conn.end();
		resolve("[db_add_genre][success]");
		return;
	    }).catch(err => {
		//console.log("[db_add_genre][bad1]");
		//handle error
		conn.end();
		reject("[db_add_genre][failure]");
		return;
	    })

	}).catch(err => {
	    //console.log("[db_add_genre][bad2]");
	    reject("[db_add_genre][failure]");
	    return;
	});

    });
}

module.exports = GenreDB;

