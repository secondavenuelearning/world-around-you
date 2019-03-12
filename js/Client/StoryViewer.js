import _ from 'underscore';
export default StoryViewer

/* ----------------------- Global Variables ----------------------- */
var textArea;
var video;


/* ----------------------- Functionalitu ----------------------- */

export function StoryViewer()
{
    //attach global vars to their element
    textArea = $('#story');
    video = $('video');
    
    //add onlick for story toggle
    $('#storyToggle').on('click', function() {ToggleStoryText()});
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