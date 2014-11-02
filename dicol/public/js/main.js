jQuery(function($){
    /**
     * Script for navigation menu
     *
     */
    $('#navmenu').tinyNav({
        header: 'Menu principal' // Writing any title with this option triggers the header
    });

    /**
     * Extra script for smoothier navigation effect
     */
    if ($(window).width() > 960) {
        $('#menu-navi .dropdown-toggle').addClass('disabled');
        $('.navbar .dropdown').hover(function () {
            "use strict";
            $(this).addClass('open').find('.dropdown-menu').first().stop(true, true).delay(250).slideDown();
        }, function () {
            "use strict";
            var na = $(this);
            na.find('.dropdown-menu').first().stop(true, true).delay(100).slideUp('fast', function () {
                na.removeClass('open');
            });
        });
    }

    /**
     * Script for back-to-top button effect
     */
    $(window).scroll(function () {
        if ($(this).scrollTop() != 0) {
            $('#bttop').fadeIn();
        } else {
            $('#bttop').fadeOut();
        }
    });
    $('#bttop').click(function () {
        $('body,html').animate({scrollTop: 0}, 800);
    });
    
    $("#navbar li a").click(function(event) {
        // check if window is small enough so dropdown is created
        $("#nav-collapse").removeClass("in").addClass("collapse");
    });


});

//@ sourceURL = main.js