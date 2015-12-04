Session.setDefault("searchTerm","");
Session.setDefault("prev","/");
Session.set("boxClosed",true);
Session.set("searched", false); //used only for desk/laptop

Template.layout.helpers({
    mobileTitle:function() {
        return Session.get("pageTitle");
    }
});

Template.layout.events({
    'submit #searchForm': function (event) {
        event.preventDefault();
        var s = document.getElementById("searchBox").value;
        Session.setPersistent("searchTerm", s);

        Router.go('/search');
     },
     'focus #searchBox': function (event) {
        event.preventDefault();
        var s = document.getElementById("searchBox").value;
        Session.setPersistent("searchTerm", s);

        Router.go('/search');
     },
     'click #searchGlass':function(event) {
         event.preventDefault();
         if ($(window).width() > 768) { //desk/laptop
            webSearch();
         }
         else { //mobile
            mobileSearch();
         }
     },
     'click #links':function(event) {
         if (!Session.get("boxClosed")) {
            webSearch();
         }
     },

     'click .back':function(event) {
         event.preventDefault();
         Router.go(Session.get("prev"));

         if (Session.get("searched")) {
            Session.set("boxClosed",false);
         }
     },
     'click .nav-link':function(event) {
         slideNav();
     }
});

Template.layout.rendered = function() { 
   slide();
   
   document.getElementById("searchBox").value = Session.get("searchTerm");
};

function webSearch() {
    $("#searchBox").toggle("slow").focus();
    if (!Session.get("boxClosed")) {
       Session.set("boxClosed",true);
       Session.set("searched", true);
    } else {
       Session.set("boxClosed",false);
       Session.set("searched", true);
    }
}

function mobileSearch() {
    if ($("#searchForm").css("display") == "none") {
        $("#searchForm").toggle();
        $("#searchBox").focus();
    }
    else {
        $("#searchForm").toggle();
    }
}

// Adapted from http://jsbin.com/eHAfIhI/1/edit?html,css,js,output
function slide() {
    //stick in the fixed 100% height behind the navbar but don't wrap it
    $('#slide-nav.navbar .container').append($('<div id="navbar-height-col"></div>'));


    var toggler = '#toggleBtn';
    $("#slide-nav").on("click", toggler, function (e) {
        slideNav();   
  
    });


    var selected = '#slidemenu, #page-content, body, .navbar, .navbar-header';


    $(window).on("resize", function () {

        if ($(window).width() > 768 && $('.navbar-toggle').is(':hidden')) {
            $(selected).removeClass('slide-active');
        }


    });
}

function slideNav() {
    var pagewrapper = '#page-content';
    var navigationwrapper = '.navbar-header';
    var slidewidth = '60%';
    var menuneg = '-100%';
    var slideneg = '-60%';
    
    var selected = $(".navbar-header").hasClass('slide-active');
    
    if ($(window).width() < 769) {
        $("#searchGlass").toggle("searchGlass");
        
        if ($("#searchForm").css("display") != "none")
            $("#searchForm").toggle("searchForm");
    }

    $('#navbar-hamburger').stop().animate({
        left: selected ? menuneg : '0px'
    });

    $('#navbar-height-col').stop().animate({
        left: selected ? slideneg : '0px'
    });

    $(pagewrapper).stop().animate({
        left: selected ? '0px' : slidewidth
    });

    $(navigationwrapper).stop().animate({
        left: selected ? '0px' : slidewidth
    });


    $(this).toggleClass('slide-active', !selected);
    $('#navbar-hamburger').toggleClass('slide-active');


    $('#page-content, .navbar, body, .navbar-header').toggleClass('slide-active');
}