import _ from 'underscore';
export default StoryViewer

/* ----------------------- Global Variables ----------------------- */
var textArea;
var video;
var fullscreen = false;


/* ----------------------- Functionalitu ----------------------- */

export function StoryViewer()
{
    //attach global vars to their element
    textArea = $('#story');
    video = $('video');
    
    //add onlick for story toggle
    $('#storyToggle').on('click', function() {ToggleStoryText()});
    
    //add onclick for fullscreen toggling
    $('#fullscreen').on('click', function() {ToggleFullScreen()});
}

function ToggleStoryText()
{
    //get current mode
    var currentMode = textArea.css("display");
    
    //check if showing or not
    if(currentMode.toString() === "none")
    {
        textArea.css("display", "block");
        
        //shrink video
        video.css('height', '70%');
        video.css('width', '70%');
        video.css('margin', '2.5% 15% 2.5% 15%'); //top right bottom left
        
    }
    else
    {
        //turn off text area
        textArea.css("display", "none");
        
        //expand video to be full size
        video.css('height', '100%');
        video.css('width', '100%');
        video.css('margin', '0px');
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