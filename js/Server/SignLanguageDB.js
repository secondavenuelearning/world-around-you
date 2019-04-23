const mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
	host: Settings.dbHost,
	user: Settings.dbUser, 
	password: Settings.dbPassword, 
	database: Settings.dbName,
	connectionLimit: Settings.dbPoolConnectionLimit
});

function SignLanguageDB() {
}

SignLanguageDB.prototype.add = function(name) {
	return new Promise(function(resolve, reject) {
		let query = 'INSERT INTO signlanguage (name) VALUES (?)';

		pool.query(query, [name.toLowerCase()]).then((result) => {
			return resolve(result.insertId);
		}).catch(err => {
			return reject(err);
		});
	});
}
SignLanguageDB.prototype.get = function(name) {
	return new Promise((resolve, reject) => {
		let query = 'SELECT * FROM signlanguage WHERE name=?';

		pool.query(query, [name.toLowerCase()]).then((result) => {
			return resolve(result[0]);
		}).catch(err => {
			return reject(err);
		});
	});
}
SignLanguageDB.prototype.getAll = function(){
	return new Promise((resolve, reject) => {
		let query = 'SELECT * from signlanguage';

		pool.query(query).then(result => {
			var signlanguages = {};
			for(var i = 0; i < result.length; i++){
				signlanguages[result[i].id] = result[i];
			}
			
			return resolve(signlanguages);
		}).catch(err => {
			return reject(err);
		});
	});
}


let _SignLanguageDB = new SignLanguageDB();
module.exports = _SignLanguageDB;

