import 'style/Games/SentenceGame/Main.css!';
import html from 'html/Client/Games/SentenceGame/Main.html!text';
import Worksheet from 'js/Client/Games/SentenceGame/Game.js';
import header from 'html/Client/Games/SentenceGame/Header.html!text';
import instructions from 'html/Client/Games/SentenceGame/Directions.html!text';
import flowerbedHtml from 'html/Client/Games/SentenceGame/Footer.html!text';

//sort of an enumaerator- nothing to contain but given strict options
var screens = {
    MainMenu: 0,
    HowTo: 1,
    Game: 2,
    Win: 3
};
var currentScreen = screens.Game;
$('footer').html(flowerbedHtml);
var anim;
var busFrames = Worksheet.GetImagesFromFolder("/img/games/Worksheet/TitleScreen_Animation/");
function initializeGameScene() {
    $(".titleWall").removeClass("titleWall");
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
  
    var backButton = document.getElementById("backBtn");
    backButton.onclick = function () {
        console.log("click");
       
        initializeTitle();
    }
    if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
    var score = document.getElementById("score");
    score.style.display = "block";
}

function initializeTitle() {
    //set html
     $('main').html(html);
    $('footer').html(flowerbedHtml);
    
    $("#wall").addClass("titleWall");
    Worksheet.Animate(".titleWall", busFrames, null, false);
    
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
        initializeTitle();
    };
       var instruction = document.getElementById("instructionsButton");
    instruction.onclick = function () {
       initializeInstructions();
    };
    //prep and run animations
   // var busFrames = BusGame.GetImagesFromFolder("/img/games/BusGame/Buses/Bus_Green_Still/");
    //BusGame.Animate("#busStop #bus", busFrames, null, false);
}
function initializeInstructions(){
    $('main').html(instructions);
   // $('main').css("background-image", "url(../img/games/BusGame/menubackground_BusGame-05.png)");
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
      var score = document.getElementById("score");
    score.style.display = "none";
    
    //prep and run animations
    $("#wall").addClass("titleWall");
    Worksheet.Animate(".titleWall", busFrames, null, false);
   
   
});
