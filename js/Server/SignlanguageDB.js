const mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
	host: Settings.dbHost,
	user: Settings.dbUser, 
	password: Settings.dbPassword, 
	database: Settings.dbName ,
	connectionLimit: Settings.dbPoolConnectionLimit
});

function SignLanguageDB() {
}

SignLanguageDB.prototype.add = function(name) {
    return new Promise(function(resolve, reject) {

		pool.getConnection().then(conn => {

			var query = 'INSERT INTO signlanguage (name) VALUES (?)';

		    conn.query(query, [name.toLowerCase()]).then((result) => {
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
SignLanguageDB.prototype.get = function(name) {
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			var query = 'SELECT * FROM signlanguage WHERE name=?';

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
SignLanguageDB.prototype.getAll = function(){
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			var query = 'SELECT * from signlanguage';

			conn.query(query).then(result => {
				var signlanguages = {};
				for(var i = 0; i < result.length; i++){
					signlanguages[result[i].id] = result[i];
				}
				conn.end().then(() => {
					resolve(signlanguages);
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


let _SignLanguageDB = new SignLanguageDB();
module.exports = _SignLanguageDB;

