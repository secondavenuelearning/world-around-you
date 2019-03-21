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
    options.cookie.maxAge = options.maxAge || 10 * 60 * 1000; // 10 min max age
    options.cookie.secure = options.secure || false;
   
    var storeOptions = {}
    storeOptions.ttl = options.maxAge ? options.maxAge / 1000 : 10 * 60; // 10 min age
    storeOptions.ttlInterval = storeOptions.ttl;
    options.store = new LokiStore(storeOptions);

    _app.use(session(options));
}


var access_log = "access.log";
var error_log = "error.log";
const app = express();


app.use(bodyParser.urlencoded({extended:false}));
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
			res.cookie('way.user', req.session.user, { maxAge: 10 * 60 * 1000, httpOnly: false});
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


// **********************
// * SIGNLANGUAGE - ADD *
// **********************
app.post('/add_signlanguage',function(req,res) {

	name1=get_body_stuff(req.body,"name1");
	if((name1==null)||(name1=="")) {
		res.send("<b>bad signlanguage-name<b/>");
		return;
	}

	SignlanguageDB.db_add_signlanguage(name1).then(function(result) {
		res.send("<div>signlanguage '"+name1+"' added to SignlanguageDB["+result+"]</div>");
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

// *******************************
// * STORY_TO_SIGNLANGUAGE - ADD *
// *******************************
app.post('/add_story_to_signlanguage',function(req,res) {

	storyId=get_body_stuff(req.body,"storyId");
	if((storyId==null)||(storyId==0)) {
		res.send("<b>bad story_to_signlanguage-storyId<b/>");
		return;
	}

	signlanguageId=get_body_stuff(req.body,"signlanguageId");
	if((signlanguageId==null)||(signlanguageId==0)) {
		res.send("<b>bad story_to_signlanguage-signlanguageId<b/>");
		return;
	}

	Story_to_signlanguageDB.db_add_story_to_signlanguage(storyId,signlanguageId).then(function(result) {
		res.send("<div>story_to_signlanguage '"+storyId+"' added to Story_to_signlanguageDB["+result+"]</div>");
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

// **********************************
// * STORY_TO_WRITTENLANGUAGE - ADD *
// **********************************
app.post('/add_story_to_writtenlanguage',function(req,res) {

	storyId=get_body_stuff(req.body,"storyId");
	if((storyId==null)||(storyId==0)) {
		res.send("<b>bad story_to_writtenlanguage-storyId<b/>");
		return;
	}

	writtenlanguageId=get_body_stuff(req.body,"writtenlanguageId");
	if((writtenlanguageId==null)||(writtenlanguageId==0)) {
		res.send("<b>bad story_to_writtenlanguage-writtenlanguageId<b/>");
		return;
	}

	Story_to_writtenlanguageDB.db_add_story_to_writtenlanguage(storyId,writtenlanguageId).then(function(result) {
		res.send("<div>story_to_writtenlanguage '"+storyId+"' added to Story_to_writtenlanguageDB["+result+"]</div>");
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
// * USER - ADD *
// **************
app.post('/add_user',function(req,res) {

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

	firstname=get_body_stuff(req.body,"firstname");
	if((firstname==null)||(firstname=="")) {
		res.send("<b>bad user-firstname<b/>");
		return;
	}

	lastname=get_body_stuff(req.body,"lastname");
	if((lastname==null)||(lastname=="")) {
		res.send("<b>bad user-lastname<b/>");
		return;
	}

	usertypeId=get_body_stuff(req.body,"usertypeId");
	if((usertypeId==null)||(usertypeId==0)) {
		res.send("<b>bad user-usertypeId<b/>");
		return;
	}

	UserDB.db_add_user(email,password,firstname,lastname,usertypeId).then(function(result) {
		res.send("<div>user '"+email+"' added to UserDB["+result+"]</div>");
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

// *********************
// * VERIFY USER LOGIN *
// *********************
app.post('/verify_login',function(req,res) {

	email=get_body_stuff(req.body,"email");
	if((email==null)||(email=="")) {
		res.send("<div>Fail-1<div/>");
		return;
	}

	password=get_body_stuff(req.body,"password");
	if((password==null)||(password=="")) {
		res.send("<div>Fail-2<div/>");
		return;
	}

	UserDB.db_get_user(email,password).then(function(result) {
		if(result=="[]") {
			res.send("<div>Fail-3</div>");
		}
		else {
			keep_email_in_session(req,email);
			res.send("<div>Success</div>");
		}
	}).catch(err => {
		res.send("<div>Fail-4</div>");
	});
});

// ***************
// REGISTER_USER *
// ***************
app.post('/register_user',function(req,res) {

	email=get_body_stuff(req.body,"email");
	if((email==null)||(email=="")) {
		res.send("<div>Fail-1</div>");
		return;
	}

	password1=get_body_stuff(req.body,"password1");
	if((password1==null)||(password1=="")) {
		res.send("<div>Fail-2</div>");
		return;
	}

	password2=get_body_stuff(req.body,"password2");
	if((password2==null)||(password2=="")) {
		res.send("<div>Fail-3</div>");
		return;
	}

	if(password1 != password2) {
		res.send("<div>Fail-4</div>");
		return;
	}

	firstname=get_body_stuff(req.body,"firstname");
	if((firstname==null)||(firstname=="")) {
		res.send("<div>Fail-5</div>");
		return;
	}

	lastname=get_body_stuff(req.body,"lastname");
	if((lastname==null)||(lastname=="")) {
		res.send("<div>Fail-6</div>");
		return;
	}

	// ***********************************
	// * CONVERT USERTYPE TO USERTYPE ID *
	// ***********************************
	usertypename = "admin";
	UsertypeDB.db_get_usertype(usertypename).then(function(result) {
		if(result=="[]") {
			res.send("<div>Fail-7</div>");
		}
		else {
			// *****************************
			// * GET USERTYPE ID FROM JSON *
			// *****************************
			tmp1=JSON.parse(result);
			usertypeId=tmp1[0].id;
			if((usertypeId==null)||(usertypeId==0)) {
				res.send("<div>Fail-8</div>");
				return;
			}
			register_user_part2(email,password1,firstname,lastname,usertypeId,res);
		}
	}).catch(err => {
		res.send("<div>Fail-9</div>");
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

// *************************
// * WRITTENLANGUAGE - ADD *
// *************************
app.post('/add_writtenlanguage',function(req,res) {

	writtenlanguagename=get_body_stuff(req.body,"writtenlanguagename");
	if((writtenlanguagename==null)||(writtenlanguagename=="")) {
		res.send("<b>bad writtenlanguage-writtenlanguagename<b/>");
		return;
	}

	WrittenlanguageDB.db_add_writtenlanguage(writtenlanguagename).then(function(result) {
		res.send("<div>writtenlanguagename '"+writtenlanguagename+"' added to WrittenlanguageDB["+result+"]</div>");
	}).catch(err => {
		res.send(err);
	});
});

// ****************************************
// ****************************************
// * SAVE STORY API CALLS BELOW THIS LINE *
// ****************************************
// ****************************************
// **********************
// * CREATE NEW STORY   *
// * - RETURN - storyId *
// **********************
app.post('/api/story',function(req,res) {
	StoryDB.addEmptyStory().then(function(result) {
		//console.log("ADD EMPTY STORY");
		res.send(result);
	}).catch(err => {
		res.send(err);
	});
});
// ****************************
// * SAVE LANGUAGES IN STORY  *
// * - RETURN - true or false *
// ****************************
app.post('/api/story/language',function(req,res) {
	obj=req.body;
	myid=obj.id;
	mywarr=obj['writtenlanguages[]'];
	mysarr=obj['signlanguages[]'];

	//console.log("[api/story/language][storyid]["+myid+"]");
	//console.log("[api/story/language][written-array]["+mywarr+"]");
	//console.log("[api/story/language][sign-array]["+mysarr+"]");

	// *************************
	// * DOES THE STORY EXIST? *
	// *************************
        console.log("[POST-/api/story/language][DOES STORY EXIST?][STORY]["+myid+"]");
	StoryDB.getStory(myid).then(function(result) {
		if(result=="[]") {
			// ****************************
			// * NO, STORY DOES NOT EXIST *
			// ****************************
			console.log("[POST-/api/story/language][StoryDB.getStory][NO, STORY "+myid+" DOESN'T EXIST]");
			res.send(result);
		}
		else {
			// *********************
			// * YES, STORY EXISTS *
			// *********************
                        console.log("[POST-/api/story/language][StoryDB.getStory][YES, STORY EXISTS]["+myid+"]");
			post_api_story_language_part2(req,res,myid,mywarr,mysarr);
		}
	}).catch(err => {
		res.send(err);
	});
});

// ****************************
// * DELETE STORY LANGUAGES   *
// * - RETURN - true or false *
// ****************************
app.post('/api/story/language/delete',function(req,res) {

	myid=req.body.id;
	mylangid=req.body.languageid;
	mytyp=req.body.langtyp;

	console.log("[api/story/language/delete][storyid]["+myid+"]");
	console.log("[api/story/language/delete][languageid]["+mylangid+"]");
	console.log("[api/story/language/delete][sign-array]["+mytyp+"]");

	if((myid==null)||(myid==0)) {
		console.log("[/api/story/language/delete][NO ID]");
		res.send('done');
	}
	if((mylangid==null)||(mylangid==0)) {
		console.log("[/api/story/language/delete][NO LANGUAGE ID]");
		res.send('done');
	}
	if((mytyp==null)||(mytyp=='')) {
		console.log("[/api/story/language/delete][NO LANGUAGE TYPE]");
		res.send('done');
	}
	if((mytyp=="sign")&&(mytyp=='written')) {
		console.log("[/api/story/language/delete][INVALID LANGUAGE TYPE]["+langtyp+"]");
		res.send('done');
	}

	if(mytyp=="sign") {
		StoryDB.deleteStoryToSignlanguage(myid,mylangid).then(function(result) {
			console.log("[/api/story/language/delete][storyid]["+myid+"][signlanguageid]["+mylangid+"][result]["+result+"]");
			res.send(result);
		}).catch(err => {
			console.log("[/api/story/language/delete][storyid]["+myid+"][signlanguageid]["+mylangid+"][ERROR]["+err+"]");
			res.send(err);
		});
	}
	else if(mytyp=="written") {
		StoryDB.deleteStoryToWrittenlanguage(myid,mylangid).then(function(result) {
			console.log("[/api/story/language/delete][storyid]["+myid+"][writtenlanguageid]["+mylangid+"][result]["+result+"]");
			res.send(result);
		}).catch(err => {
			console.log("[/api/story/language/delete][storyid]["+myid+"][writtenlanguageid]["+mylangid+"][ERROR]["+err+"]");
			res.send(err);
		});
	}
	else {
		res.send('done');
	}
});
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

// ****************************************************************
// * PART OF SAVE STORY                                           *
// * SEE IF WRITTEN LANGUAGES EXIST IN WRITTEN LANGUAGES DB TABLE *
// ****************************************************************
function post_api_story_language_part2(req,res,storyid,mywarr,mysarr) {

	var wlangpromarr=[];
	var wfoundarr=[];
	var len=mywarr.length;
	//console.log("[post_api_story_language_part2][storyid]["+storyid+"][Enter the promise land!]")

	for(var i=0;i<len;i++) {
		//console.log("[post_api_story_language_part2][storyid]["+storyid+"][writtenlanguage]["+i+"]["+mywarr[i]+"]")
		wlangpromarr.push(new Promise((resolve,reject) => {
			WrittenlanguageDB.getwrittenlanguage(mywarr[i]).then(function(result) {
				if(result=="[]") {
					// ******************************
					// * NO WRITTEN LANGUAGE FOUND *
					// ******************************
					console.log("[post_api_story_language_part2][NO WRITTENLANGUGE FOUND][story]["+storyid+"]");
					//console.log(result);
					resolve(result);
				}
				else {
					// **************************
					// * WRITTEN LANGUAGE FOUND *
					// **************************
					obj=JSON.parse(result);
					var writid=obj[0]["id"];
					console.log("[post_api_story_language_part2][WRITTENLANGUGE FOUND][writtenlanguageid]["+writid+"][storyid]["+storyid+"]");
					//console.log(result);
					wfoundarr.push(result);
					resolve(result);
				}
			}).catch(err => {
				console.log("[promise-2][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(wlangpromarr).then(() => { 
		console.log("[post_api_story_language_part2][PROMISES DONE-WRITTEN LANGUAGE-CHECKS]");
		post_api_story_language_part3(req,res,storyid,wfoundarr,mywarr,mysarr);
	}).catch(err => {
		console.log("broken promises 2");
	});
}

// *********************************************************
// * PART OF SAVE STORY                                    *
// * ADD WRITTEN LANGUAGES INTO WRITTEN LANGUAGES DB TABLE *
// *********************************************************
function post_api_story_language_part3(req,res,storyid,wfoundarr,mywarr,mysarr) {
	// ****************************************************
	// * CREATE WRITTEN LANGUAGE ARRAY FROM FOUND RECORDS *
	// ****************************************************
	var rec=null;
	var foundlangs=[];
	var added_ids=[];
	flen=wfoundarr.length;
	for(var jj=0;jj<flen;jj++) {
		rec=wfoundarr[jj];
		tmp1=JSON.parse(rec);
		foundlangs.push(tmp1[0].name);
		added_ids.push(tmp1[0].id);
	}
	// *********************************************
	// * CREATE WRITTEN LANGUAGE "NOT-FOUND" ARRAY *
	// *********************************************
	var notfoundlangs=[];
	mlen=mywarr.length;
	for(var kk=0;kk<mlen;kk++) {
		if(check_found_wlangs(mywarr[kk],foundlangs)==false) {
			notfoundlangs.push(mywarr[kk]);
		}
	}
	// ********************************************
	// * ADD WRITTEN LANGUAGE "NOT-FOUND" RECORDS *
	// ********************************************
	var writlangpromarr=[];
	nflen=notfoundlangs.length;
	for(var aa=0;aa<nflen;aa++) {
		console.log("[post_api_story_language_part3][ADD-NOT-FOUND WRITTEN LAUGUAGE]["+notfoundlangs[aa]+"]");
		writlangpromarr.push(new Promise((resolve,reject) => {
			WrittenlanguageDB.db_add_writtenlanguage(notfoundlangs[aa]).then(function(result) {
				writid=result.id;
				added_ids.push(writid);
				console.log("[post_api_story_language_part3][ADDED WRITTEN LANGUAGE][ID]["+writid+"][writtenlanguage]["+notfoundlangs[aa]+"][story]["+storyid+"]");
				resolve(result);
			}).catch(err => {
				console.log("[promise-3][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(writlangpromarr).then(() => { 
		console.log("[post_api_story_language_part3][PROMISES DONE-WRITTEN LANGUAGE-ADD]");
		alen=added_ids.length;
		for(var bb=0;bb<alen;bb++) {
			console.log("[post_api_story_language_part3][added-ids]["+bb+"]["+added_ids[bb]+"]")
		}
		post_api_story_language_part4(req,res,storyid,added_ids,mywarr,mysarr);
	}).catch(err => {
		console.log("broken promises 3");
	});
}

function check_found_wlangs(onelang,foundlangs) {
	wlen=foundlangs.length;
	for(var ii=0;ii<wlen;ii++) {
		if(onelang==foundlangs[ii]) {
			return true;
		}
	}
	return false;
}

// *************************************************************************
// * PART OF SAVE STORY                                                    *
// * SEE IF WRITTEN LANGUAGES EXIST IN STORY TO WRITTEN LANGUAGES DB TABLE *
// *************************************************************************
function post_api_story_language_part4(req,res,storyid,added_ids,mywarr,mysarr) {
	console.log(added_ids);
	var storywlangpromarr=[];
	var s2wexist=[];
	addlen=added_ids.length;
	for(var cc=0;cc<addlen;cc++) {
		storywlangpromarr.push(new Promise((resolve,reject) => {
			console.log("[post_api_story_language_part4][storyid]["+storyid+"][writtenlanguageid]["+added_ids[cc]+"]");
			StoryDB.getStoryToWrittenlanguage(storyid,added_ids[cc]).then(function(result) {
				if(result=="[]") {
					console.log("[post_api_story_language_part4][STORYTOWRITTENLANGUAGE NOT-FOUND]["+storyid+"]");
					console.log(result);
					resolve(result);
				}
				else {
					obj=JSON.parse(result);
					var storytowritid=obj[0]["id"];
					s2wexist.push(obj[0]["writtenlanguageId"]);
					console.log("[post_api_story_language_part4][STORYTOWRITTENLANGUGE FOUND][storytowrittenlanguageid]["+storytowritid+"][storyid]["+storyid+"]");
					resolve(result);
				}
			}).catch(err => {
				console.log("[promise-4][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(storywlangpromarr).then(() => { 
		console.log("[post_api_story_language_part4][PROMISES DONE-STORY TO WRITTEN LANGUAGE-CHECKS]");
		post_api_story_language_part5(req,res,storyid,s2wexist,added_ids,mywarr,mysarr);
	}).catch(err => {
		console.log("broken promises 4");
	});
}

// ******************************************************************
// * PART OF SAVE STORY                                             *
// * ADD WRITTEN LANGUAGES INTO STORY TO WRITTEN LANGUAGES DB TABLE *
// ******************************************************************
function post_api_story_language_part5(req,res,storyid,s2w_exist,allw_ids,mywarr,mysarr) {

	s2w_len=s2w_exist.length;
	for(var ee=0;ee<s2w_len;ee++) {
		console.log("[post_api_story_language_part5][writlangid-related to story]["+ee+"]["+s2w_exist[ee]+"]");
	}

	var ids2add=[];
	var all_wlen=allw_ids.length;
	for(var dd=0;dd<all_wlen;dd++) {
		console.log("[post_api_story_language_part5][writelangid]["+dd+"]["+allw_ids[dd]+"]");
		if(check_found_s2wlangs(allw_ids[dd],s2w_exist)==false) {
			console.log("[PUSH]["+allw_ids[dd]+"]");
			ids2add.push(allw_ids[dd]);
		}
	}

	var story2wlangpromarr=[];
	ids2a_len=ids2add.length;
	for(var ff=0;ff<ids2a_len;ff++) {
		console.log("[post_api_story_language_part5][ADD TO STORY TO WRITTEN LANGUAGE RELATIONSHIP][writelangid]["+ff+"]["+ids2add[ff]+"]");
		story2wlangpromarr.push(new Promise((resolve,reject) => {
			StoryDB.addStoryToWrittenlanguage(storyid,ids2add[ff]).then(function(result) {
				resolve(result);
			}).catch(err => {
				console.log("[promise-5][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(story2wlangpromarr).then(() => { 
		console.log("[post_api_story_language_part5][PROMISES DONE-STORY TO WRITTEN LANGUAGE-ADDS]");
		post_api_story_language_part6(req,res,storyid,mywarr,mysarr);
	}).catch(err => {
		console.log("broken promises 5");
	});
}

function check_found_s2wlangs(onelang,s2w_exist) {
	s2w_wlen=s2w_exist.length;
	for(var ff=0;ff<s2w_wlen;ff++) {
		if(onelang==s2w_exist[ff]) {
			return true;
		}
	}
	return false;
}

// **********************************************************
// * PART OF SAVE STORY                                     *
// * SEE IF SIGN LANGUAGES EXIST IN SIGN LANGUAGES DB TABLE *
// **********************************************************
function post_api_story_language_part6(req,res,storyid,mywarr,mysarr) {

	var slangpromarr=[];
	var sfoundarr=[];
	var slen=mysarr.length;
	console.log("[post_api_story_language_part6][storyid]["+storyid+"][Enter the promise land!]")

	for(var gg=0;gg<slen;gg++) {
		console.log("[post_api_story_language_part6][storyid]["+storyid+"][signlanguage]["+gg+"]["+mysarr[gg]+"]")
		slangpromarr.push(new Promise((resolve,reject) => {
			SignlanguageDB.getsignlanguage(mysarr[gg]).then(function(result) {
				if(result=="[]") {
					// **************************
					// * NO SIGN LANGUAGE FOUND *
					// **************************
					console.log("[post_api_story_language_part6][NO SIGNLANGUAGE FOUND][story]["+storyid+"]");
					//console.log(result);
					resolve(result);
				}
				else {
					// ***********************
					// * SIGN LANGUAGE FOUND *
					// ***********************
					obj=JSON.parse(result);
					var signid=obj[0]["id"];
					console.log("[post_api_story_language_part6][SIGNLANGUAGE FOUND][signlanguageid]["+signid+"][storyid]["+storyid+"]");
					//console.log(result);
					sfoundarr.push(result);
					resolve(result);
				}
			}).catch(err => {
				console.log("[promise-6][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(slangpromarr).then(() => { 
		console.log("[post_api_story_language_part6][PROMISES DONE-SIGN LANGUAGE-CHECKS]");
		post_api_story_language_part7(req,res,storyid,sfoundarr,mywarr,mysarr);
	}).catch(err => {
		console.log("broken promises 6");
	});
}
// ***************************************************
// * PART OF SAVE STORY                              *
// * ADD SIGN LANGUAGES INTO SIGN LANGUAGES DB TABLE *
// ***************************************************
function post_api_story_language_part7(req,res,storyid,sfoundarr,mywarr,mysarr) {
	console.log(sfoundarr.length);
	console.log(mysarr.length);
	// *************************************************
	// * CREATE SIGN LANGUAGE ARRAY FROM FOUND RECORDS *
	// *************************************************
	var srec=null;
	var foundslangs=[];
	var sadded_ids=[];
	fslen=sfoundarr.length;
	console.log("[post_api_story_language_part7][signlangauges-found]["+fslen+"]");
	for(var hh=0;hh<fslen;hh++) {
		srec=sfoundarr[hh];
		stmp1=JSON.parse(srec);
		foundslangs.push(stmp1[0].name);
		sadded_ids.push(stmp1[0].id);
	}
	// ******************************************
	// * CREATE SIGN LANGUAGE "NOT-FOUND" ARRAY *
	// ******************************************
	var notfoundslangs=[];
	sslen=mysarr.length;
	for(var pp=0;pp<sslen;pp++) {
		console.log(mysarr[pp]);
		if(check_found_slangs(mysarr[pp],foundslangs)==false) {
			notfoundslangs.push(mysarr[pp]);
		}
	}
	// *****************************************
	// * ADD SIGN LANGUAGE "NOT-FOUND" RECORDS *
	// *****************************************
	var signlangpromarr=[];
	nfslen=notfoundslangs.length;
	for(var qq=0;qq<nfslen;qq++) {
		console.log("[post_api_story_language_part7][ADD-NOT-FOUND SIGN LAUGUAGE]["+notfoundslangs[qq]+"]");
		signlangpromarr.push(new Promise((resolve,reject) => {
			SignlanguageDB.db_add_signlanguage(notfoundslangs[qq]).then(function(result) {
				console.log(result);
				signid=result.id;
				console.log("[post_api_story_language_part7][ADDED][signlanguagetableid]["+signid+"]");
				sadded_ids.push(signid);
				console.log("[post_api_story_language_part7][ADDED SIGN LANGUAGE][ID]["+signid+"][signlanguage]["+notfoundslangs[qq]+"][story]["+storyid+"]");

				resolve(result);
			}).catch(err => {
				console.log("[promise-7][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(signlangpromarr).then(() => { 
		console.log("[post_api_story_language_part7][PROMISES DONE-SIGN LANGUAGE-ADD]");
		salen=sadded_ids.length;
		for(var rr=0;rr<salen;rr++) {
			console.log("[post_api_story_language_part7][sadded-ids]["+rr+"]["+sadded_ids[rr]+"]")
		}
		post_api_story_language_part8(req,res,storyid,sadded_ids,mywarr,mysarr);
	}).catch(err => {
		console.log("broken promises 7");
	});
}

function check_found_slangs(onelang,foundslangs) {
	slen=foundslangs.length;
	for(var ss=0;ss<slen;ss++) {
		if(onelang==foundslangs[ss]) {
			return true;
		}
	}
	return false;
}

// *******************************************************************
// * PART OF SAVE STORY                                              *
// * SEE IF SIGN LANGUAGES EXIST IN STORY TO SIGN LANGUAGES DB TABLE *
// *******************************************************************
function post_api_story_language_part8(req,res,storyid,sadded_ids,mywarr,mysarr) {
	console.log(sadded_ids);
	var story2slangpromarr=[];
	var s2sexist=[];
	saddlen=sadded_ids.length;
	for(var tt=0;tt<saddlen;tt++) {
		story2slangpromarr.push(new Promise((resolve,reject) => {
			console.log("[post_api_story_language_part8][storyid]["+storyid+"][signlanguageid]["+sadded_ids[tt]+"]");
			StoryDB.getStoryToSignlanguage(storyid,sadded_ids[tt]).then(function(result) {
				if(result=="[]") {
					console.log("[post_api_story_language_part8][STORYTOSIGNLANGUAGE NOT-FOUND]["+storyid+"]");
					console.log(result);
					resolve(result);
				}
				else {
					obj=JSON.parse(result);
					var storytosignid=obj[0]["id"];
					s2sexist.push(obj[0]["signlanguageId"]);
					console.log("[post_api_story_language_part8][STORYTOSIGNLANGUAGE FOUND][storytosignlanguageid]["+storytosignid+"][storyid]["+storyid+"]");
					resolve(result);
				}
			}).catch(err => {
				console.log("[promise-8][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(story2slangpromarr).then(() => { 
		console.log("[post_api_story_language_part8][PROMISES DONE-STORY TO SIGN LANGUAGE-CHECKS]");
		post_api_story_language_part9(req,res,storyid,s2sexist,sadded_ids,mywarr,mysarr);
	}).catch(err => {
		console.log("broken promises 8");
	});
}

// ******************************************************************
// * PART OF SAVE STORY                                             *
// * ADD SIGN LANGUAGES INTO STORY TO SIGN LANGUAGES DB TABLE *
// ******************************************************************
function post_api_story_language_part9(req,res,storyid,s2sexist,alls_ids,mywarr,mysarr) {
	console.log("[s2sexist]");
	console.log(s2sexist);
	console.log("[alls_ids]");
	console.log(alls_ids);

	s2s_len=s2sexist.length;
	for(var uu=0;uu<s2w_len;uu++) {
		console.log("[post_api_story_language_part9][signlangid-related to story]["+uu+"]["+s2sexist[uu]+"]");
	}

	var sids2add=[];
	var all_slen=alls_ids.length;
	for(var vv=0;vv<all_slen;vv++) {
		console.log("[post_api_story_language_part9][signlangid]["+vv+"]["+alls_ids[vv]+"]");
		if(check_found_s2slangs(alls_ids[vv],s2sexist)==false) {
			console.log("[PUSH]["+alls_ids[vv]+"]");
			sids2add.push(alls_ids[vv]);
		}
	}
	console.log("[sids2add]");
	console.log(sids2add);

	var story2slangpromarr=[];
	sids2a_len=sids2add.length;
	for(var ww=0;ww<sids2a_len;ww++) {
		console.log("[post_api_story_language_part9][ADD TO STORY TO SIGN LANGUAGE RELATIONSHIP][signlangid]["+ww+"]["+sids2add[ww]+"]");
		story2slangpromarr.push(new Promise((resolve,reject) => {
			StoryDB.addStoryToSignlanguage(storyid,sids2add[ww]).then(function(result) {
				resolve(result);
			}).catch(err => {
				console.log("[promise-9][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(story2slangpromarr).then(() => { 
		console.log("[post_api_story_language_part9][PROMISES DONE-STORY TO SIGN LANGUAGE-ADDS]");
	}).catch(err => {
		console.log("broken promises 9");
	});
}

function check_found_s2slangs(onelang,s2sexist) {
	s2s_slen=s2sexist.length;
	for(var xx=0;xx<s2s_slen;xx++) {
		if(onelang==s2sexist[xx]) {
			return true;
		}
	}
	return false;
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

