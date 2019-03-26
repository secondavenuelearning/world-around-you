import 'style/Editor.css!';
import _ from "underscore";
import urlParams from 'js/Client/UrlParams';
import LanguageSelector from 'js/Client/LanguageSelector';

import html from 'html/Client/Editor.html!text';

import addTextHtml from 'html/Client/Editor/AddText.html!text';
const addTextTemplate = _.template(addTextHtml);

import languageHtml from 'html/Client/Editor/Language.html!text';
const languageTemplate = _.template(languageHtml);

import coverHtml from 'html/Client/Editor/Cover.html!text';
const coverTemplate = _.template(coverHtml);

import metadataHtml from 'html/Client/Editor/Metadata.html!text';
const metadataTemplate = _.template(metadataHtml);

import pagesHtml from 'html/Client/Editor/Pages.html!text';
const pagesTemplate = _.template(pagesHtml);

import pagePreviewHtml from 'html/Client/Editor/PagePreview.html!text';
const pagePreviewTemplate = _.template(pagePreviewHtml);

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
			renderEditorContent();

		}).fail((err) => {
			console.error(err);
			return alert('[PH] Error check the console');
		});
	});
});

function renderEditorContent(){
	if(!story) return;

	$('#editor-content').html('<div id="throbber"><img src="./img/ajax-loader.gif"></div>');

	if(EDITORPAGES[editorPageIndex] == 'language'){
		renderLanguagePage();
	}
	if(EDITORPAGES[editorPageIndex] == 'cover'){
		renderCoverPage();
	}
	if(EDITORPAGES[editorPageIndex] == 'metadata'){
		renderMetadataPage();
	}
	if(EDITORPAGES[editorPageIndex] == 'pages'){
		renderPagesPage();
	}
}

function RenderAddText(beforeElement, dataType, autocompleteValues){
	$('.add-text-container').remove();

	$(beforeElement).before(addTextTemplate({
		autocompleteValues,
		dataType
	}));

	$('.cancel-text').on('click', () => {
		$('.add-text-container').remove();
	});

	if(autocompleteValues){
		$('.add-text-input').on('keydown', () => {
			let value = $('.add-text-input').val();

			if(value == ''){
				$('.autocomplete-container').hide();
				return;
			}

			$('.autocomplete-container').show();
			$('.autocomplete-button').css('display', 'none');
			$('autocomplete-button').each((i, el) => {
				let _value = $(el).val();
				var regExp = new RegExp(`^${value}`);
				if(_value.match(regExp)) $(el).css('display', 'block');
			});
		});
	}
}

function renderLanguagePage(){

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
		if(EDITORPAGES[editorPageIndex] != 'language') return;

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
				let type = $(evt.currentTarget).attr('lang-type');
				RenderAddText($(evt.currentTarget).parent(), type);

				$('.save-text').on('click', () => {
					var language = $('.add-text-input').val();
					if(language == '') {
						$('.add-text-container').remove();	
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
	});
}

function renderCoverPage(){
	let coverImage = story.coverimage,
		author = story.author;

	var ReRender = function(unsavedChanges){
		$('#editor-content').html(coverTemplate({
			author,
			coverImage,
			unsavedChanges
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
				ReRender(true);
			}
			reader.readAsDataURL(file);
		});

		$('#author-input').on('keydown', (evt) => {
			var _author = $('#author-input').val();
			if(author == _author) return;

			author = _author;

			// not calling ReRender here so that the user does not lose focus
			$('#save-cover').prop('disabled', false);
			unsavedChanges = true;
		});
	}
	ReRender();
}

function renderMetadataPage(){
	if(!story.metadata || !story.metadata.writtenLanguages){
		editorPageIndex = 0;
		renderEditorContent();
		return;
	}


	var promises = [];

	// promises.push(new Promise((resolve, reject) => {
	// 	$.ajax({
	// 		method: 'get',
	// 		url: `./api/writtenlanguages`
	// 	}).done((_writtenLanguages) => {
	// 		writtenLanguages = _writtenLanguages;
	// 		resolve();
	// 	}).fail((err) => {
	// 		console.error(err);
	// 		return alert('[PH] Error check the console');
	// 	});
	// }));

	// promises.push(new Promise((resolve, reject) => {
	// 	$.ajax({
	// 		method: 'get',
	// 		url: `./api/signlanguages`
	// 	}).done((_signLanguages) => {
	// 		signLanguages = _signLanguages;
	// 		resolve();
	// 	}).fail((err) => {
	// 		console.error(err);
	// 		return alert('[PH] Error check the console');
	// 	});
	// }));

	Promise.all(promises).then(() => {
		if(EDITORPAGES[editorPageIndex] != 'metadata') return;

		let metadata = JSON.parse(JSON.stringify(story.metadata)),
			currentWrittenLanguage = metadata.writtenLanguages[0];

		// setting properties as empty object if they don't exist so we don't have to check for their existance later
		metadata.title = metadata.title || {};
		metadata.description = metadata.description || {};
		metadata.genres = metadata.genres || {};
		metadata.tags = metadata.tags || {};

		var ReRender = function(unsavedChanges){
			$('#editor-content').html(metadataTemplate({
				coverImage: story.coverimage,
				metadata,
				currentWrittenLanguage,
				unsavedChanges
			}));
			resizeCover(true);

			$('#current-language-select').on('change', (evt) => {
				currentWrittenLanguage = $('#current-language-select').val();
				ReRender(unsavedChanges);
			});

			$('#title-input, #description-input').on('keydown keyup', (evt) => {
				let $el = $(evt.currentTarget);
				metadata[$el.attr('data-type')][currentWrittenLanguage] = $el.val();

				// not calling ReRender here so that the user does not lose focus
				$('.save-button').prop('disabled', false);
				unsavedChanges = true;
			});

			$('.delete-button').on('click', (evt) => {
				let $el = $(evt.currentTarget),
					type = $el.attr('data-type'),
					value = $el.html();

				var dataArray = metadata[type][currentWrittenLanguage];

				let index = dataArray.indexOf(value);
				dataArray.splice(index, 1);

				ReRender(true);
			});

			$('.add-text-button').on('click', (evt) => {
				let type = $(evt.currentTarget).attr('data-type');
				RenderAddText($(evt.currentTarget).parent(), type);

				$('.save-text').on('click', function(){
					let value = $('.add-text-input').val();
					
					if(value != ''){
						if(!metadata[type][currentWrittenLanguage]) metadata[type][currentWrittenLanguage] = [];
						metadata[type][currentWrittenLanguage].push(value);
					}
					ReRender(true);
				});
			});

		}
		ReRender();
	});
}

function AddPagePreview(beforeElement, pageData, pageIndex){
	pageData.pageIndex = pageIndex;
	$(beforeElement).before(pagePreviewTemplate(pageData));
}
function renderPagesPage(){
	let data = story.data ? JSON.parse(JSON.stringify(story.data)) : [];

	var ReRender = function(unsavedChanges){
		$('#editor-content').html(pagesTemplate({
			data,
			unsavedChanges
		}));
		resizeCover(true);

		$('.add-page-button').on('click', (evt) => {
			AddPagePreview($(evt.currentTarget).parent(), {}, data.length)
		});
	}
	ReRender();
}