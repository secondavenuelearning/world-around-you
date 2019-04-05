import 'style/BusGame.css!';
import html from 'html/Client/BusGame_Title.html!text';
import BusGame from 'js/Client/BusGame_Game.js';
import header from 'html/Client/BusGame_Header.html!text';
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
    var terms = ["world", "sea", "rain", "sky", "huge", "nowhere", "afterwards"];
    var storyObj = null;
        xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //get data from json
            storyObj = JSON.parse(this.responseText);
         
            //build story viwer functionality and pass in page data
          BusGame(storyObj, "fsl_luzon", "English", terms);
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
     $('main').html(html);
    $('main').css("background-image", "url(../img/games/BusGame/menubackground_BusGame-05.png)");
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
});
