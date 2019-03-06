import _ from "underscore";
import templateRawText from "html/carouselTemplate.html!text";
//$(document).ready(function() {
//    
//});
var imageLink = 'img/carousel/1.jpg';

var index = 0;


var numberToShow = 0;


function createPanelList(panels, showCount, startIndex, endIndex, pictures, holder, justImage) {
    if (justImage == true) {
        console.log(pictures);
        for (var x = 0; x < pictures.length; x++) {
            var imageTagRepeat = document.createElement("IMG");
            imageTagRepeat.setAttribute("id", "test");
            imageTagRepeat.setAttribute("src", pictures[x].story.coverImage);



            var percentage = 100 / showCount;
            var leftStart = (180 * (percentage / 100)) * x;
            imageTagRepeat.style.left = leftStart.toString() + "px";
            imageTagRepeat.style.width = percentage.toString() + "%";


            if (showCount == 1) {

                imageTagRepeat.style.paddingLeft = "10px";
                imageTagRepeat.style.paddingRight = "10px";
                imageTagRepeat.style.backgroundColor = "#0098ba";
            } else {
                imageTagRepeat.style.backgroundColor = "gray";
            }

            holder.appendChild(imageTagRepeat);

            panels[x] = imageTagRepeat;
        }
    } 
    else {
        for (var x = 0; x < pictures.length; x++) {
            var imageTagRepeat = document.createElement("div");
           // imageTagRepeat.setAttribute("id", "test");
            //imageTagRepeat.setAttribute("src", pictures[x].story.coverImage);



            /*  var percentage = 100 / showCount;
            var leftStart = (180 * (percentage / 100)) * x;
            $(pictures[x]).attr("left", '"' + leftStart.toString() + '"px'); // = leftStart.toString() + "px";
            //imageTagRepeat.$element[0].width(percentage);
           

            //= percentage.toString() + "%";


            if (showCount == 1) {
                $(pictures[x]).attr("paddingLeft", "10px");
                $(pictures[x]).attr("paddingRight", "10px");
                $(pictures[x]).attr("backgroundColor", "#0098ba");
                /*
                imageTagRepeat.style.paddingLeft = "10px";
                imageTagRepeat.style.paddingRight = "10px";
                imageTagRepeat.style.backgroundColor = "#0098ba";
               
            } else {

                $(pictures[x]).attr("backgroundColor", "gray");
            }
 */

            var percentage = 100 / showCount;
            var leftStart = (180 * (percentage / 100)) * x;
            imageTagRepeat.style.left = leftStart.toString() + "px";
            imageTagRepeat.style.width = percentage.toString() + "%";
            $(pictures[x]).attr("width", "100%");

            if (showCount == 1) {
                imageTagRepeat.style.paddingLeft = "10px";
                imageTagRepeat.style.paddingRight = "10px";
                imageTagRepeat.style.height = "100%";

                imageTagRepeat.style.backgroundColor = "#0098ba";
            } else {
                imageTagRepeat.style.backgroundColor = "gray";
            }
            console.log($(imageTagRepeat));
            $(imageTagRepeat).append($(pictures[x].$element));
       
            holder.appendChild(imageTagRepeat);
            panels[x] = imageTagRepeat;
        }
    }

}

function drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, direction, offset) {

    for (var x = 0; x < panels.length; x++) {
        if (x >= startIndex && x <= endIndex) {
            //            $(panels[x]).attr("display", "inline-block");
            panels[x].style.display = "inline-block";
        } else {
            panels[x].style.display = "inline-block";
            //            $(panels[x]).attr("display", "inline-block");
        }
        var amountToTranslate = -100 * offset;

        if (direction == "right") {
            //           // $(panels[x]).attr("transform", "translateX(" + amountToTranslate + "%)");
            //            $(panels[x]).attr("transition", "all 2s");
            panels[x].style.transform = "translateX(" + amountToTranslate + "%)";
            panels[x].style.transition = "all 2s";
        } else if (direction == "left") {
            //            $(panels[x]).attr("transform", "translateX(" + amountToTranslate + "%)");
            //            $(panels[x]).attr("transition", "all 2s");
            panels[x].style.transform = "translateX(" + amountToTranslate.toString() + "%)";
            panels[x].style.transition = "all 2s";
        } else {

        }





    }

}


function Carousel(id, imageList, showing, justimage) {
    // this.id = index++;
    //var templateRawText = $("#template").html();
    var panelCount;
    var panels = [, , ];
    var pictures = [];
    var identifier;
    var startIndex = 0;
    var endIndex;
    var showCount;
    var holder;
    var offset = 0;
    numberToShow = showing;
    var parent;
    var test = 0;
    endIndex = showing - 1;
    showCount = showing;
    pictures = imageList;

    panelCount = imageList.length;


    identifier = id;

    var compiledTemplate = _.template(templateRawText);

    var templateResult = compiledTemplate({
        name: "George",
        second: "Chase",
        image1: imageLink,
        id: index++
    });

    $(id).html(templateResult);

    var tempIndex = index - 1;

    parent = document.getElementById("carousel-" + tempIndex.toString());

    parent.parentElement.style.backgroundColor = "#0098ba";
    parent.parentElement.style.paddingLeft = "10%";
    parent.parentElement.style.paddingRight = "10%";
    // parent.parentElement.style.textAlign = "center";

    holder = parent.querySelector("div");


    var buttonRight = parent.getElementsByClassName("right")[0];


    buttonRight.onclick = function () {

        if (endIndex >= imageList.length - 1) {

        } else {
            offset += showing;
            startIndex = startIndex + showing;
            endIndex = endIndex + showing;
            drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, "right", offset);
        }





    };
    var buttonLeft = parent.getElementsByClassName("left")[0];
    buttonLeft.onclick = function () {

        if (startIndex <= 0) {

        } else {
            offset -= showing;
            startIndex = startIndex - showing;
            endIndex = endIndex - showing;
        }

        drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, "left", offset);


    };

    createPanelList(panels, showCount, startIndex, endIndex, pictures, holder, justimage);
    drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, null);

}

export default Carousel
