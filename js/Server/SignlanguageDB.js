const mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
	host: Settings.dbHost,
	user: Settings.dbUser, 
	password: Settings.dbPassword, 
	database: Settings.dbName ,
	connectionLimit: Settings.dbPoolConnectionLimit
});

function SignlanguageDB() {
}

SignlanguageDB.prototype.db_add_signlanguage = function(name) {
    return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

		    conn.query("INSERT INTO signlanguage (name) VALUES ('"+name+"')").then((res) => {
			conn.end();
			resolve({id:res.insertId});
			return;
		    }).catch(err => {
			//handle error
			conn.end();
			reject(err);
			return;
		    })

		}).catch(err => {
		    reject(err);
		    return;
		});

    });
}

SignlanguageDB.prototype.getSignLanguages = function(){
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			var query = 'SELECT * from signlanguage';

			conn.query(query).then(res => {
				var signlanguages = {};
				for(var i = 0; i < res.length; i++){
					signlanguages[res[i].id] = res[i];
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

SignlanguageDB.prototype.getsignlanguage = function(language) {

	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query('SELECT * FROM signlanguage WHERE (name="'+language+'")').then((res) => {
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

let _SignlanguageDB = new SignlanguageDB();
module.exports = _SignlanguageDB;

