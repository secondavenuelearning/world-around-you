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

WrittenlanguageDB.db_add_writtenlanguage = function(name) {
    return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

		    conn.query("INSERT INTO writtenlanguage (name) VALUES ('"+name+"')").then((res) => {
			conn.end();
			resolve("[db_add_writtenlanguage][success]");
			return;
		    }).catch(err => {
			//handle error
			conn.end();
			reject("[db_add_writtenlanguage][failure1]");
			return;
		    })

		}).catch(err => {
		    reject("[db_add_writtenlanguage][failure2]");
		    return;
		});

    });
}

WrittenlanguageDB.getwrittenlanguage = function(language) {

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

				resolve(writtenlanguages);
			}).catch(err => {
				reject(err);
				return;
			});

		}).catch(err => {
			reject(err);
			return;
		});

	});
}

let _WrittenlanguageDB = new WrittenlanguageDB();
module.exports = _WrittenlanguageDB;

