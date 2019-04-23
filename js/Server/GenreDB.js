const mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
    host: Settings.dbHost,
    user: Settings.dbUser,
    password: Settings.dbPassword,
    database: Settings.dbName,
    connectionLimit: Settings.dbPoolConnectionLimit
});

function GenreDB() {
}

GenreDB.prototype.add = function(name, writtenLanguageId) {
    return new Promise(function(resolve, reject) {
		let query = 'INSERT INTO genre (name, writtenlanguageId) VALUES (?, ?)';

	    pool.query(query, [name.toLowerCase(), writtenLanguageId]).then((result) => {
			return resolve(result.insertId);
	    }).catch(err => {
			return reject(err);
	    });
    });
}
GenreDB.prototype.get = function(name, writtenLanguageId) {
	return new Promise((resolve, reject) => {
		let query = 'SELECT * FROM genre WHERE name=?';
		if(writtenLanguageId) query += ' AND writtenlanguageId = ?';

		pool.query(query, [name.toLowerCase(), writtenLanguageId]).then((result) => {
			return resolve(result[0]);
		}).catch(err => {
			return reject(err);
		});
	});
}
GenreDB.prototype.getAll = function(){
	return new Promise((resolve, reject) => {
		let query = 'SELECT genre.*, writtenlanguage.name as language from genre JOIN writtenlanguage on writtenlanguage.id = genre.writtenlanguageId';

		pool.query(query).then(result => {
			var genres = {};
			for(var i = 0; i < result.length; i++){
				genres[result[i].id] = result[i];
			}
			
			return resolve(genres);
		}).catch(err => {
			return reject(err);
		});
	});
}


let _GenreDB = new GenreDB();
module.exports = _GenreDB;

