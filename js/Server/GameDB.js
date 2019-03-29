const mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
	host: Settings.dbHost,
	user: Settings.dbUser, 
	password: Settings.dbPassword, 
	database: Settings.dbName ,
	connectionLimit: Settings.dbPoolConnectionLimit
});

function GameDB() {
}

GameDB.prototype.addGame = function(name) {
    return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

		    conn.query("INSERT INTO game (name) VALUES ('"+name+"')").then((res) => {
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

GameDB.prototype.getGame = function(name) {

	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query('SELECT * FROM game WHERE (name="'+name+'")').then((res) => {
				conn.end();
				resolve(JSON.stringify(res));
				return;
			}).catch(err => {
				console.log(err);
				//handle error
				conn.end();
				reject(err);
				return;
			});

		}).catch(err => {
			reject(err);
			return;
		});
	});
}

let _GameDB = new GameDB();
module.exports = _GameDB;

