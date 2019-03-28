import _ from 'underscore';
import ImageHoverSwap from 'js/Client/HelperFunctions.js';
export default BusGame

/* ----------------------- Global Variables ----------------------- */
var storyData;
var score = 0;
var firstClick = false;

var firstSelected;
var secondSelected;
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

var termList = []; //hard values for testing
var signLang;
var writtenLang;

var roundorder;
var round = 
[
    //round data will be structured as such:
    
    //  { 
    //    "term": mediaType
    //  },
    // --repeats 2x per term
    // --once for each mediaType ("vid" or "txt")
];

var stopAnimations = false; //bool for forcing animations to stop


/* ----------------------- Constructor ----------------------- */
export function BusGame(storyObj, sign, written, terms)
{
    //save story data to be globally acessable
    storyData = storyObj;
    signLang = sign;
    writtenLang = written;
    termList = terms;
    
    //define how many matches the user will need this round
    roundOrder = createCountList(termList);
    totalMatches = (termList.length); //number between 0 and 10
    
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

    
    //start first round
    NextRound();

    
    //animate
    //Animate("#bottom .car img", images.Cars.FacingRight[0]);
    //Animate("#bottom .bus img", images.Buses.FacingRight[1]);
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

function createCountList(terms) {
    var values = terms.length;
    var order = [];
    if ((values % 3) == 2) {
        for (var x = 0; x < Math.floor(values / 3); x++) {
            order.push(3);
        }
        order.push(2);
    } else if ((values % 3) == 1) {
        for (var x = 0; x < Math.floor(values / 3); x++) {
            order.push(3);
        }
        order[order.length - 1] = 2;
        order.push(2);
    } else if ((values % 3) == 0) {
        for (var x = 0; x < Math.floor(values / 3); x++) {
            order.push(3);
        }
    }
   
    return order;
}

function DefineRound(numTerms)
{
    //grab random terms from term list until we get the num needed this round
    for(var i = 0; i < numTerms; i++)
    {
        //get term
        var termIndex = Math.floor(Math.random() * termList.length);
        var term = termList[termIndex];
        
        //define term in round
        vid = { [term]: "vid"};
        txt = { [term]: "txt"};
        
        round.push(vid);
        round.push(txt);
        
        //remove term from master termlist so we dont get repeats
        termList.splice(termIndex, 1);
        console.log(termList);
    }
    
    //fill blank windows
    if(numTerms < 3) //will always be 2 if not 3
    {
        round.push({BlankFillerTerm: "none"});
        round.push({BlankFillerTerm: "none"});
    }
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
    
    /*update lane width
    var laneWidth = $(lane).width();
    laneWidth += 600;
    $(lane).css('width', laneWidth); //*/
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
            busHTML += "<div class = \"window  hidden first\">";
        }
        else if(dir == "FacingRight" && i === 2) //last widnow on facing right bus
        {
            busHTML += "<div class = \"window hidden last\">";
        }
        else //default
        {
            busHTML += "<div class = \"window hidden\">";
        }
        
        //get term and relvant data
        var randIndex = Math.floor(Math.random() * round.length); //random index of item
        var roundItem = round[randIndex]; //get item at index
        var term = Object.keys(roundItem); //should only be one so key is the term
        var mediaType = roundItem[term]; //media is value of the key(term)


        switch(mediaType)
        {

            case "txt": //term
                var id = term + "Txt";
                busHTML += "<span id = \"" + id + "\">" + term + "</span>"; 

            break;

            case "vid": //video
                var id = term + "Vid";
                var vidPath = "../../videos/Malakas_Maganda/fsl_luzon/1.mp4";
                busHTML += "<video id = \"" + id + "\" src =\"" + vidPath + "\" autoplay muted loop></video>";
            break;

            case "none": //no media
                busHTML += "<div id = \"none\"></div>";
            break;
        } 
        
        //remove used term from roundlist
        round.splice(randIndex, 1);
        
        busHTML += "</div>"; //close window div 
    }
    
    busHTML += "</div>"; //close windows div 
    busHTML += "</div>"; //close bus div
    
    //add bus to lane
    $(lane).append(busHTML);
    
    /*update lane width
    var laneWidth = $(lane).width();
    laneWidth += 1080;
    $(lane).css('width', laneWidth);//*/
}

function SetupWindowConnections(){
    var windows = document.getElementsByClassName("window");
    console.log(windows[0]);
    for(var x  = 0; x < windows.length; x++){
        windows[x].onclick = function(e) 
        {
            if(firstClick == false){
                console.log("first");
                firstSelected = e.target.parentElement;
                console.log(e.target.parentElement);
                firstClick = true;
                firstSelected.classList.remove("hidden");
            }
            else if(firstClick==true){
                secondSelected = e.target.parentElement;
                  console.log(firstSelected.firstChild.id);
                if(firstSelected.firstChild.id.substr(0,firstSelected.firstChild.id.length-3) == secondSelected.firstChild.id.substr(0,secondSelected.firstChild.id.length-3)){
                    secondSelected.classList.remove("hidden");
                   
                    firstClick = false;
                    if(firstSelected.firstChild.id == "none"){
                        
                    }
                    else{
                              score++;
                    document.getElementById("current").innerHTML = score;
                    }
                     secondSelected = null;
                    firstSelected = null;
              
                }
                else{
                    firstSelected.classList.add("hidden");
                    firstClick = false;
                }
               
              
            }
           
        }
    }
}

/* ----------------------- Game Loop ----------------------- */
function NextRound()
{
    //generate round data
    var randIndex = Math.floor(Math.random() * roundOrder.length);
    var roundLength = roundOrder[randIndex];
    DefineRound(roundLength);
    roundOrder.splice(randIndex, 1);
    
    //builds vehicles for this round
    BuildCar("FacingLeft", "#top .inner");
    BuildBus("FacingLeft", "#top .inner"); //buses hold terms
    BuildBus("FacingRight", "#bottom .inner"); //buses hold terms
    BuildCar("FacingRight", "#bottom .inner");
    SetupWindowConnections();
    //add looping to the video
    var vids = $(".window video").toArray();
    vids.forEach(function(vid)
    {
        //get term
        var term = vid.id.toString();
        term = term.substring(0, term.length - 3); //remove "Vid" from id to just get term
        console.log(term);
        
        //get term data
         var termData = storyData[1].glossary;
        termData = termData[writtenLang];
        termData = termData[term].video;
        termData = termData[signLang];
        
        
        //add looping
        LoopVideoClip(vid.id, termData.start, termData.end);
    });
}

/* ----------------------- Helper Functions ----------------------- */
function LoopVideoClip(videoID, start, end)
{
    var videoContainer = document.getElementById(videoID)
    videoContainer.src += "#t="+start+","+end;
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

function Animate(imgId, frames)
{
    //set rate
    var rate = setInterval(nextFrame, 60);
    var frame = 0;
    
    function nextFrame()
    {
        if(frame >= 59)
        {
            frame = 0;
        }
        else if(stopAnimations)
        {
            clearInterval(rate);
        }
        else
        {
            //change source of img to next frame
            frame++;
            
            $(imgId)[0].src = frames[frame];
        }
    }
}