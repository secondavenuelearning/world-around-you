import _ from 'underscore';
import gameHtml from 'html/Client/PlantGame_Game.html!text';
import ImageHoverSwap from 'js/Client/HelperFunctions.js';
export default { Start, GetImagesFromFolder, Animate}

/* ----------------------- Global Variables ----------------------- */
var template = _.template(gameHtml);
var templateData = {};

var storyData;
var score = 0;

var termList = []; //hard values for testing
var termMap = {};
var signLang;
var writtenLang;


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
export function Start(storyObj, sign, written, terms) {
    //resets all data
    storyData = null;
    score = 0;
    termList = []; 
    signLang = null;
    writtenLang = null;
    
    
    
    //save story data to be globally acessable
    storyData = storyObj;
    signLang = sign;
    writtenLang = written;
    termList = terms;

    //figure out hwre each term is in the story data
    termMap = MapTermsToPages(terms.slice(0));
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


function MapTermsToPages(terms) {
    var mapped = {};

    //loop pages of story data and look for terms - start form 1 to ignore title page
    for (var page = 1; page < Object.keys(storyData).length; page++) {
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

    return mapped;
}

/* ----------------------- Building Objects ----------------------- */

/* ----------------------- Game Loop ----------------------- */
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

/* ----------------------- Animation ----------------------- */
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