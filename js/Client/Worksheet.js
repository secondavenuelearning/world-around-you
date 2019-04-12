import 'style/PlantGame.css!';
import html from 'html/Client/PlantGame.html!text';
import Game from 'js/Client/Worksheet_Game.js';
import header from 'html/Client/PlantGame_Header.html!text';
import instructions from 'html/Client/PlantGame_Instructions.html!text';
import flowerbedHtml from 'html/Client/PlantGame_Game_FlowerBed.html!text';

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
var busFrames = Game.GetImagesFromFolder("/img/games/Worksheet/TitleScreen_Animation/");
function initializeGameScene() {
      window.cancelAnimationFrame(anim);
     var xmlhttp = new XMLHttpRequest();
    var dataURL = "../../text/Malakas_Maganda.json";
    var gameData = {
        name: "Test Data",
        sentences: 
        [
            {
                Term: "world",
                Sentence: ["The whole entire", "is flat."]
            },
            {
                Term: "sea",
                Sentence: ["California finally slipped into the", "."]
            },
            {
                Term: "rain",
                Sentence: ["", ",sleet or snow, we are open."]
            },
            {
                Term: "sky",
                Sentence: ["The", "is falling!!"]
            },
            {
                Term: "huge",
                Sentence: ["The bottom of the ocean is so", "; its terrifying."]
            },
            {
                Term: "nowhere",
                Sentence: ["Where you from? Asked the stranger.", "I replied."]
            },
            {
                Term: "afterwards",
                Sentence: ["I need to get a Bruins jersey, and hamilton tickets, and maybe a show", "."]
            }  

        ]
    }
    var storyObj = null;
        xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //get data from json
            storyObj = JSON.parse(this.responseText);
         
            //build story viwer functionality and pass in page data
          Game.Start(storyObj, "fsl_luzon", "English", gameData);
        }
    };
    xmlhttp.open("GET", dataURL);
    xmlhttp.send();
    console.log(anim);
  
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
    //$('main').css("background-image", "url(../img/games/BusGame/menubackground_BusGame-05.png)");
    anim = window.requestAnimationFrame(function (timestamp){
        Game.Animate("#wall", busFrames, null, false);
    });
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
    anim = window.requestAnimationFrame(function (timestamp){
        Game.Animate("#wall", busFrames, null, false);
    });
   
   
});
