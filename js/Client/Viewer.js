import 'style/Main.css!';
import 'style/Viewer.css!';

import _ from 'underscore';
import OfflineWorker from 'js/Client/OfflineWorker';
import urlParams from 'js/Client/UrlParams';
import LanguageSelector from 'js/Client/LanguageSelector';

import StoryPreview from 'js/Client/StoryPreview.js';
import Carousel from 'js/Client/Carousel.js';
import StoryViewer from 'js/Client/StoryViewer.js';
import StoryGrid from 'js/Client/StoryGrid.js';

import html from 'html/Client/Viewer.html!text';
const template = _.template(html);

const OFFLINEPAGEASSETS = [
	'/upup.min.js',
	'/upup.sw.min.js',

	'/js/jquery-min.js',
	'/js/jquery-ui.min.js',

	'/js/Offline/Header_Offline.js',
	'/js/Offline/Viewer_Offline.js',

	'/img/icons/NavBar/WAY_logo.svg',

	'/img/icons/General/icon_Globe_White.svg',
	'/img/icons/General/icon_Page_Back.svg',
	'/img/icons/General/icon_Page_Next.svg',
	'/img/icons/General/icon_Close.svg',
	'/img/icons/General/icon_Close_hoverDown.svg',
	'/img/icons/General/icon_WrittenLang_White.svg',
	'/img/icons/General/icon_SignLang_White.svg',
	'/img/icons/General/icon_DropDnArrow.svg',

	'/img/icons/StoryViewer/bkgd_pageCounter.svg',
	'/img/icons/StoryViewer/icon_SV_CoverImage.svg',
	'/img/icons/StoryViewer/icon_SV_FullScreen.svg',
	'/img/icons/StoryViewer/icon_SV_FullScreen_hoverDown.svg',
	'/img/icons/StoryViewer/icon_SV_FullScreen_Reverse.svg',
	'/img/icons/StoryViewer/icon_SV_FullScreen_Reverse_hoverDown.svg',
	'/img/icons/StoryViewer/icon_SV_Page_Image.svg',
	'/img/icons/StoryViewer/icon_SV_Page_Image_hoverDown.svg',
	'/img/icons/StoryViewer/icon_SV_Page_SignLang.svg',
	'/img/icons/StoryViewer/icon_SV_Page_SignLang_hoverDown.svg',
	'/img/icons/StoryViewer/icon_SV_ShowText.svg',
	'/img/icons/StoryViewer/icon_SV_ShowText_hoverDown.svg',
	'/img/icons/StoryViewer/icon_SV_HideText.svg',
	'/img/icons/StoryViewer/icon_SV_HideText_hoverDown.svg',
	'/img/icons/StoryViewer/icon_SV_WrittenLang.svg',
	'/img/icons/StoryViewer/icon_SV_WrittenLang_hoverDown.svg',
	'/img/icons/StoryViewer/icon_SV_SignLang.svg',
	'/img/icons/StoryViewer/icon_SV_SignLang_hoverDown.svg'
];

let storyId,
	story,
	liked = false,
	offlineIds = [];

function displaySimilarGenres(stories){
	let similarGenreStories = [],
	lang = LanguageSelector.currentLanguageText();

	_.each(story.metadata.genres[lang], (genre) => {
		_.each(stories, (_story) => {
			if(_story.added) return;
			
			let added = false;
			_.each(_story.metadata.genres[lang], (_genre) => {
				if(_genre == genre && _story.id != story.id) added = true;
			});

			_story.added = added;
			if(added) similarGenreStories.push(new StoryPreview(_story))
		});
	});

	if(similarGenreStories.length > 0){
		$('#more-stories').show();
		new Carousel('#more-stories', similarGenreStories, 4, false, false, 'Similar Stories');
	}
	else{
		$('#more-stories').hide();
	}
}

function getStoryAssetList(){

	var AddToList = function(objOrString, currentList){
		if(typeof objOrString == 'string'){
			if(currentList.indexOf(objOrString) == -1 && objOrString.match(/\.[a-z0-9]{3,4}$|\.[a-z0-9]{3,4}\?t=[0-9]*$/gi)){
				currentList.push(objOrString);
			}

			return currentList;
		}
		else if(typeof objOrString == 'object'){
			_.each(objOrString, (obj, fieldName) => {
				if(fieldName == 'datecreated' || fieldName == 'datemodified') return;
				AddToList(obj, currentList);
			});

			return currentList;
		}
	}

	let assetList = AddToList(story, []);
	return assetList;
}

function showStory(){
	let online = !window.offline;

	// add the main html to the page
	$('main').html(template({
		story,
		online
	}));

	if(story){
		// Render the story viewer
		StoryViewer.SetStory(story);
		StoryViewer.Render('viewer');
	}

	LanguageSelector.updateLanguageDisplay();

	// We dont need the rest of the functions if this is the offline mode
	if(!online){
		showOfflineStories();
		return;
	}

	let assetList = OfflineWorker.AddToAssetList('Viewer', OFFLINEPAGEASSETS);
	OfflineWorker.SaveServiceWorker('/html/Client/ViewerOffline.html', assetList);

	// add a view to the counter
	$.ajax({
		method: 'post',
		url: '/api/story/view',
		data: {
			id: story.id
		}
	});

	// like button function
	$('#social-likes').on('click', () => {
		if(liked) return;

		liked = true;

		$.ajax({
			method: 'post',
			url: '/api/story/like',
			data: {
				id: story.id
			}
		}).done((stories) => {
			$('#likes').html(story.metadata.likes + 1);
		}).fail((err) => {
			console.error(err);
		});
	});

	// Export button function
	$('#social-export').on('click', () => {
		//let curWrittenLang = StoryViewer.GetCurrentWrittenLanguage(),
			//curSignLang = StoryViewer.GetCurrentSignLanguage();
		$.ajax({
			method: 'post',
			url: '/api/story/export',//`/api/story/export?writtenlang=${curWrittenLang}&signLang=${curSignLang}`,'/api/story/export?lang=${storyId}',
			data: {
				id: story.id,
				curWrittenLang: StoryViewer.GetCurrentWrittenLanguage(),
				curSignLang : StoryViewer.GetCurrentSignLanguage()
			}
		}).done((stories) => {
			console.log("work");
			console.log(stories);
			setTimeout(() => {window.location.href = stories}, 20000);
			//window.location.href = stories;
		}).fail((err) => {
			console.error(err);
		});
	});

	// Share button function
	$('#social-share').on('click', (evt) => {
		let copyInput = $(`<input type="text" style="position: absolute; z-index: -1" value="${window.location.href}" />`);

		$('body').append(copyInput);

		copyInput[0].select();

		document.execCommand("copy");

		copyInput.remove();

		alert('link copied.');
	});

	// Bookmark / Offline Save functionality
	$('#social-save').on('click', (evt) => {
		// Save the story JSON
		OfflineWorker.SetStorage(storyId, story);

		// Save the story assets with the service worker
		let storyAssets = getStoryAssetList(),
			originalList = OfflineWorker.GetStorage('Viewer'),
			itemsToRemove = [];

		// Remove old assets from the list
		_.each(storyAssets, (assetName) => {
			assetName = assetName.replace(/\?t=[0-9]*/gi, '');
			_.each(originalList, (_assetName, i) => {
				if(assetName == _assetName.replace(/\?t=[0-9]*/gi, ''))
					itemsToRemove.push(_assetName);
			});
		});
		OfflineWorker.RemoveFromAssetList('Viewer', itemsToRemove);

		// Add new story items to list
		let assetList = OfflineWorker.AddToAssetList('Viewer', storyAssets);
		OfflineWorker.SaveServiceWorker('/html/Client/ViewerOffline.html', assetList);

		if(offlineIds.indexOf(storyId) == -1){
			offlineIds.unshift(storyId);
			OfflineWorker.SetStorage('storyIds', offlineIds);
		}

		// TODO: Add the story to the user's bookmark if there is a user
		// NOTE: Maybe we should have a separate button for this?
	});

	LanguageSelector.updateLanguageDisplay();

	// load and render similar stories
	$.ajax({
		method: 'get',
		url: '/api/stories'
	}).done((stories) => {
		let similarAuthorStories = [];

		_.each(stories, (_story) => {
			if(_story.author != story.author || _story.id == story.id) return;
			similarAuthorStories.push(new StoryPreview(_story));
		});

		if(similarAuthorStories.length > 0){
			$('#more-author').show();
			new Carousel('#more-author', similarAuthorStories, 4, false, false, 'More from this Author');
		}
		else{
			$('#more-author').hide();
		}
		displaySimilarGenres(stories);
		$(document).on('languageChange', () => {
			displaySimilarGenres(stories);
		});

		LanguageSelector.updateLanguageDisplay();
	}).fail((err) => {
		console.error(err);
	});
}

function showOfflineStories(){
	let storyPreviews = [];
	_.each(offlineIds, (id) => {
		let _story = OfflineWorker.GetStorage(id);
		if(!_story) return;

        let sp = new StoryPreview(_story);
        storyPreviews.push(sp);
	});

    if(storyPreviews.length > 0){
        var storyGrid = new StoryGrid("offline-stories", storyPreviews);
    }
    else{
    	$('#offline-stories').addClass('empty');
    	$('#offline-stories').html('You have no saved stories.');
    }
}

$(document).ready(() => {
	storyId = parseInt(urlParams.id);
	offlineIds = OfflineWorker.GetStorage('storyIds') || [];

	if(!window.offline){
		$.ajax({
			method: 'get',
			url: `/api/story?id=${storyId}`
		}).done((_story) => {
			story = _story;
			showStory();
		}).fail((err) => {
			console.error(err);
		});
	}
	else{
		story = OfflineWorker.GetStorage(storyId);
		showStory();		
		if(!story && !isNaN(storyId)){
			console.error(`Story id (${storyId}) not saved for offline viewing.`);
		}
	}
});
