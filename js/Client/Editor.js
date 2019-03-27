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

import editWrittenHtml from 'html/Client/Editor/EditWritten.html!text';
const editWrittenTemplate = _.template(editWrittenHtml);

import editSignHtml from 'html/Client/Editor/EditSign.html!text';
const editSignTemplate = _.template(editSignHtml);

import editGlossaryHtml from 'html/Client/Editor/EditGlossary.html!text';
const editGlossaryTemplate = _.template(editGlossaryHtml);

import publishHtml from 'html/Client/Editor/Publish.html!text';
const publishTemplate = _.template(publishHtml);

const EDITORPAGES = [
	'language',
	'cover',
	'metadata',
	'pages',
	'publish'
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
		$('.cover-image-container').each((i, el) => {
			let $el = $(el);

			$el.css('width', '');
			var width = parseFloat($el.width());

			$el.css('height', `${9/16 * width}px`);
		});
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
	if(EDITORPAGES[editorPageIndex] == 'publish'){
		renderPublishPage();
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
function renderPagesPage(){
	if(!story.metadata || !story.metadata.writtenLanguages || !story.metadata.signLanguages){
		editorPageIndex = 0;
		renderEditorContent();
		return;
	}

	// Create the variables needed for rendering each page
	var data = story.data ? JSON.parse(JSON.stringify(story.data)) : [],
		currentPageIndex = 0,
		currentWrittenLanguage = story.metadata.writtenLanguages[0],
		currentSignLanguage = story.metadata.signLanguages[0],
		currentPageContent = 'written',
		currentGlossaryTerm = '';


	var ReRender = function(unsavedChanges){
		// render the mage page content
		$('#editor-content').html(pagesTemplate({
			data,
			unsavedChanges
		}));

		// resize any cover images to the correct aspect ratio
		resizeCover(true);

		// add button callbacks
		$('.add-page-button').on('click', () => {
			AddPage();
		});

		$('.page-nav-button').on('click', (evt) => {
			let $el = $(evt.currentTarget);
			$('.page-nav-button').removeClass('active');
			$el.addClass('active');

			currentPageContent = $el.attr('page-type');

			RenderPageContent();
		});

		// create a default page or add any existing pages to the story
		if(data.length == 0){
			AddPage();
		}
		else{
			_.each(data, (page, index) => {
				AddPage(page, index);
			});
		}
	}

	// function to add a page an all the associated callbacks
	var AddPage = function(page, index){
		// set the page variables if there if none exist and we are creating a new page
		if(!page){
			page = {};
			index = data.length;
			data.push(page);
		}

		// add the page preview button
		let $el = AddPagePreview($('.add-page-button').parent(), page, index, true, () => {
			if(data.length == 1) return;

			data.splice(index, 1);
			$el.remove();
			ReIndexPages();
		});

		// activat the newly added page
		ActivatePage($el.find('.page-preview')[0]);

		// setting a timeout here to ensure the content is actually on the page
		setTimeout(() => {
			// scroll to the bottom of the page previews
			$('.add-page-button')[0].scrollIntoView();

			// re-add the page preview callbacks
			$('.page-preview').off();
			$('.page-preview').on('click', (evt) => {
				ActivatePage($(evt.currentTarget));
			});
		}, 0);
	}

	// function to renumber the pages in case one is deleted
	var ReIndexPages = function(){
		let lastEl;
		$('.page-preview-container').each((i, el) => {
			let $el = $(el);
			$el.find('.page-preview').attr('page-index', i);
			$el.find('.page-delete-button').attr('page-index', i);
			$el.find('.page-number').html(i + 1);
			lastEl = $el.find('.page-preview')[0];
		});

		ActivatePage(lastEl);
	}

	// funciton to activate a page and set all of the proper variables
	var ActivatePage = function($el){
		$el = $($el);

		$('.page-preview').removeClass('active');
		$el.addClass('active');

		currentPageIndex = parseInt($el.attr('page-index'));
		currentWrittenLanguage = story.metadata.writtenLanguages[0];
		currentSignLanguage = story.metadata.signLanguages[0];
		currentPageContent = 'written';

		$('.page-nav-button').removeClass('active');
		$(`.page-nav-button[page-type=${currentPageContent}]`).addClass('active');

		RenderPageContent();
	}

	// function to render the a page tab (editing text, video, or glossary terms)
	var RenderPageContent = function($el){		
		if(currentPageContent == 'written'){
			$('#page-edit-content').html(editWrittenTemplate({
				page: data[currentPageIndex],
				story,
				currentWrittenLanguage
			}));
		}
		if(currentPageContent == 'sign'){
			$('#page-edit-content').html(editSignTemplate({
				page: data[currentPageIndex],
				story,
				currentSignLanguage
			}));
		}
		if(currentPageContent == 'glossary'){
			$('#page-edit-content').html(editGlossaryTemplate({
				page: data[currentPageIndex],
				story,
				currentWrittenLanguage,
				currentSignLanguage,
				currentGlossaryTerm
			}));
		}
		resizeCover(true);

		$('#current-written-language-select').on('change', (evt) => {
			currentWrittenLanguage = $(evt.currentTarget).val();
			RenderPageContent();
		});

		$('#current-sign-language-select').on('change', (evt) => {
			currentSignLanguage = $(evt.currentTarget).val();
			RenderPageContent();
		});

		$('#page-text').on('keydown keyup', (evt) => {
			if(!data[currentPageIndex].text) data[currentPageIndex].text = {};
			data[currentPageIndex].text[currentWrittenLanguage] = $(evt.currentTarget).val();

			$('.save-button').prop('disabled', false);
			unsavedChanges = true;
		});


		$('#image-button').on('click', (evt) => {
			$('#image-input').trigger('click');
		});

		$('#image-input').on('change', (evt) => {
			var file = $('#image-input')[0].files[0];
			// create a new file reader
			var reader = new FileReader();

			reader.onload = function(){
				$('#image-container').css('background-image', `url(${reader.result})`);
				data[currentPageIndex].image = reader.result;
				data[currentPageIndex].imageFile = file;

				$('.save-button').prop('disabled', false);
				unsavedChanges = true;
			}
			reader.readAsDataURL(file);
		});

		$('#video-button').on('click', (evt) => {
			$('#video-input').trigger('click');
		});

		$('#video-input').on('change', (evt) => {
			var file = $('#video-input')[0].files[0];
			// create a new file reader
			var reader = new FileReader();

			reader.onload = function(){
				// $('#video-player').remove();
				// $('#video-container').prepend(`<video id="video-player" controls autoplay muted loop src="${reader.result}"></video>`);
				$('#video-player').attr('src', reader.result);

				if(!data[currentPageIndex].video) data[currentPageIndex].video = {};
				data[currentPageIndex].video[currentSignLanguage] = reader.result;

				if(!data[currentPageIndex].videoFile) data[currentPageIndex].videoFile = {};
				data[currentPageIndex].videoFile[currentSignLanguage] = file;
				
				$('.save-button').prop('disabled', false);
				unsavedChanges = true;
			}
			reader.readAsDataURL(file);
		});

	}
	
	var RenderWrittenEdit = function(){

	}


	ReRender();
}
function renderPublishPage(){
	var data = story.data ? JSON.parse(JSON.stringify(story.data)) : []
	$('#editor-content').html(publishTemplate({
		data,
	}));
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
function AddPagePreview(beforeElement, page, pageIndex, includeDelete, deleteCallback){
	let $el = $(pagePreviewTemplate({
		pageIndex,
		page,
		includeDelete
	}));

	$(beforeElement).before($el);
	resizeCover(true);

	$el.find('.page-delete-button').on('click', (evt) => {
		if(typeof deleteCallback == 'function')
			deleteCallback();
		else
			$el.remove();
	});

	return $el;
}