const fs = require('fs');
const path = require('path');
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


const StoryDB = require('./js/Server/StoryDB.js');
const UserDB = require('./js/Server/UserDB.js');
const UsertypeDB = require('./js/Server/UsertypeDB.js');
const GameDB = require('./js/Server/GameDB.js');
const GamedataDB = require('./js/Server/GamedataDB.js');


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
			Page: 'BusGame'
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
	app.get('/Game', ValidateUser, (req, res) => {
		res.send(PageTemplate({
			Page: 'Game'
		}));
	});
	app.get('/GameEditor', ValidateUser, (req, res) => {
		res.send(PageTemplate({
			Page: 'GameEditor'
		}));
	});

    app.get('/img/*', (req, res) => {
        var imgPath = req.path;
        var folders = fs.readdirSync(path.resolve(__dirname) + imgPath);

        res.send(folders);
    });

// ******************************************************
// Get Requests
// ******************************************************
	ApiRoutes(app);



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


// ************
// * GET GAME *
// ************
app.get('/api/game', (req, res) => {

	console.log("[GET /api/game]");
	console.log(req.query);
	myname=req.query.name;

	console.log("[GET api/game][name]["+myname+"]");

	if((myname==null)||(myname=='')) {
		console.log("[GET /api/game][NO GAME NAME]");
		res.send('done');
		return;
	}
	GameDB.getGame(myname).then(function(result) {
		if(result=="[]") {
			console.log("[GET /api/game][gamename]["+myname+"][result]["+result+"][NOT-FOUND]");
			console.log(result);
			res.send(result);
		}
		else {
			console.log("[GET /api/game][gamename]["+myname+"][result]["+result+"][FOUND]");
			console.log(result);
			res.send(result);
		}
	}).catch(err => {
		console.log("[GET /api/game][gamename]["+myname+"][ERROR]["+err+"]");
		res.send(err);
	});
});

// ************
// * ADD GAME *
// ************
app.post('/api/game',function(req,res) {
	console.log("[POST /api/game]");
	console.log(req.body);
	myname=req.body.name;

	console.log("[POST api/game][name]["+myname+"]");

	if((myname==null)||(myname=='')) {
		console.log("[POST /api/game][NO GAME NAME]");
		res.send('done');
	}
	GameDB.getGame(myname).then(function(result) {
		if(result=="[]") {
			console.log("[POST /api/game][gamename]["+myname+"][result]["+result+"][NOT-FOUND-WILL-ADD]");
			console.log(result);
			app_post_api_game_part2(req,res,myname);
		}
		else {
			console.log("[POST /api/game][gamename]["+myname+"][result]["+result+"][ALREADY-ADD]");
			console.log(result);
			res.send('done');
		}
	}).catch(err => {
		console.log("[POST /api/game][gamename]["+myname+"][ERROR]["+err+"]");
		res.send(err);
	});
});
function app_post_api_game_part2(req,res,name) {
	console.log("[app_post_api_game_part2][name]["+name+"]");

	GameDB.addGame(name).then(function(result) {
		console.log("[app_post_api_game_part2][gamename]["+name+"][result]["+result+"]");
		console.log(result);
		res.send(result);
	}).catch(err => {
		console.log("[app_post_api_game_part2][gamename]["+name+"][ERROR]["+err+"]");
		res.send(err);
	});
};

// *****************
// * GET GAME DATA *
// *****************
app.get('/api/gamedata', (req, res) => {
	console.log("[GET /api/gamedata]");
	console.log(req.query);
	myid=req.query.id;
	mygameid=req.query.gameId;

	console.log("[GET api/gamedata][storyid]["+myid+"]");
	console.log("[GET api/gamedata][gameId]["+mygameid+"]");

	if((myid==null)||(myid==0)) {
		console.log("[GET /api/gamedata][NO STORY ID]");
		res.send('done');
	}
	if((mygameid==null)||(mygameid==0)) {
		console.log("[GET /api/gamedata][NO GAME ID]");
		res.send('done');
	}
	GamedataDB.getGamedata(myid,mygameid).then(function(result) {
		console.log(result);
		if(result=="[]") {
			console.log("[GET /api/gamedata][storyid]["+myid+"][gameid]["+mygameid+"][result]["+result+"][NOT-FOUND]");
			console.log(result);
			res.send(result);
		}
		else {
			console.log("[GET /api/gamedata][storyid]["+myid+"][gameid]["+mygameid+"][result]["+result+"][FOUND]");
			console.log(result);
			res.send(result);
		}
	}).catch(err => {
		console.log("[GET /api/gamedata][storyid]["+myid+"][gameid]["+mygameid+"][gamedata]["+mydata+"][ERROR]["+err+"]");
		res.send(err);
	});
});

// *****************
// * ADD GAME DATA *
// *****************
app.post('/api/gamedata',function(req,res) {
	console.log("[POST /api/gamedata]");
	console.log(req.body);
	myid=req.body.id;
	mygameid=req.body.gameId;
	mydata=req.body.gamedata;

	console.log("[POST api/gamedata][storyid]["+myid+"]");
	console.log("[POST api/gamedata][gameId]["+mygameid+"]");
	console.log("[POST api/gamedata][gamedata]["+mydata+"]");

	if((myid==null)||(myid==0)) {
		console.log("[POST /api/gamedata][NO STORY ID]");
		res.send('done');
	}
	if((mygameid==null)||(mygameid==0)) {
		console.log("[POST /api/gamedata][NO GAME ID]");
		res.send('done');
	}
	if((mydata==null)||(mydata=='')) {
		console.log("[POST /api/gamedata][NO GAME DATA]");
		res.send('done');
	}
	GamedataDB.getGamedata(myid,mygameid).then(function(result) {
		console.log(result);
		if(result=="[]") {
			console.log("[POST /api/gamedata][storyid]["+myid+"][gameid]["+mygameid+"][gamedata]["+mydata+"][result]["+result+"][NOT-FOUND-WILL-ADD]");
			console.log(result);
			app_post_api_gamedata_part2(req,res,myid,mygameid,mydata);
		}
		else {
			console.log("[POST /api/gamedata][storyid]["+myid+"][gameid]["+mygameid+"][gamedata]["+mydata+"][result]["+result+"][FOUND-ALREADY-ADDED]");
			console.log(result);
			res.send(result);
		}
	}).catch(err => {
		console.log("[POST /api/gamedata][storyid]["+myid+"][gameid]["+mygameid+"][gamedata]["+mydata+"][ERROR]["+err+"]");
		res.send(err);
	});
});
function app_post_api_gamedata_part2(req,res,storyid,gameid,gamedata) {

	console.log("[app_post_api_gamedata_part2][storyid]["+storyid+"]");
	console.log("[app_post_api_gamedata_part2][gameId]["+gameid+"]");
	console.log("[app_post_api_gamedata_part2][gamedata]["+gamedata+"]");

	GamedataDB.addGamedata(storyid,gameid,gamedata).then(function(result) {
		console.log("[app_post_api_gamedata_part2][storyid]["+storyid+"][gameid]["+gameid+"][gamedata]["+gamedata+"][result]["+result+"]");
		console.log(result);
		res.send(result);
	}).catch(err => {
		console.log("[app_post_api_gamedata_part2][storyid]["+myid+"][gameid]["+mygameid+"][gamedata]["+mydata+"][ERROR]["+err+"]");
		res.send(err);
	});
};
// ******************
// * LISTEN TO PORT *
// ******************
app.listen(Settings.port,function(){
	console.log(`Listening on port ${Settings.port}`);
});