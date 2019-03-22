import 'style/Editor.css!';
import _ from "underscore";
import urlParams from 'js/Client/UrlParams';
import LanguageSelector from 'js/Client/LanguageSelector';

import html from 'html/Client/Editor.html!text';

import languageHtml from 'html/Client/Editor/Language.html!text';
const languageTemplate = _.template(languageHtml);
import addLanguageHtml from 'html/Client/Editor/AddLanguage.html!text';
const addLanguageTemplate = _.template(addLanguageHtml);

import coverHtml from 'html/Client/Editor/Cover.html!text';
const coverTemplate = _.template(coverHtml);

const EDITORPAGES = [
	'language',
	'cover',
	'metadata',
	'pages',
	'review'
]

var storyId,
	story,
	editorPageIndex = 0,
	writtenLanguages,
	signLanguages;


var interval = 0;
function resizeCover(noDelay){
	clearInterval(interval);
	interval = setTimeout(() => {
		let $el = $('#cover-image-container');
		
		$el.css('width', '');
		var width = parseFloat($el.width());

		$el.css('height', `${9/16 * width}px`);
	}, noDelay ? 1 : 40);	
}
$(window).resize(resizeCover);

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

			renderEditorContent();
		});

		$.ajax({
			method: 'get',
			url: `./api/story?id=${storyId}`
		}).done((_story) => {
			story = _story;

			var promises = [];

			promises.push(new Promise((resolve, reject) => {
				$.ajax({
					method: 'get',
					url: `./api/writtenlanguages`
				}).done((_writtenLanguages) => {
					writtenLanguages = _writtenLanguages;
					resolve();
				}).fail((err) => {
					console.error(err);
					return alert('[PH] Error check the console');
				});
			}));

			promises.push(new Promise((resolve, reject) => {
				$.ajax({
					method: 'get',
					url: `./api/signlanguages`
				}).done((_signLanguages) => {
					signLanguages = _signLanguages;
					resolve();
				}).fail((err) => {
					console.error(err);
					return alert('[PH] Error check the console');
				});
			}));

			Promise.all(promises).then(() => {
				renderEditorContent();
			}).catch((err) => {
				console.error(err);
				return alert('[PH] Error check the console');
			});

		}).fail((err) => {
			console.error(err);
			return alert('[PH] Error check the console');
		});
	});
});

function renderEditorContent(){
	if(!story) return;
	console.log(storyId, story, editorPageIndex, writtenLanguages, signLanguages);

	$('#editor-content').html('');
	if(EDITORPAGES[editorPageIndex] == 'language'){
		renderLanguagePage();
	}
	if(EDITORPAGES[editorPageIndex] == 'cover'){
		renderCoverPage();
	}
}

function renderLanguagePage(){
	let storyWrittenLanguages = [],
		storySignLanguages = [];

	if(story.metadata){
		if(story.metadata.writtenLanguages){
			// NOTE: we are using the stringify and parse because we don't want a reference we want to create a new array
			storyWrittenLanguages = JSON.parse(JSON.stringify(story.metadata.writtenLanguages));
		}
		if(story.metadata.signLanguages){
			// NOTE: we are using the stringify and parse because we don't want a reference we want to create a new array
			storySignLanguages = JSON.parse(JSON.stringify(story.metadata.signLanguages));
		}
	}

	var ReRender = function(unsavedChanges){

		$('#editor-content').html(languageTemplate({
			writtenLanguages,
			signLanguages,
			storyWrittenLanguages,
			storySignLanguages,
			unsavedChanges
		}));

		$('.story-language-button').on('click', (evt) => {
			let type = $(evt.currentTarget).attr('lang-type'),
				fnc = $(evt.currentTarget).attr('lang-fnc'),
				lang = $(evt.currentTarget).attr('lang-name');

			var languageArray = type == 'written' ? storyWrittenLanguages : storySignLanguages;

			if(fnc == 'add'){
				if(languageArray.indexOf(lang) == -1) languageArray.push(lang);
			}
			else{
				let index = languageArray.indexOf(lang)
				if(index != -1) languageArray.splice(index, 1);
			}
			ReRender(true);
		});

		$('.add-language').on('click', (evt) => {
			$('.add-language-container').remove();

			let type = $(evt.currentTarget).attr('lang-type');

			$(evt.currentTarget).parent().before(addLanguageTemplate({
				type
			}));

			$('.cancel-language').on('click', () => {
				$('.add-language-container').remove();
			});

			$('.save-language').on('click', () => {
				var language = $('.add-language-input').val();
				if(language == '') {
					$('.add-language-container').remove();	
					return;
				}

				let url = `./api/${type}language`;
				$.ajax({
					url,
					type: 'post',
					data: {language}
				}).done((_languageId) => {
					let languageId = parseInt(_languageId);
					var languageObject = type == 'written' ? writtenLanguages : signLanguages;
					languageObject[languageId] = {
						id: languageId,
						name: language
					}
					ReRender(unsavedChanges);
				}).fail((err) => {
					console.error(err);
					return alert('[PH] Error check the console');
				});
			});
		});

		$('.save-button').on('click', (evt) => {
			let data = {
				id: storyId,
				writtenLanguages: storyWrittenLanguages,
				signLanguages: storySignLanguages
			};

			console.log(data);

			$.ajax({
				url: 'api/story/languages',
				method: 'post',
				data,
			}).done((_story) => {
				if(_story){
					story = _story;
					ReRender();
				}
				else{
					alert('[PH] something went wrong.')
				}
			}).fail((err) => {
				console.error(err);
				return alert('[PH] Error check the console');
			})
		});
	}
	ReRender();
}

function renderCoverPage(){
	let coverImage = story.coverimage,
		author = story.author;

	var ReRender = function(unsavedChanges){
		$('#editor-content').html(coverTemplate({
			author,
			coverImage
		}));
		resizeCover(true);

		$('#cover-image-button').on('click', (evt) => {
			$('#cover-image-input').trigger('click');
		});
		$('#cover-image-input').on('change', (evt) => {
			var file = $('#cover-image-input')[0].files[0];
			// create a new file reader
			var reader = new FileReader();

			reader.onload = function(){
				coverImage = reader.result;
				ReRender();
			}
			reader.readAsDataURL(file);
		})
	}
	ReRender();
}