mdb = require('mariadb');
moment = require('moment');

function GenreDB() {
}

GenreDB.db_add_genre = function(name,writtenlanguageId) {

    tim=moment().valueOf();
    tim=tim/1000;
    //console.log("[time]["+tim+"]");

    const pool = mdb.createPool({host: 'localhost', user:'root', password:'7l8n6OF#',connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO way.genre (name,writtenlanguageId,datecreated) VALUES ('"+name+"',"+writtenlanguageId+","+tim+")").then((res) => {
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

