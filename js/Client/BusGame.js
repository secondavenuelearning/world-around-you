import 'style/BusGame.css!';
import html from 'html/Client/BusGame.html!text';
import BusGame from 'js/Client/BusGame_Game.js';
import header from 'html/Client/BusGame_Header.html!text';

//sort of an enumaerator- nothing to contain but given strict options
var screens =
    {
        MainMenu: 0,
        HowTo: 1,
        Game: 2,
        Win: 3
    };
var currentScreen = screens.Game;


$(document).ready(function () {
    //update main section of page
    $('header').html(header);
    $('main').html(html);

    var xmlhttp = new XMLHttpRequest();
    var dataURL = "../../text/Malakas_Maganda.json";
    var storyObj = null;
    
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) 
      {
        //get data from json
        storyObj = JSON.parse(this.responseText);
          
        //build story viwer functionality and pass in page data
        //BusGame(storyObj, "fsl_luzon", "English");
      }
    };
    xmlhttp.open("GET", dataURL);
    xmlhttp.send();
});
