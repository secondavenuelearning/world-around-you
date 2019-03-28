const mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
	host: Settings.dbHost,
	user: Settings.dbUser, 
	password: Settings.dbPassword, 
	database: Settings.dbName ,
	connectionLimit: Settings.dbPoolConnectionLimit
});

function GamedataDB() {
}

GamedataDB.prototype.addGamedata = function(storyId,gameId,data) {
    return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

		    conn.query("INSERT INTO gamedata (gameId,storyId,data) VALUES ("+gameId+","+storyId+",'"+data+"')").then((res) => {
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

GamedataDB.prototype.getGamedata = function(storyId,gameId) {

	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query('SELECT * FROM gamedata WHERE (gameId='+gameId+' AND storyId='+storyId+')').then((res) => {
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

let _GamedataDB = new GamedataDB();
module.exports = _GamedataDB;

