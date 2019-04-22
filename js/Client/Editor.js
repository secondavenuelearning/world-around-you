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
	editorPageIndex = 0;


var interval = 0;
function resizeCover(noDelay){
	clearInterval(interval);
	interval = setTimeout(() => {
		$('.cover-image-container').each((i, el) => {
			let $el = $(el);

			$el.css('width', '');
			var width = Math.round(parseFloat($el.width()));
			
			$el.css('height', `${Math.floor(9/16 * width)}px`);
		});
	}, noDelay ? 1 : 40);	
}
$(window).resize(resizeCover);

$(document).ready(function () {

	if(navigator.serviceWorker){
		navigator.serviceWorker.getRegistrations().then((reg) => {
			if(reg[0]) reg[0].unregister();
		});
	}

	new Promise((resolve, reject) => {
		storyId = parseInt(urlParams.id);
		editorPageIndex = EDITORPAGES.indexOf(urlParams.page || 'language');

		if(storyId){
			return resolve();
		}
		else{
			$.ajax({
				method: 'post',
				url: '/api/story'
			}).done((_storyId) => {
				window.location = window.location.origin + window.location.pathname + `?id=${_storyId}`;
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

			renderEditorContent();
		});

		$.ajax({
			method: 'get',
			url: `/api/story?id=${storyId}`
		}).done((_story) => {
			story = _story;

			// go to the publish page is the story is already visible
			if(story.visible) editorPageIndex = EDITORPAGES.length - 1;

			renderEditorContent();

		}).fail((err) => {
			console.error(err);
			return alert('[PH] Error check the console');
		});
	});
});

function renderEditorContent(renderData){
	if(!story) return;


	$('#editor-nav-previous').prop('disabled', editorPageIndex == 0);
	$('#editor-nav-next').prop('disabled', editorPageIndex == EDITORPAGES.length - 1);

	$('#editor-content').html('<div id="throbber"><img src="./img/ajax-loader.gif"></div>');

	if(EDITORPAGES[editorPageIndex] == 'language'){
		renderLanguagePage(renderData);
	}
	if(EDITORPAGES[editorPageIndex] == 'cover'){
		renderCoverPage(renderData);
	}
	if(EDITORPAGES[editorPageIndex] == 'metadata'){
		renderMetadataPage(renderData);
	}
	if(EDITORPAGES[editorPageIndex] == 'pages'){
		renderPagesPage(renderData);
	}
	if(EDITORPAGES[editorPageIndex] == 'publish'){
		renderPublishPage(renderData);
	}
}
function renderLanguagePage(){

	let promises = [],
		writtenLanguages,
		signLanguages;

	promises.push(new Promise((resolve, reject) => {
		$.ajax({
			method: 'get',
			url: `/api/writtenlanguages`
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
			url: `/api/signlanguages`
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
				RenderAddText($(evt.currentTarget).parent(), type, null, () => {
					var language = $('.add-text-input').val();
					if(language == '') {
						$('.add-text-container').remove();	
						return;
					}

					let url = `/api/${type}language`;
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
				$('#editor-content').append('<div id="throbber"><img src="./img/ajax-loader.gif"></div>');
				let data = {
					id: storyId,
					writtenLanguages: storyWrittenLanguages,
					signLanguages: storySignLanguages
				};

				$.ajax({
					method: 'post',
					url: '/api/story/languages',
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
				});
			});
		}
		ReRender();
	});
}
function renderCoverPage(){
	let coverImage = story.coverimage,
		author = story.author,
		newImageFile;

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
				newImageFile = file;
				coverImage = reader.result;
				ReRender(true);
			}
			reader.readAsDataURL(file);
		});

		$('#author-input').on('change keydown keyup', (evt) => {
			var _author = $('#author-input').val();
			if(author == _author) return;

			author = _author;

			// not calling ReRender here so that the user does not lose focus
			$('#save-cover').prop('disabled', false);
			unsavedChanges = true;
		});

		$('.save-button').on('click', () => {
			$('#editor-content').append('<div id="throbber"><img src="./img/ajax-loader.gif"></div>');

			var uploadPromise = new Promise((resolve, reject) => {
				if(newImageFile){
					UploadFile(newImageFile, `ci-${storyId}`).then((path) => {
						coverImage = path + `?t=${new Date().getTime()}`;
						resolve();
					});
				}
				else{
					resolve();
				}
			});

			uploadPromise.then(() => {
				let data = {
					id: storyId,
					author,
					coverImage
				};

				$.ajax({
					method: 'post',
					url: '/api/story/cover',
					data
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
				});
			});
		})
	}
	ReRender();
}
function renderMetadataPage(){
	if(!story.metadata || !story.metadata.writtenLanguages){
		editorPageIndex = 0;
		renderEditorContent();
		return;
	}

	let promises = [],
		genres,
		tags;

	promises.push(new Promise((resolve, reject) => {
		$.ajax({
			method: 'get',
			url: `/api/genres`
		}).done((_genres) => {
			genres = _genres;
			resolve();
		}).fail((err) => {
			console.error(err);
			return alert('[PH] Error check the console');
		});
	}));

	promises.push(new Promise((resolve, reject) => {
		$.ajax({
			method: 'get',
			url: `/api/tags`
		}).done((_tags) => {
			tags = _tags;
			resolve();
		}).fail((err) => {
			console.error(err);
			return alert('[PH] Error check the console');
		});
	}));

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

			$('#title-input, #description-input').on('change keydown keyup', (evt) => {
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
				let type = $(evt.currentTarget).attr('data-type'),
					autoComplete = [];
				var	typeList = type == 'genres' ? genres : tags;

					_.each(typeList, (acObj) => {
						if(acObj.language.toLowerCase() == currentWrittenLanguage)
							autoComplete.push(acObj.name);
					});

				RenderAddText($(evt.currentTarget).parent(), type, autoComplete, (el) => {
					let value = $('.add-text-input').val();

					if(value == '') return;

					let data = {
						name: value,
						language: currentWrittenLanguage
					};

					$.ajax({
						method: 'post',
						url: `/api/${type == 'genres' ? 'genre' : 'tag'}`,
						data
					}).then((valueId) => {
						data.id = valueId;
						typeList[valueId] = data;

						if(!metadata[type][currentWrittenLanguage]) metadata[type][currentWrittenLanguage] = [];
						metadata[type][currentWrittenLanguage].push(value);

						ReRender(true);

					}).fail((err) => {
						console.error(err);
					})
				});
			});

			$('.save-button').on('click', () => {
				$('#editor-content').append('<div id="throbber"><img src="./img/ajax-loader.gif"></div>');
				let data = {
					id: storyId,
					metadata
				};

				$.ajax({
					method: 'post',
					url: '/api/story/metadata',
					data
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
				});
			});

		}
		ReRender();
	});
}
function renderPagesPage(renderData){
	if(!story.metadata || !story.metadata.writtenLanguages || !story.metadata.signLanguages){
		editorPageIndex = 0;
		renderEditorContent();
		return;
	}

	// Create the variables needed for rendering each page
	var data = story.data ? JSON.parse(JSON.stringify(story.data)) : [],
		pageId = data.length,
		currentPageIndex = 0,
		currentWrittenLanguage = story.metadata.writtenLanguages[0],
		currentSignLanguage = story.metadata.signLanguages[0],
		currentPageContent = 'written',
		currentGlossaryTerm = '',
		loopIndex;


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

		$('.save-button').on('click', () => {
			$('#editor-content').append('<div id="throbber"><img src="./img/ajax-loader.gif"></div>');
			var uploadPromises = [];

			_.each(data, (page, index) => {
				if(page.imageFile){
					uploadPromises.push(new Promise((resolve, reject) => {
						delete page.image;
						UploadFile(page.imageFile, `pi-${storyId}-${page.id}`).then((path) =>{
							page.image = path + `?t=${new Date().getTime()}`;;
							delete page.imageFile;
							resolve();
						});
					}));
				}
				if(page.videoFile){
					_.each(page.videoFile, (file, lang) => {
						uploadPromises.push(new Promise((resolve, reject) => {
							delete page.video[lang];
							UploadFile(file, `pv-${storyId}-${page.id}-${lang}`).then((path) =>{
								page.video[lang] = path + `?t=${new Date().getTime()}`;;
								delete page.videoFile[lang];
								resolve();
							});
						}));
					});
				}
				if(page.glossary){
					_.each(page.glossary, (glossaryList, lang) => {
						_.each(glossaryList, (termObj, term) => {
							if(!termObj.imageFile) return;

							uploadPromises.push(new Promise((resolve, reject) => {
								delete page.glossary[lang][term].image;
								UploadFile(termObj.imageFile, `pgi-${storyId}-${page.id}-${lang}-${term}`).then((path) => {
									page.glossary[lang][term].image = path + `?t=${new Date().getTime()}`;;
									delete page.glossary[lang][term].imageFile;
									resolve();
								});
							}));
						})
					});
				}

				Promise.all(uploadPromises).then(() => {
					let _data = {
						id: storyId,
						data
					};

					$.ajax({
						method: 'post',
						url: '/api/story/data',
						data: _data
					}).done((_story) => {
						if(_story){
							story = _story;
							renderData = {
								currentPageIndex: currentPageIndex,
								scroll: $('#term-selection')[0] ? $('#term-selection')[0].scrollTop : 0
							}
							$('#editor-content').html('');

							// setting this delay to unload the page of any videos or images
							setTimeout(ReRender, 200);
						}
						else{
							alert('[PH] something went wrong.')
						}
					}).fail((err) => {
						console.error(err);
						return alert('[PH] Error check the console');
					});
				});
			});
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

		if(renderData){
			if(typeof renderData.currentPageIndex == 'number')
				ActivatePage($('.page-preview')[renderData.currentPageIndex]);
		}


		if($('#pages-preview')[0])
			$('#pages-preview')[0].scrollTo(0, renderData && renderData.scroll ? renderData.scroll : 0);

		if($('.page-preview.active')[0])
			$('.page-preview.active')[0].scrollIntoViewIfNeeded();
	}

	// function to add a page an all the associated callbacks
	var AddPage = function(page, index){
		// set the page variables if there if none exist and we are creating a new page
		let scrollToBottom;
		if(!page){
			page = {
				id: pageId++
			};
			index = data.length;
			data.push(page);

			currentWrittenLanguage = story.metadata.writtenLanguages[0];
			currentSignLanguage = story.metadata.signLanguages[0];

			$('.save-button').prop('disabled', false);
			unsavedChanges = true;
			scrollToBottom = true;
		}

		// add the page preview button
		let $el = AddPagePreview($('body'), page, index, true, (el) => {
			if(data.length == 1) return;

			let _index = parseInt($(el).attr('page-index'));
			data.splice(_index, 1);
			$el.remove();
			ReIndexPages();

			$('.save-button').prop('disabled', false);
			unsavedChanges = true;
		});
		$('.add-page-button').parent().before($el);

		// activat the newly added page
		ActivatePage($el.find('.page-preview')[0]);

		// setting a timeout here to ensure the content is actually on the page
		setTimeout(() => {
			// scroll to the bottom of the page previews
			if(scrollToBottom){
				if($('.add-page-button'))
					$('.add-page-button')[0].scrollIntoView();
			}
			else{
				if($('.page-preview.active')[0])
					$('.page-preview.active')[0].scrollIntoViewIfNeeded();
			}


			// re-add the page preview callbacks
			$('.page-preview').off();
			$('.page-preview').on('click', (evt) => {
				ActivatePage(evt.currentTarget);
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

		$('.page-nav-button').removeClass('active');
		$(`.page-nav-button[page-type=${currentPageContent}]`).addClass('active');

		RenderPageContent();
	}

	// function to render the a page tab (editing text, video, or glossary terms)
	var RenderPageContent = function($el){
		var page = data[currentPageIndex];	
		if(currentPageContent == 'written'){
			$('#page-edit-content').html(editWrittenTemplate({
				page,
				story,
				currentWrittenLanguage
			}));
		}
		if(currentPageContent == 'sign'){
			$('#page-edit-content').html(editSignTemplate({
				page,
				story,
				currentSignLanguage
			}));
		}
		if(currentPageContent == 'glossary'){
			// set the current glossary term to the first term
			if(!currentGlossaryTerm || currentGlossaryTerm == ''){
				currentGlossaryTerm = page.glossary && page.glossary[currentWrittenLanguage] ? Object.keys(page.glossary[currentWrittenLanguage])[0] : '';
			}

			$('#page-edit-content').html(editGlossaryTemplate({
				page,
				story,
				currentWrittenLanguage,
				currentSignLanguage,
				currentGlossaryTerm
			}));
			let vid = $('#glossary-video-player')[0];
			if(vid){
				vid.ondurationchange = function(){
					if(!page.glossary || !page.glossary[currentWrittenLanguage] 
						|| !page.glossary[currentWrittenLanguage][currentGlossaryTerm] 
						|| !page.glossary[currentWrittenLanguage][currentGlossaryTerm].video
						|| !page.glossary[currentWrittenLanguage][currentGlossaryTerm].video[currentSignLanguage]) return;
					UpdateVideoKnobs();
				}
				vid.ontimeupdate = function(){
					if(!page.glossary || !page.glossary[currentWrittenLanguage] 
						|| !page.glossary[currentWrittenLanguage][currentGlossaryTerm] 
						|| !page.glossary[currentWrittenLanguage][currentGlossaryTerm].video
						|| !page.glossary[currentWrittenLanguage][currentGlossaryTerm].video[currentSignLanguage]) return;

					let startTime = page.glossary[currentWrittenLanguage][currentGlossaryTerm].video[currentSignLanguage].start || 0,
						endTime = page.glossary[currentWrittenLanguage][currentGlossaryTerm].video[currentSignLanguage].end || vid.duration;

					if(vid.currentTime < startTime || vid.currentTime > endTime)
						vid.currentTime = startTime;
				}

			}
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

		$('#page-text').on('change keydown keyup', (evt) => {
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

			$('#video-player').remove();
			$('#editor-content').append('<div id="throbber"><img src="./img/ajax-loader.gif"></div>');
			
			reader.onload = function(){
				// $('#video-player').remove();
				// $('#video-container').prepend(`<video id="video-player" controls autoplay muted loop src="${reader.result}"></video>`);
				// $('#video-player').attr('src', reader.result);

				if(!data[currentPageIndex].video) data[currentPageIndex].video = {};
				data[currentPageIndex].video[currentSignLanguage] = reader.result;

				if(!data[currentPageIndex].videoFile) data[currentPageIndex].videoFile = {};
				data[currentPageIndex].videoFile[currentSignLanguage] = file;
				
				$('.save-button').prop('disabled', false);
				unsavedChanges = true;

				renderData = {
					currentPageIndex: currentPageIndex,
					scroll: $('#term-selection')[0] ? $('#term-selection')[0].scrollTop : 0
				}

				ReRender(true);
			}
			reader.readAsDataURL(file);
		});

		$('.glossary-select-button').on('click', (evt) => { 
			let $el = $(evt.currentTarget),
				selectValue = $el.attr('select-value'),
				selectType = $el.attr('select-Type');

			if(selectType == 'currentWrittenLanguage')
				currentWrittenLanguage = selectValue;
			if(selectType == 'currentSignLanguage')
				currentSignLanguage = selectValue;
			if(selectType == 'currentGlossaryTerm')
				currentGlossaryTerm = selectValue;

			RenderPageContent();
		})

		$('#glossary-image-button').on('click', (evt) => {
			$('#glossary-image-input').trigger('click');
		});

		$('#glossary-image-input').on('change', (evt) => {
			var file = $('#glossary-image-input')[0].files[0];
			// create a new file reader
			var reader = new FileReader();

			reader.onload = function(){
				$('#glossary-image-container').css('background-image', `url(${reader.result})`);
				data[currentPageIndex].glossary[currentWrittenLanguage][currentGlossaryTerm].image = reader.result;
				data[currentPageIndex].glossary[currentWrittenLanguage][currentGlossaryTerm].imageFile = file;

				$('.save-button').prop('disabled', false);
				unsavedChanges = true;
			}
			reader.readAsDataURL(file);
		});

		$('#term-add-button').on('click', (evt) => {
			RenderAddText(evt.currentTarget, 'glossaryTerm', null, (el) => {
				if(!data[currentPageIndex].glossary) data[currentPageIndex].glossary = {};
				if(!data[currentPageIndex].glossary[currentWrittenLanguage]) data[currentPageIndex].glossary[currentWrittenLanguage] = {};

				var term = $('.add-text-input').val();
				data[currentPageIndex].glossary[currentWrittenLanguage][term] = {
					name: term
				};
				currentGlossaryTerm = term;

				unsavedChanges = true;
				RenderPageContent();
			});
		});


		$('.video-knob').on('mousedown', (evt) => {
			if(!currentGlossaryTerm || currentGlossaryTerm == '') return;

			let knob = $(evt.currentTarget),
				knobType = knob.attr('knob-type'),
				maxDelta = parseInt($('#glossary-video-controller').width());
				startPosition = parseInt(knob.css('left')),
				startX = evt.pageX,
				video = $('#glossary-video-player')[0];

			$('#glossary-video-controller').append(knob);
			knob.addClass('dragging');
			$('body').addClass('dragging');
			$('.knob-time').fadeIn(500);

			$(document).on('mousemove.drag', (evt) => {
				let delta = evt.pageX - startX + startPosition,
					skPos = parseInt($('#start-knob').css('left')),
					ekPos = parseInt($('#end-knob').css('left'));

				if(knobType == 'start'){
					delta = delta > 0 ? delta : 0;
					delta = delta < ekPos ? delta : ekPos - 1;
				}
				else{
					delta = delta > skPos ? delta : skPos + 1;
					delta = delta < maxDelta ? delta : maxDelta;
				}

				let deltaPercent = delta / maxDelta;

				let time = Math.round(video.duration * deltaPercent * 10) / 10;

				if(isNaN(time)) return;

				if(!data[currentPageIndex].glossary[currentWrittenLanguage][currentGlossaryTerm].video)
					data[currentPageIndex].glossary[currentWrittenLanguage][currentGlossaryTerm].video = {};

				if(!data[currentPageIndex].glossary[currentWrittenLanguage][currentGlossaryTerm].video[currentSignLanguage])
					data[currentPageIndex].glossary[currentWrittenLanguage][currentGlossaryTerm].video[currentSignLanguage] = {};

				if(knobType == 'start')
					data[currentPageIndex].glossary[currentWrittenLanguage][currentGlossaryTerm].video[currentSignLanguage].start = time;
				else
					data[currentPageIndex].glossary[currentWrittenLanguage][currentGlossaryTerm].video[currentSignLanguage].end = time;

				let startTime = data[currentPageIndex].glossary[currentWrittenLanguage][currentGlossaryTerm].video[currentSignLanguage].start || 0;
				video.currentTime = startTime;

				$('.save-button').prop('disabled', false);
				unsavedChanges = true;

				UpdateVideoKnobs();

			});

			$(document).on('mouseup.drag', (evt) => {
				$(document).off('.drag');
				knob.removeClass('dragging');
				$('body').removeClass('dragging');
				$('.knob-time').fadeOut(500);
			});
		});

		$('#term-definition-input').on('change keydown keyup', (evt) => {
			data[currentPageIndex].glossary[currentWrittenLanguage][currentGlossaryTerm].definition = $(evt.currentTarget).val();

			$('.save-button').prop('disabled', false);
			unsavedChanges = true;
		});

	}

	var UpdateVideoKnobs = function(){
		let video = $('#glossary-video-player')[0];

		let duration = video.duration;

		if(isNaN(duration)) return;

		let startPercent, endPercent
		if(data[currentPageIndex].glossary[currentWrittenLanguage][currentGlossaryTerm].video[currentSignLanguage].start){
			let startTime = data[currentPageIndex].glossary[currentWrittenLanguage][currentGlossaryTerm].video[currentSignLanguage].start;
			startPercent = startTime / duration * 100;

			$('#start-knob .knob-time').html(`${startTime}s`);
			$('#start-knob').css('left', `${startPercent}%`);
		}
		if(data[currentPageIndex].glossary[currentWrittenLanguage][currentGlossaryTerm].video[currentSignLanguage].end){
			let endTime = data[currentPageIndex].glossary[currentWrittenLanguage][currentGlossaryTerm].video[currentSignLanguage].end;
			endPercent = endTime / duration * 100;

			$('#end-knob .knob-time').html(`${endTime}s`);
			$('#end-knob').css('left', `${endPercent}%`);
		}

		startPercent = startPercent || 0;
		endPercent = endPercent || 100;
		$('#selected-track').css('left', `${startPercent}%`);
		$('#selected-track').css('width', `${endPercent - startPercent}%`);
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
	_.each(data, (page, index) => {
		$el = AddPagePreview($('#pages'), page, index);
		$el.find('.edit-button').on('click', () => {
			editorPageIndex--;
			renderEditorContent({currentPageIndex: index});
		});
	});

	$('.save-button').on('click', () => {
		$('#editor-content').append('<div id="throbber"><img src="./img/ajax-loader.gif"></div>');
		let data = {
			id: storyId
		};

		$.ajax({
			method: 'post',
			url: '/api/story/publish',
			data
		}).done((_story) => {
			if(_story){
				story.visible = 1;
				$('.save-button').remove();
				$('#throbber').remove();
				alert('Story Published')
			}
			else{
				alert('[PH] something went wrong.')
			}
		}).fail((err) => {
			console.error(err);
			return alert('[PH] Error check the console');
		});

	})
}

function RenderAddText(beforeElement, dataType, autocompleteValues, saveCallback){
	$('.add-text-container').remove();

	var $el = $(addTextTemplate({
		autocompleteValues,
		dataType
	}));

	$(beforeElement).before($el);

	$('.save-text').on('click', (evt) => {
		if(typeof saveCallback == 'function') saveCallback(evt.currentTarget);
		$('.add-text-container').remove();
	});

	$('.cancel-text').on('click', () => {
		$('.add-text-container').remove();
	});

	if(autocompleteValues){
		$('.autocomplete-button').on('click', (evt) => {
			let value = $(evt.currentTarget).html();
			$('.add-text-input').val(value);
			$('.save-text').trigger('click');
		});
		$('.autocomplete-container').hide();
		$('.add-text-input').on('change keydown keyup', () => {
			$('.autocomplete-container').hide();

			let value = $('.add-text-input').val();
			if(value == '')
				return;

			let match = false;
			$('.autocomplete-button').prop('disabled', true);
			$('.autocomplete-button').each((i, el) => {
				let _value = $(el).html();
				var regExp = new RegExp(`^${value}`, 'i');
				if(_value.match(regExp)) {
					match = true;
					$(el).prop('disabled', false);
				}
			});

			if(match) 
				$('.autocomplete-container').show();
		});
	}

	$('.add-text-input').focus();
	return $el;
}
function AddPagePreview(parent, page, pageIndex, includeDelete, deleteCallback){
	let $el = $(pagePreviewTemplate({
		pageIndex,
		page,
		includeDelete
	}));

	$(parent).append($el);
	resizeCover(true);

	$el.find('.page-delete-button').on('click', (evt) => {
		if(typeof deleteCallback == 'function')
			deleteCallback(evt.currentTarget);
		else
			$el.remove();
	});

	return $el;
}
function UploadFile(file, fileName){
	return new Promise((resolve, reject) => {
		var fd = new FormData();
		fd.append('file', file);

		$.ajax({
			method: 'post',
			url: `/api/file/${fileName}`,
	        enctype: 'multipart/form-data',
	        processData: false,  // Important!
	        contentType: false,
			data: fd
		}).done((result) =>{
			resolve(result.replace(/\\/, '/'));
		}).fail((err) => {
			console.error(err);
			alert('error in file upload');
		});
	});
}