    /**************************** THUMBNAIL CAROUSEL ****************************/

    // Set up the thumbnail carousel
    function setupCarousel() {
        $(".regular").slick({
            dots: true,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3
        });
    }