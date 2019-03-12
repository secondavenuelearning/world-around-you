import _ from 'underscore';
export default StoryViewer

/* ----------------------- Global Variables ----------------------- */
var textArea = $('#story');


/* ----------------------- Functionalitu ----------------------- */

export function StoryViewer()
{
    console.log(textArea.text());
    //add onlick for story toggle
    $('#storyToggle').on('click', ToggleStoryText());
}

function ToggleStoryText()
{
    //get current mode
    var currentMode = textArea.css("display");
    
    //check if showing or not
    if(currentMode.toString() === "none")
    {
        textArea.css("display", "block");
    }
    else
    {
        textArea.css("display", "none");
    }
}