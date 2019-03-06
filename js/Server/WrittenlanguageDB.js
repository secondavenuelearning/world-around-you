mdb = require('mariadb');
moment = require('moment');

function WrittenlanguageDB() {
}

WrittenlanguageDB.db_add_writtenlanguage = function(name) {

    tim=moment().valueOf();
    tim=tim/1000;

    const pool = mdb.createPool({host: 'localhost', user:'root', password:'7l8n6OF#',connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO way.writtenlanguage (name,datecreated) VALUES ('"+name+"',"+tim+")").then((res) => {
		conn.end();
		resolve("[db_add_writtenlanguage][success]");
		return;
	    }).catch(err => {
		//handle error
		conn.end();
		reject("[db_add_writtenlanguage][failure1]");
		return;
	    })

	}).catch(err => {
	    reject("[db_add_writtenlanguage][failure2]");
	    return;
	});

    });
}

module.exports = WrittenlanguageDB;

