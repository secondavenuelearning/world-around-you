const Settings = require('./Settings.js');
const StoryDB = require('./StoryDB.js');

var apiRoutes = function(app){
// ******************************************************
// Get Stories
// ******************************************************
	app.get('/api/stories', (req, res) => {
		var unpublished = req.query.unpublished;

		StoryDB.getStories(unpublished).then((stories) => {
			res.send(stories);
		}).catch((err) => {
			res.send(err);
		});
	});

	app.get('/api/search/:term', (req, res) => {
		StoryDB.getStories(false).then((_stories) => {
			var stories = [];

			// Check for an exact match of the title or author
			
			// Check for the occurance of the term in the title
			
			// CHeck for the exact match of a tag
			
			// Check for 
			
			// 
			
			// 

			res.send(stories);
		}).catch((err) => {
			res.send(err);
		});

	});
}

module.exports = apiRoutes;