import Carousel from 'js/Carousel';


$(document).ready(function(){
    new Carousel("#templateResult", ['img/carousel/from_this_author/1.png', 
                                     'img/carousel/from_this_author/1.png', 'img/carousel/from_this_author/1.png', 'img/carousel/from_this_author/2.png', 'img/carousel/from_this_author/2.png', 
                                     'img/carousel/from_this_author/2.png',
                                     'img/carousel/from_this_author/3.png', 'img/carousel/from_this_author/3.png', 
                                     'img/carousel/from_this_author/3.png' ], 4);
   new Carousel("#templateResultTwo", ['img/carousel/from_this_author/1.png', 
                                     'img/carousel/from_this_author/1.png', 'img/carousel/from_this_author/1.png', 'img/carousel/from_this_author/2.png', 'img/carousel/from_this_author/2.png', 
                                     'img/carousel/from_this_author/2.png',
                                     'img/carousel/from_this_author/3.png', 'img/carousel/from_this_author/3.png', 
                                     'img/carousel/from_this_author/3.png' ], 3);
})