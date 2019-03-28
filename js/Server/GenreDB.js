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

GenreDB.prototype.add = function(name, writtenLanguageId) {
    return new Promise(function(resolve, reject) {
		pool.getConnection().then(conn => {
			let query = 'INSERT INTO genre (name, writtenlanguageId) VALUES (?, ?)';
		    conn.query(query, [name.toLowerCase(), writtenLanguageId]).then((result) => {
				conn.end().then(() => {
					resolve(result.insertId);
					return;
				});
		    }).catch(err => {
				conn.end().then(() => {
					reject(err);
					return;
				});
		    });
		}).catch(err => {
		    reject(err);
		    return;
		});
    });
}
GenreDB.prototype.get = function(name, writtenLanguageId) {
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			var query = 'SELECT * FROM genre WHERE name=?';
			if(writtenLanguageId) query += ' AND writtenlanguageId = ?';

			conn.query(query, [name.toLowerCase(), writtenLanguageId]).then((result) => {
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
GenreDB.prototype.getAll = function(){
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			var query = 'SELECT genre.*, writtenlanguage.name as language from genre JOIN writtenlanguage on writtenlanguage.id = genre.writtenlanguageId';
			conn.query(query).then(result => {

				var genres = {};
				for(var i = 0; i < result.length; i++){
					genres[result[i].id] = result[i];
				}
				conn.end().then(() => {
					resolve(genres);
				});
			}).catch(err => {
				conn.end().then(() => {
					reject(err);
					return;
				});
			});

		}).catch(err => {
			conn.end().then(() => {
				reject(err);
				return;
			});
		});

	});
}


let _GenreDB = new GenreDB();
module.exports = _GenreDB;

