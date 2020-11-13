const crypto = require('crypto');
const Settings = require('./Settings.js');
const ValidateUser = require('./ValidateUser.js');
const StoryDB = require('./StoryDB.js');
const UserDB = require('./UserDB.js');
const WrittenLanguageDB = require('./WrittenLanguageDB');
const SignLanguageDB = require('./SignLanguageDB');
const GenreDB = require('./GenreDB');
const TagDB = require('./TagDB');
const GameDB = require('./GameDB');
const ExportEPub = require('./ExportEPub.js');
/**
 * Create a random string at the desired length
 * @param  {int} length         the desired length of the string
 * @param  {boolean} useCapitals    flag to decide if the string should include capital letters
 * @param  {boolean} useIntegers    flag to decide if the string should use integers
 * @return {string}              the random string that is generated
 */
function createRandomString(length, useCapitals, useIntegers){
	// the list of characters allowed in the string
	var chars = "abcdefghijklmnopqrstuvwxyz";
	if(useCapitals) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	if(useIntegers) chars += "0123456789";

	var string = "";

	// loop selecting random letters from the list of characters until the string is the correct length
	for(var i=0; i<length; i++){
		var index = Math.floor(Math.random() * chars.length);
		string += chars.substring(index, index+1);
	}

	return string;
}

/**
 * Encrypt a given string
 * @param  {strin} string the string to encrypt
 * @param  {string} algo   the algorithm to use when encrypting the string
 * @param  {string} key    the key to use when encrypting the string
 * @return {string}        the encrypted string
 */
function encryptString(string, algo, key){
	var iv = createRandomString(16, true, true);
	var cipher = crypto.createCipheriv(algo, key, iv);
	var salt = createRandomString(50, true, true);

	let encrypted = cipher.update(salt + string, 'utf8', 'hex');
	encrypted += cipher.final('hex');

	return encrypted + iv;
}

/**
 * Decrypt a given string
 * @param  {string} encryptedString the string to be decrypted
 * @param  {string} algo            the algorythm used to encrypt the string
 * @param  {string} key             the key used to encrypt the string
 * @return {string}                 the decrypted string
 */
function decryptString(encryptedString, algo, key){
	var iv = encryptedString.substr(encryptedString.length - 16);
	var encrypted = encryptedString.substr(0, encryptedString.length - 16);
	var decipher = crypto.createDecipheriv(algo, key, iv);

	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	decrypted += decipher.final('utf8');

	return  decrypted.substr(50, decrypted.length -1);
}


let apiRoutes = function(app){
// ******************************************************
// User Routes
// ******************************************************
	app.post('/api/login', (req, res) => {
		let username = req.body.username,
			password = req.body.password;

		if(!username || username == '') {
			return res.status(400).send('Username Error');
		}
		if(!password || password == '') {
			return res.status(400).send('Password Error');
		}

		UserDB.getUser(username).then(function(user) {
			if(!user || decryptString(user.password, Settings.algo, Settings.key) != password){
				return res.send(false);
			}
			else{
				delete user.password;
				req.session.user = user;
				req.session.save(err => {
					if(err){
						return req.error(err); // res.status(500).send(err);
					}
					return res.send(true);
				});
			}
		}).catch(err => {
			return req.error(err); // res.status(500).send(err);
		});
	});

	app.post('/api/register', (req, res) => {
		let username = req.body.username,
			email = encryptString(req.body.email, Settings.algo, Settings.key),
			password = encryptString(req.body.password, Settings.algo, Settings.key);

		if(!username || username == '') {
			return res.status(400).send('Username Error');
		}
		if(!email || email == '') {
			return res.status(400).send('Email Error');
		}
		if(!password || password == '') {
			return res.status(400).send('Password Error');
		}

		UserDB.addUser(username, email, password).then(function(userId) {
			UserDB.getUser(username).then(function(user) {
				delete user.password;
				req.session.user = user;
				req.session.save(err => {
					if(err){
						return req.error(err); // res.status(500).send(err);
					}
					res.redirect('/Stories');
				});
			}).catch(err => {
				return req.error(err); // res.status(500).send(err);
			});
		}).catch(err => {
			return req.error(err); // res.status(500).send(err);
		});
	});

// ******************************************************
// Story Routes
// ******************************************************
	function SearchForMatch(term, comparingTerm, exactMatch){
		if(typeof comparingTerm == 'object'){
			let match = false;
			for(let i in comparingTerm){
				if(SearchForMatch(term, comparingTerm[i], exactMatch))
					match = true;
			}
			return match;
		}
		else if(typeof comparingTerm == 'string'){
			if(exactMatch){
				return term.toLowerCase() == comparingTerm.toLowerCase();
			}
			else{
				let reg = new RegExp(term, 'gi');
				return comparingTerm.match(reg) ? true : false;
			}
		}
		else{
			return false;
		}
	}
	function ValidateStory(req, res, next) {
		let id = parseInt(req.body.id) || parseInt(req.query.id);

		if(!id || id == '') {
			return res.status(400).send('StoryId Error');
		}

		StoryDB.get(id).then((story) => {
			if(story){
				StoryDB.getData(id).then((data) => {
					story.data = data;
					req.story = story;
					next();
				}).catch((err) => {
					return req.error(err); // res.status(500).send(err);
				});
			}
			else{
				return res.status(400).send('[PH] Invalid story id');
			}
		}).catch((err) => {
			return req.error(err);
		});
	}

	// get rountes
		app.get('/api/stories', (req, res) => {
			let unpublished = req.query.unpublished;

			StoryDB.getAll(unpublished).then((stories) => {
				return res.send(stories);
			}).catch((err) => {
				return req.error(err); // res.status(500).send(err);
			});
		});
		app.get('/api/story', (req, res) => {
			let id = req.query.id;		
			StoryDB.get(id).then((story) => {
				if(story){
					StoryDB.getData(id).then((data) => {
						story.data = data;
						return res.send(story);
					}).catch((err) => {
						return req.error(err); // res.status(500).send(err);
					});
				}
				else{
					return res.send(false);
				}
			}).catch((err) => {
				return req.error(err); // res.status(500).send(err);
			});
		});
		app.get('/api/stories/:term', (req, res) => {
			let term = req.params.term;
			StoryDB.getAll(false).then((_stories) => {
				let stories = [];

				for(let i=0; i<_stories.length; i++){
					let story = _stories[i];

					// Check for an exact match of the title 
					if(SearchForMatch(term, story.metadata.title, true))
						story.metadata.relevancy = 1;
					// Check for an exact match of the author
					else if(SearchForMatch(term, story.author, true))
						story.metadata.relevancy = 2;
					// Check for the occurance of the term in the title
					else if(SearchForMatch(term, story.metadata.title))
						story.metadata.relevancy = 3;
					// Check for the exact match of a tag
					else if(SearchForMatch(term, story.metadata.tags, true))
						story.metadata.relevancy = 4;
					// Check for the exact match of genre
					else if(SearchForMatch(term, story.metadata.genres, true))
						story.metadata.relevancy = 5;
					// Check for the occurance of the term a tag
					else if(SearchForMatch(term, story.metadata.tags, true))
						story.metadata.relevancy = 6;
					// Check for the occurance of the term a genre
					else if(SearchForMatch(term, story.metadata.genres, true))
						story.metadata.relevancy = 7;
					// Check for the occurance of the term a description
					else if(SearchForMatch(term, story.metadata.description))
						story.metadata.relevancy = 8;
					
					if(story.metadata.relevancy)
						stories.push(story);
				}

				stories = stories.sort((a, b) => {
					return a.relevancy > b.relevancy ? 1 : a.relevancy < b.relevancy ? -1 : 0;
				});			

				return res.send(stories);
			}).catch((err) => {
				return req.error(err); // res.status(500).send(err);
			});
		});
		app.get('/api/bookmarks', (req, res) => {
			if(!req.session.user){
				return res.send([]);
			}

			StoryDB.getAll(false, req.session.user.id).then((stories) => {
				return res.send(stories);
			}).catch((err) => {
				return req.error(err); // res.status(500).send(err);
			});
		});
		app.get('/api/story/games', ValidateStory, (req, res) => {
			let id = parseInt(req.query.id);

			StoryDB.getGameData(id).then((games) => {
				return res.send(games);
			}).catch((err) => {
				return req.error(err); // res.status(500).send(err);
			});
		});

	// post routes
		app.post('/api/story', ValidateUser, (req, res) => {
			StoryDB.add().then(function(storyId) {
				return res.send(storyId + '');
			}).catch(err => {
				return req.error(err); // res.status(500).send(err);
			});
		});
		app.get('/StoryDelete', ValidateUser, (req, res) => {
			let storyId = req.query.storyId;			
			StoryDB.deleteStory(storyId).then(function() {
				return res.redirect('back');
			}).catch(err => {
				return req.error(err); // res.status(500).send(err);
			});
		});
		app.get('/GameDelete', ValidateUser, (req, res) => {			
			let gameId = req.query.gameId;	
			StoryDB.deleteGame(gameId).then(function() {
				return res.redirect('back');
			}).catch(err => {
				return req.error(err); // res.status(500).send(err);
			});
		});
		app.post('/api/story/languages', ValidateUser, ValidateStory, (req, res) => {
			let id = parseInt(req.body.id),
				storyWrittenLanguages = req.body.writtenLanguages || [],
				storySignLanguages = req.body.signLanguages || [],
				story = req.story;

			new Promise((resolve, reject) => { // add or remove written languages
				WrittenLanguageDB.getAll().then((writtenLanguages) => { // get all written languages
					let promises = [];

					let nameBasedWrittenLanguages = {};
					for(let i in writtenLanguages){
						let language = writtenLanguages[i];
						nameBasedWrittenLanguages[language.name.toLowerCase()] = language;
					}

						// add new languages to the story
					for(let i in storyWrittenLanguages){
						let language = storyWrittenLanguages[i];
						if(!story.metadata || !story.metadata.writtenLanguages || story.metadata.writtenLanguages.indexOf(language) == -1){
							promises.push(new Promise((_resolve, _reject) => {
								let writtenlanguageId = nameBasedWrittenLanguages[language.toLowerCase()].id;
								StoryDB.addWrittenLanguage(story.id, writtenlanguageId).then(() => {
									if(!story.metadata) story.metadata = {};
									if(!story.metadata.writtenLanguages) story.metadata.writtenLanguages = [];
									story.metadata.writtenLanguages.push(language);
									return _resolve();
								}).catch((err) => {
									return _reject(err);
								});
							}))
						}
					}

						// remove old languages to the story
					if(story.metadata && story.metadata.writtenLanguages){
						for(let i in story.metadata.writtenLanguages){
							let language = story.metadata.writtenLanguages[i];
							if(storyWrittenLanguages.indexOf(language) != -1) continue;

							promises.push(new Promise((_resolve, _reject) => {
								let writtenlanguageId = nameBasedWrittenLanguages[language.toLowerCase()].id;
								StoryDB.deleteWrittenLanguage(story.id, writtenlanguageId).then(() => {
									let index = story.metadata.writtenLanguages.indexOf(language);
									story.metadata.writtenLanguages.splice(index, 1);
									return _resolve();
								}).catch((err) => {
									return _reject(err);
								});
							}));
						}
					}

					Promise.all(promises).then(() => {
						return resolve();
					}).catch((err) => {
						return reject(err);
					});
				});
			}).then(() => { // add or remove sign langugaes 
				return new Promise((resolve, reject) => {
					SignLanguageDB.getAll().then((signLanguages) => { // get all sign languages
						let promises = [];

						let nameBasedSignLanguages = {};
						for(let i in signLanguages){
							let language = signLanguages[i];
							nameBasedSignLanguages[language.name.toLowerCase()] = language;
						}
	 					
	 					// add new languages to the story
						for(let i in storySignLanguages){
							let language = storySignLanguages[i];
							if(!story.metadata || !story.metadata.signLanguages || story.metadata.signLanguages.indexOf(language) == -1){
								promises.push(new Promise((_resolve, _reject) => {
									let signlanguageId = nameBasedSignLanguages[language.toLowerCase()].id;
									StoryDB.addSignLanguage(story.id, signlanguageId).then(() => {
										if(!story.metadata) story.metadata = {};
										if(!story.metadata.signLanguages) story.metadata.signLanguages = [];
										story.metadata.signLanguages.push(language);
										return _resolve();
									}).catch((err) => {
										return _reject(err);
									});
								}))
							}
						}

	 					// remove old languages to the story
						if(story.metadata && story.metadata.signLanguages){
							for(let i in story.metadata.signLanguages){
								let language = story.metadata.signLanguages[i];
								if(storySignLanguages.indexOf(language) != -1) continue;

								promises.push(new Promise((_resolve, _reject) => {
									let signlanguageId = nameBasedSignLanguages[language.toLowerCase()].id;
									StoryDB.deleteSignLanguage(story.id, signlanguageId).then(() => {
										let index = story.metadata.signLanguages.indexOf(language);
										story.metadata.signLanguages.splice(index, 1);
										return _resolve();
									}).catch((err) => {
										return _reject(err);
									});
								}));
							}
						}

						Promise.all(promises).then(() => {
							return resolve();
						}).catch((err) => {
							return reject(err);
						});
					});
				});
			}).then(() => { // finish up
				return res.send(story);
			}).catch((err) => {
				return req.error(err); // res.status(500).send(err);
			})
		});
		app.post('/api/story/cover', ValidateUser, ValidateStory, (req, res) => {
			let id = parseInt(req.body.id),
				author = req.body.author || '',
				artist = req.body.artist || '',
				coverImage = req.body.coverImage,
				story = req.story;
			StoryDB.setCover(id, author, artist, coverImage).then(function(result) {
				story.author = author;
				story.artist = artist;
				story.coverimage = coverImage;
				return res.send(story);
			}).catch((err) =>{
				return req.error(err);
			});
		});
		app.post('/api/story/metadata', ValidateUser, ValidateStory, (req, res) => {
			let id = parseInt(req.body.id),
				metadata = req.body.metadata,
				story = req.story,
				languages = {};

			new Promise((resolve, reject) => { // get all written languages
				WrittenLanguageDB.getAll().then((_languages) => {
					for(let i in _languages){
						languages[_languages[i].name] = _languages[i];
					}

					return resolve();
				}).catch((err) => {
					return reject(err);
				});
			}).then(() =>{ // update titles
				return new Promise((resolve, reject) => {
					if(!metadata.title)
						metadata.title = {};

					let promises = [];

					// add or update titles
					for(let lang in metadata.title){
						promises.push(new Promise((_resolve, _reject) => {
							StoryDB.setTitle(story.id, languages[lang].id, metadata.title[lang]).then(() => {
								story.metadata.title[lang] = metadata.title[lang];
								_resolve();
							}).catch((err) => {
								_reject(err);
							});
						}));
					}

					// delete old titles
					for(let lang in story.metadata.title){
						if(metadata.title[lang]) continue;

						promises.push(new Promise((_resolve, _reject) => {
							StoryDB.deleteTitle(story.id, languages[lang].id).then(() => {
								delete story.metadata.title[lang];
								_resolve();
							}).catch((err) => {
								_reject(err);
							});
						}));
					}

					Promise.all(promises).then(() => {
						resolve();
					}).catch((err) => {
						reject(err);
					});
				});
			}).then(() =>{ // update descriptions
				return new Promise((resolve, reject) => {
					if(!metadata.description)
						metadata.description = {};

					let promises = [];

					// add or update descriptions
					for(let lang in metadata.description){
						promises.push(new Promise((_resolve, _reject) => {
							StoryDB.setDescription(story.id, languages[lang].id, metadata.description[lang]).then(() => {
								story.metadata.description[lang] = metadata.description[lang];
								_resolve();
							}).catch((err) => {
								_reject(err);
							});
						}));
					}
					// add or update signer
					for(let lang in metadata.signer){
						promises.push(new Promise((_resolve, _reject) => {
							StoryDB.setSigner(story.id, languages[lang].id, metadata.signer[lang]).then(() => {
								story.metadata.signer[lang] = metadata.signer[lang];
								_resolve();
							}).catch((err) => {
								_reject(err);
							});
						}));
					}
					// add or update translator
					for(let lang in metadata.translator){
						promises.push(new Promise((_resolve, _reject) => {
							StoryDB.setTranslator(story.id, languages[lang].id, metadata.translator[lang]).then(() => {
								story.metadata.translator[lang] = metadata.translator[lang];
								_resolve();
							}).catch((err) => {
								_reject(err);
							});
						}));
					}

					// delete old descriptions
					for(let lang in story.metadata.description){
						if(metadata.description[lang]) continue;

						promises.push(new Promise((_resolve, _reject) => {
							StoryDB.deleteDescription(story.id, languages[lang].id).then(() => {
								delete story.metadata.description[lang];
								_resolve();
							}).catch((err) => {
								_reject(err);
							});
						}));
					}

					Promise.all(promises).then(() => {
						resolve();
					}).catch((err) => {
						reject(err);
					});
				});
			}).then(() =>{ // update genres
				return new Promise((resolve, reject) => {
					GenreDB.getAll().then((_genres) => {
						let genres = {};
						for(let i in _genres){
							genres[_genres[i].name] = _genres[i];
						}

						if(!metadata.genres)
							metadata.genres = {};
						let promises = [];

						// add new genres
						for(let lang in metadata.genres){
							for(let i in metadata.genres[lang]){
								let genre = metadata.genres[lang][i].toLowerCase();
								if(story.metadata.genres[lang] && story.metadata.genres[lang].indexOf(genre) != -1) continue;

								promises.push(new Promise((_resolve, _reject) => {
									StoryDB.addGenre(story.id, genres[genre].id).then(() => {
										if(!story.metadata.genres[lang]) story.metadata.genres[lang] = [];
										story.metadata.genres[lang].push(genre);
										_resolve();
									}).catch((err) => {
										_reject(err);
									});
								}));
							}
						}

						// delete old genres
						for(let lang in story.metadata.genres){
							for(let i in story.metadata.genres[lang]){
								let genre = story.metadata.genres[lang][i].toLowerCase();
								if(metadata.genres[lang] && metadata.genres[lang].indexOf(genre) != -1) continue;

								promises.push(new Promise((_resolve, _reject) => {
									StoryDB.deleteGenre(story.id,  genres[genre].id).then(() => {
										story.metadata.genres[lang].splice(i, 1);
										_resolve();
									}).catch((err) => {
										_reject(err);
									});
								}));
							}
						}

						Promise.all(promises).then(() => {
							resolve();
						}).catch((err) => {
							reject(err);
						});
					}).catch((err) => {
						reject(err);
					});
				});
			}).then(() =>{ // update tags
				return new Promise((resolve, reject) => {
					TagDB.getAll().then((_tags) => {
						let tags = {};
						for(let i in _tags){
							tags[_tags[i].name] = _tags[i];
						}

						if(!metadata.tags)
							metadata.tags = {};

						let promises = [];

						// add new tags
						for(let lang in metadata.tags){
							for(let i in metadata.tags[lang]){
								let tag = metadata.tags[lang][i].toLowerCase();
								if(story.metadata.tags[lang] && story.metadata.tags[lang].indexOf(tag) != -1) continue;

								promises.push(new Promise((_resolve, _reject) => {
									StoryDB.addTag(story.id, tags[tag].id).then(() => {
										if(!story.metadata.tags[lang]) story.metadata.tags[lang] = [];
										story.metadata.tags[lang].push(tag);
										_resolve();
									}).catch((err) => {
										_reject(err);
									});
								}));
							}
						}

						// delete old tags
						for(let lang in story.metadata.tags){
							for(let i in story.metadata.tags[lang]){
								let tag = story.metadata.tags[lang][i].toLowerCase();
								if(metadata.tags[lang] && metadata.tags[lang].indexOf(tag) != -1) continue;

								promises.push(new Promise((_resolve, _reject) => {
									StoryDB.deleteTag(story.id, tags[tag].id).then(() => {
										story.metadata.tags[lang].splice(i, 1);
										_resolve();
									}).catch((err) => {
										_reject(err);
									});
								}));
							}
						}

						Promise.all(promises).then(() => {
							resolve();
						}).catch((err) => {
							reject(err);
						});
					}).catch((err) => {
						reject(err);
					});
				});
			}).then(() => { // finish up
				return res.send(story);
			}).catch((err) => {
				return req.error(err); // res.status(500).send(err);
			});
		});
		app.post('/api/story/data', ValidateUser, ValidateStory, (req, res) => {
			let id = parseInt(req.body.id),
				data = req.body.data,
				story = req.story;

			StoryDB.setData(id, data).then(function(result) {
				story.data = data;
				return res.send(story);
			}).catch((err) =>{
				return req.error(err);
			});
		});	
		app.post('/api/story/publish', ValidateUser, ValidateStory, (req, res) => {
			let id = parseInt(req.body.id);

			StoryDB.setVisible(id).then((result) => {
				return res.send(req.story);
			}).catch((err) =>{
				return req.error(err);
			});
		});
		app.post('/api/story/view', ValidateStory, (req, res) => {
			let id = parseInt(req.body.id);

			StoryDB.addView(id).then((result) => {
				return res.send(true);
			}).catch((err) =>{
				return req.error(err);
			});
		});
		app.post('/api/story/like', ValidateStory, (req, res) => {
			let id = parseInt(req.body.id);

			StoryDB.addLike(id).then((result) => {
				return res.send(true);
			}).catch((err) =>{
				return req.error(err);
			});
		});
		//app.post('/api/story/export', ValidateUser, ValidateStory, (req, res) => {
		app.post('/api/story/export', ValidateStory, (req, res) => {
			let story = req.story,
			    data = req.story.data,
			    url = "http://" + req.headers.host,
			    writtenlanguageId = req.body.curWrittenLang,
				signlanguageId = req.body.curSignLang;
				//console.log(story.metadata);
			ExportEPub.generateContent(story, data, url, writtenlanguageId, signlanguageId).then((result) =>{
				console.log("result: " + result);
				res.send(result);
			}).catch((err) =>{
				console.log("error: " + err);
				return req.error(err);
			});
		});
		app.post('/api/story/game', ValidateUser, ValidateStory, (req, res) => {
			let id = parseInt(req.body.id),
				gameId = parseInt(req.body.gameId),
				writtenlanguageId = parseInt(req.body.writtenlanguageId),
				signlanguageId = parseInt(req.body.signlanguageId);

			StoryDB.addGamedata(id, gameId, writtenlanguageId, signlanguageId).then((gamedataId) => {
				return res.send(gamedataId + '');
			}).catch((err) => {
				return req.error(err); // res.status(500).send(err);
			});
		});		
		app.post('/api/story/gamedata', ValidateUser, (req, res) => {
			let id = parseInt(req.body.id),
				data = req.body.data;

			if(!id || id == '') {
				return res.send('Id Error');
			}

			StoryDB.setGameData(id, data).then((gamedata) => {
				return res.send(true);
			}).catch(err => {
				return req.error(err); // res.status(500).send(err);
			});
		});

// ******************************************************
// Other Routes
// ******************************************************
	app.get('/api/writtenlanguages', (req, res) => {
		WrittenLanguageDB.getAll().then((languages) => {
			return res.send(languages);
		}).catch((err) => {
			return req.error(err); // res.status(500).send(err);
		});
	});
	app.get('/api/signlanguages', (req, res) => {
		SignLanguageDB.getAll().then((languages) => {
			return res.send(languages);
		}).catch((err) => {
			return req.error(err); // res.status(500).send(err);
		});
	});
	app.get('/api/genres', (req, res) => {
		GenreDB.getAll().then((genres) => {
			return res.send(genres);
		}).catch((err) => {
			return req.error(err); // res.status(500).send(err);
		});
	});
	app.get('/api/tags', (req, res) => {
		TagDB.getAll().then((tags) => {
			return res.send(tags);
		}).catch((err) => {
			return req.error(err); // res.status(500).send(err);
		});
	});
	app.get('/api/games', (req, res) => {
		GameDB.getAll().then((tags) => {
			return res.send(tags);
		}).catch((err) => {
			return req.error(err); // res.status(500).send(err);
		});
	});
	app.get('/api/game/data', (req, res) => {
		let id = parseInt(req.query.id);

		GameDB.getGameData(id).then((gamedata) => {
			if(!gamedata) return res.send({});

			StoryDB.get(gamedata.storyId).then((story) => {
				gamedata.story = story;

				StoryDB.getData(gamedata.storyId).then((data) => {
					gamedata.story.data = data;
					if(gamedata.data) gamedata.data = JSON.parse(gamedata.data);
					return res.send(gamedata);
				}).catch((err) => {
					return req.error(err); // res.status(500).send(err);
				});
			}).catch((err) => {
				return req.error(err); // res.status(500).send(err);
			});
		}).catch((err) => {
			return req.error(err); // res.status(500).send(err);
		});
	});

	app.post('/api/writtenlanguage', ValidateUser, (req, res) => {
		let language = req.body.language;

		if(!language || language == '') {
			return res.send('Language Error');
		}

		// try to get any existing language
		WrittenLanguageDB.get(language).then((_language) =>{
			if(_language){
				// if the language already exists pass back its id
				return res.send(_language.id + '');
			}

			// add the new language to the database
			WrittenLanguageDB.add(language).then((languageId) => {
				return res.send(languageId + '');
			}).catch(err => {
				return req.error(err); // res.status(500).send(err);
			});
		}).catch(err => {
			return req.error(err); // res.status(500).send(err);
		});
	});
	app.post('/api/signlanguage', ValidateUser, (req, res) => {
		let language = req.body.language;

		if(!language || language == '') {
			return res.send('Language Error');
		}

		// try to get any existing language
		SignLanguageDB.get(language).then((_language) =>{
			if(_language){
				// if the language already exists pass back its id
				return res.send(_language.id + '');
			}

			// add the new language to the database
			SignLanguageDB.add(language).then((languageId) => {
				return res.send(languageId + '');
			}).catch(err => {
				return req.error(err); // res.status(500).send(err);
			});
		}).catch(err => {
			return req.error(err); // res.status(500).send(err);
		});
	});
	app.post('/api/genre', ValidateUser, (req, res) => {
		let name = req.body.name,
			language = req.body.language;

		if(!name || name == '') {
			return res.send('Name Error');
		}

		if(!language || language == '') {
			return res.send('Language Error');
		}

		// get the language from the database
		WrittenLanguageDB.get(language).then((_language) =>{
			if(!_language){
				return res.send('Language Error');
			}

			// check to see if this genre exist for this language already
			GenreDB.get(name, _language.id).then((_genre) =>{
				if(_genre){
					// pass back the existing genre id
					return res.send(_genre.id + '');
				}

				// add the new genre to the database
				GenreDB.add(name, _language.id).then((genreId) => {
					return res.send(genreId + '');
				}).catch(err => {
					return req.error(err); // res.status(500).send(err);
				});
			}).catch(err => {
				return req.error(err); // res.status(500).send(err);
			});
		}).catch(err => {
			return req.error(err); // res.status(500).send(err);
		});
	});
	app.post('/api/tag', ValidateUser, (req, res) => {
		let name = req.body.name,
			language = req.body.language;

		if(!name || name == '') {
			return res.send('Name Error');
		}

		if(!language || language == '') {
			return res.send('Language Error');
		}

		// get the language from the database
		WrittenLanguageDB.get(language).then((_language) =>{
			if(!_language){
				return res.send('Language Error');
			}

			// check to see if this tag exist for this language already
			TagDB.get(name, _language.id).then((_tag) =>{
				if(_tag){
					// pass back the existing tag id
					return res.send(_tag.id + '');
				}

				// add the new genre to the database
				TagDB.add(name, _language.id).then((tagId) => {
					return res.send(tagId + '');
				}).catch(err => {
					return req.error(err); // res.status(500).send(err);
				});
			}).catch(err => {
				return req.error(err); // res.status(500).send(err);
			});
		}).catch(err => {
			return req.error(err); // res.status(500).send(err);
		});
	});
	app.post('/api/game', ValidateUser, (req, res) => {
		let name = req.body.name;

		if(!name || name == '') {
			return res.send('Name Error');
		}

		// try to get any existing language
		GameDB.get(name).then((game) =>{
			if(game){
				// if the name already exists pass back its id
				return res.send(game.id + '');
			}

			// add the new name to the database
			GameDB.add(name).then((nameId) => {
				return res.send(nameId + '');
			}).catch(err => {
				return req.error(err); // res.status(500).send(err);
			});
		}).catch(err => {
			return req.error(err); // res.status(500).send(err);
		});
	});
}

module.exports = apiRoutes;