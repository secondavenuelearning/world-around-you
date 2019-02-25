

    /**************************** SPECIFY SOME HELPER FUNCTIONS ****************************/

    // Loops video at given time interval (in seconds)
    function playVideoInterval(start, end) {
        video = document.getElementById('glossaryVid');

        $(video).attr({
            start: start,
            end: end
        });
        $(video).data('loop', true);
        video.currentTime = $(video).attr('start');
        video.addEventListener('timeupdate', loop);
        video.play();

        function loop() {
            if (this.currentTime >= $(video).attr('end') && $(video).data('loop')) {
                video.currentTime = $(video).attr('start');
            }
        }
    }

    // Resizes story text (which varies from page to page) to always fit within the constant sized div
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

    // Bind event handler to menu buttons to show text 
    function bindMenuButtons() {
        // Get all menu buttons
        var menuBtns = document.getElementsByClassName('menuBtn');
        // Get the description element
        var description = document.getElementById('btnDesc');
        // For each menu button
        for (var i = 0; i < menuBtns.length; i++) {
            // Add an event handler
            menuBtns[i].addEventListener('mouseenter', function(e) {
                thisBtn = this;
                // Delay showing description by 1/2 second (if user is not sure, they will hover longer)
                timerToWaitForUser = window.setTimeout(function(){
                    // Get data for the menu element to use as description
                    description.textContent = thisBtn.getAttribute('data');
                    // Position & show description
                    description.style.visibility = 'visible'; // quickly show then...
                    $(description).css({
                        'left': thisBtn.offsetLeft-(description.offsetWidth-thisBtn.offsetWidth)/2,
                        'opacity': 1
                    });
                }, 500);
            });
            menuBtns[i].addEventListener('mouseleave', function() {
                // Clear timeout
                window.clearTimeout(timerToWaitForUser);
                // Hide btn description
                $(description).css({
                    'visibility': 'hidden',
                    'opacity': 0
                });
            })
        }
    }

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
            $('#slider').slider('value', nextIndex); // (slider has change event handler that will show/hide correct components/arrows)
        }); 

        // Set left arrow to go backward through story
        leftArrow.addEventListener('click', function() {
            var currComponent = ($('#slider').slider('value') - 1) % 3; 
            var lastIndex = (currPage * 3) + currComponent;
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
        var vidEle = document.getElementById('mainVid');

        // When hovering over video element, show overlay
        vidEle.addEventListener('mouseenter', function() {
            // Show video overlay if component has been told to listen for mouseenter
            if (!this.classList.contains('ignore-mouseenter')) {
                $('#videoOverlay').css({
                    display: 'block',
                    height: $(this).parent().height()
                });
                // Pause video
                this.pause();
            }
        });

        // When mouse leaves video overlay
        $('#videoOverlay').on('mouseleave', function() {
            // Hide video overlay
            $('#videoOverlay').css({
                display: 'none'
            });
            // Resume video
            if (!vidEle.ended) {
                vidEle.play();
            }
        });

        $(vidEle).parent().on('mouseleave', function() {
            // Tell component to listen for mouseenter event again
            vidEle.classList.remove('ignore-mouseenter');
        });
        
        // When click replay button
        $('#videoOverlay img').on('click', function() {
            // Tell component to ignore mouseenter event, otherwise 
            // it will pop up the overlay right away again
            vidEle.classList.add('ignore-mouseenter');
            $('#videoOverlay').css({
                display: 'none'
            });
            // Restart video
            vidEle.currentTime = 0;
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
                $('#storyText').resizeText();
            }
            // NOTE: The text resize occurs here, immediately after the text component is made visible, since the resize function uses scrollHeight and offsetHeight which cannot be calculated if display = none
        } 
    }

    // Returns calculated display value for given element
    function getDisplayValue(element) {
        return element.currentStyle ? element.currentStyle.display : getComputedStyle(element, null).display;
    }



