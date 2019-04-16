import 'style/Stories.css!';
import Carousel from 'js/Client/Carousel.js';
import FiltersBar from 'js/Client/Filter.js';
import StoryPreview from 'js/Client/StoryPreview';
import LanguageSelector from 'js/Client/LanguageSelector';
import StoryGrid from 'js/Client/StoryGrid.js';

import html from 'html/Client/Stories.html!text';
var online = true;

$(document).ready(function () {
    $('main').html(html);
    $.ajax({
        method: 'get',
        url: './api/stories'
    }).done((stories) => {

        var newestStories = [];
        for (let i = 0; i < 9 && i < stories.length; i++) {
            let sp = new StoryPreview(stories[i]);
            newestStories.push(sp);
            
        }
        new Carousel("#new-stories", newestStories, 1, false,  true, "New Stories");

        var storyPreviews = [];
        if(stories.length > 0){
            for (var i = 0; i < stories.length; i++) {
                let sp = new StoryPreview(stories[i]);
                storyPreviews.push(sp);
            }
            var storyGrid = new StoryGrid("stories", storyPreviews);
            // Pass story grid as the object to be filtered
            FiltersBar('filter-bar', storyGrid, storyPreviews);
        }
        
        LanguageSelector.updateLanguageDisplay();
    }).fail((err) => {
        alert('[PH] Something went wrong with the server, please try again later');
    });
});
