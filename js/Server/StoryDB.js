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

StoryDB.prototype.addStory = function() {
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			conn.query('INSERT INTO story (id) VALUES (NULL)').then((result) => {
				conn.end().then(() => {
					return resolve(result.insertId);
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});
		}).catch(err => {
			return reject(err);
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

			conn.query("INSERT INTO story_to_genre (storyId, genreId) VALUES (?, ?)", [storyId, genreId]).then((result) => {
				conn.end().then(() => {
					return resolve(result.insertId);
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});

	});
}
StoryDB.prototype.addStoryToSignlanguage = function(storyId,signlanguageId) {

	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_signlanguage (storyId, signlanguageId) VALUES (?, ?)", [storyId, signlanguageId]).then((result) => {
				conn.end().then(() => {
					return resolve(result.insertId);
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});

	});
}
StoryDB.prototype.addStoryToTag = function(storyId,tagId) {

	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_tag (storyId, tagId) VALUES (?, ?)", [storyId, tagId]).then((result) => {
				conn.end().then(() => {
					return resolve(result.insertId);
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});

	});
}
StoryDB.prototype.addStoryToWrittenlanguage = function(storyId,writtenlanguageId) {
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			var query = 'INSERT INTO story_to_writtenlanguage (storyId,writtenlanguageId) VALUES (?, ?)';

			conn.query(query, [storyId, writtenlanguageId]).then((result) => {
				conn.end().then(() => {
					return resolve(result.insertId);
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});

	});
}

StoryDB.prototype.addStoryToUser = function(storyId,userId) {
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("INSERT INTO story_to_user (storyId,userId) VALUES (?, ?)", [storyId, userId]).then((result) => {
				conn.end().then(() => {
					return resolve(result.insertId);
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});

	});
}


function AddStoriesMetadata (storyResults){
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {
			let stories = {};

			if(storyResults.length == 0){
				return resolve([]);
			}

			for(let i=0; i<storyResults.length; i++){
				let story = storyResults[i] || {};
				console.log(story)
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
					}).catch(err => {
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
					}).catch(err => {
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
					}).catch(err => {
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
					}).catch(err => {
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
					}).catch(err => {
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
					}).catch(err => {
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
					}).catch(err => {
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
					}).catch(err => {
						return _reject(err);
					});
				}));

				Promise.all(dataPromises).then(() => {
					conn.end().then(() => {
						return resolve(Object.values(stories));
					});
				}).catch(err => {
					conn.end().then(() => {
						return reject(err);
					});
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

StoryDB.prototype.getStory = function(storyId, userId){
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {

			let storyQuery = 'SELECT story.id, story.author, story.coverimage, story.visible, story.datemodified, story.datecreated from story';
			if(userId) storyQuery += ' JOIN  story_to_user ON story_to_user.storyId = story.id AND story_to_user.userId = ?';
			storyQuery += ' WHERE id = ?';

			conn.query(storyQuery, userId ? [userId, storyId] : [storyId]).then(storyResults => {
				conn.end().then(() => {
					AddStoriesMetadata(storyResults).then((stories) => {
						return resolve(stories[0]);
					}).catch(err => {
						return reject(err);
					});
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

StoryDB.prototype.getStories = function(includeUnpublished, userId){
	return new Promise((resolve, reject) => {
		pool.getConnection().then(conn => {

			let storyQuery = 'SELECT story.id, story.author, story.coverimage, story.visible, story.datemodified, story.datecreated from story';
			if(userId) storyQuery += ' JOIN  story_to_user ON story_to_user.storyId = story.id AND story_to_user.userId = ?';
			if(!includeUnpublished) storyQuery += ' WHERE visible = 1';

			conn.query(storyQuery, [userId]).then(storyResults => {
				conn.end().then(() => {
					AddStoriesMetadata(storyResults).then((stories) => {
						return resolve(stories);
					}).catch(err => {
						return reject(err);
					});
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

StoryDB.prototype.getStoryData = function(storyId){
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {
			let query = "SELECT data from story WHERE id = ?";
			conn.query(query, [storyId]).then(res => {
				conn.end().then(() => {
					return resolve(res[0] ? res[0].data : null);
				});
			}).catch(err => {
				return reject(err);
			});
		}).catch(err => {
			return reject(err);
		});

	});
}

StoryDB.prototype.getStoryToWrittenlanguage = function(storyId,writtenlanguageId) {
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("SELECT * FROM story_to_writtenlanguage WHERE(storyId="+storyId+" AND writtenlanguageId="+writtenlanguageId+")").then((result) => {
				conn.end().then(() => {
					return resolve(JSON.stringify(result));
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});
	});
}

StoryDB.prototype.deleteStoryToWrittenlanguage = function(storyId, writtenlanguageId) {
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			var query = 'DELETE FROM story_to_writtenlanguage WHERE(storyId=? AND writtenlanguageId=?)';
			conn.query(query, [storyId, writtenlanguageId]).then((result) => {
				conn.end().then(() => {
					return resolve(true);
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});
	});
}

StoryDB.prototype.getStoryToSignlanguage = function(storyId,signlanguageId) {
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("SELECT * FROM story_to_signlanguage WHERE(storyId="+storyId+" AND signlanguageId="+signlanguageId+")").then((result) => {
				conn.end().then(() => {
					return resolve(JSON.stringify(result));
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});
	});
}

StoryDB.prototype.deleteStoryToSignlanguage = function(storyId, signlanguageId) {
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			var query = 'DELETE FROM story_to_signlanguage WHERE(storyId=? AND signlanguageId=?)';
			conn.query(query, [storyId, signlanguageId]).then((result) => {
				conn.end().then(() => {
					return resolve(true);
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});
	});
}

StoryDB.prototype.addStoryCover = function(storyId,coverimage,author) {
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("UPDATE story SET coverimage='"+coverimage+"',author='"+author+"' WHERE(id="+storyId+")").then((result) => {
				console.log("[Affected-Rows]["+res.affectedRows+"]");
				conn.end().then(() => {
					return resolve('{rows:'+res.affectedRows+'}');
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});
	});
}

StoryDB.prototype.publishStory = function(storyId) {
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("UPDATE story SET visible=1 WHERE(id="+storyId+")").then((result) => {
				console.log("[Affected-Rows]["+res.affectedRows+"]");
				conn.end().then(() => {
					return resolve('{rows:'+res.affectedRows+'}');
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});
	});
}

StoryDB.prototype.addStoryData = function(storyId,theblob) {
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("UPDATE story SET data='"+theblob+"' WHERE(id="+storyId+")").then((result) => {
				console.log("[Affected-Rows]["+res.affectedRows+"]");
				conn.end().then(() => {
					return resolve('{rows:'+res.affectedRows+'}');
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});
	});
}

StoryDB.prototype.addStoryDescriptionId = function(storyId,descriptionId) {
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("UPDATE story SET descriptionId='"+descriptionId+"' WHERE(id="+storyId+")").then((result) => {

				console.log("[Affected-Rows]["+res.affectedRows+"]");
				conn.end().then(() => {
					return resolve('{rows:'+res.affectedRows+'}');
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});
	});
}

StoryDB.prototype.getStoryToGenre = function(storyId,genreId) {
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("SELECT * FROM story_to_genre WHERE(storyId="+storyId+" AND genreId="+genreId+")").then((result) => {
				conn.end().then(() => {
					return resolve(JSON.stringify(result));
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});
	});
}

StoryDB.prototype.getStoryToTag = function(storyId,tagId) {
	return new Promise((resolve, reject) => {

		pool.getConnection().then(conn => {

			conn.query("SELECT * FROM story_to_tag WHERE(storyId="+storyId+" AND tagId="+tagId+")").then((result) => {
				conn.end().then(() => {
					return resolve(JSON.stringify(result));
				});
			}).catch(err => {
				//handle error
				conn.end().then(() => {
					return reject(err);
				});
			});

		}).catch(err => {
			return reject(err);
		});
	});
}

let _StoryDB = new StoryDB();
module.exports = _StoryDB;

