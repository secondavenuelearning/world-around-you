import 'style/Games/SentenceGame/Main.css!'; //css
import html from 'html/Client/Games/SentenceGame/Main.html!text'; //this pages html
import Worksheet from 'js/Client/Games/SentenceGame/Game.js'; //the html for the actual game
import header from 'html/Client/Games/SentenceGame/Header.html!text'; //header bar html - score, notifcations, and back button
import instructions from 'html/Client/Games/SentenceGame/Directions.html!text'; //instructions page html
import flowerbedHtml from 'html/Client/Games/SentenceGame/Footer.html!text'; //footer html- holds background, and flower objects for game. Shows repalced just BG for title screen

var frames = []; //array of animation frames for title screen- filled by docuemnt.ready func

/*
Loads and runs actual game, updates button functionality for the game screen
*/
function initializeGameScene() {
    //remove class from wall so animation stops
    $(".titleWall").removeClass("titleWall");
    
    //get game data (unless we already have it) and run game
     new Promise((resolve, reject) => {
        if(game){
            resolve(game);
        }
        else{
            $.ajax({
                method: 'get',
                url: `api/game/data?id=${urlParams.id}`
            }).done((_game) => {
                resolve(_game);
            }).catch((err) => {
                console.error(err);
            });
        }
    }).then((_game) => {
        //build story viwer functionality and pass in page data
        Worksheet.Start(_game);
    }).catch((err) => {
        console.error(err);
    });
  
    //get back button and hookup functinoality (brings user back to title page)
    var backButton = document.getElementById("backBtn");
    backButton.onclick = function () {
        console.log("click");
       
        initializeTitle();
    }
    
    //clear items
    if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function() {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        };
    }
    
    //make score visible
    var score = document.getElementById("score");
    score.style.display = "block";
}

/*
re-intializes title screen when moving to it from another screen like the game, or How To
*/
function initializeTitle() {
    //set html
    $('main').html(html);
    $('footer').html(flowerbedHtml);
    
    //give wall a class to animate on- so it can ebr emoved and animation stops when not on this screen
    $("#wall").addClass("titleWall");
    Worksheet.Animate(".titleWall", frames, null, false); //use Game.js' animate function
    
    //hide score! we dont need it here
    var score = document.getElementById("score");
    score.style.display = "none";
    
    //hookup buttons
    var play = document.getElementById("playButton");
    play.onclick = function () {
       initializeGameScene();
    };
      var backButton = document.getElementById("backBtn");
    backButton.onclick = function () {
        console.log("click");
        window.location = "/stories";
    };
       var instruction = document.getElementById("instructionsButton");
    instruction.onclick = function () {
       initializeInstructions();
    };
}

/*
Sets up how-to screen. (Repalces html, and hooks up buttons)
*/
function initializeInstructions(){
    ///replace main html with that of how to screen
    $('main').html(instructions);
    
   //hook up buttons
    var backButton = document.getElementById("backBtn");
    backButton.onclick = function () {
        console.log("click");
        initializeTitle();
    };
     var play = document.getElementById("playButton");
    play.onclick = function () {
       initializeGameScene();
    };
}

/*
Entry point! This func is essentially intializeTitle() but run whent he page is first opened, plus a few minor differences. 
tldr; Intializes title screen
*/
$(document).ready(function () {
    //update html for entire page
    $('header').html(header);
    $('main').html(html);
    $('footer').html(flowerbedHtml);
    
    //hookup buttons
   var play = document.getElementById("playButton");
        play.onclick = function () {
            initializeGameScene();
        };
    
    var instruction = document.getElementById("instructionsButton");
    instruction.onclick = function () {
       initializeInstructions();
    };
    
    var backButton = document.getElementById("backBtn"); //goes back to stories page
    backButton.onclick = function () {
        window.location = "/stories";
    };
    
    //hide score- it was loaded w/ header but not needed on menu pages
    var score = document.getElementById("score");
    score.style.display = "none";
    
    //prep and run animations
    frames = Worksheet.GetImagesFromFolder("/img/games/Worksheet/TitleScreen_Animation/"); //use Game.js' function to get the frames used for title/menu screen Background animation
    $("#wall").addClass("titleWall");
    Worksheet.Animate(".titleWall", frames, null, false); 
});
