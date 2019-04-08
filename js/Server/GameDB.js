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

GameDB.prototype.add = function(name) {
    return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			var query = 'INSERT INTO game (name) VALUES (?)';

		    conn.query(query, [name.toLowerCase()]).then((result) => {
				conn.end().then(() => {
					return resolve(result.insertId);
				});
		    }).catch(err => {
				conn.end().then(() => {
					return reject(err);
				});
		    });
		}).catch(err => {
		    return reject(err);
		});

    });
}
GameDB.prototype.get = function(name) {
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			var query = 'SELECT * FROM game WHERE name=?';

			conn.query(query, [name.toLowerCase()]).then((result) => {
				conn.end().then(() => {
					return resolve(result[0]);
				});
			}).catch(err => {
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});
	});
}
GameDB.prototype.getAll = function(){
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			var query = 'SELECT * from game';

			conn.query(query).then(result => {
				var games = {};
				for(var i = 0; i < result.length; i++){
					games[result[i].id] = result[i];
				}
				conn.end().then(() => {
					resolve(games);
				});
			}).catch(err => {
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			conn.end().then(() => {
				return reject(err);
			});
		});
	});
}
GameDB.prototype.getGameData = function(id){
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			var query = `SELECT gamedata.*, game.name, game.path, writtenlanguage.name as writtenLanguage, signlanguage.name as signLanguage 
							FROM gamedata 
							JOIN game ON game.id = gamedata.gameId 
						    JOIN writtenlanguage ON writtenlanguage.id = gamedata.writtenlanguageId 
						    JOIN signlanguage ON signlanguage.id = gamedata.signlanguageId 
						    WHERE gamedata.id = ?`;

			conn.query(query, [id]).then(result => {
				conn.end().then(() => {
					resolve(result[0]);
				});
			}).catch(err => {
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			conn.end().then(() => {
				return reject(err);
			});
		});
	});

}

let _GameDB = new GameDB();
module.exports = _GameDB;

