import 'style/StoryGrid.css!';
import _ from "underscore";

var selectedPage = 1;
var maxPage = -1;
var storiesDiv;
var offsetCount = 0;

function addStories(){
	var childrenCount = document.getElementById(storiesDiv).childElementCount;
	var countNode = 0;
	var newDiv;
	var pageNum = 0;
	while(countNode < childrenCount){
		// Only 9 stories per page
		if((countNode ) % 9 == 0){
			pageNum++;
			newDiv = document.createElement("div"); 
			newDiv.id = 'grid-page' + pageNum;
			$(newDiv).addClass("grid-page");

			// Handles multiple pages
			if(pageNum > 1){
				$(newDiv).addClass("grid-page");
				newDiv.style.transform = "translateX(100vw)";
				var gridButton;
				var gridButtons
				// Creates pagination only if it doesn't exist already
				if(pageNum == 2){

					gridButtons = document.createElement("div"); 
					gridButtons.id = "grid-buttons";
					$('#' + storiesDiv).append(gridButtons);
					gridButton = document.createElement("button"); 
					$(gridButton).attr("type","button");
					$(gridButton).addClass("grid-button");
					$(gridButton).addClass("grid-button-selected");
					gridButton.innerHTML = "1";
					gridButton.id = "grid-" + 1 + "-button";
					gridButton.addEventListener("click", swapGridPage);
					$(gridButtons).append(gridButton);
					// Previous button
					gridButton = document.createElement("button"); 
					$(gridButton).attr("type","button");
					gridButton.id = "grid-prev-button";
					gridButton.innerHTML = "<";
					gridButton.addEventListener("click", swapGridPage);
					$(gridButtons).prepend(gridButton);
				}
				gridButton = document.createElement("button"); 
				$(gridButton).attr("type","button");
				$(gridButton).addClass("grid-button");
				gridButton.innerHTML = pageNum;
				gridButton.id = "grid-" + pageNum + "-button";
				gridButton.addEventListener("click", swapGridPage);
				$(gridButtons).append(gridButton);
			}
			$('#' + storiesDiv).append(newDiv);

		}
		var sp = $('#' + storiesDiv + ' #story-preview-' + (countNode + offsetCount))[0];
		$(newDiv).append(sp);
		countNode++;


	}
	// Next button
	gridButton = document.createElement("button"); 
	$(gridButton).attr("type","button");
	gridButton.id = "grid-next-button";
	gridButton.innerHTML = ">";
	gridButton.addEventListener("click", swapGridPage);
	$(gridButtons).append(gridButton);
	maxPage = pageNum;
	// Timeout to make sure elements have been populated
	setTimeout(function(){
		resizeStories();
	}, 100);

}

function swapGridPage(event){
	var targetPage;
	// Test for next and previous buttons
	if(event.target.id == "grid-prev-button"){
		targetPage = selectedPage - 1;
	}else if(event.target.id == "grid-next-button"){
		targetPage = selectedPage + 1;
	}else{
		targetPage = parseInt(event.target.id.match(/\d+/g));
	}

	// Return if button clicked was same page you are on
	if(targetPage === selectedPage){
		return;
	}
	if(targetPage > selectedPage){
		document.getElementById('grid-page' + selectedPage).style.animationName = 'gridLeftFadeOut';
		document.getElementById('grid-page' + targetPage).style.animationName = 'gridLeftFadeIn';
		$(".grid-button:nth-child(" + (selectedPage + 1) + ")").removeClass("grid-button-selected");
		selectedPage = targetPage;
		$(".grid-button:nth-child(" + (selectedPage + 1) + ")").addClass("grid-button-selected");
	}else{
		document.getElementById('grid-page' + selectedPage).style.animationName = 'gridRightFadeOut';
		document.getElementById('grid-page' + targetPage).style.animationName = 'gridRightFadeIn';
		$(".grid-button:nth-child(" + (selectedPage + 1) + ")").removeClass("grid-button-selected");
		selectedPage = targetPage;
		$(".grid-button:nth-child(" + (selectedPage + 1) + ")").addClass("grid-button-selected");
	}
	// Take care of next and previous buttons
	if(selectedPage === 1){
		$("#grid-prev-button").css("visibility", "hidden");
	}else{
		$("#grid-prev-button").css("visibility", "visible");
	}

	if(selectedPage === maxPage){
		$("#grid-next-button").css("visibility", "hidden");
	}else{
		$("#grid-next-button").css("visibility", "visible");
	}
}

// For resizing the stories div
function resizeStories(){
	// Timeout to make sure elements have been populated
	setTimeout(function(){
		var height = $('#grid-page1').height();
		$('#' + storiesDiv).css('height', (height + 20) + 'px');
	}, 100);
}

function StoryGrid(id, stories){
	for(var i in stories){
		stories[i].appendTo(id);
	}
	storiesDiv = id;
	offsetCount = parseInt(stories[0].id.match(/\d+/g));
	// Calculate and setup pagination
	addStories();

	// Resize div for stories and pagination
	$(window).off('.storygrid');
	$(window).on('resize.storygrid', resizeStories);
}

export default StoryGrid
