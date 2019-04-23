const mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
	host: Settings.dbHost,
	user: Settings.dbUser, 
	password: Settings.dbPassword, 
	database: Settings.dbName,
	connectionLimit: Settings.dbPoolConnectionLimit
});

function WrittenLanguageDB() {
}

WrittenLanguageDB.prototype.add = function(name) {
	return new Promise((resolve, reject) => {
		let query = 'INSERT INTO writtenlanguage (name) VALUES (?)';

		pool.query(query, [name.toLowerCase()]).then((result) => {
			return resolve(result.insertId);
		}).catch(err => {
			return reject(err);
		});
	});
}
WrittenLanguageDB.prototype.get = function(name) {
	return new Promise((resolve, reject) => {
		let query = 'SELECT * FROM writtenlanguage WHERE name=?';

		pool.query(query, [name.toLowerCase()]).then((result) => {
			return resolve(result[0]);
		}).catch(err => {
			return reject(err);
		});
	});
}
WrittenLanguageDB.prototype.getAll = function(){
	return new Promise((resolve, reject) => {
		let query = 'SELECT * from writtenlanguage';

		pool.query(query).then(result => {
			var writtenlanguages = {};
			for(var i = 0; i < result.length; i++){
				writtenlanguages[result[i].id] = result[i];
			}
			
			return resolve(writtenlanguages);
		}).catch(err => {
			return reject(err);
		});
	});
}


let _WrittenLanguageDB = new WrittenLanguageDB();
module.exports = _WrittenLanguageDB;

