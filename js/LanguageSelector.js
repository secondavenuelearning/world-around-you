import 'style/LanguageSelector.css!';
import _ from 'underscore';
import languages from 'js/LanguageSelector_Languages';
import html from 'html/LanguageSelector.html!text';


languages.sort(function(a, b) {
	return a.code > b.code ? 1 : a.code < b.code ? -1 : 0;
});

var template = _.template(html),
	currentLanguage = $('html').attr('lang'),
	$el = $(template({
		languages,
		currentLanguage
	}));

$(`*[lang="${currentLanguage}"]:not(html)`).show();

var appendTo = function(elementOrId) {
	// grab the jquery element
	var $elementOrId = $(typeof elementOrId == 'string' ? `#${elementOrId}` : elementOrId);

	// append the story preview element
	$elementOrId.append($el);

	$('#language-select').off('change');
	$('#language-select').on('change', function(evt){
		currentLanguage = $(evt.currentTarget).val();

		$('*[lang]:not(html)').hide();
		$(`*[lang="${currentLanguage}"]:not(html)`).show();
		$('html').attr('lang', currentLanguage);
	});
}

export default {
	appendTo
}