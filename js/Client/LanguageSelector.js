import 'style/LanguageSelector.css!';
import _ from 'underscore';
import languages from 'js/Client/LanguageSelector_Languages';
import html from 'html/Client/LanguageSelector.html!text';


languages.sort(function(a, b) {
	return a.code > b.code ? 1 : a.code < b.code ? -1 : 0;
});

var template = _.template(html),
	currentLanguage = $('html').attr('lang'),
	currentLanguageText,
	$el = $(template({
		languages,
		currentLanguage
	}));

_.each(languages, (lang) => {
	if(lang.code == currentLanguage) currentLanguageText = lang.text;
});

$(`*[lang="${currentLanguage}"]:not(html)`).show();

var appendTo = function(elementOrId) {
	// grab the jquery element
	var $elementOrId = $(typeof elementOrId == 'string' ? `#${elementOrId}` : elementOrId);

	// append the story preview element
	$elementOrId.append($el);

	$('#language-select').off('change');
	$('#language-select').on('change', function(evt){
		currentLanguage = $(evt.currentTarget).val();
		$('#language-select option').each((i, el) => {
			if($(el).prop('selected')) currentLanguageText = $(el).html().toLowerCase();
		});
		updateLanguageDisplay();
		$(document).trigger('languageChange');
	});
}

var updateLanguageDisplay = function(){
	$('*[lang]:not(html)').hide();
	$('html').attr('lang', currentLanguage);

	// conver any text to an actual language code
	_.each(languages, (langObj) => {
		$(`*[lang="${langObj.text}"]`).attr('lang', langObj.code);
	});

	$(`*[lang="${currentLanguage}"]:not(html)`).show();
}

export default {
	appendTo,
	updateLanguageDisplay,
	currentLanguage: function(){return currentLanguage.toLowerCase()},
	currentLanguageText: function(){return currentLanguageText.toLowerCase()}
}