import 'style/Games/BusGame/Main.css!';
import BusGame from 'js/Client/Games/BusGame/Game.js';
import html from 'html/Client/Games/BusGame/Title.html!text';
import header from 'html/Client/Games/BusGame/Header.html!text';
import instructions from 'html/Client/Games/BusGame/Directions.html!text';

//sort of an enumaerator- nothing to contain but given strict options
var screens = {
    MainMenu: 0,
    HowTo: 1,
    Game: 2,
    Win: 3
};
var currentScreen = screens.Game;

function initializeGameScene() {
    
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
    
    var backButton = document.getElementById("backBtn");
    backButton.onclick = function () {
        console.log("click");
        document.getElementById("score").remove();
        initializeTitle();
    }
    if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
}

function initializeTitle() {
    //set html
     $('main').html(html);
    $('main').css("background-image", "url(../img/games/BusGame/menubackground_BusGame-05.png)");
    
    //hookup buttons
    var play = document.getElementById("playButton");
    play.onclick = function () {
       initializeGameScene();
    };
      var backButton = document.getElementById("backBtn");
    backButton.onclick = function () {
       window.location = "/stories";
        //initializeTitle();
    };
       var instruction = document.getElementById("instructionsButton");
    instruction.onclick = function () {
       initializeInstructions();
    };
    
    //prep and run animations
    var busFrames = BusGame.GetImagesFromFolder("/img/games/BusGame/Buses/Bus_Green_Still/");
     if(window.navigator.userAgent.indexOf("Edge") > -1){
       
       }
    else{
         BusGame.Animate("#busStop #bus", busFrames, null, false);
    }
 
}
function initializeInstructions(){
    $('main').html(instructions);
    $('main').css("background-image", "url(../img/games/BusGame/menubackground_BusGame-05.png)");
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
$(document).ready(function () {
    //update main section of page
    $('header').html(header);
    $('main').html(html);
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
       window.location = "/stories";
        //initializeTitle();
    };
    
    //prep and run animations
    var busFrames = BusGame.GetImagesFromFolder("/img/games/BusGame/Buses/Bus_Green_Still/");
    if(window.navigator.userAgent.indexOf("Edge") > -1){
       
       }
    else{
         BusGame.Animate("#busStop #bus", busFrames, null, false);
    }
   
});
