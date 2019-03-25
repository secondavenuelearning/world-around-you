import 'style/Editor.css!';
import _ from "underscore";
import urlParams from 'js/Client/UrlParams';
import LanguageSelector from 'js/Client/LanguageSelector';

import html from 'html/Client/Editor.html!text';

const EDITORPAGES = [
	'language',
	'cover',
	'metadata',
	'pages',
	'review'
]

var storyId,
	story,
	editorPageIndex = 0;

$(document).ready(function () {

	new Promise((resolve, reject) => {
		storyId = parseInt(urlParams.id);
		editorPageIndex = EDITORPAGES.indexOf(urlParams.page || 'language');

		if(storyId){
			return resolve();
		}
		else{
			$.ajax({
				method: 'post',
				url: './api/story'
			}).done((_storyId) => {
				storyId = parseInt(_storyId);
				return resolve();
			}).fail((err) => {
				console.error(err);
				return alert('[PH] Error check the console');
			});
		}
	}).then(() => {
		$('main').html(html);
		$('#editor-nav-previous').prop('disabled', editorPageIndex == 0);
		$('#editor-nav-next').prop('disabled', editorPageIndex == EDITORPAGES.length - 1);

		$('.editor-nav-button').on('click', (evt) => {
			var dir = parseInt($(evt.currentTarget).attr('nav-dir'));

			if(dir == 1 && (editorPageIndex == EDITORPAGES.length - 1))
				return;
			else if(dir == -1 && editorPageIndex == 0)
				return;

			editorPageIndex += dir;
			
			$('#editor-nav-previous').prop('disabled', editorPageIndex == 0);
			$('#editor-nav-next').prop('disabled', editorPageIndex == EDITORPAGES.length - 1);

			RenderEditorContent();
		});

		$.ajax({
			method: 'get',
			url: `./api/story?id=${storyId}`
		}).done((_story) => {
			story = _story;
			RenderEditorContent();
		}).fail((err) => {
			console.error(err);
			return alert('[PH] Error check the console');
		});
	});
});

function RenderEditorContent(){
	if(!story) return;
}