const fs = require('fs');
const express = require('express');
const session = require('express-session');
const LokiStore = require('connect-loki')(session);
const bodyParser = require('body-parser');
const decode = require('urldecode');
const encode = require('urlencode');
const _ = require('underscore');

const Settings = require('./js/Server/Settings.js');
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

app = express();
app.use(bodyParser.urlencoded({extended:false}));
port = 3000;

app.use(express.static(__dirname));

// ****************************************************************************
// * CREATE SESSION STUFF - BELOW THIS LINE                                   *
// ****************************************************************************
app.CreateSessions = function(options){
    var options = typeof options == "object" ? options : {};
    options.secret = options.secret || "salNodeBB"; // the secret is used as the id for the session cookie
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
    // options.store = new FileStore();

    app.use(session(options));
}
app.CreateSessions({});
var sess=null;
// ****************************************************************************
// * CREATE SESSION STUFF - ABOVE THIS LINE                                   *
// ****************************************************************************

	app.get('/', function(req, res){
		res.redirect('/Stories');
	});
	app.get('/Stories', function(req, res){
		res.send(PageTemplate({
			Page: 'Stories'
		}));
	});
	app.get('/Games', function(req, res){
		res.send(PageTemplate({
			Page: 'Games'
		}));
	});
	app.get('/Login', function(req, res){
	sess=req.session;
	console.log("[/Login][Sess.Email]["+sess.email+"]");
		res.send(PageTemplate({
			Page: 'Login'
		}));
	});
	app.get('/Search', function(req, res){
		res.send(PageTemplate({
			Page: 'Search'
		}));
	});
	app.get('/Edit', function(req, res){
		res.send(PageTemplate({
			Page: 'Edit'
		}));
	});
	app.get('/Story', function(req, res){
		res.send(PageTemplate({
			Page: 'Story'
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
// * SAVE LANGUAGES IN STORY  *
// * 1ST TRY - BROKEN         *
// * - RETURN - true or false *
// ****************************
app.post('/api/story/languagex',function(req,res) {

	obj=req.body;
	myid=obj.id;
	mywarr=obj['writtenlanguages[]'];
	mysarr=obj['signlanguages[]'];

	console.log("[api/story/language][id]["+myid+"]");
	console.log("[api/story/language][written-array]["+mywarr+"]");
	console.log("[api/story/language][sign-array]["+mysarr+"]");

	mywlang=mywarr[0];

	// *************************
	// * DOES THE STORY EXIST? *
	// *************************
        console.log("[DOES STORY EXIST?][STORY]["+myid+"]");
	StoryDB.getStory(myid).then(function(result) {
		if(result=="[]") {
			// ****************************
			// * NO, STORY DOES NOT EXIST *
			// ****************************
			console.log("[StoryDB.getStory][NO, STORY DOESN'T EXIST]");
			console.log(result);
			res.send(result);
		}
		else {
			// *********************
			// * YES, STORY EXISTS *
			// *********************
                        console.log("[StoryDB.getStory][YES, STORY EXISTS]["+myid+"]");
			xpost_api_story_language_part2x(req,res,myid,mywlang,mywarr,mysarr);
		}
	}).catch(err => {
		res.send(err);
	});
});
// ****************************
// * DELETE STORY LANGUAGES   *
// * - RETURN - true or false *
// ****************************
app.delete('/api/story/language',function(req,res) {
});
// ************************************
// * SAVE STORY COVER PAGE AND AUTHOR *
// * - RETURN - true or false         *
// ************************************
app.post('/api/story/cover',function(req,res) {
});
// ****************************
// * SAVE STORY METADATA      *
// * - RETURN - true or false *
// ****************************
app.post('/api/story/metadata',function(req,res) {
});
// ****************************
// * SAVE STORY JSON DATA     *
// * - RETURN - true or false *
// ****************************
app.post('/api/story/data',function(req,res) {
});
// ****************************
// * PUBLISH STORY            *
// * - RETURN - true or false *
// ****************************
app.post('/api/story/publish',function(req,res) {
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

function xpost_api_story_language_part2x(req,res,storyid,writlang,mywarr,mysarr) {
	// *******************
	// * STORY WAS FOUND *
	// *******************
        // ********************************
        // * DOES WRITTEN LANGUAGE EXIST? *
        // ********************************
        console.log("[xpost_api_story_language_part2x][DOES WRITTEN LANGUAGE EXIST?][language]["+writlang+"][storyid]["+storyid+"]");
	WrittenlanguageDB.getwrittenlanguage(writlang).then(function(result) {
		if(result=="[]") {
                        // ***************************************
                        // * NO, WRITTEN LANGUAGE DOES NOT EXIST *
                        // ***************************************
                        console.log("[xpost_api_story_language_part2x][NO, WRITTENLANGUGE DOESN'T EXIST]["+writlang+"][story]["+storyid+"]");
                        xpost_api_story_language_part3x(req,res,storyid,writlang,mywarr,mysarr);
                }
                else {
                        obj=JSON.parse(result);
                        var writid=obj[0]["id"];
                        // ******************************
                        // * YES, WRITTENLANGUAGE EXISTS *
                        // ******************************
                        console.log("[xpost_api_story_language_part2x][YES, WRITTEN LANGUAGE EXISTS]["+writid+"][writtenlanguage]["+writlang+"][story]["+storyid+"][go to part 4]");
			post_api_story_language_part4(req,res,storyId,writid,mywarr,mysarr);
                }
	}).catch(err => {
		res.send(err);
	});
}

function xpost_api_story_language_part3x(req,res,storyid,writlang,mywarr,mysarr) {
        // *******************
        // * STORY WAS FOUND *
        // *******************
        // ***********************************
        // * WRITTEN LANGUAGE DOES NOT EXIST *
        // ***********************************
        // ************************
        // * ADD WRITTEN LANGUAGE *
        // ************************
        console.log("[xpost_api_story_language_part3x][ADD WRITTEN LANGUAGE]["+writlang+"][story]["+storyid+"]");
        writid=0;
        WrittenlanguageDB.db_add_writtenlanguage(writlang).then(function(result) {
                writid=result.id;
                console.log("[xpost_api_story_language_part3x][NEW WRITTEN LANGUAGE ID]["+writid+"][writtenlanguage]["+writlang+"][story]["+storyid+"]");
		// ********************************************************
		// * DOES STORY AND WRITTEN LANGUAGE HAVE A RELATIONSHIP? *
		// ********************************************************
		xpost_api_story_language_part4x(req,res,storyid,writid,mywarr,mysarr);
        }).catch(err => {
                res.send(err);
        });
}

function xpost_api_story_language_part4x(req,res,storyId,writtenlanguageId,mywarr,mysarr) {
	console.log("got to part 4");
        // *******************
        // * STORY EXISTS *
        // *******************
        // ***************************
        // * WRITTEN LANGUAGE EXISTS *
        // ***************************
        // ***************************************************
        // * STORY AND WRITTEN LANGUAGE RELATIONSHIP EXIST ? *
        // ***************************************************
	console.log("[part4][STORY/WRITTEN LANGUAGE RELATIONSHIP EXIST?][story]["+storyId+"][writtenlanguage]["+writtenlanguageId+"]");
	StoryDB.getStoryToWrittenlanguage(storyId,writtenlanguageId).then(function(result) {
		if(result=="[]") {
			console.log("[xpost_api_story_language_part4x][NO RELATIONSHIP][ADD!][story]["+storyId+"][writtenlanguage]["+writtenlanguageId+"]");
			xpost_api_story_language_part5x(req,res,storyId,writtenlanguageId,mywarr,mysarr);
		}
		else {
			console.log("[xpost_api_story_language_part4x][RELATIONSHIP EXISTS][DONE!][story]["+storyId+"][writtenlanguage]["+writtenlanguageId+"]");
			res.send(result);
		}
        }).catch(err => {
                res.send(err);
        });
}

function xpost_api_story_language_part5x(req,res,storyId,writtenlanguageId,mywarr,mysarr) {
	console.log("[xpost_api_story_language_part5x][ADD RELATIONSHIP][story]["+storyId+"][writtenlanguage]["+writtenlanguageId+"]");
	StoryDB.addStoryToWrittenlanguage(storyId,writtenlanguageId).then(function(result) {
		var recid=result.id;
                console.log("[NEW RELATIONSHIP ADDED]["+recid+"]");
		res.send(result);
        }).catch(err => {
                res.send(err);
        });
}

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
				console.log("[promise][rejected]");
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
				console.log("[promise][rejected]");
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

function post_api_story_language_part4(req,res,storyid,added_ids,mywarr,mysarr) {
	console.log(added_ids);
	var storywlangpromarr=[];
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
					console.log("[post_api_story_language_part4][STORYTOWRITTENLANGUGE FOUND][storytowrittenlanguageid]["+storytowritid+"][storyid]["+storyid+"]");
					resolve(result);
				}
			}).catch(err => {
				console.log("[promise][rejected]");
				reject(err);
			});
		}));
	}
	Promise.all(storywlangpromarr).then(() => { 
		console.log("[post_api_story_language_part4][PROMISES DONE-STORY TO WRITTEN LANGUAGE-CHECKS]");
	}).catch(err => {
		console.log("broken promises 4");
	});
}

