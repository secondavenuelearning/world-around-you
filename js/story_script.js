
window.onload = function() {
    
    /**************************** LOAD STORY JSON FILE ****************************/

    var whichStory = "story_2"; // the ID of the story in the JSON file
    var currStoryData = null;
    var numOfPages = 0;
    var currPage = 0;
    var languages = [];
    var chosenLanguage = "";
    loadStory(whichStory);

    // Load JSON file for one story
    function loadStory(storyId) {
        if (window.XMLHttpRequest) {
            console.log("Loading text for " + storyId + "...");
            var xmlhttp = new XMLHttpRequest();
            var dataUrl = 'text/' + whichStory + '.json';
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    // Save story and parse title and first page
                    currStoryData = JSON.parse(this.responseText);
                    console.log('This story has ' + numOfPages + ' pages');
                    languages = parseLanguageChoices();
                    chosenLanguage = languages[0]; // placeholder, user will set later
                    numOfPages = Object.keys(currStoryData.languages[chosenLanguage]).length;  // -1 due to title 
                    parseTitle();
                    parsePage(currPage);
                    createSlider();
                    bindArrowListener();
                    bindVideoHoverListener();
                    bindChangeLanguage();
                    setupCarousel();
                }
            };
            xmlhttp.open("GET", dataUrl);
            xmlhttp.send();
        }
    }

    /**************************** PARSE PAGE INTO HTML ELEMENTS ****************************/

    // Get title from JSON file
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
        console.log('Parsing page ' + pageNum + ' of ' + whichStory);

        // Set the picture component
        var picComponent = document.getElementsByClassName('component')[0];
        picComponent.src = 'img/' + whichStory + '/' + pageNum + '.png';
        // Set the video component
        vidComponent = document.getElementsByClassName('component')[1];
        vidComponent.src = 'videos/' + whichStory + '/' + pageNum + '.mp4';

        // Set the glossary component according to chosen language, first removing current text
        storyText = document.getElementById('storyText');
        while (storyText.firstChild) {
            storyText.removeChild(storyText.firstChild);
        }

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
            } else {
                // If the phrase contains no time stamp, add it as plain text
                $('<span></span>')
                    .appendTo('#storyText')
                    .text(text);
            }
        });

        // Add video and picture to first row of text component
        var textComponent = document.getElementsByClassName('parent')[2]; // third parent
        var textVid = textComponent.getElementsByTagName('video')[0];
        var textPic = textComponent.getElementsByTagName('img')[0];
        textVid.src = 'videos/' + whichStory + '/' + pageNum + '.mp4';
        textPic.src = 'img/' + whichStory + '/' + pageNum + '.png';
    }

    $.fn.resizeText = function(options) {
        var settings = $.extend({ maxfont: 40, minfont: 15 }, options);

        var style = $('<style>').html('.nodelays ' +
        '{ ' +
            '-moz-transition: none !important; ' +
            '-webkit-transition: none !important;' +
            '-o-transition: none !important; ' +
            'transition: none !important;' +
        '}');

        function shrink(el, fontsize, minfontsize) {
            if (fontsize < minfontsize) {
                return;
            }
            el.style.fontSize = fontsize + 'px';
            if (el.scrollHeight > el.offsetHeight) shrink(el, fontsize - 1, minfontsize);
        }

        $('head').append(style);

        $(this).each(function(index, el) {
            var element = $(el);
            element.addClass('nodelays');
            shrink(el, settings.maxfont, settings.minfont);
            element.removeClass('nodelays');
        });

        style.remove();
    }

    /**************************** HANDLE EVENTS ****************************/

    // Bind event handlers to clicks on paginating arrows
    function bindArrowListener() {
        var arrows = document.getElementsByClassName("arrow"); 
        var leftArrow = arrows[0];
        var rightArrow = arrows[1];

        // Deactivate left arrow at the beginning
        leftArrow.classList.add('deactivated');

        // Set right arrow to advance forward through story
        rightArrow.addEventListener('click', function() {
            var currComponent = ($('#slider').slider('value') - 1) % 3;
            var nextIndex = (currPage * 3) + currComponent + 2;
            console.log('on page ' + currPage + ' and component ' + nextIndex);
            $('#slider').slider('value', nextIndex); // (slider has change event handler that will show/hide correct components/arrows)
        }); 

        // Set left arrow to go backward through story
        leftArrow.addEventListener('click', function() {
            var currComponent = ($('#slider').slider('value') - 1) % 3; 
            var lastIndex = (currPage * 3) + currComponent;
            console.log('on page ' + currPage + ' and component ' + currComponent);
            $('#slider').slider('value', lastIndex); // (slider has change event handler that will show/hide correct components/arrows)
        });
    }

    // Deactivates or activates arrow when appropriate
    function checkArrows(componentNum) {
        var arrows = document.getElementsByClassName("arrow"); 
        var leftArrow = arrows[0];
        var rightArrow = arrows[1];

        // If on the first component, 
        if (componentNum == 1) {
            // Deactivate left arrow
            if (!leftArrow.classList.contains('deactivated')) {
                leftArrow.classList.add('deactivated');
            }
        } else {
            // Activate left arrow
            if (leftArrow.classList.contains('deactivated')) {
                leftArrow.classList.remove('deactivated');
            }
        }

        // If on the last component,
        if (componentNum == (numOfPages * 3)) {
            // Deactivate right arrow
            if (!rightArrow.classList.contains('deactivated')) {
                rightArrow.classList.add('deactivated');
            }
        } else { // If not on the last component,
            // Activate right arrow
            if (rightArrow.classList.contains('deactivated')) {
                rightArrow.classList.remove('deactivated');
            }
        }
    }

    // Binds event handler to video hover event
    function bindVideoHoverListener() {
        var components = document.getElementsByClassName('parent');

        // When hovering over video element, show overlay
        for (var i = 0; i < components.length; i++) {
            if (components[i].children[0].nodeName.toLowerCase() == 'video') {
                var vidEle = components[i].children[0];
                vidEle.addEventListener('mouseenter', function() {
                    $('#videoOverlay').css({display: 'block'});
                    this.pause();
                    //$('#videoOverlay').css({width: '100vw', height: '520px'}); // same as panel
                });
                vidEle.addEventListener('mouseleave', function() {
                    $('#videoOverlay').css({display: 'none'});
                    if (!this.ended) {
                        this.play();
                    }
                    //$('#videoOverlay').css({width: 0, height: 0});
                });
            }
        }

        $('#videoOverlay > img').on('click', function() {
            console.log('replaying');
        });
    }

    // Shows specified component, hiding all other components
    function showThisComponent(id) {
        var components = document.getElementsByClassName('parent');

        // Show the desired component, ensuring other components are hidden first
        if (getDisplayValue(components[id]) == "none") {
            for (var i = 0; i < components.length; i++) {
                if (i != id && getDisplayValue(components[i]) != "none") {
                    components[i].style.display = "none";
                    // If another component is a video, ensure it is paused & reset
                    if (components[i].children[0].nodeName.toLowerCase() == 'video') {

                        components[i].children[0].pause();
                        components[i].children[0].currentTime = 0;
                    }
                }
            }

            // Show the desired component
            components[id].style.display = "block";

            // If desired component is a video, start playing
            if (components[id].children[0].nodeName.toLowerCase() == 'video') {
                components[id].children[0].play();
            }

            // If desired component is text, make it fit
            // Set initial size at large so it can be resized down to fit later
            $('#storyText').css('font-size', '40px');
            if (components[id].lastElementChild.firstElementChild == $('#storyText')[0]) {
                console.log('resizing story text...');
                $('#storyText').resizeText();
            }
            // NOTE: The text resize occurs here, immediately after the text component is made visible, since the resize function uses scrollHeight and offsetHeight which cannot be calculated if display = none
        } 
    }

    // Returns calculated display value for given element
    function getDisplayValue(element) {
        return element.currentStyle ? element.currentStyle.display : getComputedStyle(element, null).display;
    }

    /**************************** SLIDER BAR ****************************/
    
    function createSlider() {
        $("#slider").slider({
            min: 1,
            max: numOfPages * 3, 
            step: 0.00001, // smoother 
            change: slideTo, // on manual change
            range: false,
            animate: "slow",
            orientation: 'horizontal',
            create: function(event, ui) { // set ticks
                setSliderTicks(event.target);
            },
            stop: function(event, ui) {
                // Move handle to closest value, since steps are tiny to allow for smoother sliding
                $('#slider').slider('value', Math.round(ui.value)); 
            }
        });
    }

    // If the slider changes, update the view
    function slideTo(event, ui) {
        // Get value of slider
        var desiredId = $('#slider').slider('value') - 1;
        var desiredPage = Math.floor(desiredId/3);
        var desiredComponent = desiredId % 3; 

        // Make the desired page the current page 
        if (currPage != desiredPage) {
            console.log('turning page');
            currPage = desiredPage;
            parsePage(currPage); 
        }

        // Check if any arrow should be activated/deactivated
        checkArrows(desiredId + 1);

        // Show the desired component and hide undesired components
        showThisComponent(desiredComponent);
    } 

    // Set tick marks on slider
    function setSliderTicks(){
        var $slider =  $('#slider');
        var max =  $slider.slider("option", "max");    
        var spacing =  100 / (max - 1);

        $slider.find('.tickmark').remove();
        for (var i = 0; i < max ; i+=3) {
            $('<span class="tickmark"></span>').css('left', (spacing * i) +  '%').appendTo($slider); 
         }
    }

    // Let user change language
    function bindChangeLanguage() {
        triggerDivs = document.getElementsByClassName('changeLang');
        for (var i = 0; i < triggerDivs.length; i++) {
            triggerDivs[i].addEventListener('click', function() {
                // Get languages menu and clear it
                var menu = document.getElementById('languages');
                $(menu).empty();
                // If cursor leaves menu, close it
                $('.controls').on('mouseleave', function() {
                    $(menu).hide();
                });
                // Add languages
                for (var i in languages) {
                    var menuItem = document.createElement('div');
                    var text = document.createElement('p');
                    text.textContent = languages[i];
                    text.style.padding = '10px 20px 20px 20px';
                    text.style.margin = '0px';
                    menuItem.appendChild(text);
                    menuItem.style.display = 'block';
                    menuItem.style.height = '100%';
                    // Highlight item if current chosen language
                    if (languages[i] == chosenLanguage) {
                        menuItem.style.fontWeight = "bold";
                    }
                    menu.appendChild(menuItem);
                    // Bind event listener for user click on menu item
                    $(menuItem).on('click', function(e) {
                        console.log(e.target);
                        // Remove any highlighting all  menu items
                        for (var j = 0; j < menu.children.length; j++) {
                            console.log(menu.children[j]);
                            menu.children[j].style.fontWeight = 'normal';
                        }
                        // Highlight current menu item 
                        e.target.parentNode.style.fontWeight = 'bold';
                        // Get the language choice 
                        chosenLanguage = this.textContent.trim();
                        // Parse page again, with this language
                        parsePage(currPage);
                        // If current component is storyText, resize text 
                        if ($('#storyText').css('display') != 'none') {
                            $('#storyText').resizeText();
                        }

                    });
                }
                // Show the menu, positioning it right above controls bar
                $(menu).toggle();
                $(menu).css({'top': -($(menu).height())});            
            });
        }
    }

    /**************************** THUMBNAIL CAROUSEL ****************************/

    function setupCarousel() {
        $(".regular").slick({
            dots: true,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3
        });
    }
    






    /**************************** GLOSSARY (UNUSED RIGHT NOW) ****************************/

    // Show featherlight if user clicks on a glossary word
    function playVideoInterval(glossaryVid, start, end) {
        //var glossaryVid = document.getElementsByClassName('glossaryVid')[1];
        glossaryVid.setAttribute('start', start);
        glossaryVid.setAttribute('end', end);
        $(glossaryVid).data('loop', true);
        glossaryVid.setAttribute('currentTime', $(glossaryVid).attr('start'));
        //$(glossaryVid).on('timeupdate', loop);
        $(glossaryVid)[0].play();
        console.log($(glossaryVid)[0]);

        function loop() {
            if ($(this).attr('currentTime') >= $(glossaryVid).attr('end') && $(glossaryVid).data('loop')) {
                $(glossaryVid).attr('currentTime', $(glossaryVid).attr('start'));
            }
            console.log(glossaryVid);
            glossaryVid.setAttribute('start', start);
            glossaryVid.setAttribute('end', end);
            $(glossaryVid).data('loop', true);
            glossaryVid.currentTime = $(glossaryVid).attr('start');
            glossaryVid.addEventListener('timeupdate', loop);
            console.log(glossaryVid.currentTime);
            glossaryVid.play();

            function loop() {
                console.log('playing loop');
                console.log(this.currentTime);
                if (this.currentTime >= $(glossaryVid).attr('end') && $(glossaryVid).data('loop')) {
                    glossaryVid.currentTime = $(glossaryVid).attr('start');
                }
            }
        }
    } 

}
