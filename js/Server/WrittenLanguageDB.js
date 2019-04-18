const mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
	host: Settings.dbHost,
	user: Settings.dbUser, 
	password: Settings.dbPassword, 
	database: Settings.dbName ,
	connectionLimit: Settings.dbPoolConnectionLimit
});

function WrittenLanguageDB() {
}

WrittenLanguageDB.prototype.add = function(name) {
    return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			var query = 'INSERT INTO writtenlanguage (name) VALUES (?)';

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
WrittenLanguageDB.prototype.get = function(name) {
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			var query = 'SELECT * FROM writtenlanguage WHERE name=?';

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
WrittenLanguageDB.prototype.getAll = function(){
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			var query = 'SELECT * from writtenlanguage';

			conn.query(query).then(result => {
				var writtenlanguages = {};
				for(var i = 0; i < result.length; i++){
					writtenlanguages[result[i].id] = result[i];
				}
				conn.end().then(() => {
					resolve(writtenlanguages);
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


let _WrittenLanguageDB = new WrittenLanguageDB();
module.exports = _WrittenLanguageDB;

