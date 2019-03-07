const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const decode = require('urldecode');
const encode = require('urlencode');
const _ = require('underscore');

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

// ***************
// * GENRE - ADD *
// ***************
app.post('/add_genre',function(req,res) {

        // res.send(req.body);

        // show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

	StoryDB.db_add_story(author,descriptionId,coverimage,visible,data).then(function(result) {
		res.send("<div>story '"+titleId+"' added to StoryDB["+result+"]</div>");
	}).catch(err => {
		res.send(err);
	});
});

// ************************
// * STORY_TO_GENRE - ADD *
// ************************
app.post('/add_story_to_genre',function(req,res) {

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

        //res.send(req.body);

        //show_body_stuff(req.body);

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

// ******************
// * LISTEN TO PORT *
// ******************
app.listen(port,function(){
        console.log('Listening on port '+port);
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

