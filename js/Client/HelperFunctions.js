import _ from 'underscore';
export default ImageHoverSwap

function ImageHoverSwap(hoverID, imageID, img, imgHover)
{
    //add hover event that swaps images
    $(hoverID).hover(function () //mouse enter
    {
        //set source to use hover version
        $(imageID).attr('src', imgHover);
    }, function() //mosue exit
    {
        //set source to use normal version
        $(imageID).attr('src', img);
    });
    
}