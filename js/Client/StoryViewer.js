import _ from 'underscore';
export default StoryViewer

/* ----------------------- Global Variables ----------------------- */
var storyData;

var pageIndex = 0;
var totalPages;

var writtenLang = "English";
var signLang = "fsl_luzon";

var textArea;
var visuals;

var fullscreen = false;

/* ----------------------- Constructor ----------------------- */

export function StoryViewer(storyObj)
{
    //save passed in story json globally
    storyData = storyObj;
    
    //attach global vars to their element
    textArea = $('#story');
    visuals = $('#visuals');
    
    //add onlick for story toggle
    $('#storyToggle').on('click', function() {ToggleStoryText()});
    
    //add onclick for fullscreen toggling
    $('#fullscreen').on('click', function() {ToggleFullScreen()});
    
    //add onclick event for chaning pages onto the nav buttons
    $('.viewerNav#back button').on('click', function() {changePage(pageIndex - 1)});
    $('.viewerNav#forward button').on('click', function() {changePage(pageIndex + 1)});
    
    //set the total page number
    totalPages = Object.keys(storyData).length - 1;
    $('#total').text(totalPages);
    
    //parse the first page
    $('#visuals img').css("display", "block");
    $('#visuals video').css("display", "none");
    
    parsePage(pageIndex);
    ToggleStoryText(); //hide text for cover image
    greyOutNav(); //grey out back button bc on first item
}

/* ----------------------- Data parsing ----------------------- */
function parsePage(page)
{ console.log("Parsing: " + page);
    //update all the page numbers
    updatePageNumbers();
    
    //set story text
    $('#story').text(storyData[pageIndex].text[writtenLang]);
    
    //set image
    $('#visuals img').attr('src', storyData[pageIndex].image);
    
    //set video
    $('#visuals video').attr('src', storyData[pageIndex].video[signLang]);
 
    //search for glossary terms and make them buttons
    GenerateGlossaryButtons();
    
}

function updatePageNumbers()
{
    var screen = 1;
    if(!ShowingCover())
    {
        screen = 2;
    }
    
    //update current
    $('#index #current').text(pageIndex + 1);
    $('#currentOverlay span').text(pageIndex + 1);
    
    //update buttons
    $('.viewerNav#forward #num').text(pageIndex + screen);
    $('.viewerNav#back #num').text(pageIndex - (screen % 2) + 1);
}

function GenerateGlossaryButtons()
{
    var story = storyData[pageIndex].text[writtenLang];
    
    // Add glossary functionality
    var glossary = {};
    if(storyData[pageIndex].hasOwnProperty('glossary')) //check if we even have glossary items
    { 
        glossary = storyData[pageIndex].glossary[writtenLang]; //get all glossary object for this lang

        //build glossary regex
        var glossaryRegex = "";
        var terms = 1;
        Object.keys(glossary).forEach(function(term){ //terms
            glossaryRegex += term + "|";
            terms++;
         });

        glossaryRegex = glossaryRegex.slice(0, glossaryRegex.length - 1); //clean off last '|'
        glossaryRegex = new RegExp(glossaryRegex, 'gi'); //convert to actual regular expression - gi is global (g) and not case sensitive(i)

        //replace found regex terms with functional glossary items in the html
         story = story.replace(glossaryRegex, function(match){
            var formattedTerm = '<span class=\"glossary\">' + match + '</span>';
            return formattedTerm;
        });
        
        //give modified text back to story element
        textArea.html(story);
    }
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
        textArea.removeAttr('style');
        visuals.removeAttr('style');
        
        //update icons
        $('#currentOverlay img').attr('src', '../../img/icons/replay.png');
        $('.viewerNav #icon').attr('src', '../../img/icons/language.png');
    }
    //we saw the video we need to parse the next page
    else
    {
        //change to show img
        $('#visuals img').css("display", "block");
        $('#visuals video').css("display", "none");
        
        //turn off text area
        textArea.css("display", "none");
        
        //expand video to be full size
        visuals.css('height', '100%');
        visuals.css('width', '100%');
        visuals.css('margin', '0px');
        
        //update icons
        $('#currentOverlay img').attr('src', '../../img/icons/language.png');
        $('.viewerNav #icon').attr('src', '../../img/icons/replay.png');
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
        textArea.removeAttr('style');
        visuals.removeAttr('style');
        
        //update icons
        $('#currentOverlay img').attr('src', '../../img/icons/replay.png');
        $('.viewerNav #icon').attr('src', '../../img/icons/language.png');
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
        textArea.css("display", "none");
        
        //expand video to be full size
        visuals.css('height', '100%');
        visuals.css('width', '100%');
        visuals.css('margin', '0px');
        
        //update icons
        $('#currentOverlay img').attr('src', '../../img/icons/language.png');
        $('.viewerNav #icon').attr('src', '../../img/icons/replay.png');
    }
}

function ToggleStoryText()
{
    //get current mode
    var currentMode = textArea.css("display");
    
    //check if showing or not
    if(currentMode.toString() === "none")
    {
        //set text and visuals back to default
        textArea.removeAttr('style');
        visuals.removeAttr('style');
        
    }
    else
    {
        //turn off text area
        textArea.css("display", "none");
        
        //expand video to be full size
        visuals.css('height', '100%');
        visuals.css('width', '100%');
        visuals.css('margin', '0px');
    }
}

function ToggleFullScreen()
{
    if(fullscreen)
    {
        //set fullscreen to be off
        fullscreen = false;
        
        //show elements
        $('header').removeAttr('style');
        $('#details').removeAttr('style');
        $('#more-stories').removeAttr('style');
        $('#more-author').removeAttr('style');
        $('footer').removeAttr('style');
        
        //move viewer elements back down under header
        $('main').removeAttr('style');
        $('#viewer').removeAttr('style');
        $('#viewerBar').removeAttr('style');
    }
    else
    {
        //set fullscreen to on
        fullscreen = true;
        
        //hide elements
        $('header').css('display', 'none');
        $('#details').css('display', 'none');
        $('#more-stories').css('display', 'none');
        $('#more-author').css('display', 'none');
        $('footer').css('display', 'none');
        
        //move viewer elements up and make it fill
        $('main').css('top', '0');
        $('main').css('height', '100%');
        $('#viewer').css('height', 'calc(100% - 100px');
        
        //scroll to the top so we dont have odd whitespace and remove anythign thats extra
        $('main').scrollTop(0);
        $('main').css('overflow', 'hidden');
    }
    
}

/* ---------------------- Button Extra Styling Functions ---------------------- */
function greyOutNav()
{
    //special events
    if(pageIndex == 0 && ShowingCover()) //first page should hide left button
    {
        //get back button and "grey" it out
        $('.viewerNav#back button').css('opacity', '.3');
        
        //hide text
        //$('.viewerNav#back span').text(1);
        $('.viewerNav#back span').css('display', "none");
        
        //resize icon
        $('.viewerNav#back #icon').css('height', '70%');
        $('.viewerNav#back #icon').css('padding', '10%');
        $('.viewerNav#back #icon').css('margin-top', '10%');

    }
    else if(pageIndex >= (totalPages - 1) && !ShowingCover()) //last page shoudl hide right button
    {
        //get forward button and "grey" it out
        $('.viewerNav#forward button').css('opacity', '.3');
        
        //hide text
        //$('.viewerNav#forward span').text(totalPages - 1);
        $('.viewerNav#forward span').css('display', "none");
        
        //resize icon
        $('.viewerNav#forward #icon').css('height', '70%');
        $('.viewerNav#forward #icon').css('padding', '10%');
        $('.viewerNav#forward #icon').css('margin-top', '10%');
    }
    else
    {
        $('.viewerNav button').removeAttr('style');
        $('.viewerNav span').removeAttr('style');
        $('.viewerNav #icon').removeAttr('style');
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