mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
        host: Settings.dbHost,
        user: Settings.dbUser,
        password: Settings.dbPassword,
        database: Settings.dbName ,
        connectionLimit: Settings.dbPoolConnectionLimit
});

function TagDB() {
}

TagDB.prototype.db_add_tag = function(name,writtenlanguageId) {

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO tag (name,writtenlanguageId) VALUES ('"+name+"',"+writtenlanguageId+")").then((res) => {
		conn.end();
                resolve({id:res.insertId});
		return;
	    }).catch(err => {
		//handle error
		conn.end();
		reject(err);
		return;
	    })

	}).catch(err => {
	    reject(err);
	    return;
	});

    });
}

TagDB.prototype.db_get_tag = function(name) {

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("SELECT * FROM tag WHERE (name='"+name+"')").then((res) => {
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

let _TagDB = new TagDB();
module.exports = _TagDB;

