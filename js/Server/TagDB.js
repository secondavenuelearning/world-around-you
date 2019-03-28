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
		pool.getConnection().then(conn => {
			let query = 'INSERT INTO tag (name, writtenlanguageId) VALUES (?, ?)';
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
TagDB.prototype.get = function(name, writtenLanguageId) {
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			var query = 'SELECT * FROM tag WHERE name=?';
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
TagDB.prototype.getAll = function(){
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			var query = 'SELECT tag.*, writtenlanguage.name as language from tag JOIN writtenlanguage on writtenlanguage.id = tag.writtenlanguageId';
			conn.query(query).then(result => {

				var tags = {};
				for(var i = 0; i < result.length; i++){
					tags[result[i].id] = result[i];
				}
				conn.end().then(() => {
					resolve(tags);
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


let _TagDB = new TagDB();
module.exports = _TagDB;

