import 'style/Viewer.css!';
import _ from "underscore";
import urlParams from 'js/Client/UrlParams';
import LanguageSelector from 'js/Client/LanguageSelector';

import StoryPreview from 'js/Client/StoryPreview.js';
import Carousel from 'js/Client/Carousel.js';
import StoryViewer from 'js/Client/StoryViewer.js';

import html from 'html/Client/Viewer.html!text';
const template = _.template(html);

let storyId,
    story,
    liked = false;

function displaySimilarGenres(stories){
    let similarGenreStories = [],
        lang = LanguageSelector.currentLanguageText();

    _.each(story.metadata.genres[lang], (genre) => {
        _.each(stories, (_story) => {
            let added = false;
            _.each(_story.metadata.genres[lang], (_genre) => {
                if(_genre == genre && _story.id != story.id) added = true;
            });

            if(added) similarGenreStories.push(StoryPreview(_story))
        });
    });

    if(similarGenreStories.length > 0){
        $('#more-stories').show();
        new Carousel('#more-stories', similarGenreStories, 4, false, false, 'Similar Stories');
    }
    else{
        $('#more-stories').hide();
    }
}

$(document).ready(() => {
    storyId = parseInt(urlParams.id);

    $.ajax({
        method: 'get',
        url: `/api/story?id=${storyId}`
    }).done((_story) => {
        story = _story;
        $('main').html(template({
            story
        }));
        console.log(story);

        StoryViewer.SetStory(story);
        StoryViewer.Render('viewer');


        $.ajax({
            method: 'post',
            url: '/api/story/view',
            data: {
                id: story.id
            }
        });
        $('#social-likes').on('click', () => {
            if(liked) return;

            liked = true;

            $.ajax({
                method: 'post',
                url: '/api/story/like',
                data: {
                    id: story.id
                }
            }).done((stories) => {
                $('#likes').html(story.metadata.likes + 1);
            }).fail((err) => {
                console.error(err);
            });
        })

        LanguageSelector.updateLanguageDisplay();

        $.ajax({
            method: 'get',
            url: '/api/stories'
        }).done((stories) => {
            let similarAuthorStories = [];

            _.each(stories, (_story) => {
                if(_story.author != story.author || _story.id == story.id) return;
                similarAuthorStories.push(StoryPreview(_story));
            });

            if(similarAuthorStories.length > 0){
                $('#more-author').show();
                new Carousel('#more-author', similarAuthorStories, 4, false, false, 'More from this Author');
            }
            else{
                $('#more-author').hide();
            }

            displaySimilarGenres(stories);
            $(document).on('languageChange', () => {
                displaySimilarGenres(stories);
            });
        }).fail((err) => {
            console.error(err);
        });
    }).fail((err) => {
        console.error(err);
    });
});
