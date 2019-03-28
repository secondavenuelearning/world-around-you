const path = require('path');
const multer = require('multer');

const Settings = require('./Settings.js');
const ValidateUser = require('./ValidateUser.js');
const StoryDB = require('./StoryDB.js');
const UserDB = require('./UserDB.js');
const WrittenLanguageDB = require('./WrittenLanguageDB');
const SignLanguageDB = require('./SignLanguageDB');
const GenreDB = require('./GenreDB');
const TagDB = require('./TagDB');


let apiRoutes = function(app){
// ******************************************************
// User Routes
// ******************************************************
	app.post('/api/login', (req, res) => {
		let username = req.body.username,
			password = req.body.password;

		if(!username || username == '') {
			return res.send('Username Error');
		}
		if(!password || password == '') {
			return res.send('Password Error');
		}

		UserDB.getUser(username).then(function(user) {
			if(!user || user.password != password){
				return res.send(false);
			}
			else{
				delete user.password;
				req.session.user = user;
				req.session.save(err => {
					if(err){
						return res.send(err);
					}
					return res.send(true);
				});
			}
		}).catch(err => {
			return res.send(err);
		});
	});

	app.post('/api/register', (req, res) => {
		let username = req.body.username,
			email = req.body.email,
			password = req.body.password;

		if(!username || username == '') {
			return res.send('Username Error');
		}
		if(!email || email == '') {
			return res.send('Email Error');
		}
		if(!password || password == '') {
			return res.send('Password Error');
		}

		UserDB.addUser(username, email, password).then(function(userId) {
			UserDB.getUser(username).then(function(user) {
				delete user.password;
				req.session.user = user;
				req.session.save(err => {
					if(err){
						return res.send(err);
					}
					res.redirect('/Stories');
				});
			}).catch(err => {
				return res.send(err);
			});
		}).catch(err => {
			return res.send(err);
		});
	});

// ******************************************************
// Story Routes
// ******************************************************
	app.get('/api/stories', (req, res) => {
		let unpublished = req.query.unpublished;

		StoryDB.getAll(unpublished).then((stories) => {
			return res.send(stories);
		}).catch((err) => {
			return res.send(err);
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
					return res.send(err);
				});
			}
			else{
				return res.send(false);
			}
		}).catch((err) => {
			return res.send(err);
		});
	});
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
				else if(SearchForMatch(term, story.metadata.tag, true))
					story.metadata.relevancy = 4;
				// Check for the exact match of genre
				else if(SearchForMatch(term, story.metadata.genre, true))
					story.metadata.relevancy = 5;
				// Check for the occurance of the term a tag
				else if(SearchForMatch(term, story.metadata.tag, true))
					story.metadata.relevancy = 6;
				// Check for the occurance of the term a genre
				else if(SearchForMatch(term, story.metadata.genre, true))
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
			return res.send(err);
		});
	});
	app.get('/api/bookmarks', (req, res) => {
		if(!req.session.user){
			return res.send([]);
		}

		StoryDB.getAll(false, req.session.user.id).then((stories) => {
			return res.send(stories);
		}).catch((err) => {
			return res.send(err);
		});
	});


	app.post('/api/story', ValidateUser, (req,res) => {
		StoryDB.addStory().then(function(storyId) {
			return res.send(storyId + '');
		}).catch(err => {
			return res.send(err);
		});
	});
	app.post('/api/story/languages', ValidateUser, (req, res) => {
		let id = parseInt(req.body.id),
			storyWrittenLanguages = req.body.writtenLanguages || [],
			storySignLanguages = req.body.signLanguages || [];

		new Promise((resolve, reject) => { // check if the story exists
			StoryDB.get(id).then((story) => {
				if(story){
					return resolve(story);
				}
				else{
					return reject('[PH] Invalid story id');
				}
			}).catch((err) => {
				return reject(err);
			});
		}).then((story) => { // add or remove written languages
			return new Promise((resolve, reject) => {
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
								StoryDB.addWrittenlanguage(story.id, writtenlanguageId).then(() => {
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
								StoryDB.deleteWrittenlanguage(story.id, writtenlanguageId).then(() => {
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
						return resolve(story);
					}).catch((err) => {
						return reject(err);
					});
				});
			});
		}).then((story) => { // add or remove sign langugaes 
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
								StoryDB.addSignlanguage(story.id, signlanguageId).then(() => {
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
								StoryDB.deleteSignlanguage(story.id, signlanguageId).then(() => {
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
						return resolve(story);
					}).catch((err) => {
						return reject(err);
					});
				});
			});
		}).then((story) => { // finish up
			return res.send(story);
		}).catch((err) => {
			return res.send(err);
		})
	});
	app.post('/api/story/cover', ValidateUser, (req, res) => {
		let id = parseInt(req.body.id),
			author = req.body.author || '',
			coverImage = req.body.coverImage;

		if(!id || id == '') {
			return res.send('StoryId Error');
		}

		new Promise((resolve, reject) => { // check if the story exists
			StoryDB.get(id).then((story) => {
				if(story){
					return resolve(story);
				}
				else{
					return reject('[PH] Invalid story id');
				}
			}).catch((err) => {
				return reject(err);
			});
		}).then((story) =>{
			StoryDB.setCover(id, author, coverImage).then(function(result) {
				story.author = author;
				story.coverimage = coverImage;

				return res.send(story);
			}).catch((err) =>{
				res.send(err);
			});
		}).catch(err => {
			res.send(err);
		});
	});
	app.post('/api/story/metadata', ValidateUser, (req, res) => {
		let id = parseInt(req.body.id),
			metadata = req.body.metadata;

		new Promise((resolve, reject) => { // check if the story exists
			StoryDB.get(id).then((story) => {
				if(story){
					return resolve(story);
				}
				else{
					return reject('[PH] Invalid story id');
				}
			}).catch((err) => {
				return reject(err);
			});
		}).then((story) =>{ // get all written languages
			return new Promise((resolve, reject) => {
				WrittenLanguageDB.getAll().then((_languages) => {
					languages = {};
					for(let i in _languages){
						languages[_languages[i].name] = _languages[i];
					}

					return resolve({story, languages});
				}).catch((err) => {
					return reject(err);
				});
			});
		}).then((obj) =>{ // update titles
			let story = obj.story,
				languages = obj.languages;

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
					resolve({story, languages});
				}).catch((err) => {
					reject(err);
				});
			});
		}).then((obj) =>{ // update descriptions
			let story = obj.story,
				languages = obj.languages;

			
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
					resolve({story, languages});
				}).catch((err) => {
					reject(err);
				});
			});
		}).then((obj) =>{ // update genres
			let story = obj.story,
				languages = obj.languages;

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
						resolve({story, languages});
					}).catch((err) => {
						reject(err);
					});
				}).catch((err) => {
					reject(err);
				});
			});
		}).then((obj) =>{ // update tags
			let story = obj.story,
				languages = obj.languages;

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
						resolve(story);
					}).catch((err) => {
						reject(err);
					});
				}).catch((err) => {
					reject(err);
				});
			});
		}).then((story) => { // finish up
			return res.send(story);
		}).catch((err) => {
			return res.send(err);
		});
	});
	app.post('/api/story/data', ValidateUser, (req, res) => {
		let id = parseInt(req.body.id),
			data = req.body.data;

		new Promise((resolve, reject) => { // check if the story exists
			StoryDB.get(id).then((story) => {
				if(story){
					return resolve(story);
				}
				else{
					return reject('[PH] Invalid story id');
				}
			}).catch((err) => {
				return reject(err);
			});
		}).then((story) =>{
			StoryDB.setData(id, data).then(function(result) {
				story.data = data;

				return res.send(story);
			}).catch((err) =>{
				res.send(err);
			});
		}).catch(err => {
			res.send(err);
		});
	});	
	app.post('/api/story/publish',function(req,res) {
		let id = parseInt(req.body.id);

		new Promise((resolve, reject) => { // check if the story exists
			StoryDB.get(id).then((story) => {
				if(story){
					return resolve(story);
				}
				else{
					return reject('[PH] Invalid story id');
				}
			}).catch((err) => {
				return reject(err);
			});
		}).then((story) =>{
			StoryDB.setVisible(id).then(function(result) {
				return res.send(story);
			}).catch((err) =>{
				res.send(err);
			});
		}).catch(err => {
			res.send(err);
		});
	});

// ******************************************************
// Other Routes
// ******************************************************
	app.get('/api/writtenlanguages', (req, res) => {
		WrittenLanguageDB.getAll().then((languages) => {
			return res.send(languages);
		}).catch((err) => {
			return res.send(err);
		});
	});
	app.get('/api/signlanguages', (req, res) => {
		SignLanguageDB.getAll().then((languages) => {
			return res.send(languages);
		}).catch((err) => {
			return res.send(err);
		});
	});
	app.get('/api/genres', (req, res) => {
		GenreDB.getAll().then((genres) => {
			return res.send(genres);
		}).catch((err) => {
			return res.send(err);
		});
	});
	app.get('/api/tags', (req, res) => {
		TagDB.getAll().then((tags) => {
			return res.send(tags);
		}).catch((err) => {
			return res.send(err);
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
				return res.send(err);
			});
		}).catch(err => {
			return res.send(err);
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
				return res.send(err);
			});
		}).catch(err => {
			return res.send(err);
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
					return res.send(err);
				});
			}).catch(err => {
				return res.send(err);
			});
		}).catch(err => {
			return res.send(err);
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
					return res.send(err);
				});
			}).catch(err => {
				return res.send(err);
			});
		}).catch(err => {
			return res.send(err);
		});
	});

// ******************************************************
// File Upload
// ******************************************************
	// Set Storage Engine
	const storage = multer.diskStorage({
		destination: 'uploads',
		filename: function(req, file, cb) {
			cb(null, req.params.fileName + path.extname(file.originalname));
		}
	});

	// Init upload
	const upload = multer({
		storage: storage,
		limits: {fileSize:10000000000},
		fileFilter: function(req, file, cb) {
			checkFileType(file, cb);
		}
	}).single('file');

	// Check File Type
	function checkFileType(file, cb) {
		// Allowed ext
		const filetypes = /jpeg|jpg|png|gif|mp4|mp3/;
		// Check ext
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
		// Check mime
		const mimetype = filetypes.test(file.mimetype); 

		if(mimetype && extname) {
			return cb(null, true);
		}
		else {
			cb('Error: Videos and Images Only!');
		}
	}

	app.post('/api/file/:fileName', ValidateUser, (req, res) => {
		upload(req, res, (err) => {
			if(err) {
				res.send(err);
			}
			else {
				if(req.file == undefined) {
					res.send({
						msg: 'Error: No File Selected!'
					});
				}
				else {
					res.send(`${req.file.path}`);
				}
			}
		});
	});

}

module.exports = apiRoutes;