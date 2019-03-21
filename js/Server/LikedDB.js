mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
        host: Settings.dbHost,
        user: Settings.dbUser,
        password: Settings.dbPassword,
        database: Settings.dbName ,
        connectionLimit: Settings.dbPoolConnectionLimit
});

function LikedDB() {
}

LikedDB.prototype.db_add_liked = function(storyId) {

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO liked (storyId) VALUES ("+storyId+")").then((res) => {
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

LikedDB.prototype.db_get_liked = function(storyId) {

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("SELECT * FROM liked WHERE (storyId='"+storyId+"')").then((res) => {
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

let _LikedDB = new LikedDB();
module.exports = _LikedDB;

