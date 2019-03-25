import _ from 'underscore';
import ImageHoverSwap from 'js/Client/HelperFunctions.js';
export default BusGame

/* ----------------------- Global Variables ----------------------- */
var storyData;
var score = 0;
var totalMatches;


/* ----------------------- Constructor ----------------------- */
export function BusGame(storyObj, signLang, writtenLang)
{
    //save story data to be globally acessable
    storyData = storyObj;
    
    //define how many matches the user will need this round
    totalMatches = (Math.floor(Math.random() * 10) + 1); //number between 0 and 10
    
    //add score area to header
    ExtendHeader();
    
    //build out lanes and add cars
    BuildLanes();
}

/* ----------------------- Data parsing ----------------------- */


/* ----------------------- Building Objects ----------------------- */
function ExtendHeader()
{
    //create html for score area
    var scoreHTML = "<button id = \"score\">";
    scoreHTML += "<span id=\"current\"></span>";
    scoreHTML += "<span id=\"total\"></span>";
    scoreHTML += "</button>";
    
    //update header html
    $('header').append(scoreHTML);
    
    //set score numbers
    $('header #current').text(score);
    $('header #total').text("/" + totalMatches);
}

function BuildLanes()
{
    //build html
    var laneHTML = "<div id=\"top\" class=\"lane\"></div>";
    laneHTML += "<div id=\"bottom\" class=\"lane\"></div>";
    
    //replace main with the lanes
    $('main').html(laneHTML);
}

function BuildCar()
{
    
}

/* ----------------------- Game Loop ----------------------- */

