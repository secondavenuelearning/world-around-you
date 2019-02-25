/**************************** SLIDER BAR ****************************/
    
    // Create slider bar for pagination
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
    function bindChangeLanguages() {
        changeTextLanguage();
        changeSignLanguage();
    }

    // Change language
    function changeTextLanguage() {
        var triggerDiv = document.getElementById('changeTextLang');
        triggerDiv.addEventListener('click', function(e) {
            // Get languages menu 
            var menu = document.getElementById('languages');
            // If it's already showing, hide and exit function
            if ($(menu).css('display') != 'none' && $(menu).attr('type') == 'text') {
                $(menu).attr('type', '');
                $(menu).hide();
                return;
            }
            // Clear it
            $(menu).empty();
            // If cursor leaves menu, close it
            $('.controls').on('mouseleave', function() {
                $(menu).hide();
            });
            // Add languages to menu
            $(menu).attr('type', 'text');
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
                    // Remove any highlighting all  menu items
                    for (var j = 0; j < menu.children.length; j++) {
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
            // Show the menu, positioning it above trigger icon
            $(menu).show();
            $(menu).css({
                'top': -($(menu).height()),
                'left': 0
            });         
        });
    }

    // Change sign language 
    function changeSignLanguage() {
        var triggerDiv = document.getElementById('changeSignLang');
        triggerDiv.addEventListener('click', function(e) {
            // Get languages menu 
            var menu = document.getElementById('languages');
            // If it's already showing, hide and exit function
            if ($(menu).css('display') != 'none' && $(menu).attr('type') == 'sign') {
                $(menu).attr('type', '');
                $(menu).hide();
                return;
            }

            // Clear it
            $(menu).empty();
            // If cursor leaves menu, close it
            $('.controls').on('mouseleave', function() {
                $(menu).hide();
            });

            // Add sign languages to menu
            $(menu).attr('type', 'sign');
            for (var i in signLanguages) {
                var menuItem = document.createElement('div');
                var text = document.createElement('p');
                text.textContent = signLanguages[i];
                text.style.padding = '10px 20px 20px 20px';
                text.style.margin = '0px';
                menuItem.appendChild(text);
                menuItem.style.display = 'block';
                menuItem.style.height = '100%';

                // Highlight item if current chosen language
                if (signLanguages[i] == chosenSignLanguage) {
                    menuItem.style.fontWeight = "bold";
                }

                menu.appendChild(menuItem);

                // Bind event listener for user click on menu item
                $(menuItem).on('click', function(e) {
                    // Remove any highlighting all menu items
                    for (var j = 0; j < menu.children.length; j++) {
                        menu.children[j].style.fontWeight = 'normal';
                    }
                    // Highlight current menu item 
                    e.target.parentNode.style.fontWeight = 'bold';
                    // Get the language choice 
                    chosenSignLanguage = this.textContent.trim();
                    // Parse page again for the new sign language
                    parsePage(currPage);
                    // If current component is video, start it
                    var mainVid = document.getElementById('mainVid');
                    if (mainVid.parentNode.style.display != 'none') {

                        mainVid.play();
                    }
                });
            }

            // Show the menu, positioning it above trigger icon
            $(menu).show();
            $(menu).css({
                'top': -($(menu).height()),
                'left': '15%'
            });  
        });    
    }