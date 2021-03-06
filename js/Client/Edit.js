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
        if(navigator.serviceWorker){
            navigator.serviceWorker.getRegistrations().then((reg) => {
                if(reg[0]) reg[0].unregister();
            });
        }
        alert('World Around You is used by people of all ages. Please make sure any content you share on the site is appropriate for everyone to see.');
        var storyPreviews = [];
        if(stories.length > 0){
            for (var i = 0; i < stories.length; i++) {
                storyPreviews.push(new StoryPreview(stories[i], true));
            }
            // Needs an id for an already made element to populate, and a list of story previews
            var storyGrid = new StoryGrid("stories", storyPreviews);
            FiltersBar('filter-bar', storyGrid, storyPreviews);
        }

        LanguageSelector.updateLanguageDisplay();
    }).fail((err) => {

    });
});