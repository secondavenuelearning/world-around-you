import 'style/Main.css!';
import 'style/Header.css!';

import _ from 'underscore';
import user from 'js/Client/User';
import LanguageSelector from 'js/Client/LanguageSelector';
import ImageHoverSwap from 'js/Client/HelperFunctions.js'
import html from 'html/Client/Header.html!text';

var template = _.template(html);

$('document').ready(function(){
  
	LanguageSelector.appendTo($('header')[0]);

	var el = template({
		user,
		offline: window.offline
	});
	$('header').append(el);
	LanguageSelector.updateLanguageDisplay();
});