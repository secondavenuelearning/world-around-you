import 'style/Stories.css!';
import Carousel from 'js/Client/Carousel.js';
import FiltersBar from 'js/Client/Filter.js';
import StoryPreview from 'js/Client/StoryPreview';
import LanguageSelector from 'js/Client/LanguageSelector';

import html from 'html/Client/Stories.html!text';


$(document).ready(function () {
    $('main').html(html);
    $.ajax({
        method: 'get',
        url: './api/stories'
    }).done((stories) => {
        console.log(stories);
        var storyOne = [];
        for (var i = 0; i < 9; i++) {
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
            storyOne.push(sp);
            
        }
        new Carousel("#new-stories", storyOne, 1, false,  true, "New Stories");


        FiltersBar('filter-bar');


        for (var i = 0; i < stories.length; i++) {
            let sp = new StoryPreview(stories[i]);
            sp.appendTo('stories');
        }

        LanguageSelector.updateLanguageDisplay();
    }).fail((err) => {

    });

});
