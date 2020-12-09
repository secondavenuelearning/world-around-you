import 'style/StoryViewer.css!';
import _ from 'underscore';

import CustomSelect  from 'js/Client/CustomSelect';

import html from 'html/Client/StoryViewer.html!text';
const template = _.template(html);

import pageHtml from 'html/Client/StoryViewer_Page.html!text';
const pagTemplate = _.template(pageHtml);

import glossaryHtml from 'html/Client/GlossaryModal.html!text';
const glossaryTemplate = _.template(glossaryHtml);


/* ----------------------- Global Variables ----------------------- */
let story,
	page,
	pageIndex = -1,
	subPageIndex = 0,    
	currentWrittenLanguage,
	currentSignLanguage;

var writtenLang = "English";
var writtenOptions;

var signLang = "fsl_luzon";
var signOptions;

var textArea;
var visuals;

var fullscreen = false;

/* ----------------------- Constructor ----------------------- */
function SetStory(_story){
	story = _story;
	currentWrittenLanguage = story.metadata.writtenLanguages[0];
	currentSignLanguage = story.metadata.signLanguages[0];
}

function Render(id){
	$(`#${id}`).html(template({
		story
	}));
	document.addEventListener('fullscreenchange', exitFullScreenHandle);
	document.addEventListener('webkitfullscreenchange', exitFullScreenHandle);
	document.addEventListener('mozfullscreenchange', exitFullScreenHandle);
	document.addEventListener('MSFullscreenChange', exitFullScreenHandle);

	function exitFullScreenHandle(){
		if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
	        $('#page-content').css({'height': 'calc(100% - 60px)'});
			$('#fullscreen-toggle').css({'bottom': '-35px'});
			$('#page-controller').css({'margin-top': '5px'});
			$('a.story-game-button').css({'bottom': '-35px'});
	    }
	}
	$('#fullscreen-toggle').on('click', (evt) => {
		if (document.fullscreen || document.msFullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) { /* Firefox */
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) { /* IE/Edge */
				document.msExitFullscreen();
			}
			$('#page-content').css({'height': 'calc(100% - 60px)'});
			$('#fullscreen-toggle').css({'bottom': '-35px'});
			$('#page-controller').css({'margin-top': '5px'});
			$('a.story-game-button').css({'bottom': '-35px'});
		}
		else {
			let viewer = $('#story-viewer')[0];
			if (viewer.requestFullscreen) {
				viewer.requestFullscreen();
			} else if (viewer.mozRequestFullScreen) { /* Firefox */
				viewer.mozRequestFullScreen();
			} else if (viewer.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
				viewer.webkitRequestFullscreen();
			} else if (viewer.msRequestFullscreen) { /* IE/Edge */
				viewer.msRequestFullscreen();
			}
			$('#page-content').css({'height': 'calc(100% - 120px)'});
			$('#fullscreen-toggle').css({'bottom': '10px'});
			$('#page-controller').css({'margin-top': '19px'});
			$('a.story-game-button').css({'bottom': '10px'});
		}
	});

	let wlSelect = new CustomSelect('page-controller', {
			id: 'written-language-select', 
			options: story.metadata.writtenLanguages,
			defaultText: currentWrittenLanguage
		}),
		slSelect = new CustomSelect('page-controller', {
			id: 'sign-language-select', 
			options: story.metadata.signLanguages,
			defaultText: currentSignLanguage
		});

	$(wlSelect).on('change', (evt, value) => {
		currentWrittenLanguage = value;
		RenderPage();
	});
	$(slSelect).on('change', (evt, value) => {
		currentSignLanguage = value;
		RenderPage();
	});

	RenderPage();
}

function RenderPage(){
	let currentPageNumber = pageIndex + 2,
		page = pageIndex == -1 ? {image: story.coverimage} : story.data[pageIndex],
		maxSubIndex = page.image && page.video ? 1 : 0,
		previousPage = pageIndex == 0 ? {image: story.coverimage} : story.data[pageIndex - 1],
		nextPage = story.data[pageIndex + 1];

	let currentIcon, previousIcon, previousPageNumber, nextIcon, nextPageNumber, videoSaver, videoSaverSrc;

	if(pageIndex == -1){
		currentIcon = 'image';
		nextIcon = nextPage.image ? 'image' : 'sign';
		nextPageNumber = 2;
	}
	else{
		if(subPageIndex != maxSubIndex){
			currentIcon = 'image';

			previousPageNumber = currentPageNumber - 1;
			previousIcon = previousPage.video ? 'sign' : 'image';

			nextPageNumber = currentPageNumber;
			nextIcon = 'sign';
		}
		else{
			currentIcon = 'sign';

			previousPageNumber = maxSubIndex == 1 ? currentPageNumber : currentPageNumber - 1;
			previousIcon = maxSubIndex == 1 ? 'image' : (previousPage.video ? 'sign' : 'image');

			if(nextPage){
				nextPageNumber = currentPageNumber + 1;
				nextIcon = nextPage.image ? 'image' : 'sign';
			}
		}
	}

	$('#page-content').html(pagTemplate({
		page,
		currentIcon,
		currentPageNumber,
		previousIcon,
		previousPageNumber,
		nextIcon,
		nextPageNumber,
		currentWrittenLanguage,
		currentSignLanguage,
		videoSaver,
		videoSaverSrc
	}));

	$('#page-counter #current').html(currentPageNumber);

	$('.story-viewer-nav-button').on('click', (evt) => {
		let dir = $(evt.currentTarget).attr('page-dir');

		if(dir > 0){
			if(subPageIndex == maxSubIndex){
				pageIndex++;
				subPageIndex = 0;
			}
			else{
				subPageIndex++;
			}
		}
		else if(dir < 0){
			if(subPageIndex == maxSubIndex && maxSubIndex > 0){
				subPageIndex--;
			}
			else{
				pageIndex--;
				subPageIndex = previousPage.image && previousPage.video ? 1 : 0;
			}
		}
		RenderPage();
	});

	$('#text-toggle').on('click', (evt) => {
		$('.video-container').toggleClass('text-open');
		$('#text-toggle-container').toggleClass('text-open');
		$('#text-container').toggleClass('text-open');
	});


	if($('#videoSpeed')) { videoSaver = true; }
	else if(!$('#videoSpeed')) { videoSaver = false;}

	console.log("video saver: " + videoSaver);

	GenerateGlossaryButtons(page);
}


function GenerateGlossaryButtons(page){
	if(!page) return;

	let glossaryTerms = page.glossary ? page.glossary[currentWrittenLanguage] : [],
		text = $('#text-container').html();

	if(!text) return;

	_.each(glossaryTerms, (term, name) => {
		let regEx = new RegExp(name, 'i');
		text = text.replace(regEx, (match) => {
			return `<span class="glossary" glossary-term="${name}">${match}</span>`;
		});
	});

	$('#text-container').html(text);


	//add button functionality
	$('.glossary').on('click', (evt) => {

		//parse data to modal pop up
		let termName = $(evt.currentTarget).attr('glossary-term'),
			term = glossaryTerms[termName];

		$('#story-viewer').append(glossaryTemplate({
			term,
			page,
			currentWrittenLanguage,
			currentSignLanguage
		}));

		$('#exit-modal').on('click', (evt) => {
			$('#glossary-modal').remove();
		});


		// loop the video between the desired times
		let vid = $('#glossary-video')[0];
		if(vid){
			vid.ontimeupdate = function(){
				let startTime = term.video[currentSignLanguage].start || 0,
					endTime = term.video[currentSignLanguage].end || vid.duration;

				if(vid.currentTime < startTime || vid.currentTime > endTime)
					vid.currentTime = startTime;
			}
		}
	});
}

function GetCurrentWrittenLanguage(){
	return currentWrittenLanguage;
}
function GetCurrentSignLanguage(){
	return currentSignLanguage;
}

export default {
	SetStory,
	Render,
	GetCurrentWrittenLanguage,
	GetCurrentSignLanguage
}