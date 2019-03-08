mdb = require('mariadb');
moment = require('moment');

const Settings = require('./Settings');
const pool = mdb.createPool({
	host: Settings.dbHost,
	user: Settings.dbUser, 
	password: Settings.dbPassword, 
	database: Settings.dbName ,
	connectionLimit: Settings.dbPoolConnectionLimit
});

function StoryDB(){

}

StoryDB.prototype.addStory = function(author,descriptionId,coverimage,visible,data) {
	let time = moment().valueOf();
	time = time / 1000;

	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query('INSERT INTO story (author, descriptionId, coverimage, visible, data, datecreated) VALUES (?, ?, ?, ?, ?, ?)', [author, descriptionId, coverimage, visible, data, time]).then((res) => {
				conn.end();
				resolve(res);
				return;
			}).catch(err => {
				//handle error
				conn.end();
				reject(false);
				return;
			});

		}).catch(err => {
			reject(false);
			return;
		});
	});
}
StoryDB.prototype.addStoryToGenre = function(storyId,genreId) {
	let time = moment().valueOf();
	time = time / 1000;


	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_genre (storyId, genreId, datecreated) VALUES (?, ?, ?)", [storyId, genreId, time]).then((res) => {
				conn.end();
				resolve(res);
				return;
			}).catch(err => {
				//handle error
				conn.end();
				reject(false);
				return;
			});

		}).catch(err => {
			reject(false);
			return;
		});

	});
}
StoryDB.prototype.addStoryToSignlanguage = function(storyId,signlanguageId) {
	let time = moment().valueOf();
	time = time / 1000;


	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_signlanguage (storyId, signlanguageId, datecreated) VALUES (?, ?, ?)", [storyId, signlanguageId, time]).then((res) => {
				conn.end();
				resolve(res);
				return;
			}).catch(err => {
				//handle error
				conn.end();
				reject(false);
				return;
			});

		}).catch(err => {
			reject(false);
			return;
		});

	});
}
StoryDB.prototype.addStoryToTag = function(storyId,tagId) {
	let time = moment().valueOf();
	time = time / 1000;


	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_tag (storyId, tagId, datecreated) VALUES (?, ?, ?)", [storyId, tagId, time]).then((res) => {
				conn.end();
				resolve(res);
				return;
			}).catch(err => {
				//handle error
				conn.end();
				reject(false);
				return;
			});

		}).catch(err => {
			reject(false);
			return;
		});

	});
}
StoryDB.prototype.addStoryToWrittenlanguage = function(storyId,writtenlanguageId) {
	let time = moment().valueOf();
	time = time / 1000;


	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_writtenlanguage (storyId,writtenlanguageId,datecreated) VALUES (?, ?, ?)", [storyId, writtenlanguageId, time]).then((res) => {
				conn.end();
				resolve(res);
				return;
			}).catch(err => {
				//handle error
				conn.end();
				reject(false);
				return;
			});

		}).catch(err => {
			reject(false);
			return;
		});

	});
}

let _StoryDB = new StoryDB();
module.exports = _StoryDB;

