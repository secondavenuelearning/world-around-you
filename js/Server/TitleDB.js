mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
        host: Settings.dbHost,
        user: Settings.dbUser,
        password: Settings.dbPassword,
        database: Settings.dbName ,
        connectionLimit: Settings.dbPoolConnectionLimit
});


function TitleDB() {
}

TitleDB.prototype.db_add_title = function(name,writtenlanguageId,storyId) {

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO title (name,writtenlanguageId,storyId) VALUES ('"+name+"',"+writtenlanguageId+","+storyId+")").then((res) => {
		conn.end();
		resolve({id:res.insertId});
		return;
	    }).catch(err => {
		//handle error
		console.log(err);
		conn.end();
		reject(err);
		return;
	    })

	}).catch(err => {
	    console.log(err);
	    reject(err);
	    return;
	});

    });
}

TitleDB.prototype.db_get_title = function(writtenlanguageId,storyId) {

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("SELECT * FROM title WHERE (writtenlanguageId="+writtenlanguageId+" AND storyId="+storyId+")").then((res) => {
		conn.end();
		resolve(JSON.stringify(res));
		return;
	    }).catch(err => {
		//handle error
		console.log(err);
		conn.end();
		reject(err);
		return;
	    })

	}).catch(err => {
	    console.log(err);
	    reject(err);
	    return;
	});

    });
}

let _TitleDB = new TitleDB();
module.exports = _TitleDB;

