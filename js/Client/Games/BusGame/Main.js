import 'style/Games/BusGame/Main.css!'; //css
import BusGame from 'js/Client/Games/BusGame/Game.js'; //js of actual game
import html from 'html/Client/Games/BusGame/Title.html!text'; // title page html
import header from 'html/Client/Games/BusGame/Header.html!text'; //header for this game
import instructions from 'html/Client/Games/BusGame/Directions.html!text'; //instructions page html

/*
Loads and runs actual game, updates button functionality for the game screen
*/
function initializeGameScene() {
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
        BusGame.Start(_game);
    }).catch((err) => {
        console.error(err);
    });
    
    //hookup button
    var backButton = document.getElementById("backBtn");
    backButton.onclick = function () {
        console.log("click");
        document.getElementById("score").remove();
        initializeTitle();
    }
    
    //cleanup
    if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function() {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        };
    }
}

/*
re-intializes title screen when moving to it from another screen like the game, or How To
*/
function initializeTitle() {
    //set html and background
    $('main').html(html);
    $('main').css("background-image", "url(../img/games/BusGame/menubackground_BusGame-05.png)");
    
    //hookup buttons
    var play = document.getElementById("playButton");
    play.onclick = function () {
       initializeGameScene();
    };
      var backButton = document.getElementById("backBtn");
    backButton.onclick = function () {
       window.location = "/stories"; //goto stories page
        //initializeTitle();
    };
       var instruction = document.getElementById("instructionsButton");
    instruction.onclick = function () {
       initializeInstructions();
    };
    
    //prep and run animation- but not on edge
    var busFrames = BusGame.GetImagesFromFolder("/img/games/BusGame/Buses/Bus_Green_Still/"); //get anim frames
     if(window.navigator.userAgent.indexOf("Edge") < 0) //check to make sure wer arent on Edge
     {
         //play bus animation
         BusGame.Animate("#busStop #bus", busFrames, null, false);
     }
 
}

/*
Sets up how-to screen. (Repalces html, and hooks up buttons)
*/
function initializeInstructions(){
    //replace main html with that of how to screen- and set BG
    $('main').html(instructions);
    $('main').css("background-image", "url(../img/games/BusGame/menubackground_BusGame-05.png)");
    
    //hookup buttons
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
    //update main section of page
    $('header').html(header);
    $('main').html(html);
    
    //hookup buttons
    var play = document.getElementById("playButton");
    play.onclick = function () {
        initializeGameScene();
    };
    
    var instruction = document.getElementById("instructionsButton");
    instruction.onclick = function () {
       initializeInstructions();
    };
    
    var backButton = document.getElementById("backBtn");
    backButton.onclick = function () {
       window.location = "/stories"; //goto stories page
        //initializeTitle();
    };
    
    //prep and run animation- but not on edge
    var busFrames = BusGame.GetImagesFromFolder("/img/games/BusGame/Buses/Bus_Green_Still/"); //get anim frames
     if(window.navigator.userAgent.indexOf("Edge") < 0) //check to make sure wer arent on Edge
     {
         //play bus animation
         BusGame.Animate("#busStop #bus", busFrames, null, false);
     }
 
   
});
