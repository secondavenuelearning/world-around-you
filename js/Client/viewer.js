import 'style/Viewer.css!';
import _ from "underscore";
import urlParams from 'js/Client/UrlParams';
import LanguageSelector from 'js/Client/LanguageSelector';

import StoryPreview from 'js/Client/StoryPreview.js';
import Carousel from 'js/Client/Carousel.js';
import StoryViewer from 'js/Client/StoryViewer.js';
import ImageHoverSwap from 'js/Client/HelperFunctions.js';
import FiltersBar from 'js/Client/Filter.js';

import html from 'html/Client/Viewer.html!text';
const template = _.template(html);

let storyId,
    story;

var totalLikes;
var canLike = true;

// temp
    function updateLikes() {
     
        if (canLike) {
            totalLikes++;
            document.getElementById("likes").innerHTML = "Likes: " + totalLikes;
            canLike = false;
            
        }
        document.getElementById("likeClick").style.backgroundColor = "#0098ba";

    }

    function SetViewLikeCounts(viewCount, likeCount) {
        document.getElementById("likes").innerHTML = "Likes: " + likeCount;
        totalLikes = likeCount;
        document.getElementById("likeClick").onclick = function () {
          
            if (canLike) {
                totalLikes++;
                document.getElementById("likes").innerHTML = "Likes: " + totalLikes;
                canLike = false;
            }

        }
     
        console.log(canLike);

        document.getElementById("views").innerHTML = "Views: " + viewCount;
    }

    function GenerateGenres(Genres) {
        var holder = document.getElementById("genres");
        for (var x = 0; x < Genres.length; x++) {
            var innerText = "<div class = 'category'>" + Genres[x] + "</div>";
            holder.innerHTML += innerText;

        }
    }

    function GenerateTage(Tags) {
        var holder = document.getElementById("tags");
        for (var x = 0; x < Tags.length; x++) {
            var innerText = "<div class = 'category'>#" + Tags[x] + "</div>";
            holder.innerHTML += innerText;

        }
    }

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
        // FiltersBar('index', true);
        LanguageSelector.updateLanguageDisplay();


        // var modal = document.getElementById('id01');

        // // When the user clicks anywhere outside of the modal, close it
        // window.onclick = function(event) {
        //     if (event.target == modal) {
        //         modal.style.display = "none";
        //     }
        // }
        // document.getElementById("exit-modal").onclick = function () {
        //     modal.style.display = "none";
        // };

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
