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
            FacingRight: [],
            FacingLeft: []
        },
        
        Buses: 
        {
            FacingRight: [],
            FacingLeft: []
        }
    };

var termList = ["world", "sea", "sky", "huge"]; //hard values for testing
var signLang;
var writtenLang;


/* ----------------------- Constructor ----------------------- */
export function BusGame(storyObj, sign, written)
{
    //save story data to be globally acessable
    storyData = storyObj;
    signLang = sign;
    writtenLang = written;
    
    //define how many matches the user will need this round
    totalMatches = (Math.floor(Math.random() * 10) + 1); //number between 0 and 10
    
    //add score area to header
    ExtendHeader();
    
    //get all car and bus images
    images.Buses.FacingLeft.push(GetImagesFromFolder("/img/games/BusGame/Buses/Bus_Blue_Animation_Left/Frames/"));
    images.Buses.FacingLeft.push(GetImagesFromFolder("/img/games/BusGame/Buses/Bus_Red_Animation_Left/Frames/"));
    images.Buses.FacingRight.push(GetImagesFromFolder("/img/games/BusGame/Buses/Bus_Green_Animation_Right/Frames/"));
    images.Buses.FacingRight.push(GetImagesFromFolder("/img/games/BusGame/Buses/Bus_Yellow_Animation_Right/Frames/"));
    
    images.Cars.FacingLeft.push(GetImagesFromFolder("/img/games/BusGame/Cars/Car_Grey_Animation_Left/Frames/"));
    images.Cars.FacingLeft.push(GetImagesFromFolder("/img/games/BusGame/Cars/Car_Teal_Animation_Left/Frames/"));
    images.Cars.FacingLeft.push(GetImagesFromFolder("/img/games/BusGame/Cars/Car_Yellow_Animation_Left/Frames/"));
    images.Cars.FacingRight.push(GetImagesFromFolder("/img/games/BusGame/Cars/Car_Red_Animation_Right/Frames/"));
    images.Cars.FacingRight.push(GetImagesFromFolder("/img/games/BusGame/Cars/Car_DarkBlue_Animation_Right/Frames/"));
    images.Cars.FacingRight.push(GetImagesFromFolder("/img/games/BusGame/Cars/Car_Blue_Animation_Right/Frames/"));
    
    
    
    
    //build out lanes and add cars
    BuildLanes();
    BuildBus("FacingLeft", "#top .inner");
    BuildBus("FacingRight", "#bottom .inner");
    BuildCar("FacingLeft", "#top .inner");
    BuildCar("FacingRight", "#bottom .inner");
    /*
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
    BuildCar("FacingRight", "#bottom .inner");*/
    
    //add looping to the video
    var termData = storyData[1].glossary;
    termData = termData[writtenLang];
    
    var vids = $(".window video").get();
    var vidIds = [];
    vids.forEach(function(vid)
    {
        //get term
        var term = vid.id.toString();
        term = term.substring(0, term.length - 4);
        
        //add looping
        LoopVideoClip(vid.id, )
    });
}

/* ----------------------- Data parsing ----------------------- */
function GetImagesFromFolder(folder)
{
    var files = [];
    
    $.ajax({
        url : folder,
        async: false, //to ensure all data points have been added before we continue
        success: function (data) {
            
            data.forEach(function(datapoint)
            {
                var path = "../.." + folder.toString() + "" + datapoint.toString();
                files.push(path);
            }); 
        }
    });
    return files;
}



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
    car = car[0];
    
    //build car html
    var carHTML = "<div class = \"vehicle car\">";
    carHTML += "<img src = \"" + car + "\">"
    carHTML += "</div>";
    
    //add car to lane
    $(lane).append(carHTML);
    
    //update lane width
    var laneWidth = $(lane).width();
    laneWidth += 600;
    $(lane).css('width', laneWidth);
}

function BuildBus(dir, lane)
{
    //chose image to use for bus
    var bus = images.Buses[dir]; //get cars at the proper facing dir
    bus = bus[Math.floor(Math.random() * (bus.length))]; //get random car from array
    bus = bus[0]; //get first frame as the still photo
    
    //build car html
    var busHTML = "<div class = \"vehicle bus\">";
    busHTML += "<img src = \"" + bus + "\">";
    busHTML += "<div class = \"windows\">";
    
    //add html for each window
    for(var i = 0; i < 3; i++)
    {
        //build window - acount for extra spacing betwen special case windows
        if(dir == "FacingLeft" && i === 0) //first window on facing left bus
        {
            busHTML += "<div class = \"window first\">";
        }
        else if(dir == "FacingRight" && i === 2) //last widnow on facing right bus
        {
            busHTML += "<div class = \"window last\">";
        }
        else //default
        {
            busHTML += "<div class = \"window\">";
        }
        
        //get term and relvant data
        var term = termList[Math.floor(Math.random() * termList.length)];
        
        var mediaType = Math.floor(Math.random() * 3); // 0 - 3
        switch(mediaType)
        {
            case 0: //term
                var id = term + "Trm";
                busHTML += "<p><span id = \"" + id + "\">Huge</span></p>"; 
            break;

            case 1: //video
                var id = term + "Vid";
                var vidPath = "../../videos/Malakas_Maganda/fsl_luzon/1.mp4";
                busHTML += "<video id = \"" + id + "\" src =\"" + vidPath + "\" autoplay muted loop></video>";
            break;

            case 2: //no media
                busHTML += "<div></div>";
            break;
        } 
        
        busHTML += "</div>"; //close window div 
    }
    
    busHTML += "</div>"; //close windows div 
    busHTML += "</div>"; //close bus div
    
    //add bus to lane
    $(lane).append(busHTML);
    
    //update lane width
    var laneWidth = $(lane).width();
    laneWidth += 1080;
    $(lane).css('width', laneWidth);
}

/* ----------------------- Game Loop ----------------------- */

/* ----------------------- Helper Functions ----------------------- */
function LoopVideoClip(videoContainer, start, end)
{
    videoContainer.src = video + "#t="+start+","+end;
    videoContainer.addEventListener('loadedmetadata', function()
    {
        if(videoContainer.currentTime < start){
            videoContainer.currentTime = start;
        }
        videoContainer.ontimeupdate = function(){
            if(videoContainer.currentTime>=end){
                videoContainer.currentTime = start;
                videoContainer.play();

            }
        }
    }, false);
}