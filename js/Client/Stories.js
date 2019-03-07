import 'style/Stories.css!';
import Carousel from 'js/Client/Carousel.js';
import FiltersBar from 'js/Client/Filter.js';
import StoryPreview from 'js/Client/StoryPreview';

import html from 'html/Client/Stories.html!text';


$(document).ready(function () {
    $('main').html(html);

    var storyOne = [];
    for (var i = 0; i < 9; i++) {
        let sp = new StoryPreview({
            id: i + 1,
            title: 'Aesop Fables: The Clever Donkey',
            author: 'Massimo V.',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ex nibh, euismod in arcu quis, porttitor tincidunt ipsum. Orci varius natoque penatibus et magnis dis.',
            coverImage: 'img/carousel/from_this_author/1.png'
        });
        storyOne.push(sp);
        
    }
    new Carousel("#new-stories", storyOne, 1, false,  false, "New Stories");


    FiltersBar('filter-bar');


    for (var i = 0; i < 9; i++) {
        let sp = new StoryPreview({
            id: i + 1,
            title: 'Aesop Fables: The Clever Donkey',
            author: 'Massimo V.',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ex nibh, euismod in arcu quis, porttitor tincidunt ipsum. Orci varius natoque penatibus et magnis dis.',
            coverImage: 'img/carousel/from_this_author/1.png'
        });
        sp.appendTo('stories');
    }
});
