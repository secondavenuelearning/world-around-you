import 'style/StoryPreview.css!';
import _ from 'underscore';
import html from 'html/Client/StoryPreview.html!text';

var index = 0,
	template = _.template(html);

function StoryPreview(story){
	// get the index for this current instance
	this.id = `story-preview-${index++}`;
	this.story = story;
console.log(story);
	// get the html from the template
	var element = template({
		id: this.id,
		story: this.story
	});

	// create the jquery element
	this.$element = $(element);
}

StoryPreview.prototype.appendTo = function(elementOrId) {
	// grab the jquery element
	var $elementOrId = $(typeof elementOrId == 'string' ? `#${elementOrId}` : elementOrId);

	// append the story preview element
	$elementOrId.append(this.$element);
	console.log(elementOrId);
};

export default StoryPreview;