import 'style/Viewer.css!';
import html from 'html/Client/Viewer.html!text';

import StoryPreview from 'js/Client/StoryPreview.js';
import Carousel from 'js/Client/Carousel.js';
import StoryViewer from 'js/Client/StoryViewer.js';
import ImageHoverSwap from 'js/Client/HelperFunctions.js';
import FiltersBar from 'js/Client/Filter.js';

var totalLikes;
var canLike = true;

function SetVideoTitle(titleName) {
    var title = document.getElementById("title");
    title.innerHTML = titleName;
}

function SetAuthorInfo(authorName, authorImage) {
    var user = document.getElementById("uploader");
    user.innerHTML = "<img src = " + authorImage + " /> " + authorName;

}

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

function SetDescriptionText(description) {
    document.getElementById("Description").innerHTML = description;
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

$(document).ready(function () {
    //update main section of page

    $('main').html(html);
    
    SetVideoTitle("Test");
    SetAuthorInfo("Chase", "img/icons/user.png");
    SetViewLikeCounts(1000000, 2000);
    SetDescriptionText("  Chicken buffalo biltong, corned beef frankfurter tenderloin leberkas ball tip chuck. Beef ribs turducken pancetta spare ribs ham. Sirloin meatloaf tri-tip shank strip steak, short loin ground round shoulder fatback. Shoulder prosciutto beef, ham short loin picanha pork chop fatback short ribs. Short ribs prosciutto tri-tip, chuck landjaeger sirloin strip steak jowl bresaola fatback picanha kevin. Ground round cupim andouille, pastrami burgdoggen beef jerky beef ribs fatback porchetta. Biltong ground round tri-tip landjaeger, meatball tenderloin shoulder turkey capicola.");
    GenerateGenres(["Folk", "Fantasy"]);
    GenerateTage(["folktale", "fantasy"]);


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
        new Carousel("#more-stories", storyOne, 4, false, false, "Similar Stories");
            
        }).fail((err) => {

    });
    
        $.ajax({
        method: 'get',
        url: './api/stories'
    }).done((stories) => {
        console.log(stories);
        var storyTwo = [];
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
            storyTwo.push(sp);
        }
        new Carousel("#more-author", storyTwo, 4, false, false, "More from this Author");
            
        }).fail((err) => {

    });
    
    FiltersBar('index', true);
   /* var storyTwo = [];
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
    */

      var modal = document.getElementById('id01');

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        document.getElementById("exit-modal").onclick = function () {
            modal.style.display = "none";
        };
        

    var xmlhttp = new XMLHttpRequest();
    var dataURL = "../../text/Malakas_Maganda.json";
    var storyObj = null;
    
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) 
      {
        //get data from json
        storyObj = JSON.parse(this.responseText);
          
        //build story viwer functionality and pass in page data
        StoryViewer(storyObj);
      }
    };
    xmlhttp.open("GET", dataURL);
    xmlhttp.send();
    
    //add hover

});
