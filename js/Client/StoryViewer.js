import _ from 'underscore';
export default StoryViewer

/* ----------------------- Global Variables ----------------------- */
var textArea;
var visuals;
var fullscreen = false;
var pageIndex = 0;
var totalPages;
var storyData;


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
    parsePage(pageIndex, "English", "fsl_luzon");
    ToggleStoryText(); //hide text for cover image
    greyOutNav(); //grey out back button bc on first item
}

/* ----------------------- Data parsing ----------------------- */
function parsePage(page, writtenLang, signLang)
{
    //update all the page numbers
    updatePageNumbers();
    
    //set story text
    $('#story').text(storyData[pageIndex].text[writtenLang]);
    
    //set image
    $('#visuals img').css('display', 'block');
    $('#visuals img').attr('src', storyData[pageIndex].image);
    
    //set video
    $('#visuals video').css('display', 'none');
    $('#visuals video').attr('src', storyData[pageIndex].video[signLang]);
    
}

function updatePageNumbers()
{
    //update current
    $('#index #current').text(pageIndex + 1);
    $('#currentOverlay span').text(pageIndex + 1);
    
    //update buttons
    $('.viewerNav#forward #num').text(pageIndex + 2);
    $('.viewerNav#back #num').text(pageIndex);
}

/* ----------------------- Button Functionality ----------------------- */
function changePage(pageNum)
{
    //validate requested page
    if((pageNum < 0 && ShowingCover) || (pageNum > totalPages - 2 && !ShowingCover()))
    {
        return;
    }
    
    //check if we are on the video or img, and switch between those before changing pages
    if(ShowingCover())
    {
        //change to show video
        $('#visuals img').css("display", "none");
        $('#visuals video').css("display", "block");
        
        //update icons
        $('#currentOverlay img').attr('src', '../../img/icons/replay.png');
        $('.viewerNav #icon').attr('src', '../../img/icons/language.png');
        
        //minimize story text
        ToggleStoryText();
    }
    //we saw the video we need to parse the next page
    else
    {
        //change page index
        pageIndex = pageNum;
        
        //update icons
        $('#currentOverlay img').attr('src', '../../img/icons/language.png');
        $('.viewerNav #icon').attr('src', '../../img/icons/replay.png');
        
        //bring story text back up
        ToggleStoryText();

        //parse data from story josn to the viewers elements
        parsePage(pageIndex, "English", "fsl_luzon");
    }
    
    //grey out nav on last and first items
    greyOutNav();
    
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
    var forward = $('.viewerNav#forward button');
    var back = $('.viewerNav#back button');
    
    //special events
    if(pageIndex == 0 && ShowingCover()) //first page should hide left button
    {
        //get back button and "grey" it out
        back.css('opacity', '.3');

    }
    else if(pageIndex >= (totalPages - 1) && !ShowingCover()) //last page shoudl hide right button
    { console.log("max");
        //get forward button and "grey" it out
        forward.css('opacity', '.3');
    }
    else
    {
        $('.viewerNav button').removeAttr('style');
        $('.viewerNav button').removeAttr('disabled');
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