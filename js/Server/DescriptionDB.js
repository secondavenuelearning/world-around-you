mdb = require('mariadb');
moment = require('moment');

function DescriptionDB() {
}

DescriptionDB.db_add_description = function(name,writtenlanguageId,storyId) {

    tim=moment().valueOf();
    tim=tim/1000;

    const pool = mdb.createPool({host: 'localhost', user:'root', password:'7l8n6OF#',connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO way.description (name,writtenlanguageId,storyId,datecreated) VALUES ('"+name+"',"+writtenlanguageId+","+storyId+","+tim+")").then((res) => {
		conn.end();
		resolve("[db_add_description][success]");
		return;
	    }).catch(err => {
		//handle error
		conn.end();
		reject("[db_add_description][failure]");
		return;
	    })

	}).catch(err => {
	    reject("[db_add_description][failure]");
	    return;
	});

    });
}

module.exports = DescriptionDB;

