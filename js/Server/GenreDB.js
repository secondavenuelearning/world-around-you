mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
        host: Settings.dbHost,
        user: Settings.dbUser,
        password: Settings.dbPassword,
        database: Settings.dbName ,
        connectionLimit: Settings.dbPoolConnectionLimit
});

function GenreDB() {
}

GenreDB.prototype.db_add_genre = function(name,writtenlanguageId) {

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO genre (name,writtenlanguageId) VALUES ('"+name+"',"+writtenlanguageId+")").then((res) => {
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

GenreDB.prototype.db_get_genre = function(name) {

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("SELECT * FROM genre WHERE (name='"+name+"')").then((res) => {
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

let _GenreDB = new GenreDB();
module.exports = _GenreDB;

