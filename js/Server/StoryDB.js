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
	let time = moment().valueOf();
	time = time / 1000;

	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query('INSERT INTO story (author, descriptionId, coverimage, visible, data, datecreated) VALUES (?, ?, ?, ?, ?, ?)', [author, descriptionId, coverimage, visible, data, time]).then((res) => {
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
StoryDB.prototype.addStoryToGenre = function(storyId,genreId) {
	let time = moment().valueOf();
	time = time / 1000;


	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_genre (storyId, genreId, datecreated) VALUES (?, ?, ?)", [storyId, genreId, time]).then((res) => {
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
	let time = moment().valueOf();
	time = time / 1000;


	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_signlanguage (storyId, signlanguageId, datecreated) VALUES (?, ?, ?)", [storyId, signlanguageId, time]).then((res) => {
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
StoryDB.prototype.addStoryToTag = function(storyId,tagId) {
	let time = moment().valueOf();
	time = time / 1000;


	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_tag (storyId, tagId, datecreated) VALUES (?, ?, ?)", [storyId, tagId, time]).then((res) => {
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
	let time = moment().valueOf();
	time = time / 1000;


	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_writtenlanguage (storyId,writtenlanguageId,datecreated) VALUES (?, ?, ?)", [storyId, writtenlanguageId, time]).then((res) => {
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

StoryDB.prototype.getStories = function(includeUnpublished){
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			let storyQuery = 'SELECT id, author, coverimage, visible, datemodified, datecreated from story';
			if(!includeUnpublished) storyQuery += ' WHERE visible = 1;';

			conn.query(storyQuery).then(storyResults => {
				var stories = {};
				for(let i=0; i<storyResults.length; i++){
					var story = storyResults[i];
					story.metadata = {}
					stories[story.id] = story;
				}

				let writtenLanguages, signLanguages, languagePromises = [];

				languagePromises.push(WrittenlanguageDB.getWrittenLanguages());
				languagePromises.push(SignlanguageDB.getSignLanguages());

				Promise.all(languagePromises).then((languageResults) => {
					writtenLanguages = languageResults[0];
					signLanguages = languageResults[1];

					var dataPromises = [];

					// Load the descriptions
					dataPromises.push(new Promise((_resolve, _reject) => {
						let query = "SELECT * from description";
						conn.query(query).then(res => {
							for(let i = 0; i < res.length; i++){
								let storyId = res[i].storyId,
									lang = writtenLanguages[res[i].writtenlanguageId].name;

								if(!stories[storyId].metadata.description)
									stories[storyId].metadata.description = {};

								stories[storyId].metadata.description[lang] = res[i].name;
								if(res[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = res[i].datemodified;
							}

							_resolve();
						}).catch(err => {
							_reject(err);
							return;
						});
					}));

					// Load the titles
					dataPromises.push(new Promise((_resolve, _reject) => {
						let query = "SELECT * from title";
						conn.query(query).then(res => {
							for(let i = 0; i < res.length; i++){
								let storyId = res[i].storyId,
									lang = writtenLanguages[res[i].writtenlanguageId].name;

								if(!stories[storyId].metadata.title)
									stories[storyId].metadata.title = {};

								stories[storyId].metadata.title[lang] = res[i].name;
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

								if(!stories[storyId].metadata.writtenLanguages)
									stories[storyId].metadata.writtenLanguages = [];

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

								if(!stories[storyId].metadata.signLanguages)
									stories[storyId].metadata.signLanguages = [];

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

								if(!stories[storyId].metadata.genre)
									stories[storyId].metadata.genre = {};

								if(!stories[storyId].metadata.genre[lang])
									stories[storyId].metadata.genre[lang] = [];

								stories[storyId].metadata.genre[lang].push(res[i].name);
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

								if(!stories[storyId].metadata.tag)
									stories[storyId].metadata.tag = {};

								if(!stories[storyId].metadata.tag[lang])
									stories[storyId].metadata.tag[lang] = [];

								stories[storyId].metadata.tag[lang].push(res[i].name);
								if(res[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = res[i].datemodified;
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

StoryDB.prototype.getStoryMetadata = function(storyId){
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			let writtenLanguages, signLanguages, languagePromises = [];

			languagePromises.push(WrittenlanguageDB.getWrittenLanguages());
			languagePromises.push(SignlanguageDB.getSignLanguages());

			Promise.all(languagePromises).then((results) => {
				writtenLanguages = results[0];
				signLanguages = results[1];

				let metadata = {}, dataPromises = [];

				// Load the descriptions
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = "SELECT * from description WHERE storyId = ?";
					conn.query(query, [storyId]).then(res => {
						metadata.description = {}
						for(let i = 0; i < res.length; i++){
							let lang = writtenLanguages[res[i].writtenlanguageId].name;
							metadata.description[lang] = res[i].name;
							if(!metadata.datemodified || res[i].datemodified > metadata.datemodified) metadata.datemodified = res[i].datemodified;
						}

						_resolve();
					}).catch(err => {
						_reject(err);
						return;
					});
				}));

				// Load the titles
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = "SELECT * from title WHERE storyId = ?";
					conn.query(query, [storyId]).then(res => {
						metadata.title = {}
						for(let i = 0; i < res.length; i++){
							let lang = writtenLanguages[res[i].writtenlanguageId].name;
							metadata.title[lang] = res[i].name;
							if(!metadata.datemodified || res[i].datemodified > metadata.datemodified) metadata.datemodified = res[i].datemodified;
						}

						_resolve();
					}).catch(err => {
						_reject(err);
						return;
					});
				}));

				// Load the written languages
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = "SELECT * from story_to_writtenlanguage WHERE storyId = ?";
					conn.query(query, [storyId]).then(res => {
						metadata.writtenLanguages = [];
						for(let i = 0; i < res.length; i++){
							let lang = writtenLanguages[res[i].writtenlanguageId].name;
							metadata.writtenLanguages.push(lang);
							if(!metadata.datemodified || res[i].datemodified > metadata.datemodified) metadata.datemodified = res[i].datemodified;
						}

						_resolve();
					}).catch(err => {
						_reject(err);
						return;
					});
				}));

				// Load the sign languages
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = "SELECT * from story_to_signlanguage WHERE storyId = ?";
					conn.query(query, [storyId]).then(res => {
						metadata.signLanguages = [];
						for(let i = 0; i < res.length; i++){
							let lang = signLanguages[res[i].signlanguageId].name;
							metadata.signLanguages.push(lang);
							if(!metadata.datemodified || res[i].datemodified > metadata.datemodified) metadata.datemodified = res[i].datemodified;
						}

						_resolve();
					}).catch(err => {
						_reject(err);
						return;
					});
				}));

				// Load the genres
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = "SELECT story_to_genre.*, genre.name, genre.writtenlanguageId from story_to_genre JOIN genre ON story_to_genre.genreId = genre.id WHERE story_to_genre.storyId = ?";
					conn.query(query, [storyId]).then(res => {
						metadata.genre = {};
						for(let i = 0; i < res.length; i++){
							let lang = writtenLanguages[res[i].writtenlanguageId].name;
							if(!metadata.genre[lang]) metadata.genre[lang] = [];
							metadata.genre[lang].push(res[i].name);
							if(!metadata.datemodified || res[i].datemodified > metadata.datemodified) metadata.datemodified = res[i].datemodified;
						}

						_resolve();
					}).catch(err => {
						_reject(err);
						return;
					});
				}));

				// Load the tags
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = "SELECT story_to_tag.*, tag.name, tag.writtenlanguageId from story_to_tag JOIN tag ON story_to_tag.tagId = tag.id WHERE story_to_tag.storyId = ?";
					conn.query(query, [storyId]).then(res => {
						metadata.tag = {};
						for(let i = 0; i < res.length; i++){
							let lang = writtenLanguages[res[i].writtenlanguageId].name;
							if(!metadata.tag[lang]) metadata.tag[lang] = [];
							metadata.tag[lang].push(res[i].name);
							if(!metadata.datemodified || res[i].datemodified > metadata.datemodified) metadata.datemodified = res[i].datemodified;
						}

						_resolve();
					}).catch(err => {
						_reject(err);
						return;
					});
				}));

				Promise.all(dataPromises).then(() => {
					resolve(metadata);
				}).catch(err => {
					_reject(err);
					return;
				});

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

let _StoryDB = new StoryDB();
module.exports = _StoryDB;

