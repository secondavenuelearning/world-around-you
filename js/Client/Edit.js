import 'style/Edit.css!';
import FiltersBar from 'js/Client/Filter.js';
import LanguageSelector from 'js/Client/LanguageSelector';
import StoryPreview from 'js/Client/StoryPreview';
import StoryGrid from 'js/Client/StoryGrid.js';

import _ from "underscore";

import html from 'html/Client/Edit.html!text';

$(document).ready(function () {
    $('main').html(html);

    $.ajax({
        method: 'get',
        url: './api/stories?unpublished=true'
    }).done((stories) => {
        //console.log(stories);
        FiltersBar('filter-bar');
        
        var storyPreviews = [];
        for (var i = 0; i < stories.length; i++) {
            storyPreviews.push(new StoryPreview(stories[i], true));
        }

        // Needs an id for an already made element to populate, and a list of story previews
        StoryGrid("stories", storyPreviews);

        LanguageSelector.updateLanguageDisplay();
    }).fail((err) => {

    });
});