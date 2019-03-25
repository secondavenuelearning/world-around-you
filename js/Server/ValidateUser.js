var ValidateUser = function(req, res, next){
	// if there is no user logged in redirect to the main page or return nothing
	if(!req.session.user){
		if(req.method == "GET")
			res.redirect('/Stories');
		else
			res.send(false);
		return;
	}

	next();
}

module.exports = ValidateUser;