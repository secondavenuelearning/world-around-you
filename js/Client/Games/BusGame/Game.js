import _ from 'underscore';
import html from 'html/Client/Games/BusGame/Win.html!text';
import gameHtml from 'html/Client/Games/BusGame/Game.html!text';

export default { Start, GetImagesFromFolder, Animate}

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
var checkImages;
var blank;
var termList = []; //hard values for testing
var termMap = {};
var signLang;
var writtenLang;

var roundOrder;
var roundTotalMatches = 0;

var round = [
    //round data will be structured as such:

    //  { 
    //    [term]: mediaType
    //  },
    // --repeats 2x per term
    // --once for each mediaType ("vid" or "txt")
    // >>>Data removed from this array once parsed into html objects
];

var activeAnimations = [];
var animTags = [
    //anim tags structure:

    //  {
    //     [id]:framesArray,
    //     [id]:framesArray
    //  }
    // --repeats
];
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
    //resets all data
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

    roundorder = null;
    round = [];
    
    console.log(game);
    
    //save story data to be globally acessable
    storyData = game.story.data;
    console.log(storyData);
    signLang = game.signLanguage;
    writtenLang = game.writtenLanguage;
    termList = game.data.terms.slice(0);

    if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function () {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        };
    }

    
    roundTotalMatches = 0;


    //define how many matches the user will each round
    roundOrder = createCountList(termList);
    totalMatches = (termList.length); //number between 0 and 10

    //figure out hwre each term is in the story data
    let terms = JSON.parse(JSON.stringify(game.data.terms));
    termMap = MapTermsToPages(terms);

    //add score area to header
    ExtendHeader();


    //change mains bg image
    $('main').css("background-image", "url(../img/games/BusGame/background_BusGame-03.png)");


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
    
    //get waving animations
    images.Waving.push(GetImagesFromFolder("/img/games/BusGame/Waving/Waving_Animation1/Frames/"));
    if(window.navigator.userAgent.indexOf("Edge") < 0) //only laod these other waving variants if not on edge
    {
       images.Waving.push(GetImagesFromFolder("/img/games/BusGame/Waving/Waving_Animation2/Frames/"));
        images.Waving.push(GetImagesFromFolder("/img/games/BusGame/Waving/Waving_Animation3/Frames/"));
    }

   checkImages = GetImagesFromFolder("/img/games/BusGame/CheckmarkAnimation/Frames/");
   blank = new Image();
    NextRound(true);
}

/* ----------------------- Data parsing ----------------------- */
function GetImagesFromFolder(folder) {
    var files = [];

    $.ajax({
        url: folder,
        async: false, //to ensure all data points have been added before we continue
        success: function (data) {

            data.forEach(function (datapoint) {
                var path = "../.." + folder.toString() + "" + datapoint.toString();
                var img = new Image();
                img.src = path;
                files.push(img);
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

function BuildWindows() {
    var windowsHTML = [];

    //add html for each window
    for (var i = 0; i < 3; i++) {
        //get term and relvant data
        var randIndex = Math.floor(Math.random() * round.length); //random index of item
        var roundItem = round[randIndex]; //get item at index
        var term = Object.keys(roundItem); //should only be one so key is the term
        var mediaType = roundItem[term]; //media is value of the key(term)

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

        windowsHTML.push(windowHTML);
    }

    return windowsHTML;
}

function SetupWindowConnections() {
    var windows = document.getElementsByClassName("window");
    for (var x = 0; x < windows.length; x++) {
        windows[x].onclick = function (e) {
            if (firstClick == false) {
                firstSelected = e.target.parentElement;


                if (firstSelected.children[1].id !== "none") {
                    firstClick = true;
                    firstSelected.classList.remove("hidden");
                  $(firstSelected.children[0]).removeClass("Up").addClass("Down");
                } else {
                    firstSelected = null;
                }
            } else if (firstClick == true) {

                //get second selected
                secondSelected = e.target.parentElement;

                //check if the 2 selected match
                if (firstSelected.children[1].id.substr(0, firstSelected.children[1].id.length - 3) == secondSelected.children[1].id.substr(0, secondSelected.children[1].id.length - 3) && firstSelected != secondSelected && secondSelected.children[1].id !== "none") {
                    //show 2nd selected
                    secondSelected.classList.remove("hidden");
                    
                    $(secondSelected.children[0]).removeClass("Up").addClass("Down");
                    //verify 
                    firstClick = false;
                    if (firstSelected.children[1].id != "none") {



                        checkImages.push(blank);
                        var animID = window.requestAnimationFrame(function (timestamp) {
                            
                        });

                        score++;
                        document.getElementById("current").innerHTML = score;
                        
                        //add star
                        firstSelected.children[2].classList.remove("hidden");
                        secondSelected.children[2].classList.remove("hidden");
                        $(firstSelected.children[2]).addClass("show");
                        $(secondSelected.children[2]).addClass("show");
                        

                        //check win state
                        if (score === totalMatches) {
                            gameState = state.Win;
                            RoundEndTransition()
                        } else if (score === roundTotalMatches + lastRoundScore) {
                            //goto next round
                            RoundEndTransition();
                        }

                    }
                    secondSelected = null;
                    firstSelected = null;

                } else {
                    firstSelected.classList.add("hidden");
                    firstClick = false;

                    //roll up windows again
                    //var rollWindow = GetImagesFromFolder("/img/games/BusGame/WindowAnimation/Frames/").reverse();
                    //Animate(firstSelected.children[0], rollWindow, null, true);
                    //Animate(secondSelected.children[0], rollWindow, null, true);
                    
                    //update window state
                    if(firstSelected.children[1].id == "none" || secondSelected.children[1].id == "none"){
                        if(firstSelected.children[1].id !== "none"){
                            $(firstSelected.children[0]).removeClass("Down").addClass("Up");
                        }
                        if(secondSelected.children[1].id !== "none"){
                            $(secondSelected.children[0]).removeClass("Down").addClass("Up");
                        }
                    }
                    else{
                            $(firstSelected.children[0]).removeClass("Down").addClass("Up");
                    $(secondSelected.children[0]).removeClass("Down").addClass("Up");
                           }
                   
                }


            }

        }
    }
}

/* ----------------------- Game Loop ----------------------- */
function NextRound(firstRun = false) {
    //check fi this has already been doen this round
    if (roundTotalMatches === 0) { console.log("Loading next round");
        //generate round data
        var randIndex = Math.floor(Math.random() * roundOrder.length);
        var roundLength = roundOrder[randIndex];
        roundTotalMatches = roundLength;
        lastRoundScore = score;
        DefineRound(roundLength);
        roundOrder.splice(randIndex, 1);

        //update html of page form template
        //templateData = null;
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
                Windows: BuildWindows()
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

        if (firstRun) {
            console.log("first run");
            this.$main = $(main);
            $('main').html(this.$main);
        }


        FitText();

        //specialcase check- green bus doesnt have rack ontop thus is a different height than the rest
        if ($('#bottom .bus .vImg')[0].src === images.Buses.FacingRight[0][0].src) {
            $('#bottom .bus').attr('id', 'green');
        }

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
            //var rollWindow = GetImagesFromFolder("/img/games/BusGame/WindowAnimation/Frames/");
            //Animate(e.parentElement.parentElement.children[0], rollWindow, null, true);
            $(e.parentElement.children[0]).addClass("hidden");
            $(e.parentElement.parentElement.children[0]).addClass("Down");
            
        });
                                  
        console.log("Loading round finished setup");
    }
}

function RoundEndTransition() { console.log("round end transition");
    var animID = window.requestAnimationFrame(function (timestamp) {
        //animate cars
        Animate("#checkMarkImage", checkImages, null, true);
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


function FitText() {
    var windows = $(".window");
    windows.toArray().forEach(function (element) {
        let currentSize = 30;
        if (element.children[1].id.substr(element.children[1].id.length - 3, element.children[1].id.length) == "Txt") {
            while (element.children[1].offsetWidth < element.children[1].scrollWidth) {
                if (element.children[1].style.getPropertyValue('font-size') == "") {
                    element.children[1].style.setProperty('font-size', currentSize.toString() + "px");
                }
                // console.log("Start: " + element.children[1].style.setProperty('font-size', '20px'));
                // console.log("Start: " + element.children[1].style.getPropertyValue('font-size'));



                currentSize = currentSize - 5;
                element.children[1].style.setProperty('font-size', currentSize + "px");

            }

        }
    });

}

function HoverWindows() {
    //get window animation
    //var rollWindow = GetImagesFromFolder("/img/games/BusGame/WindowAnimation/Frames/");
   // var inverted = rollWindow.slice(0).reverse();

    //get all windows


    $(".window").hover(function(e)
    { 
        console.log(e.target.parentElement.classList.contains("hidden"));
        if(e.target.parentElement.classList.contains("hidden") &&
        $(e.target).siblings(".glass").hasClass("Up") && e.target.parentElement.children[1].id !== "none")
        {
            //Animate(e.target, rollWindow, null, true);
            
            //update window state
            $(e.target).siblings(".glass").removeClass("Up").addClass("Down");
        }
    },
    function(e)
    {   
        //check if target has been clicked
        if(e.target.parentElement.classList.contains("hidden") && e.target.parentElement.children[1].id !== "none" &&
        ($(e.target).siblings(".glass").hasClass("Down") ||  $(e.target).hasClass("Down")))
        {
           // Animate(e.target, inverted, null, true); 
            
            //update window state
            $(e.target).siblings(".glass").removeClass("Down").addClass("Up");
        }
    });


}



/* ----------------------- Animation ----------------------- */
function Move(timestamp, id, start, dir, startPos, endPos) {
    //get all vehciles of this type
    var vehicles = $(id).toArray();

    vehicles.forEach(function (vehicle) {
        if (!start && vehicle.style.left != "") {
            startPos = vehicle.style.left;
            startPos = parseFloat(startPos);
        }
    });

    //use timestamp to step through the move positions
    if (!start) {
        //save start time
        start = timestamp;
    }
    var pos = timestamp - start;

    var atEnd = pos > endPos; //check for end of movement path

    //alter for left
    if (dir === "Left") {
        pos = pos * -1; //invert pos for moving left instead of right
        atEnd = pos < endPos;
    }

    if (!atEnd) {
        vehicles.forEach(function (vehicle) {
            vehicle.style.left = startPos + pos + 'px';
        });

        window.requestAnimationFrame(function (timestamp) {
            Move(timestamp, id, start, dir, startPos, endPos);
        });
    } else {
        if (activeAnimations.length > 0) {
            console.log("move end");
            
            for(var i = 0; i < activeAnimations.length; i++)
            {
                cancelAnimationFrame(activeAnimations[i]);
            }
            activeAnimations = [];

            switch (gameState) {
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

function Animate(id, frames, frame, noLoop) {
    if (!noLoop || (frame < frames.length - 1)) 
    {
        window.requestAnimationFrame(function (timestamp) {
            Animate(id, frames, frame, noLoop);
        });

        if (!frame) frame = 0;

        var vImgs = $(id).toArray();
        frame = (frame + 1) % frames.length;
        //update animation

        vImgs.forEach(function (img) {

            img.src = frames[frame].src;
        });
    }
}

/* Nimate function that ends when the activeAnimations array for moving animations (vehciles) has been cleared*/
function AnimateMoving(id, frames, frame, finishRun = false) {
    if ((activeAnimations.length > 0) || (finishRun && (frame != 0)))
    {
        window.requestAnimationFrame(function (timestamp) {
            AnimateMoving(id, frames, frame, finishRun);
        });

        if (!frame) frame = 0;

        var vImgs = $(id).toArray();
        frame = (frame + 1) % frames.length;
        //update animation

        vImgs.forEach(function (img) {

            img.src = frames[frame].src;
        });
    }
}


/* ----------------------- Helper Functions ----------------------- */
function ChooseRandomArrayElement(options) {
    //chose image to use for bus
    var selected = options[Math.floor(Math.random() * (options.length))];
    return selected;
}

function LoopVideoClip(videoID, start, end) {
    var videoContainer = document.getElementById(videoID)
    videoContainer.src += "#t=" + start + "," + end;
    videoContainer.addEventListener('loadedmetadata', function () {
        if (videoContainer.currentTime < start) {
            videoContainer.currentTime = start;
        }
        videoContainer.ontimeupdate = function () {
            if (videoContainer.currentTime >= end) {
                videoContainer.currentTime = start;
                videoContainer.play();

            }
        }
    }, false);
}