//Global properties
var whichStory = "story_2"; // the ID of the story in the JSON file
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
                    numOfPages = Object.keys(currStoryData.languages[chosenLanguage]).length;  // -1 due to title 
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

    // Get title from JSON data
    function parseTitle() {
        var title = currStoryData["languages"][chosenLanguage][0].glossary[0].text;
        var titleElement = document.getElementById('title');
        titleElement.textContent = title;
    }

    // Get available language choices from JSON file
    function parseLanguageChoices() {
        return Object.keys(currStoryData.languages);
    }

    // Parse story JSON by page into components
    function parsePage(pageNum) {
        // Set the picture component
        var picComponent = document.getElementsByClassName('component')[0];
        picComponent.src = 'img/' + whichStory + '/' + pageNum + '.png';
        // Set the video component according to language
        var chosenSignLanguageFormatted = chosenSignLanguage.replace(": ", "_").toLowerCase();
        var vidPath = 'videos/' + whichStory + '/' + chosenSignLanguageFormatted + '/' + pageNum + '.mp4';
        vidComponent = document.getElementsByClassName('component')[1];
        vidComponent.src = vidPath;

        // Set the glossary component according to chosen language, first removing current text
        storyText = document.getElementById('storyText');
        while (storyText.firstChild) {
            storyText.removeChild(storyText.firstChild);
        }

        // Add video and picture to first row of text component
        var textComponent = document.getElementsByClassName('parent')[2]; // third parent
        var textVid = textComponent.getElementsByTagName('video')[0];
        var textPic = textComponent.getElementsByTagName('img')[0];
        textPicPath = 'img/' + whichStory + '/' + pageNum + '.png';
        textVid.src = vidPath;
        textPic.src = textPicPath;

        // Add glossary
        var glossary = currStoryData["languages"][chosenLanguage][pageNum].glossary;
        glossary.forEach(function(phrase) {
            var timestamp = phrase.timestamp;
            var text = phrase.text;
            // If the phrase contains timestamp, identify as glossary word
            if (timestamp) {
                $('<span></span>')
                    .addClass('glossary')
                    .appendTo($(storyText))
                    .text(text) // need to fix so that it sets these time stamp onto the trigger & featherlight can read
                    .on('click', function() {
                        // Change out picture
                        textPic.src = 'img/glossary/' + text.toLowerCase() + '.png';
                        // Loop video if timestamp is provided
                        if (timestamp.length > 0) {
                            playVideoInterval(timestamp[0], timestamp[1]);
                        }
                    });
            } else {
                // If the phrase contains no time stamp, add it as plain text
                $('<span></span>')
                    .appendTo('#storyText')
                    .text(text);
            }
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
                if (textPic.src != textPicPath) {
                    textPic.src = textPicPath;
                }
            }
        })
    }