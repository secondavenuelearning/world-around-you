const mdb = require('mariadb');

const WrittenLanguageDB = require('./WrittenLanguageDB');
const SignLanguageDB = require('./SignLanguageDB');

const Settings = require('./Settings');
const pool = mdb.createPool({
	host: Settings.dbHost,
	user: Settings.dbUser, 
	password: Settings.dbPassword, 
	database: Settings.dbName,
	connectionLimit: Settings.dbPoolConnectionLimit
});

function AddStoriesMetadata (storyResults){
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			let stories = {};

			if(storyResults.length == 0){
				return resolve([]);
			}

			for(let i=0; i<storyResults.length; i++){
				let story = storyResults[i] || {};
				story.metadata = {
					title: {},
					description: {},
					writtenLanguages: [],
					signLanguages: [],
					signer: {},
					translator: {},
					genres: {},
					tags: {},
					views: 0,
					likes: 0

				}
				stories[story.id] = story;
			}

			let writtenLanguages, signLanguages, languagePromises = [];

			languagePromises.push(WrittenLanguageDB.getAll());
			languagePromises.push(SignLanguageDB.getAll());

			Promise.all(languagePromises).then((languageResults) => {
				writtenLanguages = languageResults[0];
				signLanguages = languageResults[1];

				let dataPromises = [];

				// Load the titles
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = 'SELECT * from title',
						where = '';

					for(let id in stories){
						if(where == '') where += ` WHERE storyId = ${id}`;
						else where += ` OR storyId = ${id}`;
					}

					conn.query(query + where).then(result => {
						for(let i = 0; i < result.length; i++){
							let storyId = result[i].storyId,
								lang = writtenLanguages[result[i].writtenlanguageId].name;

							stories[storyId].metadata.title[lang] = result[i].name;
							if(result[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = result[i].datemodified;
						}

						return _resolve();
					}).catch((err) => {
						return _reject(err);
					});
				}));

				// Load the descriptions
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = 'SELECT * from description',
						where = '';

					for(let id in stories){
						if(where == '') where += ` WHERE storyId = ${id}`;
						else where += ` OR storyId = ${id}`;
					}

					conn.query(query + where).then(result => {
						for(let i = 0; i < result.length; i++){
							let storyId = result[i].storyId,
								lang = writtenLanguages[result[i].writtenlanguageId].name;

							stories[storyId].metadata.description[lang] = result[i].name;
							if(result[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = result[i].datemodified;
						}

						return _resolve();
					}).catch((err) => {
						return _reject(err);
					});
				}));

				// Load the written languages
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = "SELECT * from story_to_writtenlanguage",
						where = '';

					for(let id in stories){
						if(where == '') where += ` WHERE storyId = ${id}`;
						else where += ` OR storyId = ${id}`;
					}

					conn.query(query + where).then(result => {
						for(let i = 0; i < result.length; i++){
							let storyId = result[i].storyId,
								lang = writtenLanguages[result[i].writtenlanguageId].name;

							stories[storyId].metadata.writtenLanguages.push(lang);
							if(result[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = result[i].datemodified;
						}

						return _resolve();
					}).catch((err) => {
						return _reject(err);
					});
				}));

				// Load the signers
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = 'SELECT * from signer',
						where = '';

					for(let id in stories){
						if(where == '') where += ` WHERE storyId = ${id}`;
						else where += ` OR storyId = ${id}`;
					}

					conn.query(query + where).then(result => {
						for(let i = 0; i < result.length; i++){
							let storyId = result[i].storyId,
								lang = writtenLanguages[result[i].writtenlanguageId].name;

							stories[storyId].metadata.signer[lang] = result[i].name;
							if(result[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = result[i].datemodified;
						}

						return _resolve();
					}).catch((err) => {
						return _reject(err);
					});
				}));

				// Load the translator
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = 'SELECT * from translator',
						where = '';

					for(let id in stories){
						if(where == '') where += ` WHERE storyId = ${id}`;
						else where += ` OR storyId = ${id}`;
					}

					conn.query(query + where).then(result => {
						for(let i = 0; i < result.length; i++){
							let storyId = result[i].storyId,
								lang = writtenLanguages[result[i].writtenlanguageId].name;

							stories[storyId].metadata.translator[lang] = result[i].name;
							if(result[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = result[i].datemodified;
						}

						return _resolve();
					}).catch((err) => {
						return _reject(err);
					});
				}));

				// Load the sign languages
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = "SELECT * from story_to_signlanguage",
						where = '';

					for(let id in stories){
						if(where == '') where += ` WHERE storyId = ${id}`;
						else where += ` OR storyId = ${id}`;
					}

					conn.query(query + where).then(result => {
						for(let i = 0; i < result.length; i++){
							let storyId = result[i].storyId,
								lang = signLanguages[result[i].signlanguageId].name;

							stories[storyId].metadata.signLanguages.push(lang);
							if(result[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = result[i].datemodified;
						}

						return _resolve();
					}).catch((err) => {
						return _reject(err);
					});
				}));

				// Load the genres
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = "SELECT story_to_genre.*, genre.name, genre.writtenlanguageId from story_to_genre JOIN genre ON story_to_genre.genreId = genre.id",
						where = '';

					for(let id in stories){
						if(where == '') where += ` WHERE storyId = ${id}`;
						else where += ` OR storyId = ${id}`;
					}

					conn.query(query + where).then(result => {
						for(let i = 0; i < result.length; i++){
							let storyId = result[i].storyId,
								lang = writtenLanguages[result[i].writtenlanguageId].name;

							if(!stories[storyId].metadata.genres[lang])
								stories[storyId].metadata.genres[lang] = [];

							stories[storyId].metadata.genres[lang].push(result[i].name);
							if(result[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = result[i].datemodified;
						}

						return _resolve();
					}).catch((err) => {
						return _reject(err);
					});
				}));

				// Load the tags
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = "SELECT story_to_tag.*, tag.name, tag.writtenlanguageId from story_to_tag JOIN tag ON story_to_tag.tagId = tag.id",
						where = '';

					for(let id in stories){
						if(where == '') where += ` WHERE storyId = ${id}`;
						else where += ` OR storyId = ${id}`;
					}

					conn.query(query + where).then(result => {
						for(let i = 0; i < result.length; i++){
							let storyId = result[i].storyId,
								lang = writtenLanguages[result[i].writtenlanguageId].name;

							if(!stories[storyId].metadata.tags[lang])
								stories[storyId].metadata.tags[lang] = [];

							stories[storyId].metadata.tags[lang].push(result[i].name);
							if(result[i].datemodified > stories[storyId].datemodified) stories[storyId].datemodified = result[i].datemodified;
						}

						return _resolve();
					}).catch((err) => {
						return _reject(err);
					});
				}));

				// Load the views
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = "SELECT * from view",
						where = '';

					for(let id in stories){
						if(where == '') where += ` WHERE storyId = ${id}`;
						else where += ` OR storyId = ${id}`;
					}

					conn.query(query + where).then(result => {
						for(let i = 0; i < result.length; i++){
							let storyId = result[i].storyId;

							stories[storyId].metadata.views++;
						}

						return _resolve();
					}).catch((err) => {
						return _reject(err);
					});
				}));

				// Load the likes
				dataPromises.push(new Promise((_resolve, _reject) => {
					let query = "SELECT * from liked",
						where = '';

					for(let id in stories){
						if(where == '') where += ` WHERE storyId = ${id}`;
						else where += ` OR storyId = ${id}`;
					}

					conn.query(query + where).then(result => {
						for(let i = 0; i < result.length; i++){
							let storyId = result[i].storyId;

							stories[storyId].metadata.likes++;
						}

						return _resolve();
					}).catch((err) => {
						return _reject(err);
					});
				}));

				Promise.all(dataPromises).then(() => {
					conn.end().then(() => {
						let storiesArray = Object.values(stories);

						// sort stories by data created
						storiesArray = storiesArray.sort((a, b) => {
							return a.datecreated < b.datecreated ? 1 : a.datecreated > b.datecreated ? -1 : 0;
						});

						return resolve(storiesArray);
					});
				}).catch((err) => {
					conn.end().then(() => {
						return reject(err);
					});
				});
			}).catch((err) => {
				conn.end().then(() => {
					return reject(err);
				});
			});
		}).catch((err) => {
			return reject(err);
		});

	});
}

function AddToAssociationTable(storyId, otherId, table, otherIdField){
	return new Promise(function(resolve,reject) {
		let query = `INSERT INTO ${table} (storyId, ${otherIdField}) VALUES (?, ?)`;

		pool.query(query, [storyId, otherId]).then((result) => {
			return resolve(result.insertId);
		}).catch((err) => {
			return reject(err);
		});
	});	
}

function DeleteFromAssociationTable(storyId, otherId, table, otherIdField){
	return new Promise((resolve, reject) => {
		let query = `DELETE FROM ${table} WHERE storyId = ? AND ${otherIdField} = ?`;

		pool.query(query, [storyId, otherId]).then((result) => {
			return resolve(true);
		}).catch((err) => {
			return reject(err);
		});
	});	
}

function DeleteStoryFromAssociationTable(storyId, table){
	return new Promise((resolve, reject) => {
		let query = `DELETE FROM ${table} WHERE storyId = ?`;

		if(table == "story"){
			query = `DELETE FROM ${table} WHERE id = ?`;
		}

		pool.query(query, [storyId]).then((result) => {
			return resolve(true);
		}).catch((err) => {
			return reject(err);
		});
	});	
}

function DeleteGameFromAssociationTable(gameId, table){
	return new Promise((resolve, reject) => {
		let query = `DELETE FROM ${table} WHERE id = ?`;
		pool.query(query, [gameId]).then((result) => {
			return resolve(true);
		}).catch((err) => {
			return reject(err);
		});
	});	
}
function SetTitleOrDescription(storyId, writtenlanguageId, name, table){
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			new Promise((_resolve, _reject) => {

				let query = `SELECT * from ${table} WHERE storyId = ? AND writtenlanguageId = ?`;

				conn.query(query, [storyId, writtenlanguageId]).then((result) => {
					_resolve(result[0]);
				}).catch((err) => {
					_reject(err);
				})

			}).then((entry) => {
				let query = `INSERT INTO ${table} (storyId, writtenlanguageId, name) VALUES (?, ?, ?)`,
					queryVars = [storyId, writtenlanguageId, name];

				if(entry){
					query = `UPDATE ${table} SET name = ? WHERE id = ?`;
					queryVars = [name, entry.id];
				}

				conn.query(query, queryVars).then((result) => {
					conn.end().then(() => {
						return resolve(result.insertId);
					});
				}).catch((err) => {
					conn.end().then(() => {
						return reject(err);
					});
				});
			}).catch((err) => {
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch((err) => {
			return reject(err);
		});

	});	
}

function SetSignerorTranslator(storyId, writtenlanguageId, name, table){
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			new Promise((_resolve, _reject) => {

				let query = `SELECT * from ${table} WHERE storyId = ? AND writtenlanguageId = ?`;

				conn.query(query, [storyId, writtenlanguageId]).then((result) => {
					_resolve(result[0]);
				}).catch((err) => {
					_reject(err);
				})

			}).then((entry) => {
				let query = `INSERT INTO ${table} (storyId, writtenlanguageId, name) VALUES (?, ?, ?)`,
					queryVars = [storyId, writtenlanguageId, name];

				if(entry){
					query = `UPDATE ${table} SET name = ? WHERE id = ?`;
					queryVars = [name, entry.id];
				}

				conn.query(query, queryVars).then((result) => {
					conn.end().then(() => {
						return resolve(result.insertId);
					});
				}).catch((err) => {
					conn.end().then(() => {
						return reject(err);
					});
				});
			}).catch((err) => {
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch((err) => {
			return reject(err);
		});

	});	
}

function AddViewOrLike(storyId, table){
	return new Promise((resolve, reject) => {
		let query = `INSERT INTO ${table} (storyId) VALUES (?)`;

		pool.query(query, [storyId]).then((result) => {
			return resolve(result.insertId);
		}).catch((err) => {
			return reject(err);
		});
	});	
}

function StoryDB(){
}

// Adds
	StoryDB.prototype.add = function() {
		return new Promise((resolve, reject) => {
			pool.query('INSERT INTO story (id) VALUES (NULL)').then((result) => {
				return resolve(result.insertId);
			}).catch((err) => {
				return reject(err);
			});
		});
	}
	StoryDB.prototype.addGenre = function(storyId, genreId) {
		return AddToAssociationTable(storyId, genreId, 'story_to_genre', 'genreId');
	}
	StoryDB.prototype.addSignLanguage = function(storyId, signlanguageId) {
		return AddToAssociationTable(storyId, signlanguageId, 'story_to_signlanguage', 'signlanguageId');
	}
	StoryDB.prototype.addTag = function(storyId, tagId) {
		return AddToAssociationTable(storyId, tagId, 'story_to_tag', 'tagId');
	}
	StoryDB.prototype.addUser = function(storyId, userId) {
		return AddToAssociationTable(storyId, userId, 'story_to_user', 'userId');
	}
	StoryDB.prototype.addWrittenLanguage = function(storyId, writtenlanguageId) {
		return AddToAssociationTable(storyId, writtenlanguageId, 'story_to_writtenlanguage', 'writtenlanguageId');
	}
	StoryDB.prototype.addView = function(storyId) {
		return AddViewOrLike(storyId, 'view');
	}
	StoryDB.prototype.addLike = function(storyId) {
		return AddViewOrLike(storyId, 'liked');
	}
	StoryDB.prototype.addGamedata = function(storyId, gameId, writtenlanguageId, signlanguageId){
		return new Promise((resolve, reject) => {
			let query = `INSERT INTO gamedata (storyId, gameId, writtenlanguageId, signlanguageId) VALUES (?, ?, ?, ?)`;

			pool.query(query, [storyId, gameId, writtenlanguageId, signlanguageId]).then(result => {
				return resolve(result.insertId);
			}).catch((err) => {
				return reject(err);
			});
		});
	}

// Deletes
	StoryDB.prototype.deleteDescrtion = function(storyId, writtenlanguageId) {
		return DeleteFromAssociationTable(storyId, writtenlanguageId, 'description', 'writtenlanguageId');
	}
	StoryDB.prototype.deleteGenre = function(storyId, genreId) {
		return DeleteFromAssociationTable(storyId, genreId, 'story_to_genre', 'genreId');
	}
	StoryDB.prototype.deleteSignLanguage = function(storyId, signLanguageId) {
		return DeleteFromAssociationTable(storyId, signLanguageId, 'story_to_signlanguage', 'signlanguageId');
	}
	StoryDB.prototype.deleteTag = function(storyId, tagId) {
		return DeleteFromAssociationTable(storyId, tagId, 'story_to_tag', 'tagId');
	}
	StoryDB.prototype.deleteTitle = function(storyId, writtenlanguageId) {
		return DeleteFromAssociationTable(storyId, writtenlanguageId, 'title', 'writtenlanguageId');
	}
	StoryDB.prototype.deleteUser = function(storyId, userId) {
		return DeleteFromAssociationTable(storyId, userId, 'story_to_user', 'userId');
	}
	StoryDB.prototype.deleteWrittenLanguage = function(storyId, writtenlanguageId) {
		return DeleteFromAssociationTable(storyId, writtenlanguageId, 'story_to_writtenlanguage', 'writtenlanguageId');
	}

	StoryDB.prototype.deleteStory = function(storyId){
		return new Promise((resolve, reject) => {
			DeleteStoryFromAssociationTable(storyId,'description');
			DeleteStoryFromAssociationTable(storyId,'story_to_genre');
			DeleteStoryFromAssociationTable(storyId,'story_to_signlanguage');
			DeleteStoryFromAssociationTable(storyId,'story_to_writtenlanguage');
			DeleteStoryFromAssociationTable(storyId,'story_to_user');
			DeleteStoryFromAssociationTable(storyId,'story_to_tag');
			DeleteStoryFromAssociationTable(storyId,'title');
			DeleteStoryFromAssociationTable(storyId,'view');
			DeleteStoryFromAssociationTable(storyId,'signer');
			DeleteStoryFromAssociationTable(storyId,'translator');
			DeleteStoryFromAssociationTable(storyId,'story');
			return resolve(true);
		}).catch((err) => {
			return reject(err);
		});
	}
	StoryDB.prototype.deleteGame = function(gameId){
		return new Promise((resolve, reject) => {
			DeleteGameFromAssociationTable(gameId,'gamedata');
			return resolve(true);
		}).catch((err) => {
			return reject(err);
		});
	}


// Get
	StoryDB.prototype.get = function(storyId, userId){
		return new Promise((resolve, reject) => {
			let storyQuery = 'SELECT story.id, story.author, story.artist, story.coverimage, story.visible, story.datemodified, story.datecreated from story';
			if(userId) storyQuery += ' JOIN  story_to_user ON story_to_user.storyId = story.id AND story_to_user.userId = ?';
			storyQuery += ' WHERE id = ?';

			pool.query(storyQuery, userId ? [userId, storyId] : [storyId]).then(storyResults => {
				AddStoriesMetadata(storyResults).then((stories) => {
					return resolve(stories[0]);
				}).catch((err) => {
					return reject(err);
				});
			}).catch((err) => {
				return reject(err);
			});
		});
	}
	StoryDB.prototype.getAll = function(includeUnpublished, userId){
		return new Promise((resolve, reject) => {
			let storyQuery = 'SELECT story.id, story.author, story.artist, story.coverimage, story.visible, story.datemodified, story.datecreated from story';
			if(userId) storyQuery += ' JOIN  story_to_user ON story_to_user.storyId = story.id AND story_to_user.userId = ?';
			if(!includeUnpublished) storyQuery += ' WHERE visible = 1';
			storyQuery += ' ORDER BY story.id DESC';

			pool.query(storyQuery, [userId]).then(storyResults => {
				AddStoriesMetadata(storyResults).then((stories) => {
					return resolve(stories);
				}).catch((err) => {
					return reject(err);
				});
			}).catch((err) => {
				return reject(err);
			});
		});
	}
	StoryDB.prototype.getData = function(storyId){
		return new Promise((resolve, reject) => {
			let query = "SELECT data from story WHERE id = ?";
			pool.query(query, [storyId]).then(result => {
				return resolve(result[0] && result[0].data ? JSON.parse(result[0].data) : null);
			}).catch((err) => {
				return reject(err);
			});
		});
	}
	StoryDB.prototype.getGameData = function(storyId){
		return new Promise((resolve, reject) => {
			let query = "SELECT * from gamedata WHERE storyId = ?";
			pool.query(query, [storyId]).then(result => {
				let games = [];
				for(var i in result){
					let game = result[i];
					game.data = game.data ? JSON.parse(game.data) : null;
					games.push(game);
				}
				
				return resolve(games);
			}).catch((err) => {
				return reject(err);
			});
		});
	}

// Updates
	StoryDB.prototype.setCover = function(id, author, artist, coverImage) {
		return new Promise((resolve, reject) => {
			coverImage = coverImage || null;

			let query = 'UPDATE story SET author = ?, artist = ?, coverimage = ?  WHERE id = ?';
			pool.query(query, [author, artist, coverImage, id]).then((result) => {
				return resolve(result.affectedRows);
			}).catch((err) => {
				return reject(err);
			});
		});
	}
	StoryDB.prototype.setDescription = function(storyId, writtenlanguageId, name) {
		return SetTitleOrDescription(storyId, writtenlanguageId, name, 'description');
	}
	StoryDB.prototype.setData = function(id, data) {
		return new Promise((resolve, reject) => {
			data = typeof data == 'string' ? data : JSON.stringify(data);

			let query = 'UPDATE story SET data = ?, visible = 0 WHERE id = ?';
			pool.query(query, [data, id]).then((result) => {
				return resolve(result.affectedRows);
			}).catch((err) => {
				return reject(err);
			});
		});
	}
	StoryDB.prototype.setTitle = function(storyId, writtenlanguageId, name) {
		return SetTitleOrDescription(storyId, writtenlanguageId, name, 'title');
	}
	StoryDB.prototype.setSigner = function(storyId, writtenlanguageId, name) {
		return SetSignerorTranslator(storyId, writtenlanguageId, name, 'signer');
	}
	StoryDB.prototype.setTranslator = function(storyId, writtenlanguageId, name) {
		return SetSignerorTranslator(storyId, writtenlanguageId, name, 'translator');
	}
	StoryDB.prototype.setVisible = function(storyId) {
		return new Promise((resolve, reject) => {
			let query = 'UPDATE story SET visible = 1 WHERE id = ?';
			pool.query(query, [storyId]).then((result) => {
				return resolve(result.affectedRows);
			}).catch((err) => {
				return reject(err);
			});
		});
	}
	StoryDB.prototype.setGameData = function(gamedataId, data){
		return new Promise((resolve, reject) => {
			let query = 'UPDATE gamedata SET data = ? WHERE id = ?';
			pool.query(query, [data, gamedataId]).then((result) => {
				return resolve(result.affectedRows);
			}).catch((err) => {
				return reject(err);
			});
		});
	}


let _StoryDB = new StoryDB();
module.exports = _StoryDB;

