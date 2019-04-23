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

TagDB.prototype.add = function(name, writtenLanguageId) {
	return new Promise(function(resolve, reject) {
		let query = 'INSERT INTO tag (name, writtenlanguageId) VALUES (?, ?)';

		pool.query(query, [name.toLowerCase(), writtenLanguageId]).then((result) => {
			return resolve(result.insertId);
		}).catch(err => {
			return reject(err);
		});
	});
}
TagDB.prototype.get = function(name, writtenLanguageId) {
	return new Promise((resolve, reject) => {
		let query = 'SELECT * FROM tag WHERE name=?';
		if(writtenLanguageId) query += ' AND writtenlanguageId = ?';

		pool.query(query, [name.toLowerCase(), writtenLanguageId]).then((result) => {
			return resolve(result[0]);
		}).catch(err => {
			return reject(err);
		});
	});
}
TagDB.prototype.getAll = function(){
	return new Promise((resolve, reject) => {
		let query = 'SELECT tag.*, writtenlanguage.name as language from tag JOIN writtenlanguage on writtenlanguage.id = tag.writtenlanguageId';
		
		pool.query(query).then(result => {
			var tags = {};
			for(var i = 0; i < result.length; i++){
				tags[result[i].id] = result[i];
			}
			
			return resolve(tags);
		}).catch(err => {
			return reject(err);
		});
	});
}


let _TagDB = new TagDB();
module.exports = _TagDB;

