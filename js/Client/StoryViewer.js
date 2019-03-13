import _ from 'underscore';
export default StoryViewer

/* ----------------------- Global Variables ----------------------- */
var textArea;
var visuals;
var fullscreen = false;
var pageIndex = 0;
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
    
    //parse data from story josn to the viewers elements
    parsePage(pageIndex, "English", "fsl_luzon");
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
function ToggleStoryText()
{
    //get current mode
    var currentMode = textArea.css("display");
    
    //check if showing or not
    if(currentMode.toString() === "none")
    {
        textArea.css("display", "block");
        
        //shrink video
        visuals.css('height', '70%');
        visuals.css('width', '70%');
        visuals.css('margin', '2.5% 15% 2.5% 15%'); //top right bottom left
        
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