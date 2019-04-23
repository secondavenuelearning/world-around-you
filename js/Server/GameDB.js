const mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
	host: Settings.dbHost,
	user: Settings.dbUser, 
	password: Settings.dbPassword, 
	database: Settings.dbName,
	connectionLimit: Settings.dbPoolConnectionLimit
});

function GameDB() {
}

GameDB.prototype.add = function(name) {
	return new Promise((resolve, reject) => {
		let query = 'INSERT INTO game (name) VALUES (?)';

		pool.query(query, [name.toLowerCase()]).then((result) => {
			return resolve(result.insertId);
		}).catch(err => {
			return reject(err);
		});
	});
}
GameDB.prototype.get = function(name) {
	return new Promise((resolve, reject) => {
		let query = 'SELECT * FROM game WHERE name=?';

		pool.query(query, [name.toLowerCase()]).then((result) => {
			return resolve(result[0]);
		}).catch(err => {
			return reject(err);
		});
	});
}
GameDB.prototype.getAll = function(){
	return new Promise((resolve, reject) => {
		let query = 'SELECT * from game';

		pool.query(query).then(result => {
			var games = {};
			for(var i = 0; i < result.length; i++){
				games[result[i].id] = result[i];
			}
			
			return resolve(games);
		}).catch(err => {
			return reject(err);
		});
	});
}
GameDB.prototype.getGameData = function(id){
	return new Promise((resolve, reject) => {
		let query = `SELECT gamedata.*, game.name, game.path, writtenlanguage.name as writtenLanguage, signlanguage.name as signLanguage 
						FROM gamedata 
						JOIN game ON game.id = gamedata.gameId 
						JOIN writtenlanguage ON writtenlanguage.id = gamedata.writtenlanguageId 
						JOIN signlanguage ON signlanguage.id = gamedata.signlanguageId 
						WHERE gamedata.id = ?`;

		pool.query(query, [id]).then(result => {
			return resolve(result[0]);
		}).catch(err => {
			return reject(err);
		});
	});

}

let _GameDB = new GameDB();
module.exports = _GameDB;

