//Global properties
var whichStory = "Malakas_Maganda"; // the ID of the story in the JSON file
var currStoryData = null;
var numOfPages = 0;
var currPage = 0;
var languages = [];
var chosenLanguage = "";
var signLanguages = ['FSL: Luzon', 'FSL: Visayas', 'FSL: Mindanao']; // placeholder for now
var chosenSignLanguage = "FSL: Luzon";


    
/**************************** LOAD DATA FROM TEMPORARY JSON DATABASE ****************************/
window.onload = function(){
       
    loadStory(whichStory);
}

    // Load JSON file for one story
    function loadStory(storyId) {
        if (window.XMLHttpRequest) {
            var xmlhttp = new XMLHttpRequest();
            var dataUrl = 'text/' + whichStory + '.json';
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    // Save story and parse title and first page
                    currStoryData = JSON.parse(this.responseText);
                    languages = parseLanguageChoices();
                    chosenLanguage = languages[0]; // placeholder, user will set later
                    numOfPages = currStoryData.length;  // -1 due to title 
                    parseTitle();
                    parsePage(currPage);
                    createSlider();
                    bindArrowListener();
                    bindVideoHoverListener();
                    bindChangeLanguages();
                    setupCarousel();
                    setupFullScreen();
                    bindMenuButtons();
                }
            };
            xmlhttp.open("GET", dataUrl);
            xmlhttp.send();
        }
    }

    /**************************** PARSE DATA INTO HTML ELEMENTS ****************************/
//-------------------------------------------------------------------------------!! will be in database not json
    // Get title from JSON data
    function parseTitle() {  
        var title = whichStory;
        var titleElement = document.getElementById('title');
        titleElement.textContent = title;
    }

    // Get available language choices from JSON file
    function parseLanguageChoices() {
        return Object.keys(currStoryData[currPage].text);
    }

    // Parse story JSON by page into components
    function parsePage(pageNum) {
        var page = currStoryData[currPage];
        
        // Set the picture component
        var picComponent = document.getElementsByClassName('component')[0];
        picComponent.src = page.image;
        
        // Set the video component according to language
        var chosenSignLanguageFormatted = chosenSignLanguage.replace(": ", "_").toLowerCase();
        vidComponent = document.getElementsByClassName('component')[1];
        vidComponent.src = page.video[chosenSignLanguageFormatted];

        // build story text for this page
        var storyText = document.getElementById('storyText');
        while (storyText.firstChild) {
            storyText.removeChild(storyText.firstChild); //clear text   
        }
        
        //replace with this pages text
        var story = page.text[chosenLanguage];

        // Add video and picture to first row of text component
        var textComponent = document.getElementsByClassName('parent')[2]; // third parent
        var textVid = textComponent.getElementsByTagName('video')[0];
        var textPic = textComponent.getElementsByTagName('img')[0];
        textVid.src = page.video[chosenSignLanguageFormatted];
        textPic.src = page.image;

        // Add glossary functionality
        var glossary = {};
        if(page.hasOwnProperty('glossary')) //check if we even have glossary items
        { 
            glossary = currStoryData[currPage].glossary[chosenLanguage]; //get all glossary object for this lang
            
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
           
        }
        
        //give story to viewer
         $('<span></span>')
            .appendTo('#storyText')
            .replaceWith(story);
        
        //add on click event to glossary items
        $('.glossary').on('click', function(e) { 
            //get term from cliked item, and its glossary object
            var term = $(e.target).text().toLowerCase();
            var termObject = glossary[term];

            // Change out picture
            textPic.src = termObject.image;
            
            // Loop video if timestamp is provided
            playVideoInterval(termObject.video[chosenSignLanguageFormatted].start, termObject.video[chosenSignLanguageFormatted].end);
        });
       

        // Set event listener to component so that if user clicks anywhere and it is not glossary word, the video will stop looping
        $('.panel').on('click', function(e) {
            if (!e.target.classList.contains('glossary')) {
                // If video is playing, pause it and reset
                if (!$('#glossaryVid')[0].paused) {
                    $('#glossaryVid')[0].pause();
                    $('#glossaryVid')[0].currentTime = 0;
                }
                
                // If picture is a glossary pic, return it to story pic
                if (textPic.src != page.image) {
                    textPic.src = page.image;
                }
            }
        })
    }