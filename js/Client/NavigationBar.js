
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