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

            if(added) similarGenreStories.push(new StoryPreview(_story))
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

        // add the main html to the page
        $('main').html(template({
            story
        }));

        // Render the story viewer
        StoryViewer.SetStory(story);
        StoryViewer.Render('viewer');


        // add a view to the counter
        $.ajax({
            method: 'post',
            url: '/api/story/view',
            data: {
                id: story.id
            }
        });

        // like button function
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
        });

        // Share button function
        $('#social-share').on('click', (evt) => {
            let copyInput = $(`<input type="text" style="position: absolute; z-index: -1" value="${window.location.href}" />`);

            $('body').append(copyInput);

            copyInput[0].select();

            document.execCommand("copy");

            copyInput.remove();

            alert('link copied.');
        });

        LanguageSelector.updateLanguageDisplay();


        // load and render similar stories
        $.ajax({
            method: 'get',
            url: '/api/stories'
        }).done((stories) => {
            let similarAuthorStories = [];

            _.each(stories, (_story) => {
                if(_story.author != story.author || _story.id == story.id) return;
                similarAuthorStories.push(new StoryPreview(_story));
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
