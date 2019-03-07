import Carousel from 'js/Carousel';
import StoryPreview from 'js/Client/StoryPreview';


$(document).ready(function () {
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
  
    new Carousel("#templateResult", [storyOne[0].story.coverImage,
                                     storyOne[0].story.coverImage,
                                    storyOne[0].story.coverImage,
                                    storyOne[0].story.coverImage,
                                   storyOne[0].story.coverImage,
                                    storyOne[0].story.coverImage,
                                    storyOne[0].story.coverImage], 1, true);
    new Carousel("#templateResultTwo", ['img/carousel/from_this_author/1.png',
                                     'img/carousel/from_this_author/1.png', 'img/carousel/from_this_author/1.png', 'img/carousel/from_this_author/2.png', 'img/carousel/from_this_author/2.png',
                                     'img/carousel/from_this_author/2.png',
                                     'img/carousel/from_this_author/3.png', 'img/carousel/from_this_author/3.png',
                                     'img/carousel/from_this_author/3.png'], 3, true);
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

import FiltersBar from 'js/client/Filter.js';
FiltersBar();