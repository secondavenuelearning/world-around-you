const fs = require('fs');
const express = require('express');
const session = require('express-session');
const LokiStore = require('connect-loki')(session);
const bodyParser = require('body-parser');
const decode = require('urldecode');
const encode = require('urlencode');
const _ = require('underscore');

const Settings = require('./js/Server/Settings.js');
const ValidateUser = require('./js/Server/ValidateUser.js');
const ApiRoutes = require('./js/Server/ApiRoutes.js');


let PageHTML = fs.readFileSync('html/Server/Page.html', 'utf8');
let PageTemplate = _.template(PageHTML);


const GenreDB = require('./js/Server/GenreDB.js');
const DescriptionDB = require('./js/Server/DescriptionDB.js');
const LikedDB = require('./js/Server/LikedDB.js');
const SignlanguageDB = require('./js/Server/SignlanguageDB.js');
const StoryDB = require('./js/Server/StoryDB.js');
const Story_to_genreDB = require('./js/Server/Story_to_genreDB.js');
const Story_to_signlanguageDB = require('./js/Server/Story_to_signlanguageDB.js');
const Story_to_tagDB = require('./js/Server/Story_to_tagDB.js');
const Story_to_writtenlanguageDB = require('./js/Server/Story_to_writtenlanguageDB.js');
const TagDB = require('./js/Server/TagDB.js');
const TitleDB = require('./js/Server/TitleDB.js');
const UserDB = require('./js/Server/UserDB.js');
const UsertypeDB = require('./js/Server/UsertypeDB.js');
const ViewDB = require('./js/Server/ViewDB.js');
const WrittenlanguageDB = require('./js/Server/WrittenlanguageDB.js');
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
// * GENRE - ADD *
// ***************
app.post('/add_genre',function(req,res) {

	genrename=get_body_stuff(req.body,"genrename");
	if((genrename==null)||(genrename=="")) {
		res.send("<b>bad genre-name<b/>");
		return;
	}

	writtenlanguageId=get_body_stuff(req.body,"writtenlanguageId");
	if((writtenlanguageId==null)||(writtenlanguageId=="")) {
		res.send("<b>bad genre-writtenlanguageId<b/>");
		return;
	}

	GenreDB.db_add_genre(genrename,writtenlanguageId).then(function(result) {
		res.send("<div>genre '"+genrename+"' added to GenreDB["+result+"]</div>");
	}).catch(err => {
		res.send(err);
	});
});


// *********************
// * DESCRIPTION - ADD *
// *********************
app.post('/add_description',function(req,res) {

	descriptionname=get_body_stuff(req.body,"descriptionname");
	if((descriptionname==null)||(descriptionname=="")) {
		res.send("<b>bad description-name<b/>");
		return;
	}

	writtenlanguageId=get_body_stuff(req.body,"writtenlanguageId");
	if((writtenlanguageId==null)||(writtenlanguageId=="")) {
		res.send("<b>bad description-writtenlanguageId<b/>");
		return;
	}

	storyId=get_body_stuff(req.body,"storyId");
	if((storyId==null)||(storyId=="")) {
		res.send("<b>bad description-storyId<b/>");
		return;
	}

	DescriptionDB.db_add_description(descriptionname,writtenlanguageId,storyId).then(function(result) {
		res.send("<div>description '"+descriptionname+"' added to DecriptionDB["+result+"]</div>");
	}).catch(err => {
		res.send(err);
	});
});

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


// ***************
// * STORY - ADD *
// ***************
app.post('/add_story',function(req,res) {

	author=get_body_stuff(req.body,"author");
	if((author==null)||(author=="")) {
		res.send("<b>bad story-author<b/>");
		return;
	}

	descriptionId=get_body_stuff(req.body,"descriptionId");
	if((descriptionId==null)||(descriptionId==0)) {
		res.send("<b>bad story-descriptionId<b/>");
		return;
	}

	coverimage=get_body_stuff(req.body,"coverimage");
	if((coverimage==null)||(coverimage=="")) {
		res.send("<b>bad story-coverimage<b/>");
		return;
	}

	visible=get_body_stuff(req.body,"visible");
	if((visible==null)||(visible==0)) {
		res.send("<b>bad story-visible<b/>");
		return;
	}

	data=get_body_stuff(req.body,"data");
	if((data==null)||(data=="")) {
		console.log("[story-data]"+data+"]");
		res.send("<b>bad story-data<b/>");
		return;
	}

	StoryDB.addStory(author,descriptionId,coverimage,visible,data).then(function(result) {
		res.send("<div>story '"+titleId+"' added to StoryDB["+result+"]</div>");
	}).catch(err => {
		res.send(err);
	});
});

// ************************
// * STORY_TO_GENRE - ADD *
// ************************
app.post('/add_story_to_genre',function(req,res) {

	storyId=get_body_stuff(req.body,"storyId");
	if((storyId==null)||(storyId==0)) {
		res.send("<b>bad story_to_genre-storyId<b/>");
		return;
	}

	genreId=get_body_stuff(req.body,"genreId");
	if((genreId==null)||(genreId==0)) {
		res.send("<b>bad story_to_genre-genreId<b/>");
		return;
	}

	Story_to_genreDB.db_add_story_to_genre(storyId,genreId).then(function(result) {
		res.send("<div>story_to_genre '"+storyId+"' added to Story_to_genreDB["+result+"]</div>");
	}).catch(err => {
		res.send(err);
	});
});


// **********************
// * STORY_TO_TAG - ADD *
// **********************
app.post('/add_story_to_tag',function(req,res) {

	storyId=get_body_stuff(req.body,"storyId");
	if((storyId==null)||(storyId==0)) {
		res.send("<b>bad story_to_tag-storyId<b/>");
		return;
	}

	tagId=get_body_stuff(req.body,"tagId");
	if((tagId==null)||(tagId==0)) {
		res.send("<b>bad story_to_tag-tagId<b/>");
		return;
	}

	Story_to_tagDB.db_add_story_to_tag(storyId,tagId).then(function(result) {
		res.send("<div>story_to_tag '"+storyId+"' added to Story_to_tagDB["+result+"]</div>");
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

// *************
// * TAG - ADD *
// *************
app.post('/add_tag',function(req,res) {

	tagname=get_body_stuff(req.body,"tagname");
	if((tagname==null)||(tagname=="")) {
		res.send("<b>bad tag-name<b/>");
		return;
	}

	writtenlanguageId=get_body_stuff(req.body,"writtenlanguageId");
	if((writtenlanguageId==null)||(writtenlanguageId=="")) {
		res.send("<b>bad tag-writtenlanguageId<b/>");
		return;
	}

	TagDB.db_add_tag(tagname,writtenlanguageId).then(function(result) {
		res.send("<div>tag '"+tagname+"' added to TagDB["+result+"]</div>");
	}).catch(err => {
		res.send(err);
	});
});


// ***************
// * TITLE - ADD *
// ***************
app.post('/add_title',function(req,res) {

	titlename=get_body_stuff(req.body,"titlename");
	if((titlename==null)||(titlename=="")) {
		res.send("<b>bad title-name<b/>");
		return;
	}

	writtenlanguageId=get_body_stuff(req.body,"writtenlanguageId");
	if((writtenlanguageId==null)||(writtenlanguageId=="")) {
		res.send("<b>bad title-writtenlanguageId<b/>");
		return;
	}

	storyId=get_body_stuff(req.body,"storyId");
	if((storyId==null)||(storyId=="")) {
		res.send("<b>bad title-storyId<b/>");
		return;
	}

	TitleDB.db_add_title(titlename,writtenlanguageId,storyId).then(function(result) {
		res.send("<div>title '"+titlename+"' added to TitleDB["+result+"]</div>");
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

// ************************************
// * SAVE STORY COVER PAGE AND AUTHOR *
// * - RETURN - true or false         *
// ************************************
app.post('/api/story/cover',function(req,res) {

	console.log(req.body);
	myid=req.body.id;
	myauthor=req.body.author;
	mycover=req.body.coverimage;

	console.log("[api/story/cover][storyid]["+myid+"]");
	console.log("[api/story/cover][author]["+myauthor+"]");
	console.log("[api/story/cover][cover-image]["+mycover+"]");

	if((myid==null)||(myid==0)) {
		console.log("[/api/story/cover][NO ID]");
		res.send('done');
	}
	if((myauthor==null)||(myauthor=="")) {
		console.log("[/api/story/cover][NO AUTHOR]");
		res.send('done');
	}
	if((mycover==null)||(mycover=='')) {
		console.log("[/api/story/cover][NO COVER IMAGE]");
		res.send('done');
	}
	StoryDB.addStoryCover(myid,mycover,myauthor).then(function(result) {
		console.log("[/api/story/cover][storyid]["+myid+"][author]["+myauthor+"][coverimage]["+mycover+"][result]["+result+"]");
		res.send(result);
	}).catch(err => {
		console.log("[/api/story/cover][storyid]["+myid+"][author]["+myauthor+"][coverimage]["+mycover+"][ERROR]["+err+"]");
		res.send(err);
	});
});
// ****************************
// * SAVE STORY METADATA      *
// * - RETURN - true or false *
// ****************************
app.post('/api/story/metadata',function(req,res) {
	obj=req.body;
	myid=obj.id;
	mylang=obj.language;
	mytitle=obj.title;
	mydesc=obj.description;
	mygarr=obj['genre[]'];
	mytarr=obj['tag[]'];

	console.log("[api/story/metadata][storyid]["+myid+"]");
	console.log("[api/story/metadata][language]["+mylang+"]");
	console.log("[api/story/metadata][title]["+mytitle+"]");
	console.log("[api/story/metadata][description]["+mydesc+"]");
	console.log("[api/story/metadata][genre-array]["+mygarr+"]");
	console.log("[api/story/metadata][tag-array]["+mytarr+"]");

	// *************************
	// * DOES THE STORY EXIST? *
	// *************************
        console.log("[POST-/api/story/metadata][DOES STORY EXIST?][STORY]["+myid+"]");
	StoryDB.getStory(myid).then(function(result) {
		if(result=="[]") {
			// ****************************
			// * NO, STORY DOES NOT EXIST *
			// ****************************
			console.log("[POST-/api/story/metadata][StoryDB.getStory][NO, STORY "+myid+" DOESN'T EXIST]");
			res.send(result);
		}
		else {
			// *********************
			// * YES, STORY EXISTS *
			// *********************
                        console.log("[POST-/api/story/metadata][StoryDB.getStory][YES, STORY EXISTS]["+myid+"]");
			post_api_story_metadata_part2(req,res,myid,mylang,mytitle,mydesc,mygarr,mytarr);
		}
	}).catch(err => {
		res.send(err);
	});
});
// ****************************
// * SAVE STORY JSON DATA     *
// * - RETURN - true or false *
// ****************************
app.post('/api/story/data',function(req,res) {
	console.log(req.body);
	myid=req.body.id;
	myblob=req.body.theblob;
	console.log("[api/story/data][storyid]["+myid+"]");
	console.log("[api/story/data][blob]["+myblob+"]");

	if((myid==null)||(myid==0)) {
		console.log("[/api/story/data][NO ID]");
		res.send('done');
	}

	if((myblob==null)||(myblob=="")) {
		console.log("[/api/story/data][NO BLOB]");
		res.send('done');
	}

	StoryDB.addStoryData(myid,myblob).then(function(result) {
		res.send(result);
	}).catch(err => {
		res.send(err);
	});
});
// ****************************
// * PUBLISH STORY            *
// * - RETURN - true or false *
// ****************************
app.post('/api/story/publish',function(req,res) {

	console.log(req.body);
	myid=req.body.id;
	console.log("[api/story/publish][storyid]["+myid+"]");

	if((myid==null)||(myid==0)) {
		console.log("[/api/story/publish][NO ID]");
		res.send('done');
	}

	StoryDB.publishStory(myid).then(function(result) {
		res.send(result);
	}).catch(err => {
		res.send(err);
	});
});
// ****************************************
// ****************************************
// * SAVE STORY API CALLS ABOVE THIS LINE *
// ****************************************
// ****************************************

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

// *******************
// * SHOW BODY STUFF *
// *******************
function show_body_stuff(body) {
		ii = 0;
		for(key in body) {
				ii++;
				//console.log("[DEBUG]["+ii+"][body-key]["+key+"][body-value]["+body[key]+"]");
		}
}

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

function register_user_part2(email,password1,firstname,lastname,usertypeId,res) {
	// *********************************
	// * MAKE SURE USER DOES NOT EXIST *
	// *********************************
	UserDB.db_get_user2(email).then(function(result) {
		if(result=="[]") {
			register_user_part3(email,password1,firstname,lastname,usertypeId,res); 
		}
		else {
			res.send("<div>Fail-8a</div>");
		return;
		}
	}).catch(err => {
		res.send("<div>Fail-8b</div>");
		return;
	});
}

function register_user_part3(email,password,firstname,lastname,usertypeId,res)  {
	// ****************
	// * ADD NEW USER *
	// ****************
	UserDB.db_add_user(email,password,firstname,lastname,usertypeId).then(function(result) {
		res.send("<div>success</div>");
	}).catch(err => {
		res.send("<div>Fail-8c</div>");
	});
}

function keep_email_in_session(req,email) {
	sess=req.session;
	if(sess.email) {
		return;
	}
	else {
		sess.email=email;
	}
}


// *****************************************************
// * PART OF SAVE STORY                                *
// * GET WRITTEN LANGUAGE ID - FOR SAVE STORY METADATA *
// *****************************************************
function post_api_story_metadata_part2(req,res,myid,mylang,mytitle,mydesc,mygarr,mytarr) {
	console.log("[post_api_story_metadata_part2][storyid]["+myid+"][language]["+mylang+"][title]["+mytitle+"][description]["+mydesc+"]");
	console.log(mygarr);
	console.log(mytarr);

	WrittenlanguageDB.getwrittenlanguage(mylang).then(function(result) {
		if(result=="[]") {
			// ******************************
			// * NO WRITTEN LANGUAGE FOUND *
			// ******************************
			console.log("[post_api_story_metadata_part2][NO WRITTENLANGUGE FOUND][story]["+myid+"]");
			console.log(result);
			res.send(result);
		}
		else {
			// **************************
			// * WRITTEN LANGUAGE FOUND *
			// **************************
			obj=JSON.parse(result);
			var writid=obj[0]["id"];
			console.log("[post_api_story_metadata_part2][WRITTENLANGUGE FOUND][writtenlanguageid]["+writid+"][storyid]["+myid+"]");
			console.log(result);
			post_api_story_metadata_part3(req,res,myid,writid,mytitle,mydesc,mygarr,mytarr);
			res.send(result);
		}
	}).catch(err => {
		console.log(err);
		res.send(err);
	});
}

// *****************************************************
// * PART OF SAVE STORY                                *
// * GET STORY TITLE - FOR SAVE STORY METADATA         *
// *****************************************************
function post_api_story_metadata_part3(req,res,myid,mywritid,mytitle,mydesc,mygarr,mytarr) {
	console.log("[post_api_story_metadata_part3][storyid]["+myid+"][writtenlanguageid]["+mywritid+"][title]["+mytitle+"][description]["+mydesc+"]");
	console.log(mygarr);
	console.log(mytarr);
	TitleDB.db_get_title(mywritid,myid).then(function(result) {
		if(result=="[]") {
			// ******************
			// * NO TITLE FOUND *
			// ******************
			console.log("[post_api_story_metadata_part3][NO TITLE FOUND][story]["+myid+"]");
			post_api_story_metadata_part4(req,res,myid,mywritid,mytitle,mydesc,mygarr,mytarr);
		}
		else {
			// ***************
			// * TITLE FOUND *
			// ***************
			obj=JSON.parse(result);
			var titleid=obj[0]["id"];
			console.log("[post_api_story_metadata_part3][TITLE FOUND][titleid]["+titleid+"][storyid]["+myid+"]");
			//res.send(result);
			post_api_story_metadata_part5(req,res,myid,mywritid,mydesc,mygarr,mytarr);

		}
	}).catch(err => {
		console.log(err);
		res.send(err);
	});
}

// *****************************************************
// * PART OF SAVE STORY                                *
// * ADD STORY TITLE - FOR SAVE STORY METADATA         *
// *****************************************************
function post_api_story_metadata_part4(req,res,myid,mywritid,mytitle,mydesc,mygarr,mytarr) {
	console.log("[post_api_story_metadata_part4][storyid]["+myid+"][writtenlanguageid]["+mywritid+"][title]["+mytitle+"][description]["+mydesc+"]");
	console.log(mygarr);
	console.log(mytarr);

	TitleDB.db_add_title(mytitle,mywritid,myid).then(function(result) {
		titleid=result.id;
		console.log("[post_api_story_metadata_part4][ADDED][titleid]["+titleid+"]");
		post_api_story_metadata_part5(req,res,myid,mywritid,mydesc,mygarr,mytarr);

	}).catch(err => {
		console.log(err);
		res.send(err);
	});
}

// *****************************************************
// * PART OF SAVE STORY                                *
// * GET STORY DESCRIPTION - FOR SAVE STORY METADATA   *
// *****************************************************
function post_api_story_metadata_part5(req,res,myid,mywritid,mydesc,mygarr,mytarr) {
	DescriptionDB.db_get_description(mywritid,myid).then(function(result) {
		if(result=="[]") {
			// ************************
			// * NO DESCRIPTION FOUND *
			// ************************
			console.log("[post_api_story_metadata_part5][NO DESCRIPTION FOUND][story]["+myid+"]");
			post_api_story_metadata_part6(req,res,myid,mywritid,mydesc,mygarr,mytarr);
		}
		else {
			// *********************
			// * DESCRIPTION FOUND *
			// *********************
			obj=JSON.parse(result);
			var descid=obj[0]["id"];
			console.log("[post_api_story_metadata_part5][DESCRIPTION FOUND][descid]["+descid+"][storyid]["+myid+"]");
			//res.send(result);
			post_api_story_metadata_part7(req,res,myid,mywritid,descid,mygarr,mytarr);
		}
	}).catch(err => {
		console.log(err);
		res.send(err);
	});
}

// *****************************************************
// * PART OF SAVE STORY                                *
// * ADD STORY DESCRIPTION - FOR SAVE STORY METADATA   *
// *****************************************************
function post_api_story_metadata_part6(req,res,myid,mywritid,mydesc,mygarr,mytarr) {
	DescriptionDB.db_add_description(mydesc,mywritid,myid).then(function(result) {
		descid=result.id;
		console.log("[post_api_story_metadata_part6][ADDED][descriptionid]["+descid+"]");
		post_api_story_metadata_part7(req,res,myid,mywritid,descid,mygarr,mytarr);
	}).catch(err => {
		console.log(err);
		res.send(err);
	});
}

// ***********************************************************
// * PART OF SAVE STORY                                      *
// * ADD DESCRIPTION ID TO STORY - FOR SAVE STORY METADATA   *
// ***********************************************************
function post_api_story_metadata_part7(req,res,myid,mywritid,descid,mygarr,mytarr) {
        StoryDB.addStoryDescriptionId(myid,descid).then(function(result) {
		console.log(result);
                console.log("[post_api_story_metadata_part7][ADDED][descriptionid]["+descid+"]");
		post_api_story_metadata_part8(req,res,myid,mywritid,mygarr,mytarr);
        }).catch(err => {
                console.log(err);
                res.send(err);
        });
}

// *****************************************
// * PART OF SAVE STORY                    *
// * SEE IF GENRES EXIST IN GENRE DB TABLE *
// *****************************************
function post_api_story_metadata_part8(req,res,myid,writid,mygarr,mytarr) {

	var genrepromarr=[];
	var gfoundarr=[];
	var glen=mygarr.length;
	console.log("[post_api_story_metadata_part8][storyid]["+myid+"][Enter the promise land!]")

	for(var yy=0;yy<glen;yy++) {
		console.log("[post_api_story_metadata_part8][storyid]["+myid+"][genre]["+yy+"]["+mygarr[yy]+"]")
		genrepromarr.push(new Promise((resolve,reject) => {
			GenreDB.db_get_genre(mygarr[yy]).then(function(result) {
				if(result=="[]") {
					// ******************
					// * NO GENRE FOUND *
					// ******************
					console.log("[post_api_story_metadata_part8][NO GENRE FOUND][story]["+myid+"]");
					//console.log(result);
					resolve(result);
				}
				else {
					// ***************
					// * GENRE FOUND *
					// ***************
					obj=JSON.parse(result);
					var genreid=obj[0]["id"];
					console.log("[post_api_story_metadata_part8][GENRE FOUND][genreid]["+genreid+"][storyid]["+myid+"]");
					//console.log(result);
					gfoundarr.push(result);
					resolve(result);
				}
			}).catch(err => {
				console.log("[promise-8][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(genrepromarr).then(() => { 
		console.log("[post_api_story_metadata_part8][PROMISES DONE-GENRE-CHECKS]");
		post_api_story_metadata_part9(req,res,myid,writid,gfoundarr,mygarr,mytarr);
	}).catch(err => {
		console.log("broken promises 8");
	});
}

// ********************************************
// * PART OF SAVE STORY                       *
// * ADD STORY GENRE- FOR SAVE STORY METADATA *
// ********************************************
function post_api_story_metadata_part9(req,res,myid,writid,gfoundarr,mygarr,mytarr) {
	console.log("[post_api_story_metadata_part9]");

	// *****************************************
	// * CREATE GENRE ARRAY FROM FOUND RECORDS *
	// *****************************************
	var rec=null;
	var foundgenres=[];
	var added_ids=[];
	glen=gfoundarr.length;
	for(var zz=0;zz<glen;zz++) {
		rec=gfoundarr[zz];
		tmp1=JSON.parse(rec);
		foundgenres.push(tmp1[0].name);
		added_ids.push(tmp1[0].id);
	}
	// ***********************************
	// * CREATE GENRES "NOT-FOUND" ARRAY *
	// ***********************************
	var notfoundgenres=[];
	grlen=mygarr.length;
	for(var aa=0;aa<grlen;aa++) {
		if(check_found_genres(mygarr[aa],foundgenres)==false) {
			notfoundgenres.push(mygarr[aa]);
		}
	}
	// **********************************
	// * ADD GENRES "NOT-FOUND" RECORDS *
	// **********************************
	var genrespromarr=[];
	nflen=notfoundgenres.length;
	for(var bb=0;bb<nflen;bb++) {
		console.log("[post_api_story_metadata_part9][ADD-NOT-FOUND GENRE]["+notfoundgenres[bb]+"]");
		genrespromarr.push(new Promise((resolve,reject) => {
			GenreDB.db_add_genre(notfoundgenres[bb],writid).then(function(result) {
				genreid=result.id;
				added_ids.push(genreid);
				console.log("[post_api_story_metadata_part9][ADDED GENRE][ID]["+genreid+"][genre]["+notfoundgenres[bb]+"][story]["+myid+"]");
				resolve(result);
			}).catch(err => {
				console.log("[promise-9][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(genrespromarr).then(() => { 
		console.log("[post_api_story_metadata_part9][PROMISES DONE-GENRE-ADD]");
		alen=added_ids.length;
		for(var cc=0;cc<alen;cc++) {
			console.log("[post_api_story_metadata_part9][added-ids]["+cc+"]["+added_ids[cc]+"]")
		}
		post_api_story_metadata_part10(req,res,myid,added_ids,writid,mygarr,mytarr);
	}).catch(err => {
		console.log("broken promises 9");
	});
}

function check_found_genres(onegenre,foundgenres) {
	gglen=foundgenres.length;
	for(var dd=0;dd<gglen;dd++) {
		if(onegenre==foundgenres[dd]) {
			return true;
		}
	}
	return false;
}

// ***********************************************
// * PART OF SAVE STORY                          *
// * GET STORY TO GENRE- FOR SAVE STORY METADATA *
// ***********************************************
function post_api_story_metadata_part10(req,res,myid,added_ids,writid,mygarr,mytarr) {

	var story2genrepromarr=[];
	var s2gexist=[];
	addlen=added_ids.length;
	for(var ee=0;ee<addlen;ee++) {
		story2genrepromarr.push(new Promise((resolve,reject) => {
			console.log("[post_api_story_metadata_part10][storyid]["+myid+"][genreid]["+added_ids[ee]+"]");
			StoryDB.getStoryToGenre(myid,added_ids[ee]).then(function(result) {
				if(result=="[]") {
					console.log("[post_api_story_metadata_part10][STORYTOGENRE NOT-FOUND]["+myid+"]");
					resolve(result);
				}
				else {
					obj=JSON.parse(result);
					var storytogenreid=obj[0]["id"];
					s2gexist.push(obj[0]["genreId"]);
					console.log("[post_api_story_metadata_part10][STORYTOGENRE FOUND][storytogenreid]["+storytogenreid+"][storyid]["+myid+"]");
					resolve(result);
				}
			}).catch(err => {
				console.log("[promise-10][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(story2genrepromarr).then(() => { 
		console.log("[post_api_story_metadata_part10][PROMISES DONE-STORY TO GENRE-CHECKS]");
		post_api_story_metadata_part11(req,res,myid,s2gexist,added_ids,writid,mygarr,mytarr);
	}).catch(err => {
		console.log("broken promises 10");
	});
}

// ***********************************************
// * PART OF SAVE STORY                          *
// * ADD STORY TO GENRE- FOR SAVE STORY METADATA *
// ***********************************************
function post_api_story_metadata_part11(req,res,myid,s2gexist,allg_ids,writid,mygarr,mytarr) {
	s2g_len=s2gexist.length;
	for(var ff=0;ff<s2g_len;ff++) {
		console.log("[post_api_story_metadata_part11][genreid-related to story]["+ff+"]["+s2gexist[ff]+"]");
	}

	var ids2gadd=[];
	var all_glen=allg_ids.length;
	for(var gg=0;gg<all_glen;gg++) {
		if(check_found_s2genre(allg_ids[gg],s2gexist)==false) {
			ids2gadd.push(allg_ids[gg]);
		}
	}

	var story2genrespromarr=[];
	ids2ga_len=ids2gadd.length;
	for(var hh=0;hh<ids2ga_len;hh++) {
		story2genrespromarr.push(new Promise((resolve,reject) => {
			StoryDB.addStoryToGenre(myid,ids2gadd[hh]).then(function(result) {
				resolve(result);
			}).catch(err => {
				console.log("[promise-11][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(story2genrespromarr).then(() => { 
		console.log("[post_api_story_metadata_part11][PROMISES DONE-STORY TO GENRE-ADDS]");
		post_api_story_metadata_part12(req,res,myid,writid,mygarr,mytarr);
	}).catch(err => {
		console.log("broken promises 11");
	});
}

function check_found_s2genre(onegenre,s2gexist) {
	s2g_glen=s2gexist.length;
	for(var ii=0;ii<s2g_glen;ii++) {
		if(onegenre==s2gexist[ii]) {
			return true;
		}
	}
	return false;
}

// *******************************************
// * PART OF SAVE STORY                      *
// * GET STORY TAG - FOR SAVE STORY METADATA *
// *******************************************
function post_api_story_metadata_part12(req,res,myid,writid,mygarr,mytarr) {

	console.log(mytarr);

	var tagpromarr=[];
	var tfoundarr=[];
	var tlen=mytarr.length;
	console.log("[post_api_story_metadata_part12][storyid]["+myid+"][Enter the promise land!]")

	for(var jj=0;jj<tlen;jj++) {
		console.log("[post_api_story_metadata_part12][storyid]["+myid+"][tag]["+jj+"]["+mytarr[jj]+"]")
		tagpromarr.push(new Promise((resolve,reject) => {
			TagDB.db_get_tag(mytarr[jj]).then(function(result) {
				if(result=="[]") {
					// ****************
					// * NO TAG FOUND *
					// ****************
					console.log("[post_api_story_metadata_part12][NO TAG FOUND][story]["+myid+"]");
					console.log(result);
					resolve(result);
				}
				else {
					// *************
					// * TAG FOUND *
					// *************
					obj=JSON.parse(result);
					var tagid=obj[0]["id"];
					console.log("[post_api_story_metadata_part12][TAG FOUND][tagid]["+tagid+"][storyid]["+myid+"]");
					console.log(result);
					tfoundarr.push(result);
					resolve(result);
				}
			}).catch(err => {
				console.log("[promise-12][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(tagpromarr).then(() => { 
		console.log("[post_api_story_metadata_part12][PROMISES DONE-TAG-CHECKS]");
		post_api_story_metadata_part13(req,res,myid,writid,tfoundarr,mygarr,mytarr);
	}).catch(err => {
		console.log("broken promises 12");
	});
}

// *******************************************
// * PART OF SAVE STORY                      *
// * ADD STORY TAG - FOR SAVE STORY METADATA *
// *******************************************
function post_api_story_metadata_part13(req,res,myid,writid,tfoundarr,mygarr,mytarr) {

	console.log("[post_api_story_metadata_part13]");

	// ***************************************
	// * CREATE TAG ARRAY FROM FOUND RECORDS *
	// ***************************************
	var rec=null;
	var foundtags=[];
	var added_ids=[];
	var tlen=tfoundarr.length;
	for(var kk=0;kk<tlen;kk++) {
		rec=tfoundarr[kk];
		tmp1=JSON.parse(rec);
		foundtags.push(tmp1[0].name);
		added_ids.push(tmp1[0].id);
	}
	console.log("[post_api_story_metadata_part13][foundtags]");
	console.log(foundtags);
	console.log("[post_api_story_metadata_part13][added_ids]");
	console.log(added_ids);
	// ***********************************
	// * CREATE TAG "NOT-FOUND" ARRAY *
	// ***********************************
	var notfoundtags=[];
	var tglen=mytarr.length;
	for(var ll=0;ll<tglen;ll++) {
		console.log("[post_api_story_metadata_part13][ll]["+ll+"]["+mytarr[ll]+"]");
		if(check_found_tags(mytarr[ll],foundtags)==false) {
			console.log("[post_api_story_metadata_part13][PUSH][ll]["+ll+"]["+mytarr[ll]+"]");
			notfoundtags.push(mytarr[ll]);
		}
	}
	console.log("[post_api_story_metadata_part13][notfoundtags]");
	console.log(notfoundtags);
	// **********************************
	// * ADD TAG "NOT-FOUND" RECORDS *
	// **********************************
	var tagspromarr=[];
	taglen=notfoundtags.length;
	for(var mm=0;mm<taglen;mm++) {
		console.log("[post_api_story_metadata_part13][ADD-NOT-FOUND TAG]["+notfoundtags[mm]+"]");
		tagspromarr.push(new Promise((resolve,reject) => {
			TagDB.db_add_tag(notfoundtags[mm],writid).then(function(result) {
				tagid=result.id;
				added_ids.push(tagid);
				console.log("[post_api_story_metadata_part13][ADDED TAG][ID]["+tagid+"][tag]["+notfoundtags[mm]+"][story]["+myid+"]");
				resolve(result);
			}).catch(err => {
				console.log("[promise-13][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(tagspromarr).then(() => { 
		console.log("[post_api_story_metadata_part13][PROMISES DONE-GENRE-ADD]");
		alen=added_ids.length;
		for(var nn=0;nn<alen;nn++) {
			console.log("[post_api_story_metadata_part13][added-ids]["+nn+"]["+added_ids[nn]+"]")
		}
		post_api_story_metadata_part14(req,res,myid,added_ids,writid,mygarr,mytarr);
	}).catch(err => {
		console.log("broken promises 13");
	});
}

function check_found_tags(onetag,foundtags) {
	console.log("check_found_tags][onetag]["+onetag+"]");
	console.log("[foundtags]");
	console.log(foundtags);
	taglen=foundtags.length;
	console.log("check_found_tags][taglen]["+taglen+"]");
	for(var oo=0;oo<taglen;oo++) {
		if(onetag==foundtags[oo]) {
			return true;
		}
	}
	return false;
}

// **********************************************
// * PART OF SAVE STORY                         *
// * GET STORY TO TAG - FOR SAVE STORY METADATA *
// **********************************************
function post_api_story_metadata_part14(req,res,myid,added_ids,writid,mygarr,mytarr) {

	var story2tagpromarr=[];
	var s2texist=[];
	var addlen=added_ids.length;
	for(var pp=0;pp<addlen;pp++) {
		story2tagpromarr.push(new Promise((resolve,reject) => {
			console.log("[post_api_story_metadata_part14][storyid]["+myid+"][tagid]["+added_ids[pp]+"]");
			StoryDB.getStoryToTag(myid,added_ids[pp]).then(function(result) {
				if(result=="[]") {
					console.log("[post_api_story_metadata_part14][STORYTOTAG NOT-FOUND]["+myid+"]");
					resolve(result);
				}
				else {
					obj=JSON.parse(result);
					var storytotagid=obj[0]["id"];
					s2texist.push(obj[0]["tagId"]);
					console.log("[post_api_story_metadata_part14][STORYTOTAG FOUND][storytotagid]["+storytotagid+"][storyid]["+myid+"]");
					resolve(result);
				}
			}).catch(err => {
				console.log("[promise-14][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(story2tagpromarr).then(() => { 
		console.log("[post_api_story_metadata_part14][PROMISES DONE-STORY TO TAG-CHECKS]");
		post_api_story_metadata_part15(req,res,myid,s2texist,added_ids,writid,mygarr,mytarr);
	}).catch(err => {
		console.log("broken promises 14");
	});
}

// *********************************************
// * PART OF SAVE STORY                        *
// * ADD STORY TO TAG- FOR SAVE STORY METADATA *
// *********************************************
function post_api_story_metadata_part15(req,res,myid,s2texist,allt_ids,writid,mygarr,mytarr) {
	console.log("post_api_story_metadata_part15");

	var s2t_len=s2texist.length;
	for(var qq=0;qq<s2t_len;qq++) {
		console.log("[post_api_story_metadata_part15][tagid-related to story]["+qq+"]["+s2texist[qq]+"]");
	}

	var ids2tadd=[];
	var all_tlen=allt_ids.length;
	for(var rr=0;rr<all_tlen;rr++) {
		if(check_found_s2tag(allt_ids[rr],s2texist)==false) {
			ids2tadd.push(allt_ids[rr]);
		}
	}

	var story2tagspromarr=[];
	ids2ta_len=ids2tadd.length;
	for(var ss=0;ss<ids2ta_len;ss++) {
		story2tagspromarr.push(new Promise((resolve,reject) => {
			StoryDB.addStoryToTag(myid,ids2tadd[ss]).then(function(result) {
				resolve(result);
			}).catch(err => {
				console.log("[promise-15][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(story2tagspromarr).then(() => { 
		console.log("[post_api_story_metadata_part15][PROMISES DONE-STORY TO TAG-ADDS]");
	}).catch(err => {
		console.log("broken promises 15");
	});
}

function check_found_s2tag(onetag,s2texist) {
	var s2t_tlen=s2texist.length;
	for(var tt=0;tt<s2t_tlen;tt++) {
		if(onetag==s2texist[tt]) {
			return true;
		}
	}
	return false;
}

