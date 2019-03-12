mdb = require('mariadb');

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
	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query('INSERT INTO story (author, descriptionId, coverimage, visible, data) VALUES (?, ?, ?, ?, ?)', [author, descriptionId, coverimage, visible, data]).then((res) => {
				conn.end();
				resolve(res);
				return;
			}).catch(err => {
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

StoryDB.prototype.addEmptyStory = function() {

	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query('INSERT INTO story (author, descriptionId, coverimage, visible, data) VALUES (?, ?, ?, ?, ?)', ["", 0, "", 0, ""]).then((res) => {
				console.log(res.insertId);
				conn.end();
				resolve('{id:'+res.insertId+'}');
				return;
			}).catch(err => {
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

// ****************************************************************************
// GET A STORY - BELOW THIS LINE                                              *
// ****************************************************************************
StoryDB.prototype.getStory = function(id) {

	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query('SELECT * FROM story WHERE (id='+id+')').then((res) => {
				//console.log(res);
				conn.end();
				resolve(JSON.stringify(res));
				return;
			}).catch(err => {
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
// ****************************************************************************
// GET A STORY - ABOVE THIS LINE                                              *
// ****************************************************************************

// ****************************************************************************
// GET A STORY                                                                *
// ****************************************************************************

StoryDB.prototype.addStoryToGenre = function(storyId,genreId) {

	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_genre (storyId, genreId) VALUES (?, ?)", [storyId, genreId, time]).then((res) => {
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

	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_signlanguage (storyId, signlanguageId) VALUES (?, ?)", [storyId, signlanguageId, time]).then((res) => {
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

	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_tag (storyId, tagId) VALUES (?, ?)", [storyId, tagId, time]).then((res) => {
				conn.end();
				resolve(res);
				return;
			}).catch(err => {
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
StoryDB.prototype.addStoryToWrittenlanguage = function(storyId,writtenlanguageId) {
	return new Promise(function(resolve,reject) {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_writtenlanguage (storyId,writtenlanguageId) VALUES (?, ?)", [storyId, writtenlanguageId, time]).then((res) => {
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

