import 'style/Main.css!';
import LanguageSelector from 'js/Client/LanguageSelector';
import Carousel from 'js/Client/Carousel';
import StoryPreview from 'js/Client/StoryPreview';

$(document).ready(function () {
    var storyOne = [];
    var storyTwo = [];
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
    //console.log($(storyOne[0]).css("left"));
        for (var i = 0; i < 9; i++) {
        let sp = new StoryPreview({
            id: i + 1,
            title: 'Aesop Fables: The Clever Donkey',
            author: 'Massimo V.',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ex nibh, euismod in arcu quis, porttitor tincidunt ipsum. Orci varius natoque penatibus et magnis dis.',
            coverImage: 'img/carousel/from_this_author/1.png'
        });
        storyTwo.push(sp);
        
    }
    console.log(storyOne);
   new Carousel("#templateResult", storyOne, 1, false, true);
    new Carousel("#templateResultTwo", storyTwo, 3, false, false);

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

    LanguageSelector.appendTo($('header')[0]);
});

import FiltersBar from 'js/client/Filter.js';
FiltersBar();
