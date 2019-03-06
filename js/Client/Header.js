import 'style/Header.css!';
import _ from 'underscore';
import LanguageSelector from 'js/Client/LanguageSelector';

import html from 'html/Client/Header.html!text';

var template = _.template(html);

$(document).ready(function(){
	LanguageSelector.appendTo($('header')[0]);

	var el = template({});
	$('header').append(el);
});