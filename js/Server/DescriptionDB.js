const mdb = require('mariadb');

const Settings = require('./Settings');
const pool = mdb.createPool({
        host: Settings.dbHost,
        user: Settings.dbUser,
        password: Settings.dbPassword,
        database: Settings.dbName ,
        connectionLimit: Settings.dbPoolConnectionLimit
});

function DescriptionDB() {
}

DescriptionDB.prototype.db_add_description = function(name,writtenlanguageId,storyId) {

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("INSERT INTO way.description (name,writtenlanguageId,storyId) VALUES ('"+name+"',"+writtenlanguageId+","+storyId+")").then((res) => {
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
	    reject("[db_add_description][failure]");
	    return;
	});

    });
}

DescriptionDB.prototype.db_get_description = function(writtenlanguageId,storyId) {

    return new Promise(function(resolve,reject) {

	pool.getConnection().then(conn => {

	    conn.query("SELECT * FROM description WHERE (writtenlanguageId="+writtenlanguageId+" AND storyId="+storyId+")").then((res) => {
		conn.end();
		resolve(JSON.stringify(res));
		return;
	    }).catch(err => {
		//handle error
		console.log(err);
		conn.end();
		reject(err);
		return;
	    })

	}).catch(err => {
	    console.log(err);
	    reject(err);
	    return;
	});

    });
}

let _DescriptionDB = new DescriptionDB();
module.exports = _DescriptionDB;

