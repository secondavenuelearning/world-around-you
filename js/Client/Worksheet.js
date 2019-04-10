import 'style/PlantGame.css!';
import html from 'html/Client/PlantGame.html!text';
import Game from 'js/Client/Worksheet_Game.js';
import header from 'html/Client/PlantGame_Header.html!text';
import instructions from 'html/Client/BusGame_Directions.html!text';

//sort of an enumaerator- nothing to contain but given strict options
var screens = {
    MainMenu: 0,
    HowTo: 1,
    Game: 2,
    Win: 3
};
var currentScreen = screens.Game;

function initializeGameScene() {
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
                Sentence: ["", "Sleet or snow, we are open."]
            },
            {
                Term: "sky",
                Sentence: ["The sky", "is falling!!"]
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
                Sentence: ["I need to get a Bruins jersey, and hamilton tickets, and maybe a show", ". I dont know."]
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
    //$('main').css("background-image", "url(../img/games/BusGame/menubackground_BusGame-05.png)");
    
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
    
    //prep and run animations
   // var busFrames = BusGame.GetImagesFromFolder("/img/games/BusGame/Buses/Bus_Green_Still/");
   // BusGame.Animate("#busStop #bus", busFrames, null, false);
});
