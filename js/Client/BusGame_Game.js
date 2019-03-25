import _ from 'underscore';
import ImageHoverSwap from 'js/Client/HelperFunctions.js';
export default BusGame

/* ----------------------- Global Variables ----------------------- */
var storyData;
var score = 0;
var totalMatches;
var images = 
    {
        Cars: 
        {
            FacingRight:
            [
            "../../img/games/BusGame/Cars/car_blue_facingRight.png",
            "../../img/games/BusGame/Cars/car_darkBlue_facingRight.png",
            "../../img/games/BusGame/Cars/car_red_facingRight.png"
            ],
            
            FacingLeft:
            [
                "../../img/games/BusGame/Cars/car_grey_facingLeft.png",
                "../../img/games/BusGame/Cars/car_teal_facingLeft.png",
                "../../img/games/BusGame/Cars/car_yellow_facingLeft.png"
            ]
        },
        
        Buses: 
        {
            FacingRight:
            [
            "../../img/games/BusGame/Buses/bus_green_facingRight.png",
            "../../img/games/BusGame/Buses/bus_yellow_facingRight.png",
            ],
            
            FacingLeft:
            [
                "../../img/games/BusGame/Buses/bus_blue_facingLeft.png",
                "../../img/games/BusGame/Buses/bus_red_facingLeft.png",
            ]
        }
    };


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
    BuildCar("FacingLeft", "#top .inner");
    BuildBus("FacingLeft", "#top .inner");
    BuildCar("FacingLeft", "#top .inner");
    BuildCar("FacingLeft", "#top .inner");
    BuildBus("FacingLeft", "#top .inner");
    BuildCar("FacingLeft", "#top .inner");
    BuildCar("FacingLeft", "#top .inner");
    BuildBus("FacingLeft", "#top .inner");
    BuildCar("FacingLeft", "#top .inner");
    BuildCar("FacingLeft", "#top .inner");
    BuildBus("FacingLeft", "#top .inner");
    BuildCar("FacingLeft", "#top .inner");
    
    BuildCar("FacingRight", "#bottom .inner");
    BuildBus("FacingRight", "#bottom .inner");
    BuildCar("FacingRight", "#bottom .inner");
    BuildCar("FacingRight", "#bottom .inner");
    BuildCar("FacingRight", "#bottom .inner");
    BuildCar("FacingRight", "#bottom .inner");
    BuildBus("FacingRight", "#bottom .inner");
    BuildBus("FacingRight", "#bottom .inner");
    BuildCar("FacingRight", "#bottom .inner");
    BuildCar("FacingRight", "#bottom .inner");
    BuildBus("FacingRight", "#bottom .inner");
    BuildCar("FacingRight", "#bottom .inner");
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
    var laneHTML = "<div id=\"top\" class=\"lane\"><div class = \"inner\"></div></div>";
    laneHTML += "<div id=\"bottom\" class=\"lane\"><div class = \"inner\"></div></div>";
    
    //replace main with the lanes
    $('main').html(laneHTML);
}

function BuildCar(dir, lane)
{
    //chose image to use for car
    var car = images.Cars[dir]; //get cars at the proper facing dir
    car = car[Math.floor(Math.random() * (car.length))]; //get random car from the array
    
    //build car html
    var carHTML = "<div class = \"car\">";
    carHTML += "<img src = \"" + car + "\">"
    carHTML += "</div>";
    
    //add car to lane
    $(lane).append(carHTML);
}

function BuildBus(dir, lane)
{
    //chose image to use for bus
    var bus = images.Buses[dir]; //get cars at the proper facing dir
    bus = bus[Math.floor(Math.random() * (bus.length))]; //get random car from the array
    
    //build car html
    var busHTML = "<div class = \"bus\">";
    busHTML += "<img src = \"" + bus + "\">"
    busHTML += "</div>";
    
    //add car to lane
    $(lane).append(busHTML);
}

/* ----------------------- Game Loop ----------------------- */

