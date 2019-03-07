import 'style/Carousel.css!';
import _ from "underscore";
import html from "html/Client/Carousel.html!text";

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
            var pannel = $(`<div class="carousel-panel" style="width: ${100 / showCount}%"></div>`);

            // var percentage = 100 / showCount;
            // var leftStart = (180 * (percentage / 100)) * x;
            // imageTagRepeat.style.left = leftStart.toString() + "px";
            // imageTagRepeat.style.width = percentage.toString() + "%";
            // $(pictures[x]).attr("width", "100%");

            if (showCount == 1) {
                // imageTagRepeat.style.paddingLeft = "10px";
                // imageTagRepeat.style.paddingRight = "10px";
    
                // imageTagRepeat.style.height = "600px";
            } else {
                // imageTagRepeat.style.height = "252px";
            }
            console.log($(imageTagRepeat));
            pannel.append($(pictures[x].$element));
       
            holder.appendChild(pannel[0]);
            panels[x] = pannel[0];
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
            panels[x].style.transform = "translateX(" + amountToTranslate + "%)";
        } else if (direction == "left") {
            //            $(panels[x]).attr("transform", "translateX(" + amountToTranslate + "%)");
            panels[x].style.transform = "translateX(" + amountToTranslate.toString() + "%)";
        } else {

        }





    }

}


function Carousel(id, imageList, showing, justimage) {
    // this.id = index++;
    //var html = $("#template").html();
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

    var template = _.template(html);

    var templateResult = template({
        name: "George",
        second: "Chase",
        image1: imageLink,
        id: index++
    });

    $(id).html(templateResult);

    var tempIndex = index - 1;

    parent = document.getElementById("carousel-" + tempIndex.toString());

    parent.parentElement.style.backgroundColor = "#0098ba";
  //  parent.parentElement.style.paddingLeft = "10%";
    //parent.parentElement.style.paddingRight = "10%";
    // parent.parentElement.style.textAlign = "center";

    holder = parent.querySelector("div");


    var buttonRight = parent.getElementsByClassName("right")[0];


    buttonRight.onclick = function () {

        if (endIndex >= imageList.length - 1) {

        } else {
            $('#' + itemsID + ' > .image-holder > .page-indicator > .dots').children().eq(Math.floor(startIndex / showing)).removeAttr('id');
            
            offset += showing;
            startIndex = startIndex + showing;
            endIndex = endIndex + showing;
            drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, "right", offset);
            
            //update indicator
            $('#' + itemsID + ' > .image-holder > .page-indicator > .dots').children().eq(Math.floor(startIndex / showing)).attr('id', 'current');
        }





    };
    var buttonLeft = parent.getElementsByClassName("left")[0];
    buttonLeft.onclick = function () {

        if (startIndex <= 0) {

        } else {
            $('#' + itemsID + ' > .image-holder > .page-indicator > .dots').children().eq(Math.floor(startIndex / showing)).removeAttr('id');
            
            offset -= showing;
            startIndex = startIndex - showing;
            endIndex = endIndex - showing;
            
            $('#' + itemsID + ' > .image-holder > .page-indicator > .dots').children().eq(Math.floor(startIndex / showing)).attr('id', 'current');
        }

        drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, "left", offset);


    };

    createPanelList(panels, showCount, startIndex, endIndex, pictures, holder, justimage);
    drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, null);
    
    var itemsID = "carousel-" + tempIndex.toString();
    BuildIndexIndicator(false, holder, panelCount / showing);
    $('#' + itemsID + ' > .image-holder > .page-indicator > .dots').children().eq(0).attr('id', 'current');

}

/*Builds indicator for where in carousel pages user is
(isOverlay: bool for is this indicator acts as an overlay ontop of carousel items, or exists in the space round items)
(carouselItemID: html id of the holder for this carousels items)
(pages: number of pages - should be total items / number showing)
*/
function BuildIndexIndicator(isOverlay, carouselItemID, pages)
{
    //build html
    var indicatorHTML = "<div class = \"page-indicator";
    if(isOverlay) 
    {
        indicatorHTML += " overlay\">";
    }
    else
    {
        indicatorHTML += "\">";
        
        //give holder tag for a makeover if its not an aoverlay
        $(carouselItemID).addClass("outerIndicator");
    }
    indicatorHTML += "<div class = \"dots\"";
    indicatorHTML += "style=\"width: " + (pages*30) + "px;\">";
    for(var i = 0; i < pages; i++)
    {
        indicatorHTML += "<div class = \"dot\"> </div>";
    }
    indicatorHTML += "</div></div>";
    
    //add built html to page
    $(carouselItemID).append(indicatorHTML);
}

export default Carousel
