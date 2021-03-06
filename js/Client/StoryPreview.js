import 'style/StoryPreview.css!';
import _ from 'underscore';
import html from 'html/Client/StoryPreview.html!text';
import LanguageSelector from 'js/Client/LanguageSelector';
import user from 'js/Client/User';

var index = 0,
	template = _.template(html),
	online = !window.offline;

var interval = 0;
function resizePrviews(){
	clearInterval(interval);
	interval = setTimeout(() => {
		$('.story-preview').not('.carousel .story-preview').each((i, el) => { //dont apply this to carousel previews
			let $el = $(el);
			
			$el.css('width', '');
			var width = parseFloat($el.width());

			$el.css('height', `${9/16 * width}px`);
		});
	}, 40);	
}
$(window).resize(resizePrviews);

function StoryPreview(story, launchToEditor){
	// get the index for this current instance
	this.id = `story-preview-${index++}`;
	this.story = story;
	this.user = user;
	this.launchToEditor = launchToEditor === true ? true : false;

	// get the html from the template
	var element = template({
		id: this.id,
		story: this.story,
		user: this.user,
		launchToEditor: this.launchToEditor,
		online
	});

	// create the jquery element
	this.$element = $(element);
}

StoryPreview.prototype.appendTo = function(elementOrId) {
	// grab the jquery element
	var $elementOrId = $(typeof elementOrId == 'string' ? `#${elementOrId}` : elementOrId);

	// append the story preview element
	$elementOrId.append(this.$element);
	resizePrviews();
    LanguageSelector.updateLanguageDisplay();
};

export default StoryPreview;