const mdb = require('mariadb');

const WrittenlanguageDB = require('./WrittenlanguageDB');
const SignlanguageDB = require('./SignlanguageDB');

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
	return new Promise((resolve, reject) => {

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

	return new Promise((resolve, reject) => {

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
				reject(err);
				return;
			});

		}).catch(err => {
			reject(err);
			return;
		});

	});
}
StoryDB.prototype.addStoryToSignlanguage = function(storyId,signlanguageId) {

	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_signlanguage (storyId, signlanguageId) VALUES (?, ?)", [storyId, signlanguageId]).then((res) => {
				conn.end();
				resolve({id:res.insertId});
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
StoryDB.prototype.addStoryToTag = function(storyId,tagId) {

	return new Promise((resolve, reject) => {

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
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_writtenlanguage (storyId,writtenlanguageId) VALUES (?, ?)", [storyId, writtenlanguageId]).then((res) => {
				conn.end();
				resolve({id:res.insertId});
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

StoryDB.prototype.getStories = function(includeUnpublished){
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			let storyQuery = 'SELECT id, author, coverimage, visible, datemodified, datecreated from story';
			if(!includeUnpublished) storyQuery += ' WHERE visible = 1;';

			conn.query(storyQuery).then(storyResults => {
				var stories = {};
				for(let i=0; i<storyResults.length; i++){
					var story = storyResults[i];
					story.metadata = {
						title: {},
						description: {},
						writtenLanguages: [],
						signLanguages: [],
						genres: {},
						tags: {},
						views: 0,
						likes: 0

					}
					stories[story.id] = story;
				}

				let writtenLanguages, signLanguages, languagePromises = [];

				languagePromises.push(WrittenlanguageDB.getWrittenLanguages());
				languagePromises.push(SignlanguageDB.getSignLanguages());

				Promise.all(languagePromises).then((languageResults) => {
					writtenLanguages = languageResults[0];
					signLanguages = languageResults[1];

					var dataPromises = [];

					// Load the titles
					dataPromises.push(new Promise((_resolve, _reject) => {
						let query = "SELECT * from title";
						conn.query(query).then(res => {
							for(let i = 0; i < res.length; i++){
								let storyId = res[i].storyId,
									lang = writtenLanguages[res[i].writtenlanguageId].name;

								stories[storyId].metadata.title[lang] = res[i].name;
								if(res[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = res[i].datemodified;
							}

							_resolve();
						}).catch(err => {
							_reject(err);
							return;
						});
					}));

					// Load the descriptions
					dataPromises.push(new Promise((_resolve, _reject) => {
						let query = "SELECT * from description";
						conn.query(query).then(res => {
							for(let i = 0; i < res.length; i++){
								let storyId = res[i].storyId,
									lang = writtenLanguages[res[i].writtenlanguageId].name;

								stories[storyId].metadata.description[lang] = res[i].name;
								if(res[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = res[i].datemodified;
							}

							_resolve();
						}).catch(err => {
							_reject(err);
							return;
						});
					}));

					// Load the written languages
					dataPromises.push(new Promise((_resolve, _reject) => {
						let query = "SELECT * from story_to_writtenlanguage";
						conn.query(query).then(res => {
							for(let i = 0; i < res.length; i++){
								let storyId = res[i].storyId,
									lang = writtenLanguages[res[i].writtenlanguageId].name;

								stories[storyId].metadata.writtenLanguages.push(lang);
								if(res[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = res[i].datemodified;
							}

							_resolve();
						}).catch(err => {
							_reject(err);
							return;
						});
					}));

					// Load the sign languages
					dataPromises.push(new Promise((_resolve, _reject) => {
						let query = "SELECT * from story_to_signlanguage";
						conn.query(query).then(res => {
							for(let i = 0; i < res.length; i++){
								let storyId = res[i].storyId,
									lang = signLanguages[res[i].signlanguageId].name;

								stories[storyId].metadata.signLanguages.push(lang);
								if(res[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = res[i].datemodified;
							}

							_resolve();
						}).catch(err => {
							_reject(err);
							return;
						});
					}));

					// Load the genres
					dataPromises.push(new Promise((_resolve, _reject) => {
						let query = "SELECT story_to_genre.*, genre.name, genre.writtenlanguageId from story_to_genre JOIN genre ON story_to_genre.genreId = genre.id";
						conn.query(query).then(res => {
							for(let i = 0; i < res.length; i++){
								let storyId = res[i].storyId,
									lang = writtenLanguages[res[i].writtenlanguageId].name;

								if(!stories[storyId].metadata.genres[lang])
									stories[storyId].metadata.genres[lang] = [];

								stories[storyId].metadata.genres[lang].push(res[i].name);
								if(res[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = res[i].datemodified;
							}

							_resolve();
						}).catch(err => {
							_reject(err);
							return;
						});
					}));

					// Load the tags
					dataPromises.push(new Promise((_resolve, _reject) => {
						let query = "SELECT story_to_tag.*, tag.name, tag.writtenlanguageId from story_to_tag JOIN tag ON story_to_tag.tagId = tag.id";
						conn.query(query).then(res => {
							for(let i = 0; i < res.length; i++){
								let storyId = res[i].storyId,
									lang = writtenLanguages[res[i].writtenlanguageId].name;

								if(!stories[storyId].metadata.tags[lang])
									stories[storyId].metadata.tags[lang] = [];

								stories[storyId].metadata.tags[lang].push(res[i].name);
								if(res[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = res[i].datemodified;
							}

							_resolve();
						}).catch(err => {
							_reject(err);
							return;
						});
					}));

					// Load the views
					dataPromises.push(new Promise((_resolve, _reject) => {
						let query = "SELECT * from view";
						conn.query(query).then(res => {
							for(let i = 0; i < res.length; i++){
								let storyId = res[i].storyId;

								stories[storyId].metadata.views++;
							}

							_resolve();
						}).catch(err => {
							_reject(err);
							return;
						});
					}));

					// Load the likes
					dataPromises.push(new Promise((_resolve, _reject) => {
						let query = "SELECT * from liked";
						conn.query(query).then(res => {
							for(let i = 0; i < res.length; i++){
								let storyId = res[i].storyId;

								stories[storyId].metadata.likes++;
							}

							_resolve();
						}).catch(err => {
							_reject(err);
							return;
						});
					}));

					Promise.all(dataPromises).then(() => {
						conn.end();
						resolve(Object.values(stories));
					}).catch(err => {
						reject(err);
						return;
					});

				});
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

StoryDB.prototype.getStoryData = function(storyId){
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {
			let query = "SELECT data from story WHERE id = ?";
			conn.query(query, [storyId]).then(res => {
				conn.end();
				resolve(res[0] ? res[0].data : null);
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

StoryDB.prototype.getStoryToWrittenlanguage = function(storyId,writtenlanguageId) {
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("SELECT * FROM story_to_writtenlanguage WHERE(storyId="+storyId+" AND writtenlanguageId="+writtenlanguageId+")").then((res) => {
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
StoryDB.prototype.getStoryToSignlanguage = function(storyId,signlanguageId) {
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("SELECT * FROM story_to_signlanguage WHERE(storyId="+storyId+" AND signlanguageId="+signlanguageId+")").then((res) => {
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

let _StoryDB = new StoryDB();
module.exports = _StoryDB;

