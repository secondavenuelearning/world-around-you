mdb = require('mariadb');
moment = require('moment');

const Settings = require('./Settings');

function UsertypeDB() {
}

UsertypeDB.db_add_usertype = function(name) {

    tim=moment().valueOf();
    tim=tim/1000;
    //console.log("[time]["+tim+"]");

    const pool = mdb.createPool({host: Settings.dbHost, user: Settings.dbUser, password: Settings.dbPassword, database: Settings.dbName ,connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO usertype (name,datecreated) VALUES ('"+name+"',"+tim+")").then((res) => {
		//console.log("[db_add_usertype][success]");
		//console.log(res);
		conn.end();
		resolve("[db_add_usertype][success]");
		return;
	    }).catch(err => {
		//console.log("[db_add_usertype][bad1]");
		//handle error
		conn.end();
		reject("[db_add_usertype][failure]");
		return;
	    })

	}).catch(err => {
	    //console.log("[db_add_usertype][bad2]");
	    reject("[db_add_usertype][failure]");
	    return;
	});

    });
}

UsertypeDB.db_get_usertype = function(name) {

    const pool = mdb.createPool({host: 'localhost', user:'root', password:'7l8n6OF#',connectionLimit: 1});

    return new Promise(function(resolve,reject) {

        pool.getConnection().then(conn => {
            conn.query("SELECT id FROM usertype WHERE(name='"+name+"')").then(res => {
                //console.log("[db_get_usertype][success]");
                //console.log(res);
                conn.end();
                resolve(JSON.stringify(res));
                return;
            }).catch(err => {
                //console.log("[db_get_usertype][bad1]");
                //console.log(err);
                //handle error
                conn.end();
                reject("[db_get_usertype][failure1]");
                return;
            })

        }).catch(err => {
            //console.log("[db_get_usertype][bad2]");
            reject("[db_get_usertype][failure2]");
            return;
        });
    });
}

module.exports = UsertypeDB;

