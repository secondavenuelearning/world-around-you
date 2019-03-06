mdb = require('mariadb');
moment = require('moment');

function TitleDB() {
}

TitleDB.db_add_title = function(name,writtenlanguageId,storyId) {

    tim=moment().valueOf();
    tim=tim/1000;
    //console.log("[time]["+tim+"]");

    const pool = mdb.createPool({host: 'localhost', user:'root', password:'7l8n6OF#',connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO way.title (name,writtenlanguageId,storyId,datecreated) VALUES ('"+name+"',"+writtenlanguageId+","+storyId+","+tim+")").then((res) => {
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

