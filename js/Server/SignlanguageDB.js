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

SignlanguageDB.db_add_signlanguage = function(name) {
    return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

		    conn.query("INSERT INTO signlanguage (name) VALUES ('"+name+"')").then((res) => {
			conn.end();
			resolve("[db_add_signlanguage][success]");
			return;
		    }).catch(err => {
			//handle error
			conn.end();
			reject("[db_add_signlanguage][failure1]");
			return;
		    })

		}).catch(err => {
		    reject("[db_add_signlanguage][failure2]");
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
				
				resolve(signlanguages);
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

let _SignlanguageDB = new SignlanguageDB();
module.exports = _SignlanguageDB;

