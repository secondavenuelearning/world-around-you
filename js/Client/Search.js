import 'style/Stories.css!';
import FiltersBar from 'js/Client/Filter.js';
import StoryPreview from 'js/Client/StoryPreview';
import LanguageSelector from 'js/Client/LanguageSelector';
import StoryGrid from 'js/Client/StoryGrid.js';

import html from 'html/Client/Search.html!text';


$(document).ready(function () {
    $('main').html(html);

    $('#search-input').val(location.search.replace('?search=', ''));
    var search = $('#search-input').val();


    $.ajax({
        method: 'get',
        url: `./api/stories/${search}`
    }).done((stories) => {
        $('#search-input').on('keyup', (evt) => {
            if(evt.key == 'Enter')
                $('#search-wrapper').submit();
        });
        FiltersBar('filter-bar');

        if(stories.length == 0){
           $('#stories-header').html(`No results found for "${search}"`);
            return;
        }

        $('#stories-header').html(`Search results for "${search}"`);
        var storyPreviews = [];
        for (var i = 0; i < stories.length; i++) {
            let sp = new StoryPreview(stories[i]);
            storyPreviews.push(sp);
        }
        StoryGrid("stories", storyPreviews);
        LanguageSelector.updateLanguageDisplay();
    });

});