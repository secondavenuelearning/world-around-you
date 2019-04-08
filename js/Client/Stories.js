import 'style/Stories.css!';
import Carousel from 'js/Client/Carousel.js';
import FiltersBar from 'js/Client/Filter.js';
import StoryPreview from 'js/Client/StoryPreview';
import LanguageSelector from 'js/Client/LanguageSelector';
import StoryGrid from 'js/Client/StoryGrid.js';

import html from 'html/Client/Stories.html!text';


$(document).ready(function () {
    $('main').html(html);
    $.ajax({
        method: 'get',
        url: './api/stories'
    }).done((stories) => {
        // sort stories by data created
        stories.sort((a, b) => {
            return a.datecreated > b.datecreated ? 1 : a.datecreated < b.datecreated ? -1 : 0;
            coverImage: 'img/carousel/from_this_author/1.png'
        });
        var newestStories = [];
        for (let i = 0; i < 9 && i < stories.length; i++) {
            let sp = new StoryPreview(stories[i]);
            newestStories.push(sp);
            
        }
        new Carousel("#new-stories", newestStories, 1, false,  true, "New Stories");
        /*
        // sort stories by title
        stories.sort((a, b) => {
            let clt = LanguageSelector.currentLanguageText();
            return a.metadata.title[clt] > b.metadata.title[clt] ? 1 : a.metadata.title[clt] < b.metadata.title[clt] ? -1 : 0;
            coverImage: 'img/carousel/from_this_author/1.png'
        });
        */
        var storyPreviews = [];
        if(stories.length > 0){
            for (var i = 0; i < stories.length; i++) {
                let sp = new StoryPreview(stories[i]);
                storyPreviews.push(sp);
            }
            var storyGrid = new StoryGrid("stories", storyPreviews);
            FiltersBar('filter-bar', storyGrid, storyPreviews);
        }
        LanguageSelector.updateLanguageDisplay();
    }).fail((err) => {
        alert('[PH] Something went wrong with the server, please try again later');
    });

});
