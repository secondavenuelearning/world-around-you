import 'style/Carousel.css!';
import _ from "underscore";
import html from "html/Client/Carousel.html!text";
import ImageHoverSwap from 'js/Client/HelperFunctions.js';

var imageLink = 'img/carousel/1.jpg';

var index = 0;


var numberToShow = 0;


function createPanelList(panels, showCount, startIndex, endIndex, pictures, holder, justImage) {
    if (justImage == true) {
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
            pannel.append($(pictures[x].$element));
       
            holder.appendChild(pannel[0]);
            panels[x] = pannel[0];
        }
    }

}

function drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, direction, offset, isOverlay) {
    for (var x = 0; x < panels.length; x++) {
        var adjust = 0;
        if(isOverlay) { adjust = 0; }
        
        if (x >= startIndex && x <= endIndex) {
            //            $(panels[x]).attr("display", "inline-block");
            panels[x].style.display = "inline-block";
        } else {
            panels[x].style.display = "inline-block";
            //            $(panels[x]).attr("display", "inline-block");
        }
        var amountToTranslate = (-100 * offset) - adjust;

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


function Carousel(id, imageList, showing, justimage, isOverlay, titleText) {
    // this.id = index++;
    //var html = $("#template").html();
    var panelCount;
    var panels = [];
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
    
    if(showing == 1) { $(parent).addClass("single"); }

    parent.parentElement.style.backgroundColor = "#0098ba";
  //  parent.parentElement.style.paddingLeft = "10%";
    //parent.parentElement.style.paddingRight = "10%";
    // parent.parentElement.style.textAlign = "center";

    holder = parent.querySelector("div");


    var buttonRight = parent.getElementsByClassName("right")[0];


    buttonRight.onclick = function () {
        //$('#' + itemsID + ' > .image-holder > .page-indicator > .dots').children().eq(Math.floor(startIndex / showing)).removeAttr('id');
        $('#' + itemsID + " #current").removeAttr('id');
        if (endIndex >= imageList.length - 1) {
            offset = 0;
            startIndex = 0;
            endIndex = startIndex + showing - 1;

        } else {
            
            offset += showing;
            startIndex = startIndex + showing;
            endIndex = endIndex + showing;
        }
        
        drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, "right", offset, isOverlay);

         //update indicator
        $('#' + itemsID + ' > .image-holder > .page-indicator > .dots').children().eq(Math.floor(startIndex / showing)).attr('id', 'current');



    };
    var buttonLeft = parent.getElementsByClassName("left")[0];
    buttonLeft.onclick = function () {
 $('#' + itemsID + " #current").removeAttr('id');

        if (startIndex <= 0) {
            offset = imageList.length - 1;
            startIndex = imageList.length - 1;
            endIndex = imageList.length - 1;

        } else {
            
            offset -= showing;
            startIndex = startIndex - showing;
            endIndex = endIndex - showing;
        } console.log(offset + " " + startIndex);

        drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, "left", offset, isOverlay);
        
        $('#' + itemsID + ' > .image-holder > .page-indicator > .dots').children().eq(Math.floor(startIndex / showing)).attr('id', 'current');


    };
    BuildTitle(isOverlay, holder, titleText);
    createPanelList(panels, showCount, startIndex, endIndex, pictures, holder, justimage);
    drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, "right", 0, isOverlay);
    
    var itemsID = "carousel-" + tempIndex.toString();
    BuildIndexIndicator(isOverlay, holder, panelCount / showing, panels, startIndex, endIndex, showing, offset);
    $('#' + itemsID + ' > .image-holder > .page-indicator > .dots').children().eq(0).attr('id', 'current');
    
      $('#' + itemsID + " .dots").delegate('div', 'click', function () {
       $('#' + itemsID + " #current").removeAttr('id');
       /*
        $(this).attr('id', 'current');
        startIndex = showing * $(this).index();
        endIndex = startIndex + (showing-1);
        console.log(startIndex);
        offset = parseInt($(this).index()) + panels;
        console.log(offset);
        drawPanels(panels, 0,0,0,0,0,"left",offset,true);
        */
        $(this).attr('id', 'current');
            offset = parseInt($(this).index()) * showing;
            startIndex = showing * $(this).index();

            endIndex = startIndex + showing - 1;
        
        drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, "right", offset, isOverlay);
    });
    
    //add special functionality for overlays
    if(isOverlay)
    {
        //on hover hide title and index indicator
        $(holder).hover(function()
        {
            $('#' + itemsID + ' > .image-holder > .pageTitle').css('opacity', '0');
        }, function()
        {
            $('#' + itemsID + ' > .image-holder > .pageTitle').css('opacity', '1');
        });
    }
    
    //add hover functionality to icons
    ImageHoverSwap(id + " .carousel-nav.left", id + " .carousel-nav.left .carousel-nav-img", "../../img/icons/General/icon_Page_Back.svg", "../../img/icons/General/icon_Page_Back_hoverDown.svg");
    
    ImageHoverSwap(id + " .carousel-nav.right", id + " .carousel-nav.right .carousel-nav-img", "../../img/icons/General/icon_Page_Next.svg", "../../img/icons/General/icon_Page_Next_hoverDown.svg");

}

/*Builds indicator for where in carousel pages user is
(isOverlay: bool for is this indicator acts as an overlay ontop of carousel items, or exists in the space round items)
(carouselItemID: html id of the holder for this carousels items)
(pages: number of pages - should be total items / number showing)
*/
function BuildIndexIndicator(isOverlay, carouselItemID, pages, panels, startIndex, endIndex, showing, offset)
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
    indicatorHTML += "<div class = \"dots\""; // dots bar
    indicatorHTML += "style=\"width: " + (pages*20) + "px;\">"; //size of each dot, multipled by dots
    if(pages > 1){
        for(var i = 0; i < pages; i++)
        {
            indicatorHTML += "<div class = \"dot\"> </div>"; //actual dot
        }
    }else{
        $('.carousel-nav').css('visibility', 'hidden');
    }
    indicatorHTML += "</div></div>";
    
    //add built html to page
    $(carouselItemID).append(indicatorHTML);
   /* var dots = document.getElementsByClassName("dot");
    console.log(dots);
     
    for(var x = 0; x<dots.length;x++){
      var temp = x;
        dots[x].onclick = function(){
            
           
     
         
        };
    }
    */
  
     
}
function BuildTitle(isOverlay, carouselItemID, title)
{
    //build html
    var indicatorHTML = "<div class = \"pageTitle";
    if(isOverlay) 
    {
        indicatorHTML += " overlay\"><span>" + " " + title + "</span>";
    }
    else
    {
        indicatorHTML += "\">" + " " + title;
        
        //give holder tag for a makeover if its not an aoverlay
        $(carouselItemID).addClass("outerIndicator");
    }
   
    indicatorHTML += "</div>";
    
    //add built html to page
    $(carouselItemID).append(indicatorHTML);
}

export default Carousel
