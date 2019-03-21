const Settings = require('./Settings.js');
const ValidateUser = require('./js/Server/ValidateUser.js');
const StoryDB = require('./StoryDB.js');
const UserDB = require('./UserDB.js');

var apiRoutes = function(app){
// ******************************************************
// User Routes
// ******************************************************
	app.post('/api/login', (req, res) => {
		let username = req.body.username,
			password = req.body.password;

		if(!username || username == '') {
			res.send('Username Error');
			return;
		}
		if(!password || password == '') {
			res.send('Password Error');
			return;
		}

		UserDB.getUser(username).then(function(user) {
			if(!user || user.password != password){
				res.send(false);
			}
			else{
				delete user.password;
				req.session.user = user;
				req.session.save(err => {
					if(err){
						res.send(err);
						return;
					}
					res.send(true);
				});
			}
		}).catch(err => {
			res.send(err);
		});
	});

	app.post('/api/register', (req, res) => {
		let username = req.body.username,
			email = req.body.email,
			password = req.body.password;

		if(!username || username == '') {
			res.send('Username Error');
			return;
		}
		if(!email || email == '') {
			res.send('Email Error');
			return;
		}
		if(!password || password == '') {
			res.send('Password Error');
			return;
		}

		UserDB.addUser(username, email, password).then(function(userId) {
			UserDB.getUser(username).then(function(user) {
				delete user.password;
				req.session.user = user;
				req.session.save(err => {
					if(err){
						res.send(err);
						return;
					}
					res.redirect('/Stories');
				});
			}).catch(err => {
				res.send(err);
			});
		}).catch(err => {
			res.send(err);
		});
	});

// ******************************************************
// Story Routes
// ******************************************************

	app.get('/api/stories', (req, res) => {
		let unpublished = req.query.unpublished;

		StoryDB.getStories(unpublished).then((stories) => {
			res.send(stories);
		}).catch((err) => {
			res.send(err);
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

	app.get('/api/search/:term', (req, res) => {
		let term = req.params.term;
		StoryDB.getStories(false).then((_stories) => {
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

			res.send(stories);
		}).catch((err) => {
			res.send(err);
		});
	});

	app.get('/api/bookmarks', (req, res) => {
		if(!req.session.user){
			res.send([]);
			return;
		}

		StoryDB.getStories(false, req.session.user.id).then((stories) => {
			res.send(stories);
		}).catch((err) => {
			res.send(err);
		});
	});

	// app.post('/api/story', ValidateUser, (req,res) => {
	// 	StoryDB.addEmptyStory().then(function(result) {
	// 		res.send(result);
	// 	}).catch(err => {
	// 		res.send(err);
	// 	});
	// });
}

module.exports = apiRoutes;