import 'style/Stories.css!';
import FiltersBar from 'js/Client/Filter.js';
import StoryPreview from 'js/Client/StoryPreview';
import LanguageSelector from 'js/Client/LanguageSelector';
import StoryGrid from 'js/Client/StoryGrid.js';

import html from 'html/Client/Bookmarks.html!text';


$(document).ready(function () {
    $('main').html(html);
    $.ajax({
        method: 'get',
        url: `./api/bookmarks`
    }).done((stories) => {
        FiltersBar('filter-bar');

        if(stories.length == 0){
           $('#stories-header').html('You have no stories bookmarked.');
            return;
        }

        var storyPreviews = [];
        for (var i = 0; i < stories.length; i++) {
            let sp = new StoryPreview(stories[i]);
            storyPreviews.push(sp);
        }

        StoryGrid("stories", storyPreviews);
        
        LanguageSelector.updateLanguageDisplay();
    });

});