import _ from 'underscore';
import ImageHoverSwap from 'js/Client/HelperFunctions.js';
export default StoryViewer

/* ----------------------- Global Variables ----------------------- */
var storyData;

var pageIndex = 0;
var totalPages;

var writtenLang = "English";
var writtenOptions;

var signLang = "fsl_luzon";
var signOptions;

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
    $('#exit-fullscreen').on('click', function() {ToggleFullScreen()});
    
    //add onclick event for chaning pages onto the nav buttons
    $('.viewerNav#back button').on('click', function() {changePage(pageIndex - 1)});
    $('.viewerNav#forward button').on('click', function() {changePage(pageIndex + 1)});
    
    //set the total page number
    totalPages = Object.keys(storyData).length;
    $('#total').text(totalPages);
    
    //parse the first page
    $('#visuals img').css("display", "block");
    $('#visuals video').css("display", "none");
    $('.viewerNav #cover.icon').css('display', 'none');
    $('#storyToggle #show').css('display', 'none');
    
    GenerateLanguageSelects();
    
    parsePage(pageIndex);
    $('#storyToggle').css('display', 'none');
    ToggleStoryText(); //hide text for cover image
    visuals.css('max-height', '100%');
    greyOutNav(); //grey out back button bc on first item
    
    //add hover image swaping
    ImageHoverSwap("#storyToggle button", "#storyToggle #show", "../../img/icons/StoryViewer/icon_SV_HideText.svg", "../../img/icons/StoryViewer/icon_SV_HideTex_HoverDown.svg");
    
    ImageHoverSwap("#storyToggle button", "#storyToggle #hide", "../../img/icons/StoryViewer/icon_SV_ShowText.svg", "../../img/icons/StoryViewer/icon_SV_ShowText_HoverDown.svg");
    
    //ImageHoverSwap("#fullscreen button", "#fullscreen img", "../../img/icons/StoryViewer/icon_SV_Fullscreen.svg", "../../img/icons/StoryViewer/icon_SV_Fullscreen_HoverDown.svg");
    
    ImageHoverSwap("#signLang", "#signLang img", "../../img/icons/StoryViewer/icon_SV_SignLang.svg", "../../img/icons/StoryViewer/icon_SV_SignLang_HoverDown.svg");
    
    ImageHoverSwap("#writtenLang", "#writtenLang img", "../../img/icons/StoryViewer/icon_SV_WrittenLang.svg", "../../img/icons/StoryViewer/icon_SV_WrittenLang_HoverDown.svg");
    
    ImageHoverSwap("#forward.viewerNav", "#forward.viewerNav #sign.icon", "../../img/icons/StoryViewer/icon_SV_Page_SignLang.svg", "../../img/icons/StoryViewer/icon_SV_Page_SignLang_HoverDown.svg");
    
    ImageHoverSwap("#forward.viewerNav", "#forward.viewerNav #cover.icon", "../../img/icons/StoryViewer/icon_SV_Page_Image.svg", "../../img/icons/StoryViewer/icon_SV_Page_Image_HoverDown.svg");
    
     ImageHoverSwap("#back.viewerNav", "#back.viewerNav #sign.icon", "../../img/icons/StoryViewer/icon_SV_Page_SignLang.svg", "../../img/icons/StoryViewer/icon_SV_Page_SignLang_HoverDown.svg");
    
    ImageHoverSwap("#back.viewerNav", "#back.viewerNav #cover.icon", "../../img/icons/StoryViewer/icon_SV_Page_Image.svg", "../../img/icons/StoryViewer/icon_SV_Page_Image_HoverDown.svg");
}

/* ----------------------- Data parsing ----------------------- */
function parsePage(page)
{ console.log("Parsing: " + page);
    //update all the page numbers
    updatePageNumbers();
    
    //set story text
    $('#story').text(storyData[pageIndex].text[writtenLang]);
    
    //set image
    $('#visuals img').attr('src', storyData[page].image);
    
    //set video
    $('#visuals video').attr('src', storyData[page].video[signLang]);
 
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
    $('#holder #current').text(pageIndex + 1);
    $('#currentOverlay span').text(pageIndex + 1);
    
    //update buttons
    $('.viewerNav#forward .num').text(pageIndex + screen);
    $('.viewerNav#back .num').text(pageIndex - (screen % 2) + 1);
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
        
        //add button functionality
        $('.glossary').on('click', function(e)
        {
            //parse data to modal pop up
            var glossary = storyData[pageIndex].glossary[writtenLang];
            var term = $(e.target).text().toLowerCase();
                
            setOverlayItems( term, //word
                glossary[term].definition,
                glossary[term].video[signLang].start,
                glossary[term].video[signLang].end,
                storyData[pageIndex].video[signLang],
                glossary[term].image
            );
            
            //call pop up
            $('.modal').css("display", "block");

            $('#videoLoop').focus();
        });
    }
}

function setOverlayItems(word, definition, start, end, video, image)
{
    var videoContainer = document.getElementById("videoContainer")
    var imageTag = document.getElementById("definitionImage");
    var description = document.getElementById("definitionText");
    var title = document.getElementById("definitionWord");
    
    videoContainer.src = video + "#t="+start+","+end;
    videoContainer.addEventListener('loadedmetadata', function()
    {
        if(videoContainer.currentTime < start){
            videoContainer.currentTime = start;
        }
        videoContainer.ontimeupdate = function(){
            if(videoContainer.currentTime>=end){
                videoContainer.currentTime = start;
                videoContainer.play();

            }
        }
    }, false);
    
    imageTag.src = image;
    description.innerHTML = definition;
    title.innerHTML = word;
    
}

function GenerateLanguageSelects()
{
    //get sign and written options from the json
    writtenOptions = Object.keys(storyData[0].text);
    signOptions = Object.keys(storyData[0].video);
    
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

function ToggleStoryText()
{
    //get current mode
    var currentMode = textArea.hasClass('hideAnim');
    
    //check if showing or not
    if(currentMode)
    {
        //set text and visuals back to default
        textArea.removeClass("hideAnim");
        visuals.removeAttr('style');
        $('#storyToggle').removeAttr('style');
        $('#storyToggle #hide').css('display', 'none');
        $('#storyToggle #show').removeAttr('style');
        
    }
    else
    {
        //turn off text area
        //textArea.css("display", "none");
        textArea.addClass('hideAnim');
        
        //expand video to be full size
        visuals.css('height', '100%');
        visuals.css('max-height', '90%');
        visuals.css('width', '100%');
        visuals.css('margin', '0px');
        
        //$('#storyToggle').css('top', "calc(-100px)");
        $('#storyToggle #show').css('display', 'none');
        $('#storyToggle #hide').removeAttr('style');
        if(fullscreen){
            $('#storyToggle').css('top', '-37px');
        }
    }
}

function ToggleOptions(tag)
{
    var selectObj = $(tag + ' select');
    var buttonObj = $(tag + ' button');
    
    //get current mode
    var currentMode = selectObj.css("display");
    
     //check if showing or not
    if(currentMode.toString() === "none")
    {
        selectObj.css('display', 'block');
        
        buttonObj.css("border-bottom-left-radius", "0");
        buttonObj.css("border-bottom-right-radius", "0");
        
    }
    else
    {
        //set text and visuals back to default
        selectObj.removeAttr('style');
        buttonObj.removeAttr('style');
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
        $('#more-stories').css('display', 'block');
        $('#more-author').css('display', 'block');
        $('footer').removeAttr('style');
        
        //move viewer elements back down under header
        $('main').removeAttr('style');
        $('#viewer').removeAttr('style');
        $('#viewerBar').removeAttr('style');

        $('#holder').removeClass('holder-fullscreen');
        $('#viewer-content').removeClass('viewer-content-fullscreen');

        $('#fullscreen').removeClass('fullscreen-active');
        $('.filters').removeClass('fullscreen-active');
        $('#exit-fullscreen').removeClass('fullscreen-active');

        $('#storyToggle').css('top', '-54px');

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
        $('#viewer').css('height', 'calc(100% - 70px');

        $('#holder').addClass('holder-fullscreen');
        $('#viewer-content').addClass('viewer-content-fullscreen');

        
        //scroll to the top so we dont have odd whitespace and remove anythign thats extra
        $('main').scrollTop(0);
        $('main').css('overflow', 'hidden');

        $('#fullscreen').addClass('fullscreen-active');
        $('.filters').addClass('fullscreen-active');
        $('#exit-fullscreen').addClass('fullscreen-active');

        var currentMode = textArea.hasClass('hideAnim');
        if(currentMode){
            $('#storyToggle').css('top', '-37px');
        }else{
            $('#storyToggle').css('top', '-54px');
        }

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
        $('.viewerNav#back .icon').css('height', '70%');
        $('.viewerNav#back .icon').css('padding', '10%');
        $('.viewerNav#back .icon').css('margin-top', '15px');

    }
    else if(pageIndex >= (totalPages - 1) && !ShowingCover()) //last page shoudl hide right button
    {
        //get forward button and "grey" it out
        $('.viewerNav#forward button').css('opacity', '.3');
        
        //hide text
        //$('.viewerNav#forward span').text(totalPages - 1);
        $('.viewerNav#forward span').css('display', "none");
        
        //resize icon
        $('.viewerNav#forward .icon').css('height', '70%');
        $('.viewerNav#forward .icon').css('padding', '10%');
        $('.viewerNav#forward .icon').css('margin-top', '15px');
    }
    else
    {
        $('.viewerNav button').removeAttr('style');
        $('.viewerNav span').removeAttr('style');
        $('.viewerNav .icon').removeAttr('margin-top');
        $('.viewerNav .icon').removeAttr('padding');
        $('.viewerNav .icon').removeAttr('height');
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