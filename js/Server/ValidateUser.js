var ValidateUser = function(req, res, next){
	// if there is no user logged in redirect to the main page
	if(!req.session.user){
		if(req.method == "get")
			res.redirect('/Stories');
		else
			res.send(false);
		return;
	}

	next();
}

module.exports = ValidateUser;