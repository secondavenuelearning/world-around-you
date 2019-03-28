const fs = require('fs');
const express = require('express');
const session = require('express-session');
const LokiStore = require('connect-loki')(session);
const bodyParser = require('body-parser');
const _ = require('underscore');

const Settings = require('./js/Server/Settings.js');
const ValidateUser = require('./js/Server/ValidateUser.js');
const ApiRoutes = require('./js/Server/ApiRoutes.js');


let PageHTML = fs.readFileSync('html/Server/Page.html', 'utf8');
let PageTemplate = _.template(PageHTML);


const LikedDB = require('./js/Server/LikedDB.js');
const StoryDB = require('./js/Server/StoryDB.js');
const UserDB = require('./js/Server/UserDB.js');
const UsertypeDB = require('./js/Server/UsertypeDB.js');
const ViewDB = require('./js/Server/ViewDB.js');


/**
 * Adds text to the defined log file, creates a new file is the original is too long
 * @param {string} log  	name of the log file
 * @param {string} text 	text to add to the file
 * @param {string} dir 		the directory of where the logs should be put
 * @return {string}			returns the new name of the file
 */
function WriteLog(log, text, dir){
	dir = dir || './logs';
	
	// create the directory if it doesn't exist
	var dirExist = fs.existsSync(dir);
	if(!dirExist) fs.mkdirSync(dir);

	// write the log file
	fs.writeFileSync(`${dir}/${log}`, `\n${text}`, {flag: 'a'});
	console.log(`${dir}/${log}`, text);

	// loop through to make sure we are accessing the correct log and no log file gets too big
	var loop = true;
	var appendix = 0;
	const originalLog = log;

	while(loop){
		// check the file size and switch to a differenct file if it is too big
		var stats = fs.statSync(`${dir}/${log}`);
		var fileSize = stats.size / 1000000;

		// move to a different file if the log is too big
		if(fileSize > 1000){
			appendix++;
			log = `${originalLog}_${appendix}`;
		}
		else{
			loop = false;
		}
	}

	// return the log in case it has changed, to avoid doing the loop every time.
	return log;
}

/**
 * Function to create a session file store for the server
 * @param {Expressjs} _app    	express.js server app
 * @param {object} options 		default options for the sessions store
 */
function CreateSessions(_app, options){
    var options = typeof options == "object" ? options : {};
    options.secret = options.secret || "worldAroundYou"; // the secret is used as the id for the session cookie
    options.resave = options.resave || false;     // automatically save sessions whenever they are grabbed even if they arent modified
    options.rolling = typeof options.rolling == "boolean" ? options.resave : true;     // automatically update the session time unless asked to do otherwise
    options.saveUninitialized = options.saveUninitialized || false; // automatically save new sessions that have not been modified
    options.cookie = {};
    options.cookie.maxAge = options.maxAge || 60 * 60 * 1000; // 60 min max age
    options.cookie.secure = options.secure || false;
   
    var storeOptions = {}
    storeOptions.ttl = options.maxAge ? options.maxAge / 1000 : 60 * 60; // 60 min age
    storeOptions.ttlInterval = storeOptions.ttl;
    options.store = new LokiStore(storeOptions);

    _app.use(session(options));
}


var access_log = "access.log";
var error_log = "error.log";
const app = express();


app.use(bodyParser.json({limit:"50mb"})); // for parsing application/json
app.use(bodyParser.urlencoded({ extended:true, limit:"50mb" })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname));

CreateSessions(app, {});

var sess=null;
// ****************************************************************************
// * CREATE SESSION STUFF - ABOVE THIS LINE                                   *
// ****************************************************************************
	app.use((req, res, next) => {		
		// add to the access log
		if(!req.url.match(/.js|.css|.html|.png|.jpg/)){
			access_log = WriteLog(access_log, `Log (${new Date()}): ${req.method} | ${req.url}`);
		}

		// set a browser cookie
		if(req.session.user){
			res.cookie('way.user', req.session.user, { maxAge: 60 * 60 * 1000, httpOnly: false});
		}
		else{
			res.clearCookie('way.user');
		}

		next();
	});

	app.get('/', (req, res) => {
		res.redirect('/Stories');
	});
	app.get('/Stories', (req, res) => {
		res.send(PageTemplate({
			Page: 'Stories'
		}));
	});
	app.get('/Games', (req, res) => {
		res.send(PageTemplate({
			Page: 'Games'
		}));
	});
	app.get('/Login', (req, res) => {
		res.send(PageTemplate({
			Page: 'Login'
		}));
	});
	app.get('/Logout', (req, res) => {
		req.session.destroy((err) => {
			res.clearCookie('way.user');
			res.redirect('/Stories');
		});
	});
	app.get('/Bookmarks', ValidateUser, (req, res) => {
		res.send(PageTemplate({
			Page: 'Bookmarks'
		}));
	});
	app.get('/Search', (req, res) => {
		res.send(PageTemplate({
			Page: 'Search'
		}));
	});
    app.get('/View', (req, res) => {
		res.send(PageTemplate({
			Page: 'Viewer'
		}));
	});
	app.get('/Edit', (req, res) => {
		res.send(PageTemplate({
			Page: 'Edit'
		}));
	});
	app.get('/Editor', ValidateUser, (req, res) => {
		res.send(PageTemplate({
			Page: 'Editor'
		}));
	});

// ******************************************************
// Get Requests
// ******************************************************
	ApiRoutes(app);



// ***************
// * LIKED - ADD *
// ***************
app.post('/add_liked',function(req,res) {

	storyId=get_body_stuff(req.body,"storyId");
	if((storyId==null)||(storyId==0)) {
		res.send("<b>bad liked-storyId<b/>");
		return;
	}

	LikedDB.db_add_liked(storyId).then(function(result) {
		res.send("<div>liked '"+storyId+"' added to LikedDB["+result+"]</div>");
	}).catch(err => {
		res.send(err);
	});
});



app.post('/add_story_to_user',function(req,res) {

	storyId=get_body_stuff(req.body,"storyId");
	if((storyId==null)||(storyId==0)) {
		res.send("<b>bad story_to_user-storyId<b/>");
		return;
	}

	userId=get_body_stuff(req.body,"userId");
	if((userId==null)||(userId==0)) {
		res.send("<b>bad story_to_user-userId<b/>");
		return;
	}

	StoryDB.addStoryToUser(storyId,userId).then(function(result) {
		console.log(result);
		res.send("<div>story_to_user '"+storyId+"' added to Story_to_user["+result+"]</div>");
	}).catch(err => {
		res.send(err);
	});
});


// **************
// * USER - GET *
// **************
app.post('/get_user',function(req,res) {

	email=get_body_stuff(req.body,"email");
	if((email==null)||(email=="")) {
		res.send("<b>bad user-email<b/>");
		return;
	}

	password=get_body_stuff(req.body,"password");
	if((password==null)||(password=="")) {
		res.send("<b>bad user-password<b/>");
		return;
	}

	UserDB.db_get_user(email,password).then(function(result) {
		res.send("<div>"+result+"</div>");
	}).catch(err => {
		res.send(err);
	});
});

// ******************
// * USERTYPE - ADD *
// ******************
app.post('/add_usertype',function(req,res) {

	usertypename=get_body_stuff(req.body,"usertypename");
	if((usertypename==null)||(usertypename=="")) {
		res.send("<b>bad usertype-usertypename<b/>");
		return;
	}

	UsertypeDB.db_add_usertype(usertypename).then(function(result) {
		res.send("<div>usertype '"+usertypename+"' added to UsertypeDB["+result+"]</div>");
	}).catch(err => {
		res.send(err);
	});
});


// **************
// * VIEW - ADD *
// **************
app.post('/add_view',function(req,res) {

	storyId=get_body_stuff(req.body,"storyId");
	if((storyId==null)||(storyId==0)) {
		res.send("<b>bad view-storyId<b/>");
		return;
	}

	ViewDB.db_add_view(storyId).then(function(result) {
		res.send("<div>view '"+storyId+"' added to ViewDB["+result+"]</div>");
	}).catch(err => {
		res.send(err);
	});
});


// ****************************************
// ****************************************
// * SAVE STORY API CALLS BELOW THIS LINE *
// ****************************************
// ****************************************

// ******************
// * LISTEN TO PORT *
// ******************
app.listen(Settings.port,function(){
	console.log(`Listening on port ${Settings.port}`);
});

// ******************
// * GET BODY STUFF *
// ******************
function get_body_stuff(body,name) {
		ii = 0;
		for(key in body) {
				ii++;
				//console.log("[GET]["+ii+"][body-key]["+key+"][body-value]["+body[key]+"]");
		if(key==name) {
			return body[key];
		}
		}
	return null;
}