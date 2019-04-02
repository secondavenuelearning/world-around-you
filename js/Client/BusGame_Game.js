import _ from 'underscore';
import html from 'html/Client/BusGame_Win.html!text';
import gameHtml from 'html/Client/BusGame_Game.html!text';
import ImageHoverSwap from 'js/Client/HelperFunctions.js';
export default BusGame

/* ----------------------- Global Variables ----------------------- */
var template = _.template(gameHtml);
var templateData = {};

var storyData;
var score = 0;
var lastRoundScore = 0;
var firstClick = false;

var firstSelected;
var secondSelected;
var totalMatches;

var termList = []; //hard values for testing
var termMap = {};
var signLang;
var writtenLang;

var roundOrder;
var roundTotalMatches = 0;
var round = 
[
    //round data will be structured as such:
    
    //  { 
    //    [term]: mediaType
    //  },
    // --repeats 2x per term
    // --once for each mediaType ("vid" or "txt")
    // >>>Data removed from this array once parsed into html objects
];

var activeAnimations = [];
var animTags = 
[
    //anim tags structure:
    
    //  {
    //     [id]:framesArray,
    //     [id]:framesArray
    //  }
    // --repeats
];
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

//game state machine
var state =
{
    Loading: 0,
    Start: 1,
    Playing: 2,
    End: 3,
    Win: 4
}
var gameState = state.Playing;


/* ----------------------- Constructor ----------------------- */
export function BusGame(storyObj, sign, written, terms)
{
    //save story data to be globally acessable
    storyData = storyObj;
    signLang = sign;
    writtenLang = written;
    termList = terms;
    
    //define how many matches the user will each round
    roundOrder = createCountList(termList);
    totalMatches = (termList.length); //number between 0 and 10
    
    //figure out hwre each term is in the story data
    termMap = MapTermsToPages(terms.slice(0));
    
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
    
    
    NextRound(true);
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
                files.push(preloadImage(path));
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
    }
    
    //fill blank windows
    if(numTerms < 3) //will always be 2 if not 3
    {
        round.push({BlankFillerTerm: "none"});
        round.push({BlankFillerTerm: "none"});
    }
}

function MapTermsToPages(terms)
{
    var mapped = {};
    
    //loop pages of story data and look for terms - start form 1 to ignore title page
    for(var page = 1; page < Object.keys(storyData).length; page++)
    {
        //get current glossary in current lang
        var glossary = storyData[page].glossary[writtenLang];
        
        var termsLeft = terms;
        
        //loop through glossary terms
        Object.keys(glossary).forEach(function(term)
        {
            //compare to terms in the game
            for(var i = 0; i < terms.length; i++)
            {
                //compare glossary term to term at i
                if(term == terms[i])
                {
                    //they match! - remove from terms left and add to the term map
                    termsLeft.splice(i, 1);
                    mapped[term] = page;
                }
            }
        });
        
        //update terms
        terms = termsLeft;
    }
    
    return mapped;
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

function BuildWindows()
{
    var windowsHTML = [];
    
    //add html for each window
    for(var i = 0; i < 3; i++)
    {
        //get term and relvant data
        var randIndex = Math.floor(Math.random() * round.length); //random index of item
        var roundItem = round[randIndex]; //get item at index
        var term = Object.keys(roundItem); //should only be one so key is the term
        var mediaType = roundItem[term]; //media is value of the key(term)

        var windowHTML = "";
        switch(mediaType)
        {

            case "txt": //term
                var id = term + "Txt";
                windowHTML += "<span id = \"" + id + "\">" + term + "</span>"; 

            break;

            case "vid": //video
                var id = term + "Vid";
                var vidPath = storyData[termMap[term]].video[signLang];
                windowHTML += "<video id = \"" + id + "\" src =\"" + vidPath + "\" autoplay muted loop></video>";
            break;

            case "none": //no media
                windowHTML += "<div id = \"none\"></div>";
            break;
        } 
        
        //remove used term from roundlist
        round.splice(randIndex, 1);
        
        windowsHTML.push(windowHTML);
    }
    
    return windowsHTML;
}

function SetupWindowConnections(){
    var windows = document.getElementsByClassName("window");
    for(var x  = 0; x < windows.length; x++){
        windows[x].onclick = function(e) 
        {
            if(firstClick == false){
                firstSelected = e.target.parentElement;
                firstClick = true;
                firstSelected.classList.remove("hidden");
            }
            else if(firstClick==true){
                secondSelected = e.target.parentElement;
                if(firstSelected.firstChild.id.substr(0,firstSelected.firstChild.id.length-3) == secondSelected.firstChild.id.substr(0,secondSelected.firstChild.id.length-3)){
                    secondSelected.classList.remove("hidden");
                   
                    firstClick = false;
                    if(firstSelected.firstChild.id == "none"){
                        
                    }
                    else{
                        var checkImages = GetImagesFromFolder("/img/games/BusGame/CheckmarkAnimation/Frames/");
                     var blank = new Image();
                      
                        checkImages.push(blank);
                        Animate("#checkMarkImage", checkImages, null, true);
                              score++;
                    document.getElementById("current").innerHTML = score;
                        
                        //check win state
                        if(score === totalMatches)
                        {
                            gameState = state.Win;
                            RoundEndTransition() 
                        }
                        else if(score === roundTotalMatches + lastRoundScore)
                        {
                            //goto next round
                            RoundEndTransition();
                        }
                        
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
function NextRound(firstRun = false)
{
    //check fi this has already been doen this round
    if(roundTotalMatches === 0)
    {
        //generate round data
        var randIndex = Math.floor(Math.random() * roundOrder.length);
        var roundLength = roundOrder[randIndex];
        roundTotalMatches = roundLength;
        lastRoundScore = score;
        DefineRound(roundLength);
        roundOrder.splice(randIndex, 1);

        //update html of page form template
        templateData =
        {
            Top:
            {
                Bus: 
                {
                    Frames: ChooseRandomArrayElement(images.Buses.FacingLeft),
                    Current: 0
                },
                Car:
                {
                    Frames: ChooseRandomArrayElement(images.Cars.FacingLeft),
                    Current: 0
                },
                Windows: BuildWindows()
            },
            Bottom:
            {
                Bus: 
                {
                    Frames: ChooseRandomArrayElement(images.Buses.FacingRight),
                    Current: 0
                },
                Car:
                {
                    Frames: ChooseRandomArrayElement(images.Cars.FacingRight),
                    Current: 0
                },
                Windows: BuildWindows()
            }
        };
        var main = template(templateData);

        if(firstRun)
        { console.log("first run");
            this.$main = $(main);
            $('main').html(this.$main);
        }
        

        //add clicking mechnaic functionality to windows
        SetupWindowConnections();
        
        //add looping to the video
        var vids = $(".window video").toArray();
        vids.forEach(function(vid)
        {
            //get term
            var term = vid.id.toString();
            term = term.substring(0, term.length - 3); //remove "Vid" from id to just get term

            //get term data
             var termData = storyData[termMap[term]].glossary;
            termData = termData[writtenLang];
            termData = termData[term].video;
            termData = termData[signLang];


            //add looping
            LoopVideoClip(vid.id, termData.start, termData.end);
        });
    }
}

function RoundEndTransition()
{
     var animID = window.requestAnimationFrame(function(timestamp)
    {
         //animate cars
        Animate("#bottom .bus img", templateData.Bottom.Bus.Frames, null, false);
        Animate("#top .bus img", templateData.Top.Bus.Frames, null, false);
        Animate("#bottom .car img", templateData.Bottom.Car.Frames, null, false);
        Animate("#top .car img", templateData.Top.Car.Frames, null,false);
         
         //move cars
        Move(timestamp, '#bottom .vehicle', null, "Right", 0, screen.width);
        Move(timestamp, '#top .vehicle', null, "Left", 0, (screen.width * -1));
    });
    
    activeAnimations.push(animID);
}

function RoundStartTransition()
{
    //move vehicles off screen on proper side so they can drive in
    $('#bottom .vehicle').css('left', (screen.width * -1) + 'px');
    $('#top .vehicle').css('left', screen.width + 'px');
    
    //animate and move vehicles back on screen
     var animID = window.requestAnimationFrame(function(timestamp)
    {
         //animate cars
        Animate("#bottom .bus img", templateData.Bottom.Bus.Frames, null,false);
        Animate("#top .bus img", templateData.Top.Bus.Frames, null,false);
        Animate("#bottom .car img", templateData.Bottom.Car.Frames, null,false);
        Animate("#top .car img", templateData.Top.Car.Frames, null,false);

         //move cars
        Move(timestamp, '#bottom .vehicle', null, "Right", (screen.width * -1), (screen.width + 20));
        Move(timestamp, '#top .vehicle', null, "Left", (screen.width), ((screen.width + 10) * -1));
    });
    
    activeAnimations.push(animID);
}

function WinScreen()
{
    //change to win screen
    $('main').html(html);

    //clear data of this script
    storyData = null;
    score = 0;
    firstClick = false;

    firstSelected = null;
    secondSelected = null;
    totalMatches = null;
    roundTotalMatches = 0;
    images = 
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

    termList = []; //hard values for testing
    signLang = null;
    writtenLang = null;

    roundorder = null;
    round = [];

}


/* ----------------------- Animation ----------------------- */
function Move(timestamp, id, start, dir, startPos, endPos)
{   
    //get all vehciles of this type
    var vehicles = $(id).toArray();
    
    vehicles.forEach(function(vehicle)
    { 
        if(!start && vehicle.style.left != "") 
        {
            startPos = vehicle.style.left;
            startPos = parseFloat(startPos);
        }
     });
    
    //use timestamp to step through the move positions
    if(!start) 
    {   
        //save start time
        start = timestamp;
    }
    var pos = timestamp - start;
    
    var atEnd = pos > endPos; //check for end of movement path
    
    //alter for left
    if(dir === "Left") 
    {
        pos = pos * -1;//invert pos for moving left instead of right
        atEnd = pos < endPos;
    }
    
    if (!atEnd) 
    {
        vehicles.forEach(function(vehicle)
        {  
            vehicle.style.left = startPos + pos + 'px';
        });
        
        window.requestAnimationFrame(function(timestamp)
        {
            Move(timestamp, id, start, dir, startPos, endPos);
        });
    }
    else
    {
        if(activeAnimations.length > 0)
        { console.log("move end");
         
            cancelAnimationFrame(activeAnimations[0]);
            activeAnimations.pop();

            switch(gameState)
            {
                case state.Start:
                    //chnage state for next run
                    gameState = state.Playing;

                    //run code
                    //RoundStartTransition();
                    
                break

                case state.Playing:
                    //change state
                    gameState = state.End;

                    //run script
                    RoundEndTransition();
                break;

                case state.End:
                    //chnage state
                    gameState = state.Start;
                    
                    //clear round matches - so a NextRound() is only called once
                    roundTotalMatches = 0;
         

                    //run code
                    NextRound(true);
                    RoundStartTransition();
                break;
                    
                case state.Win:
                    //goto win screen and clear as much data as possible
                    WinScreen();
                break;
            }
        }
        
        
    }

}

function Animate(id, frames, frame, noLoop)
{
    if(((activeAnimations.length > 0)&& !noLoop && (frame < frames.length-1)) || (noLoop && (frame < frames.length-1)))
    {
        window.requestAnimationFrame(function(timestamp)
        {
            Animate(id, frames, frame, noLoop);
        });

        if(!frame) frame = 0;

        var vImgs = $(id).toArray();

        //update animation
        vImgs.forEach(function(img)
        {
            frame = (frame + 1) % frames.length;
            img.src = frames[frame].src;
        });
    }
}
    

/* ----------------------- Helper Functions ----------------------- */
function ChooseRandomArrayElement(options)
{
    //chose image to use for bus
    var selected = options[Math.floor(Math.random() * (options.length))]; 
    return selected;
}

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

//thanks: https://stackoverflow.com/questions/3646036/javascript-preloading-images
function preloadImage(url)
{
    var img=new Image();
    img.src=url;
    
    return img;
}