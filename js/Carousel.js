import _ from "underscore";
import templateRawText from "html/carouselTemplate.html!text";
//$(document).ready(function() {
//    
//});
var imageLink = 'img/carousel/1.jpg';

var index = 0;

function clearPanels(panels) {
    console.log("Panels " + panels);
    for (var x = 0; x < panels.length; x++) {
        if (panels[x] == null) {

        } else {
            console.log("Removed");
            panels[x].remove();
        }

    }
    panels = [];

}

function drawPanels(panels, showCount, startIndex, endIndex, pictures, holder) {
    clearPanels(panels);
    if (showCount <= 1) {
        var imageTag = document.createElement("IMG");
        imageTag.setAttribute("id", "test");
        imageTag.setAttribute("src", pictures[startIndex]);
        imageTag.style.height = "152px";
        imageTag.style.width = "280px";
        holder.appendChild(imageTag);

        panels[0] = imageTag;

    } else {

        for (var x = startIndex; x < endIndex + 1; x++) {
            if (x >= pictures.length) {

            } else {
                var imageTagRepeat = document.createElement("IMG");
                imageTagRepeat.setAttribute("id", "test");
                imageTagRepeat.setAttribute("src", pictures[x]);
                imageTagRepeat.style.height = "152px";
                imageTagRepeat.style.width = "280px";
                holder.appendChild(imageTagRepeat);

                panels[x] = imageTagRepeat;
            }

        }
    }
}

function Carousel(id, imageList, showing) {
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
    parent.style.display = "inline-block"
    console.log(parent);
    holder = parent.querySelector("div");
    

    var buttonRight = parent.getElementsByClassName("right")[0];
    console.log(buttonRight);

    buttonRight.onclick = function () {
        if (endIndex >= imageList.length - 1) {

        } else {
            startIndex = startIndex + showing;
            endIndex = endIndex + showing;
        }

        drawPanels(panels, showCount, startIndex, endIndex, pictures, holder);


    };
    var buttonLeft = parent.getElementsByClassName("left")[0];
    buttonLeft.onclick = function () {
        if (startIndex <= 0) {

        } else {
            startIndex = startIndex - showing;
            endIndex = endIndex - showing;
        }
        console.log("Running left");
        drawPanels(panels, showCount, startIndex, endIndex, pictures, holder);


    };

    drawPanels(panels, showCount, startIndex, endIndex, pictures, holder);
    console.log("Panels " + panels);

}

export default Carousel
