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
        url: './api/stories'
    }).done((stories) => {
        //console.log(stories);
        FiltersBar('filter-bar');
        
        var storyPreviews = [];

        // for (var i = 0; i < stories.length; i++) {
        //     let sp = new StoryPreview(stories[i]);
        for (var i = 0; i < 27; i++) {
            let sp = new StoryPreview({
                id: i + 1,
                metadata: {
                    title: {
                        english: 'Aesop Fables: The Clever Donkey'
                    },
                    description: {
                        english: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ex nibh, euismod in arcu quis, porttitor tincidunt ipsum. Orci varius natoque penatibus et magnis dis.'
                    }                    
                },
                author: 'Massimo V.',
                coverImage: 'img/carousel/from_this_author/1.png'
            });
            storyPreviews.push(sp);
        }
        // Needs an id for an already made element to populate, and a list of story previews
        StoryGrid("stories", storyPreviews);

        LanguageSelector.updateLanguageDisplay();
    }).fail((err) => {

    });
});