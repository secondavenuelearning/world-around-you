import _ from 'underscore';
import html from 'html/Client/Games/BusGame/Win.html!text'; //win screen html
import gameHtml from 'html/Client/Games/BusGame/Game.html!text'; //game itself html

export default { Start, GetImagesFromFolder, Animate} //export functions for use outside of this script

/* ----------------------- Global Variables ----------------------- */
//html template and its data object
var template = _.template(gameHtml);
var templateData = {};

//global story data accessor
var storyData;

//language info
var signLang;
var writtenLang;

//scoring
var score = 0;
var lastRoundScore = 0;

var totalMatches;
var roundTotalMatches = 0;

//clicking window mechanic
var firstClick = false;
var firstSelected; //first object lcicked that is proper
var secondSelected; //second object clicke dthat is proper

//round information
var termList = []; //list of terms
var termMap = {}; //terms mapped to the pages they are from in the story data

var roundOrder; //order in which terms will be broken up every round (ie 3, 3, 2, 2 if we have 10 terms)
var round = [
    //round data will be structured as such:

    //  { 
    //    [term]: mediaType
    //  },
    // --repeats 2x per term
    // --once for each mediaType ("vid" or "txt")
    
    // >>>Data removed from this array once parsed into html objects
];

//animation
var checkImages;
var activeAnimations = []; //used for moving anims in confjunction with round change logic
var images = {
    Cars: {
        FacingRight: [],
        FacingLeft: []
    },

    Buses: {
        FacingRight: [],
        FacingLeft: []
    },
    
    Waving: [],
    Star: [] //single array
};

//game state machine
var state = {
    Loading: 0,
    Start: 1,
    Playing: 2,
    End: 3,
    Win: 4
}
var gameState = state.Playing;


/* ----------------------- Constructor ----------------------- */
export function Start(game) {
    //resets all data - just in case returning tot he game from title after backing out of the game
    storyData = null;
    score = 0;
    firstClick = false;

    firstSelected = null;
    secondSelected = null;
    totalMatches = 9999999;
    roundTotalMatches = 0;
    images = {
        Cars: {
            FacingRight: [],
            FacingLeft: []
        },

        Buses: {
            FacingRight: [],
            FacingLeft: []
        },

        Waving: [],
    };

    roundorder = null;
    round = [];
    
    //save story data to be globally acessable
    storyData = game.story.data;
    
    //get selected languages
    signLang = game.signLanguage;
    writtenLang = game.writtenLanguage;
    
    //get list of terms
    termList = game.data.terms.slice(0);
    
    //minor cleanup
    if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function () {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        };
    }


    //define how many matches the user will need each round
    roundOrder = createCountList(termList.length);
    totalMatches = (termList.length); //number between 0 and 10

    //figure out where each term is in the story data
    let terms = JSON.parse(JSON.stringify(game.data.terms)); //list of terms
    termMap = MapTermsToPages(terms);

    //add score area to header
    ExtendHeader();


    //change mains bg image
    $('main').css("background-image", "url(../img/games/BusGame/background_BusGame-03.png)");


    //get animations
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
    
    //get waving animations
    images.Waving.push(GetImagesFromFolder("/img/games/BusGame/Waving/Waving_Animation1/Frames/"));
    if(window.navigator.userAgent.indexOf("Edge") < 0) //only laod these other waving variants if not on edge
    {
       images.Waving.push(GetImagesFromFolder("/img/games/BusGame/Waving/Waving_Animation2/Frames/"));
        images.Waving.push(GetImagesFromFolder("/img/games/BusGame/Waving/Waving_Animation3/Frames/"));
    }

   checkImages = GetImagesFromFolder("/img/games/BusGame/CheckmarkAnimation/Frames/");
   checkImages.push(new Image()); //extra blank frame so check images diapears after run
    
    //prep next round and run 
    NextRound();
}

/* ----------------------- Data parsing ----------------------- */
/*
Get all the image files names in the defined folder from the server, and returns them as Image Objects.
(folder: path to the requested folder to get images)
*/
function GetImagesFromFolder(folder) {
    var files = []; //array to save images
    
    //use ajax command to request file names from the server, and save as IMage objects
    $.ajax({
        url: folder,
        async: false, //to ensure all data points have been added before we continue
        success: function (data) {

            data.forEach(function (datapoint) { //each returned file name is datapoint
                var path = "../.." + folder.toString() + "" + datapoint.toString(); //build full string of the path to the image
                
                //create image object and ste its src tot eh apth
                var img = new Image();
                img.src = path;
                
                //save to out array
                files.push(img);
            });
        }
    });

    //give back allt he saved images
    return files;
}

/*
Returns an array of number of terms per round based on the total number of items (ie, 10 total items returns [3, 3, 2, 2])
*/
function createCountList(totalItems) {
    var order = [];
    if ((totalItems % 3) == 2) {
        for (var x = 0; x < Math.floor(totalItems / 3); x++) {
            order.push(3);
        }
        order.push(2);
    } else if ((totalItems % 3) == 1) {
        for (var x = 0; x < Math.floor(totalItems / 3); x++) {
            order.push(3);
        }
        order[order.length - 1] = 2;
        order.push(2);
    } else if ((totalItems % 3) == 0) {
        for (var x = 0; x < Math.floor(totalItems / 3); x++) {
            order.push(3);
        }
    }

    return order;
}

/*
Given a number of terms, fills "round" varible with IDs of videos and terms in a round. 
*/
function DefineRound(numTerms) {
    //grab random terms from term list until we get the num needed this round
    for (var i = 0; i < numTerms; i++) {
        //get term
        var termIndex = Math.floor(Math.random() * termList.length);
        var term = termList[termIndex];

        //define term in round
        vid = {
            [term]: "vid"
        };
        txt = {
            [term]: "txt"
        };

        //add vid/text combos to round array
        round.push(vid);
        round.push(txt);

        //remove term from master termlist so we dont get repeats
        termList.splice(termIndex, 1);
    }

    //fill blank windows
    if (numTerms < 3) //will always be 2 if not 3
    {
        round.push({
            BlankFillerTerm: "none"
        });
        round.push({
            BlankFillerTerm: "none"
        });
    }
}

/*
Given a array of glossary terms (strings), returns an object that tells what page the term is from in the story data
*/
function MapTermsToPages(terms) {
    var mapped = {};

    //loop pages of story data and look for terms - start form 1 to ignore title page
    for (var page = 0; page < storyData.length; page++) {
        
        //check if this page has a glossary
        if(storyData[page].hasOwnProperty('glossary'))
        {
            //get current glossary in current lang
            var glossary = storyData[page].glossary[writtenLang];

            var termsLeft = terms;

            //loop through glossary terms
            Object.keys(glossary).forEach(function (term) {
                //compare to terms in the game
                for (var i = 0; i < terms.length; i++) {
                    //compare glossary term to term at i
                    if (term == terms[i]) {
                        //they match! - remove from terms left and add to the term map
                        termsLeft.splice(i, 1);
                        mapped[term] = page;
                    }
                }
            });

            //update terms
            terms = termsLeft;
        }
    }
    return mapped;
}

/* ----------------------- Building Objects ----------------------- */
/*
appends <header> with score elements, and sets inital values
*/
function ExtendHeader() {
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

/*
Returns array of html builds for each piece of media inside a window. What each window media piece (vid, text, none) holds is selected at random from round array
*/
function BuildWindows() {
    var windowsHTML = [];

    //add html for each window
    for (var i = 0; i < 3; i++) {
        //get term and relvant data
        var randIndex = Math.floor(Math.random() * round.length); //random index of item
        var roundItem = round[randIndex]; //get item at index
        var term = Object.keys(roundItem); //should only be one so key is the term
        var mediaType = roundItem[term]; //media is value of the key(term)

        //based on selected medaitype and relevatn data build proper html
        var windowHTML = "";
        switch (mediaType) {

            case "txt": //term
                var id = term + "Txt";
                windowHTML += "<span id = \"" + id + "\">" + term + "</span>";

                break;

            case "vid": //video
                var id = term + "Vid";
                console.log(term, termMap)
                var vidPath = storyData[termMap[term]].video[signLang];
                windowHTML += "<video id = \"" + id + "\" src =\"" + vidPath + "\" autoplay muted loop></video>";
                break;

            case "none": //no media
                windowHTML += "<div id = \"none\"><img src =\"\"></div>";
                break;
        }

        //remove used term from roundlist
        round.splice(randIndex, 1);
        
        //push built html element to array of windows
        windowsHTML.push(windowHTML);
    }

    return windowsHTML;
}

/*
Creates matching functionality and handles relevant logics like score, window css transitions, and kicking off round transiton/win logic
*/
function SetupWindowConnections() {
    //loop through windows adding onclick functionality that contains core game mechanics
    var windows = document.getElementsByClassName("window");
    for (var x = 0; x < windows.length; x++) 
    {
        windows[x].onclick = function (e) //e is window element
        {
            //check which click this si and act accordingly
            if (!firstClick)
            { //have not clicked yet- this si the first click
                //save what we clicked on
                firstSelected = e.target.parentElement;

                //check if we are clicking a valid window
                if (firstSelected.children[1].id !== "none") 
                {
                    //it is a valid window! - set class values according
                    firstClick = true; //we ahve clicked once
                    firstSelected.classList.remove("hidden"); //class used for overriding hover functionality for a clicked window
                  $(firstSelected.children[0]).removeClass("Up").addClass("Down"); //roll down window
                } 
                else 
                {
                    //invalid window, dont hold onto what firstSelected was as it doesnt matter
                    firstSelected = null;
                }
            } 
            //we have clicked soemthing, so run logic for second click
            else if (firstClick) 
            {

                //get second selected
                secondSelected = e.target.parentElement;

                //check if the 2 selected matches the first, user isnt clicking the same thing, and is a valid window
                var firstTerm = firstSelected.children[1].id.substr(0, firstSelected.children[1].id.length - 3); //cut out the media type identified from id
                var secondTerm = secondSelected.children[1].id.substr(0, secondSelected.children[1].id.length - 3);
                if ( firstTerm == secondTerm //compare terms
                    && firstSelected != secondSelected // make sure both selected arent the same
                    && secondSelected.children[1].id !== "none") //make sure the second selected isnt a blank window
                {
                    //show 2nd selected
                    secondSelected.classList.remove("hidden");
                    
                    //roll donw window
                    $(secondSelected.children[0]).removeClass("Up").addClass("Down");
                    
                    //verify 
                    firstClick = false; //intial value- will be ste to tru if valid
                    if (firstSelected.children[1].id != "none") 
                    {
                        //up score and show ths update on the page
                        score++;
                        document.getElementById("current").innerHTML = score;
                        
                        //show star by exchanging class tags from "hidden" to "show"
                        firstSelected.children[2].classList.remove("hidden");
                        secondSelected.children[2].classList.remove("hidden");
                        $(firstSelected.children[2]).addClass("show");
                        $(secondSelected.children[2]).addClass("show");
                        

                        //check win state
                        if (score === totalMatches) 
                        {
                            //set game state to wind and run end transition
                            gameState = state.Win;
                            RoundEndTransition()
                        } 
                        //not a win? check if the round has been completed
                        else if (score === roundTotalMatches + lastRoundScore) 
                        {
                            //goto next round
                            RoundEndTransition();
                        }

                    }
                    
                    //end of run- clear sleected items
                    secondSelected = null;
                    firstSelected = null;

                } 
                //second click was not a match or invalid - clear everything and reset windows
                else 
                {
                    //reset first click
                    firstSelected.classList.add("hidden");
                    firstClick = false;

                    //update window state for non blank windows
                    if(firstSelected.children[1].id == "none" || secondSelected.children[1].id == "none") //one is a blank
                    {
                        //roll up windows, if they arent a blank window w/ no media
                        if(firstSelected.children[1].id !== "none")
                        {
                            $(firstSelected.children[0]).removeClass("Down").addClass("Up");
                        }
                        if(secondSelected.children[1].id !== "none")
                        {
                            $(secondSelected.children[0]).removeClass("Down").addClass("Up");
                        }
                    }
                    //neither are blank windows
                    else
                    {
                        //roll up both windows
                        $(firstSelected.children[0]).removeClass("Down").addClass("Up");
                        $(secondSelected.children[0]).removeClass("Down").addClass("Up");
                    }
                   
                }
            }
        }
    }
}

/* ----------------------- Game Loop ----------------------- */
/*
Updates data to reflect a new round, and updates page html
*/
function NextRound() {
    //check fi this has already been doen this round
    if (roundTotalMatches === 0) { console.log("Loading next round");
        //generate round data
        var randIndex = Math.floor(Math.random() * roundOrder.length); //select random 
        var roundLength = roundOrder[randIndex];
        roundTotalMatches = roundLength;
        lastRoundScore = score;
        DefineRound(roundLength);
        roundOrder.splice(randIndex, 1);

        //update html of page form template (chose random vehicles, and build out windows)
        templateData = {
            Top: {
                Bus: {
                    Frames: ChooseRandomArrayElement(images.Buses.FacingLeft),
                    Current: 0
                },
                Car: {
                    Frames: ChooseRandomArrayElement(images.Cars.FacingLeft),
                    Current: 0
                },
                Windows: BuildWindows() //array of window html objects, template handles where each goes
            },
            Bottom: {
                Bus: {
                    Frames: ChooseRandomArrayElement(images.Buses.FacingRight),
                    Current: 0
                },
                Car: {
                    Frames: ChooseRandomArrayElement(images.Cars.FacingRight),
                    Current: 0
                },
                Windows: BuildWindows()
            }
        };
        var main = template(templateData);
        this.$main = $(main);
        $('main').html(this.$main);

        //adjust text size inside windows to fit
        FitText();

        //specialcase check- green bus doesnt have rack ontop thus is a different height than the rest
        if ($('#bottom .bus .vImg')[0].src === images.Buses.FacingRight[0][0].src) {
            $('#bottom .bus').attr('id', 'green');
        }

        //make windows roll up and down when hovering
        HoverWindows();

        //add clicking mechnaic functionality to windows
        SetupWindowConnections();

        //add looping to the video
        var vids = $(".window video").toArray();
        vids.forEach(function (vid) {
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
        
        //fill empty windows
        var emptyWindows = $(".window #none img").toArray();
        emptyWindows.forEach(function(e)
        {
            //set waving person behind window
            Animate(e, ChooseRandomArrayElement(images.Waving), null, false);
            
            //for variations sake- flip waving animation sometimes
            if(Math.random() > .5)
            {
                $(e).css('transform', "scaleX(-1)");
            }
            
            //roll down window
            $(e.parentElement.children[0]).addClass("hidden");
            $(e.parentElement.parentElement.children[0]).addClass("Down");
            
        });
                                  
        console.log("Loading round finished setup");
    }
}

/*
Animate vehicles off screen
*/
function RoundEndTransition() { console.log("round end transition");
    var animID = window.requestAnimationFrame(function (timestamp) {
        //animate cars
        Animate("#checkMarkImage", checkImages, null, true); //run check mark anim
        AnimateMoving("#bottom .bus .vImg", templateData.Bottom.Bus.Frames, null);
        AnimateMoving("#top .bus .vImg", templateData.Top.Bus.Frames, null);
        AnimateMoving("#bottom .car .vImg", templateData.Bottom.Car.Frames, null);
        AnimateMoving("#top .car .vImg", templateData.Top.Car.Frames, null);

        //move cars
        Move(timestamp, '#bottom .vehicle', null, "Right", 0, screen.width);
        Move(timestamp, '#top .vehicle', null, "Left", 0, (screen.width * -1));
    });

    activeAnimations.push(animID);
}

/*
Move vehicles just off left side, and Animate vehicles back on screen
*/
function RoundStartTransition() { console.log("round start transition");
    //move vehicles off screen on proper side so they can drive in
    $('#bottom .vehicle').css('left', (window.innerWidth * -1) + 'px');
    $('#top .vehicle').css('left', window.innerWidth + 'px');

    //animate and move vehicles back on screen
    var animID = window.requestAnimationFrame(function (timestamp) {
        //animate cars
        AnimateMoving("#bottom .bus .vImg", templateData.Bottom.Bus.Frames, null, true);
        AnimateMoving("#top .bus .vImg", templateData.Top.Bus.Frames, null, true);
        AnimateMoving("#bottom .car .vImg", templateData.Bottom.Car.Frames, null, true);
        AnimateMoving("#top .car .vImg", templateData.Top.Car.Frames, null, true);

        //move cars
        Move(timestamp, '#bottom .vehicle', null, "Right", (screen.width * -1), (screen.width + 20));
        Move(timestamp, '#top .vehicle', null, "Left", (screen.width), ((screen.width + 10) * -1));
    });

    activeAnimations.push(animID);
}

/*
Clear data at end of game, and make html reflect the win screen
*/
function WinScreen() {
    //change to win screen
    $('main').html(html);
    
    gameState = state.Playing;

    //clear data of this script
    storyData = null;
    score = 0;
    firstClick = false;

    firstSelected = null;
    secondSelected = null;
    totalMatches = 9999999;
    roundTotalMatches = 0;
    images = {
        Cars: {
            FacingRight: [],
            FacingLeft: []
        },

        Buses: {
            FacingRight: [],
            FacingLeft: []
        },

        Waving: [],
    };

    termList = []; //hard values for testing
    signLang = null;
    writtenLang = null;

    roundorder = null;
    round = [];

}

/*
Shrinks text inside windows
*/
function FitText() {
    //get widnow
    var windows = $(".window");
    windows.toArray().forEach(function (element) {
        let currentSize = 30; //base size
        //make sure window is a text media type
        if (element.children[1].id.substr(element.children[1].id.length - 3, element.children[1].id.length) == "Txt") {
            //loop and shrink until text fits
            while (element.children[1].offsetWidth < element.children[1].scrollWidth) {
                if (element.children[1].style.getPropertyValue('font-size') == "") {
                    element.children[1].style.setProperty('font-size', currentSize.toString() + "px");
                }
                currentSize = currentSize - 5;
                element.children[1].style.setProperty('font-size', currentSize + "px");

            }

        }
    });

}

/*
Adds hover fucntionality to windows to roll up/donw the glass using css transitions
*/
function HoverWindows() {
    //get all windows
    $(".window").hover(function(e) //e is window element, e.target is the actually clicked piece (media)
    { //roll down
        if(e.target.parentElement.classList.contains("hidden") &&
        $(e.target).siblings(".glass").hasClass("Up") && e.target.parentElement.children[1].id !== "none")
        {   
            //update window state
            $(e.target).siblings(".glass").removeClass("Up").addClass("Down");
        }
    },
    function(e) //roll up - e is window elelemnt, e.target is media or glass
    {   
        //check if target has been clicked
        if(e.target.parentElement.classList.contains("hidden") && e.target.parentElement.children[1].id !== "none" &&
        ($(e.target).siblings(".glass").hasClass("Down") ||  $(e.target).hasClass("Down")))
        {
            //update window state
            $(e.target).siblings(".glass").removeClass("Down").addClass("Up");
        }
    });


}



/* ----------------------- Animation ----------------------- */
/*
Moves specificed element from the start positiont to the end position (moving horizontally), at end of its movement attempts to update game state do round logic.
(timestamp: gotten from window.requestanimationframe())
(id: html id of elemnt that you want to move)
(start: starting timestamp of movement, set by script. SHOULD BE NULL INTIALLY)
(dir: string of direction to move ie Left or Right)
(startPos: intial position of moving object)
(endPos: end position after move has concluded)
*/
function Move(timestamp, id, start, dir, startPos, endPos) {
    //get all vehciles of this type
    var vehicles = $(id).toArray();

    //set startPos for each vehicle
    vehicles.forEach(function (vehicle) 
    {
        if (!start && vehicle.style.left != "") { //first run and style.left isnt blank
            startPos = vehicle.style.left; //save style.left
            startPos = parseFloat(startPos); //remove "px" from string so its just numbers
        }
    });

    //use timestamp to step through the move positions
    if (!start) {
        //save start time
        start = timestamp;
    }
    var pos = timestamp - start; //get difference betwen this step and start time

    var atEnd = pos > endPos; //check for end of movement path - used in if statement a few lines down

    //alter pos and redefine end if for left
    if (dir === "Left") {
        pos = pos * -1; //invert pos for moving left instead of right
        atEnd = pos < endPos; //end pos logic is diffeent in this direction
    }

    //check for end of moevment path, if so run round logic, if not move again
    if (!atEnd) 
    {
        //move each vehicle
        vehicles.forEach(function (vehicle) {
            vehicle.style.left = startPos + pos + 'px';
        });

        //set next recursive movement run
        window.requestAnimationFrame(function (timestamp) {
            Move(timestamp, id, start, dir, startPos, endPos);
        });
    } 
    //at end of movement- run round logic
    else 
    {
        //use active anims ot check if the round logic has already been updated
        if (activeAnimations.length > 0) {
            console.log("move end");
            
            //clear running animations
            for(var i = 0; i < activeAnimations.length; i++)
            {
                cancelAnimationFrame(activeAnimations[i]);
            }
            activeAnimations = [];

            //based on gaem state, update state and goto next phase
            switch (gameState) {
                case state.Start:
                    //chnage state for next run
                    gameState = state.Playing;

                    break

                case state.Playing:
                    //change state
                    gameState = state.End;

                    //move vehicles off screen
                    RoundEndTransition();
                    break;

                case state.End:
                    //chnage state
                    gameState = state.Start;

                    //clear round matches - so a NextRound() is only called once
                    roundTotalMatches = 0;


                    //start next round and move vehicles back on screen
                    NextRound();
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

/*
Runs animation of defined <img> element
(id: html id of <img> elemnt you wish to animate)
(frames: array of Image() objects used for each frame of the animation)
(frame: fraemt he animation is one. SHOULD BE NULL INITIALLY)
(noLoop: boolean that defines if this animation loops or only runs once)
*/
function Animate(id, frames, frame, noLoop) {
    //check if we are looping, or have not reached finish of animation
    if (!noLoop || (frame < frames.length - 1)) 
    {
        //set next recursive run of animation
        window.requestAnimationFrame(function (timestamp) {
            Animate(id, frames, frame, noLoop);
        });

        //set frame if first run
        if (!frame) frame = 0;

        //get img(s) hat are being animated
        var vImgs = $(id).toArray();
        
        //loop through all lements being animated and update animation
        frame = (frame + 1) % frames.length; //up frame w/ wrapping
        vImgs.forEach(function (img) {
            img.src = frames[frame].src; //set src to that of the new frame
        });
    }
}

/* Animate function that ends when the activeAnimations array for moving animations (vehciles) has been cleared*/
function AnimateMoving(id, frames, frame, finishRun = false) {
    if ((activeAnimations.length > 0) || (finishRun && (frame != 0)))
    {
        window.requestAnimationFrame(function (timestamp) {
            AnimateMoving(id, frames, frame, finishRun);
        });

        if (!frame) frame = 0;

        var vImgs = $(id).toArray();
        
        //update animation
        frame = (frame + 1) % frames.length;
        vImgs.forEach(function (img) {

            img.src = frames[frame].src;
        });
    }
}


/* ----------------------- Helper Functions ----------------------- */
/*
Retuns random element form a given array
*/
function ChooseRandomArrayElement(options) {
    //chose image to use for bus
    var selected = options[Math.floor(Math.random() * (options.length))];
    return selected;
}

/*
makes given <video> elemnt loop from noted start time to end time
*/
function LoopVideoClip(videoID, start, end) {
    //get <video> elment
    var videoContainer = document.getElementById(videoID);
    
    //modify vidoe src to have start and end timestamps
    videoContainer.src += "#t=" + start + "," + end;
    
    //after vidoe has loaded, add listeners on its timestamp and make it loop between start and end
    videoContainer.addEventListener('loadedmetadata', function () {
        //push vidoe to "start" if before it
        if (videoContainer.currentTime < start) {
            videoContainer.currentTime = start;
        }
        
        //listener on each timestamp change to reset to "start" if over "end" time
        videoContainer.ontimeupdate = function () {
            //check over end time
            if (videoContainer.currentTime >= end) {
                videoContainer.currentTime = start; //set back to start
                videoContainer.play(); //play video again

            }
        }
    }, false);
}