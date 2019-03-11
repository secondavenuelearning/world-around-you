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

	app.get('/api/stories/metadata', (req, res) => {

	});
}

module.exports = apiRoutes;