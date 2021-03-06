const mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
	host: Settings.dbHost,
	user: Settings.dbUser, 
	password: Settings.dbPassword, 
	database: Settings.dbName ,
	connectionLimit: Settings.dbPoolConnectionLimit
});

function UserDB() {
}

UserDB.db_add_user = function(email,password,firstname,lastname,usertypeId) {

    const pool = mdb.createPool({host: Settings.dbHost, user: Settings.dbUser, password: Settings.dbPassword, database: Settings.dbName ,connectionLimit: 1});

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO user (email,password,firstname,lastname,usertypeId) VALUES ('"+email+"','"+password+"','"+firstname+"','"+lastname+"',"+usertypeId+")").then((res) => {
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
UserDB.prototype.addUser = function(username, email, password){
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			var query = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
			console.log(query, [username, email, password]);
		    conn.query(query, [username, email, password]).then(res => {
				conn.end().then(() => {
					resolve(res.insertId);
				});
		    }).catch(err => {
				conn.end().then(() => {
					reject(err);
				});
		    });
		}).catch(err => {
		    reject(err);
		});
	});	
}
UserDB.prototype.getUser = function(username){
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			var query = 'SELECT * FROM user WHERE username = ?';
		    conn.query(query, [username]).then(res => {
				conn.end().then(() => {
					resolve(res[0]);
				});
		    }).catch(err => {
				conn.end().then(() => {
					 reject(err);
				});
		    });
		}).catch(err => {
		    reject(err);
		});
	});
}
UserDB.db_get_user = function(email,password) {

    const pool = mdb.createPool({host: Settings.dbHost, user: Settings.dbUser, password: Settings.dbPassword, database: Settings.dbName ,connectionLimit: 1});


    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("SELECT * FROM user WHERE(email='"+email+"' AND password='"+password+"')").then(res => {
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

    const pool = mdb.createPool({host: Settings.dbHost, user: Settings.dbUser, password: Settings.dbPassword, database: Settings.dbName ,connectionLimit: 1});


    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("SELECT * FROM user WHERE(email='"+email+"')").then(res => {
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

let _UserDB = new UserDB();
module.exports = _UserDB;