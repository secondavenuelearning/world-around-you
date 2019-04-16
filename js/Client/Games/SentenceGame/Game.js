import _ from 'underscore';
import gameHtml from 'html/Client/Games/SentenceGame/Game.html!text';
import flowerbedHtml from 'html/Client/Games/SentenceGame/Footer.html!text';
import winHtml from 'html/Client/Games/SentenceGame/Win.html!text';
import ImageHoverSwap from 'js/Client/HelperFunctions.js';
export default {
    Start,
    GetImagesFromFolder,
    Animate
}

/* ----------------------- Global Variables ----------------------- */
//html and data passed to html
var template = _.template(gameHtml);
var templateData = {};

//win template
var winTemplate = _.template(winHtml);
var winTemplateData = {};

//global access to raw story data
var storyData;

//selected languages for this game
var signLang;
var writtenLang;
var hintRun = 0;
//game round data and varibales
var rounds = [];
var round = 0;

var termMap = {}; //where the terms used in the current round reside (page wise) int he sory data

//scoring
var score = 0;
var maxScore = 0;
var firstTry = true;

var flowers = 0; //will be a decimal but actual flowers shwon will be math.floor version
var flowerPower = 0;

//tip strings up top
var notif = {
    Good: [
        "Good Job!",
        "Great",
        "Correct",
        "Bravo",
        "You're good at this!",
        "Piece of cake", //maybe bad bc localization?
        "Gold star!",
        "Rad",
        ":)"
    ],
    Bad: [
        "Ouch",
        "Try Again",
        "Not quite...",
        "*sad trombone*",
        "Nope",
        "Sorry",
        "oof",
        "Give it another shot",
        "Thats not it",
        "Return to sender",
        ":("
    ]
};

//animation
var animations = {
    Star: [], //single
    Plants: [], //single
    Bird: [], //single
    Flowers: {
        Windy: [],
        Growing: []
    }
};

var untilWindy = 3000;

//gameplay vaibales
var dragging = false;


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
    storyData = null;
    score = 0;
    signLang = null;
    writtenLang = null;
    round = 0;
    //save story data to be globally acessable
    storyData = game.story.data;
    signLang = game.signLanguage
    writtenLang = game.writtenLanguage;
    rounds = game.data.sentences;
    maxScore = game.data.sentences.length;

    //calc flower rate (ie points required to get a flower)
    flowerPower = 9 / maxScore; //9 is the number of flowers
    flowers = 0;

    //set header max score text
    $("#score #total").text("/ " + maxScore);
    $("#score #current").text("0");

    //get animation images
    animations = {
        Star: GetImagesFromFolder("/img/games/BusGame/StarAnimation/Frames/"), //single
        Plants: GetImagesFromFolder("/img/games/Worksheet/WindyPlants_Animation/"), //single
        Bird: GetImagesFromFolder("/img/games/Worksheet/Bird_Animation/"), //single
        Flowers: {
            Windy: [
                "/img/games/Worksheet/Flowers/Flower1_Wind_Animation/",
                "/img/games/Worksheet/Flowers/Flower2_Wind_Animation/",
                "/img/games/Worksheet/Flowers/Flower3_Wind_Animation/",
                "/img/games/Worksheet/Flowers/Flower4_Wind_Animation/",
                "/img/games/Worksheet/Flowers/Flower5_Wind_Animation/",
                "/img/games/Worksheet/Flowers/Flower6_Wind_Animation/",
                "/img/games/Worksheet/Flowers/Flower7_Wind_Animation/",
                "/img/games/Worksheet/Flowers/Flower8_Wind_Animation/",
                "/img/games/Worksheet/Flowers/Flower9_Wind_Animation/"
            ],
            Growing: [
                "/img/games/Worksheet/Flowers/Flower1_Growing_Animation/",
                "/img/games/Worksheet/Flowers/Flower2_Growing_Animation/",
                "/img/games/Worksheet/Flowers/Flower3_Growing_Animation/",
                "/img/games/Worksheet/Flowers/Flower4_Growing_Animation/",
                "/img/games/Worksheet/Flowers/Flower5_Growing_Animation/",
                "/img/games/Worksheet/Flowers/Flower6_Growing_Animation/",
                "/img/games/Worksheet/Flowers/Flower7_Growing_Animation/",
                "/img/games/Worksheet/Flowers/Flower8_Growing_Animation/",
                "/img/games/Worksheet/Flowers/Flower9_Growing_Animation/"
            ]
        }
    }

    //add flower bed (not part of normal build so flowers arent reset on round changes)
    $('footer').html(flowerbedHtml);

    //create a new round and update html
    NextRound();

    //start off windy anim
    setTimeout(function () {
        WindyAnim();
        Animate("#bird", animations.Bird, null, true);
    }, untilWindy);

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

function PreLoadAnimChunk(anims, size) {
    //get images for deifned number of items to be loaded
    var start = 0;
    for (var i = 0; i < size; i++) {
        //check if anim has already loaded
        if (_.isString(anims[start + i])) { //has not! load the image
            anims[start + i] = GetImagesFromFolder(anims[start + i]);
        } else if (start < anims.length) //only cont if we have items left to check
        { //loaded- dont count this towards the loop
            //update start pos so next one moves forward but loop isnt started
            start++;
            i--; //delay loop stopping
        }
    }
}

function LoadingFlowers() {
    //get array of flowers
    var bouquet = $(".flower").toArray(); //get it? its a bunch of flowers

    //loop through flowers and enable any new flowers players have gotten
    for (var i = 0; i < Math.floor(flowers + flowerPower); i++) //only show full flowers! thus- Math.floor(flowers)
    {
        //check if the current flower has already bloomed
        if ($(bouquet[i]).hasClass("hidden")) {
            //load next chunk of flowers
            animations.Flowers.Growing[i] = GetImagesFromFolder(animations.Flowers.Growing[i]);
        } else {
            //unload old animations and repalce with new ones
            if (_.isArray(animations.Flowers.Growing[i])) {
                //get new and set start frame
                animations.Flowers.Windy[i] = GetImagesFromFolder(animations.Flowers.Windy[i]);
                $(bouquet[i]).removeClass("growing");
                $(bouquet[i]).addClass("windy");

                //unload old 
                animations.Flowers.Growing[i] = null;
            }
        }
    }
}

/* ----------------------- Game Mechanics ----------------------- */
function NextRound() {
    //load animations as we need them
    LoadingFlowers();

    //reset some things
    firstTry = true;
    hintRun = 0;
    //get random terms
    var options = [rounds[round].term]; //options includes the corrcet option first

    for (var i = 0; i < 2; i++) {
        var page = Math.floor(Math.random() * (storyData.length));
        //check if page has a glossary
        if(storyData[page].hasOwnProperty('glossary'))
        {
            var terms = Object.keys(storyData[page].glossary[writtenLang]);
            var term = ChooseRandomArrayElement(terms);

            //check if we ahve already used this term
            if (!options.includes(term)) { //we havent- add it to options
                options.push(term);
            } else //we have :( try again
            {
                i--;
            }
        }
        else
        {
            //try again for a page with glossary terms
            i--;
        }

    }

    //map the terms to where they are in the story data- this is mainly for the correct option
    termMap = MapTermsToPages(options.slice(0));

    //shuffle options so the correct vid isnt the first one
    shuffle(options);

    //build template
    var pages = [termMap[options[0]], termMap[options[1]], termMap[options[2]]];
    templateData = {
        ID: options,
        Media: [
            storyData[pages[0]].video[signLang],
            storyData[pages[1]].video[signLang],
            storyData[pages[2]].video[signLang]
        ],
        Star: animations.Star[0].src,
        Text: [rounds[round].part1, rounds[round].part2]
    };

    var main = template(templateData);
    this.$main = $(main);
    $('main').html(this.$main);

    //clear notif
    $("#responseText").text("");

    //add looping to the video
    var vids = $("#videos video").toArray();
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

    //add core game mechanic event functionality
    DragAndDrop();

    //add hint functionality
    $("#hint").on('click', function () {
        //run hint
        Hint();
    });
}

function Win() {
    //load last of the flowers
    LoadingFlowers();

    //build win template
    winTemplateData = {
        Score: score,
        Max: maxScore
    };

    var win = winTemplate(winTemplateData);

    //go to win screen

    $("main").html(win);
    $("#responseText").text("");
    var scoreTemp = document.getElementById("score");
    scoreTemp.style.display = "none";
}

function Hint() {
    //get incorrect options
    var options = [];
    templateData.ID.forEach(function (option) {
        if (option != rounds[round].term) {
            options.push(option);
        }
    });

    //chose which of them to omit
    var omit = ChooseRandomArrayElement(options);

    //hide the omited item
    omit = "#" + omit + "Vid"; //expand to proper ID
    if ($(omit).attr('class') == "hidden" && hintRun<10) {
        hintRun++;
        Hint();

        
    } else {
        $(omit).addClass("hidden");
    }
    //$(omit).addClass("hidden");

    //affect trys
    firstTry = false;
    
}

function DragAndDrop() {
    //make drag blurb follow mouse
    $(document).on('mousemove', function (e) {
        event.preventDefault(); //dont slect things when dragging

        //update position of "dragged" word element
        $('#drag').css({
            left: e.pageX - 50,
            top: e.pageY - 115
        });
    });

    //add click event for videos
    $(".media").on('mousedown', function (e) {
        //dont selecte things hwen dragging
        event.preventDefault();

        //show drag again
        $("#drag").removeClass("hidden");

        //hide video
        $(e.target).children("video").addClass("hidden");
        $(e.target).addClass("selected");

        //set dragging to true
        dragging = true;

        //give drag its proper text
        var term = $(".selected video")[0].id.toString();
        term = term.substring(0, term.length - 3);
        $("#drag span").text(term);

    });

    $(document).on('mouseup', function (e) {
        //check if we are dragging and mouseup is on the blank
        if (dragging && $(e.target)[0] == $("#blank")[0]) {
            //chekc if its the right term that was draggged in
            var term = $(".selected video")[0].id.toString();
            term = term.substring(0, term.length - 3);
            if (term == rounds[round].term) {
                //show star and ainmate
                $(".selected img").removeClass("hidden");
                Animate($(".selected img"), animations.Star, null, true, true); //has round logic

                //updaet scoring and flowers
                if (firstTry) {
                    score++; //up score by one

                    //update score text
                    $("#score #current").text(score);
                }

                //up flower count
                flowers += flowerPower;

                //add new flowers
                UpdateFlowers();

                //apply term to blank
                $("#blank").addClass("filled");
                $("#blank").text(term);

                //update notif text
                RunNotif(notif.Good);


            } else //not the correct awnser- punish
            {
                //hide drag and show hidden video
                $(".selected").children("video").removeClass("hidden");

                //some stuff w/ score??
                firstTry = false;

                //update notif text
                RunNotif(notif.Bad);
            }
        } else //we let go not on the blank
        {
            //hide drag and show hidden video
            $(".selected video").removeClass("hidden");
        }

        //deselect and hide hidden
        $(".selected").removeClass("selected");
        $("#drag").addClass("hidden");

        //we obvi arent dragign if the user let go of the mouse button
        dragging = false;
    });
}

function UpdateFlowers() {
    //get array of flowers
    var bouquet = $(".flower").toArray(); //get it? its a bunch of flowers

    //loop through flowers and enable any new flowers players have gotten
    for (var i = 0; i < Math.floor(flowers); i++) //only show full flowers! thus- Math.floor(flowers)
    {
        //check if the current flower has already bloomed
        if ($(bouquet[i]).hasClass("hidden")) {
            //unhide this flower
            $(bouquet[i]).removeClass("hidden");

            //animate flower
            $(bouquet[i]).addClass("growing");
            Animate($(bouquet[i]).children("img"), animations.Flowers.Growing[i], null, true);

        }

    }
}

function RunNotif(notifs) {
    //chose random element
    var notif = ChooseRandomArrayElement(notifs);

    //replace notif text with selected
    $("#responseText").text(notif);
}

/* ----------------------- Building Objects ----------------------- */

/* ----------------------- Animation ----------------------- */
function Animate(id, frames, frame, noLoop, roundLogicActive = false) {
    if (!noLoop || (frame < frames.length - 1)) {
        var anim = window.requestAnimationFrame(function (timestamp) {
            Animate(id, frames, frame, noLoop, roundLogicActive);
        });

        if (!frame) frame = 0;

        var vImgs = $(id).toArray();
        frame = (frame + 1) % frames.length;
        //update animation

        vImgs.forEach(function (img) {

            img.src = frames[frame].src;
        });
    } else if (roundLogicActive) {
        //updaet round
        round++;

        //goto next round or win screen
        if (round < rounds.length) {
            NextRound();
        } else {
            Win();
        }

    }
}

function WindyAnim() {
    //animate background
    Animate("#wall", animations.Plants, null, true);

    //animate all the flowers
    var bouquet = $(".flower").toArray(); //get it? its a bunch of flowers
    for (var i = 0; i < bouquet.length; i++) {
        //exclude hidden flowers
        if (!$(bouquet[i]).hasClass("hidden") && (!$(bouquet[i]).hasClass("growing"))) {
            Animate($(bouquet[i]).children("img"), animations.Flowers.Windy[i], null, true);
        }
    }

    //set next windy run
    untilWindy = Math.floor(Math.random() * 30000) + 9000;
    setTimeout(function () {
        WindyAnim();
    }, untilWindy);
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

function FitText() {
    var windows = $(".window");
    windows.toArray().forEach(function (element) {
        let currentSize = 30;
        if (element.children[1].id.substr(element.children[1].id.length - 3, element.children[1].id.length) == "Txt") {
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

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function (array) {

    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;

};

//Adds includes method for browsers that dont support
// thanks: https://stackoverflow.com/questions/31221341/ie-does-not-support-includes-method
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, "includes", {
        enumerable: false,
        value: function (obj) {
            var newArr = this.filter(function (el) {
                return el == obj;
            });
            return newArr.length > 0;
        }
    });
}
