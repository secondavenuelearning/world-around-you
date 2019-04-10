import _ from 'underscore';
import gameHtml from 'html/Client/PlantGame_Game.html!text';
import ImageHoverSwap from 'js/Client/HelperFunctions.js';
export default { Start, GetImagesFromFolder, Animate}

/* ----------------------- Global Variables ----------------------- */
var template = _.template(gameHtml);
var templateData = {};

var storyData;
var score = 0;

var termList = [];
var termMap = {};
var signLang;
var writtenLang;

var rounds = [];
var round = 0;

var starAnim;

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
export function Start(storyObj, sign, written, gameData) {
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
    rounds = gameData.sentences;
    
    //get animation images
    starAnim = GetImagesFromFolder("/img/games/BusGame/StarAnimation/Frames/");
    
    //get terms
    rounds.forEach(function(item)
    {
        //save term
        termList.push(item.Term);
    });
    
    //create a new round and update html
    NextRound();
    
    //add core game mechanic event functionality
    DragAndDrop();
    
    
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
function NextRound()
{
    //get random terms
    var options = [rounds[round].Term]; //options includes the corrcet option first
    
    for(var i = 0; i < 2; i++)
    {
        var page = Math.floor(Math.random() * (Object.keys(storyData).length - 2)) + 1;
        var terms = Object.keys(storyData[page].glossary[writtenLang]);
        var term = ChooseRandomArrayElement(terms);
        
        //check if we ahve already used this term
        if(!options.includes(term))
        { //we havent- add it to options
            options.push(term);
        }
        else //we have :( try again
        {
            i--;
        }
        
    }
    
    //map the terms to where they are in the story data- this is mainly for the correct option
    termMap = MapTermsToPages(options.slice(0));
    
    //shuffle options so the correct vid isnt the first one
    shuffle(options);
    
    //build template
    var pages = [termMap[options[0]], termMap[options[1]], termMap[options[2]]];
    templateData =
    {
        ID: options,
        Media: 
        [
            storyData[pages[0]].video[signLang],
            storyData[pages[1]].video[signLang],
            storyData[pages[2]].video[signLang]
        ],
        Star: starAnim[0].src,
        Text: [rounds[round].Sentence[0], rounds[round].Sentence[1]]
    };
    
    var main = template(templateData);
    this.$main = $(main);
    $('main').html(this.$main);
    
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
}

function DragAndDrop()
{
    //make drag blurb follow mouse
    $(document).on('mousemove', function(e){
        $('#drag').css({
           left:  e.pageX - 50,
           top:   e.pageY - 100
        });
    });
    
    //add click event for videos
    $(".media video").on('mousedown', function(e)
    {
        //show drag again
        $("#drag").removeClass("hidden");
        
        //hide video
        $(e.target).addClass("hidden");
        $(e.target).addClass("selected");
        
        //set dragging to true
        dragging = true;
        
    });
    
    $(document).on('mouseup', function(e)
    {
        //check if we are dragging and mouseup is on the blank
        if(dragging && $(e.target)[0] == $("#blank")[0])
        {
            //chekc if its the right term that was draggged in
            var term = $(".selected")[0].id.toString();
            term = term.substring(0, term.length - 3);
            if(term == rounds[round].Term)
            {
                //show star and up score
                score++;
                $(".selected").siblings('img').removeClass("hidden");
                $(".selected").removeClass("selected");
                
                
            }
            else //not the correct awnser- punish
            {
                //hide drag and show hidden video
                $(".selected").removeClass("hidden");
                $(".selected").removeClass("selected");
                $("#drag").addClass("hidden");
                
                //some stuff w/ score??
            }
        }
        else //we let go not on the blank
        {
            console.log("boo");
            
            //hide drag and show hidden video
            $(".selected").removeClass("hidden");
            $(".selected").removeClass("selected");
            $("#drag").addClass("hidden");
        }
        
        //we obvi arent dragign if the user let go of the mouse button
        dragging = false;
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
    value: function(obj) {
        var newArr = this.filter(function(el) {
          return el == obj;
        });
        return newArr.length > 0;
      }
  });
}