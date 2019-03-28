const mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
	host: Settings.dbHost,
	user: Settings.dbUser, 
	password: Settings.dbPassword, 
	database: Settings.dbName ,
	connectionLimit: Settings.dbPoolConnectionLimit
});

function WrittenlanguageDB() {
}

WrittenlanguageDB.prototype.addWrittenLanguage = function(name) {
    return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			var query = 'INSERT INTO writtenlanguage (name) VALUES (?)';

		    conn.query(query, [name]).then((res) => {
				conn.end().then(() => {
					resolve(res.insertId);
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

WrittenlanguageDB.prototype.getwrittenlanguage = function(language) {

	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query('SELECT * FROM writtenlanguage WHERE (name="'+language+'")').then((res) => {
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

WrittenlanguageDB.prototype.getWrittenLanguages = function(){
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			var query = 'SELECT * from writtenlanguage';

			conn.query(query).then(res => {
				var writtenlanguages = {};
				for(var i = 0; i < res.length; i++){
					writtenlanguages[res[i].id] = res[i];
				}
				conn.end().then(() => {
					resolve(writtenlanguages);
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

let _WrittenlanguageDB = new WrittenlanguageDB();
module.exports = _WrittenlanguageDB;

