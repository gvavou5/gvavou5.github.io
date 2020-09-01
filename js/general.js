$(document).ready(function(){ // here so that I know that all the items have been initialised

  // Get the navbar
  var navbar = document.getElementById("navbar");
  var content = document.getElementById("pageContent");

  // Get the offset position of the navbar
  var sticky = navbar.offsetTop;
  var navbarHeight = navbar.offsetHeight;
  var moveOrNot = true;
  var activeCounter = 1;
  //for the active highlight
  let mainNavLinks = document.querySelectorAll(".topnav .link");
  let mainSections = document.querySelectorAll(".aboutme .education .skills .professionalexperience");
  let lastId;
  let cur = [];

  $(window).on('scroll', function() {
    let fromTop = window.scrollY;
    /**
      active selection
    **/
    //console.log("offset Top : " + navbar.offsetTop + " offset height: " + navbar.offsetHeight + " page offset " + window.pageYOffset)
    //navbarHeight = navbar.offsetHeight;
    mainNavLinks.forEach(link => {
      let section = document.querySelector(link.hash);
      if (
        section.offsetTop <= fromTop + navbarHeight  &&
        section.offsetTop + section.offsetHeight >= fromTop + navbarHeight
      ) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
    /**
      sticky navbar
    **/
    if (window.pageYOffset >= sticky) {
      navbar.classList.add("sticky");
      content.classList.add("moveContentDown");
    } else {
      navbar.classList.remove("sticky");
      content.classList.remove("moveContentDown");
    }
  });

  $(mainNavLinks).click(function() {
    //if we try to move to the same hash with the navbar, go again on top
    if (this.hash == window.location.hash){
      moveToSection();
      return false;
    }
    return true;//if you have to move, go to the handler
  });

  $(window).on('hashchange', function() {
    if ( "onhashchange" in window ) {
      moveToSection();
    }
  });

  function moveToSection(){
    var hash = window.location.hash.substring( 1 );
    if ( !hash )
        return;

    // vanish the dropdown menu so that the page is visible and in order to calculate
    // offset correctly
    var x = document.getElementById("navbar");
    if (x.className === "topnav responsive" || x.className === "topnav sticky responsive"){
          x.classList.remove('responsive');
    }

    var offset = navbarHeight;
    var sel = '[id="' + hash + '"], a[name="' + hash + '"]';
    var currentOffset = $( sel ).offset().top;
    console.log(currentOffset + " " + offset);
    $( window ).scrollTop( currentOffset - offset );
  }

  //on click handler for the responsive navbar
  document.querySelector('.icon').addEventListener('click', function() {
    var x = document.getElementById("navbar");
    if (x.className === "topnav" || x.className === "topnav sticky") {
      x.classList.add('responsive');
    } else {
      x.classList.remove('responsive');
    }
    return true;
  })

});
