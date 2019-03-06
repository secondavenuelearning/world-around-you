mdb = require('mariadb');
moment = require('moment');

function UserDB() {
}

UserDB.db_add_user = function(email,password,firstname,lastname,usertypeId) {

    tim=moment().valueOf();
    tim=tim/1000;
    //console.log("[time]["+tim+"]");

    const pool = mdb.createPool({host: 'localhost', user:'root', password:'7l8n6OF#',connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO way.user (email,password,firstname,lastname,usertypeId,datecreated) VALUES ('"+email+"','"+password+"','"+firstname+"','"+lastname+"',"+usertypeId+","+tim+")").then((res) => {
		//console.log("[db_add_user][success]");
		//console.log(res);
		conn.end();
		resolve("[db_add_user][success]");
		return;
	    }).catch(err => {
		//console.log("[db_add_user][bad1]");
		//handle error
		conn.end();
		reject("[db_add_user][failure]");
		return;
	    })

	}).catch(err => {
	    //console.log("[db_add_user][bad2]");
	    reject("[db_add_user][failure]");
	    return;
	});

    });
}

UserDB.db_get_user = function(email,password) {

    const pool = mdb.createPool({host: 'localhost', user:'root', password:'7l8n6OF#',connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("SELECT * FROM way.user WHERE(email='"+email+"' AND password='"+password+"')").then(res => {
		//console.log("[db_get_user][success]");
		//console.log(res);
		conn.end();
		resolve(JSON.stringify(res));
		return;
	    }).catch(err => {
		//console.log("[db_get_user][bad1]");
		//console.log(err);
		//handle error
		conn.end();
		reject("[db_get_user][failure1]");
		return;
	    })

	}).catch(err => {
	    //console.log("[db_get_user][bad2]");
	    reject("[db_get_user][failure2]");
	    return;
	});

    });
}


UserDB.db_get_user2 = function(email) {

    const pool = mdb.createPool({host: 'localhost', user:'root', password:'7l8n6OF#',connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("SELECT * FROM way.user WHERE(email='"+email+"')").then(res => {
		//console.log("[db_get_user][success]");
		//console.log(res);
		conn.end();
		resolve(JSON.stringify(res));
		return;
	    }).catch(err => {
		//console.log("[db_get_user][bad1]");
		//console.log(err);
		//handle error
		conn.end();
		reject("[db_get_user][failure1]");
		return;
	    })

	}).catch(err => {
	    //console.log("[db_get_user][bad2]");
	    reject("[db_get_user][failure2]");
	    return;
	});

    });
}

module.exports = UserDB;

