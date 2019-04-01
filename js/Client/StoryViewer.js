import 'style/StoryViewer.css!';
import _ from 'underscore';
import ImageHoverSwap from 'js/Client/HelperFunctions.js';

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
	totalPages = 0,
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
	totalPages = Object.keys(story.data).length + 1;
	pageIndex = -1;
	subPageIndex = 0;

	currentWrittenLanguage = story.metadata.writtenLanguages[0];
	currentSignLanguage = story.metadata.signLanguages[0];
}

function Render(id){
	$(`#${id}`).html(template({
		currentPageNumber: pageIndex + 2,
		totalPages
	}));

	$('#fullscreen-toggle').on('click', (evt) => {
		if (document.fullscreen) {
			document.exitFullscreen();
		}
		else {
			$('#story-viewer')[0].requestFullscreen();
		}
	})

	RenderPage();
}

function RenderPage(){
	let currentPageNumber = pageIndex + 2,
		page = pageIndex == -1 ? {image: story.coverimage} : story.data[pageIndex],
		maxSubIndex = page.image && page.video ? 1 : 0,
		previousPage = pageIndex == 0 ? {image: story.coverimage} : story.data[pageIndex - 1],
		nextPage = story.data[pageIndex + 1];

	let currentIcon, previousIcon, previousPageNumber, nextIcon, nextPageNumber;

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
		currentSignLanguage
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
		$('#video-container').toggleClass('text-open');
		$('#text-toggle-container').toggleClass('text-open');
		$('#text-container').toggleClass('text-open');
	});

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

			console.log(termName, term, glossaryTerms)

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

function GenerateLanguageSelects()
{
	//get sign and written options from the json
	writtenOptions = Object.keys(story[0].text);
	signOptions = Object.keys(story[0].video);
	
	//build menus
	BuildSelectOptions($('#writtenLang select'), writtenOptions);
	BuildSelectOptions($('#signLang select'), signOptions);
	
	//add click events
	$('#writtenLang button').on('click', function()
	{   
		//toggle dropdown visibility
		ToggleOptions('#writtenLang');
	});
	$('#writtenLang select').on('change', function(e)
	{
		writtenLang = e.target.value;  
		parsePage(pageIndex);
		ToggleOptions('#writtenLang');
	});
	
	$('#signLang button').on('click', function()
	{
		ToggleOptions('#signLang');
	});
	$('#signLang select').on('change', function(e)
	{
		signLang = e.target.value;
		parsePage(pageIndex);
		ToggleOptions('#signLang');
	});
	
}

function BuildSelectOptions(select, options)
{
	var optionsHTML = "";
	
	//loop through options and create html
	options.forEach(function(option)
	{
		optionsHTML += "<option value=\"" + option + "\">";
		optionsHTML += option;
		optionsHTML += "</option>";
	});
	
	//add to slect object
	select.html(optionsHTML);
}

/* ----------------------- Button Functionality ----------------------- */
function changePage(pageNum)
{
	//validate requested page
	if((pageNum < 0 && ShowingCover()) || (pageNum > totalPages - 1 && !ShowingCover()))
	{
		return;
	}
	
	//check if we are paging forward or backward, call fucntion accordingly
	if(pageNum > pageIndex)
	{
		NextScreen(pageNum);
	}
	else
	{
		LastScreen(pageNum);
	}
   
	
	//grey out nav on last and first items
	greyOutNav();
	
	//parse data from story josn to the viewers elements
	parsePage(pageIndex);
	 if(ShowingCover()){
		 var nav = document.getElementById("currentOverlay");
		 nav.style.opacity = .7;
	 }
	else{
		 var nav = document.getElementById("currentOverlay");
		 nav.style.opacity = 0;
	}
	
}

function LastScreen(pageNum)
{
	if(ShowingCover())
	{
		//change page index
		pageIndex = pageNum;
		
		//change to show video
		$('#visuals img').css("display", "none");
		$('#visuals video').css("display", "block");
		
		//set text and visuals back to default
		textArea.removeClass('hideAnim');
		visuals.removeAttr('style');
		$('#storyToggle').removeAttr('style');
		
		//update icons
		$('.viewerNav #sign.icon').css('display', 'none');
		$('.viewerNav #cover.icon').removeAttr('style');
		$('#storyToggle #hide').css('display', 'none');
		$('#storyToggle #show').removeAttr('style');
	}
	//we saw the video we need to parse the next page
	else
	{
		//change to show img
		$('#visuals img').css("display", "block");
		$('#visuals video').css("display", "none");
		
		//turn off text area
		textArea.addClass('hideAnim');;
		$('#storyToggle').css('display', 'none');
		
		//expand video to be full size
		visuals.css('height', '100%');
		visuals.css('max-height', '100%');
		visuals.css('width', '100%');
		visuals.css('margin', '0px');
		
		//update icons
		$('.viewerNav #sign.icon').removeAttr('style');
		$('.viewerNav #cover.icon').css('display', 'none');
		$('#storyToggle #show').css('display', 'none');
		$('#storyToggle #hide').removeAttr('style');
	}
}

function NextScreen(pageNum)
{
	 //check if we are on the video or img, and switch between those before changing pages
	if(ShowingCover())
	{
		//change to show video
		$('#visuals img').css("display", "none");
		$('#visuals video').css("display", "block");
		
		//set text and visuals back to default
		textArea.removeClass('hideAnim');;
		visuals.removeAttr('style');
		$('#storyToggle').removeAttr('style');
		
		//update icons
		$('.viewerNav #sign.icon').css('display', 'none');
		$('.viewerNav #cover.icon').removeAttr('style');
		$('#storyToggle #hide').css('display', 'none');
		$('#storyToggle #show').removeAttr('style');
	}
	//we saw the video we need to parse the next page
	else
	{
		//change page index
		pageIndex = pageNum;
		
		//change to show img
		$('#visuals img').css("display", "block");
		$('#visuals video').css("display", "none");
		
		//turn off text area
		textArea.addClass('hideAnim');
		$('#storyToggle').css('display', 'none');
		
		//expand video to be full size
		visuals.css('height', '100%');
		visuals.css('max-height', '100%');
		visuals.css('width', '100%');
		visuals.css('margin', '0px');
		
		//update icons
		$('.viewerNav #sign.icon').removeAttr('style');
		$('.viewerNav #cover.icon').css('display', 'none');
		$('#storyToggle #show').css('display', 'none');
		$('#storyToggle #hide').removeAttr('style');
	}
}

/* ---------------------- Helper Functions ---------------------- */
function ShowingCover()
{
	var isShowing = true;
	
	if($('#visuals img').css('display') == "none")
	{
		isShowing = false;
	}
	
	return isShowing;
}

export default {
	SetStory,
	Render
}