import 'style/BusGame.css!';
import html from 'html/Client/BusGame_Title.html!text';
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

function createCountList(terms){
    var values = terms.length;
    var order = [];
    if((values % 3)==2){
         for(var x = 0; x<Math.floor(values/3); x++ ){
            order.push(3);
        }
        order.push(2);
    }
    else if((values % 3)==1){
         for(var x = 0; x<Math.floor(values/3); x++ ){
            order.push(3);
        }
        order[order.length-1] = 2;
        order.push(2);
    }
    else if((values % 3)==0){
        for(var x = 0; x<Math.floor(values/3); x++ ){
            order.push(3);
        }
    }
    console.log(order);
}
$(document).ready(function () {
    //update main section of page
    $('header').html(header);
    $('main').html(html);
    var play = document.getElementById("playButton");
    play.onclick = function(){
        BusGame(storyObj, "fsl_luzon", "English");
    };
    var xmlhttp = new XMLHttpRequest();
    var dataURL = "../../text/Malakas_Maganda.json";
    var storyObj = null;
    var terms = [1,2,3,4,5,6,7,8,9];
    createCountList(terms);
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) 
      {
        //get data from json
        storyObj = JSON.parse(this.responseText);
          
        //build story viwer functionality and pass in page data
     //   BusGame(storyObj, "fsl_luzon", "English");
      }
    };
    xmlhttp.open("GET", dataURL);
    xmlhttp.send();
});
