let $exclusiveStart =
  document.querySelector(".exclusive").getBoundingClientRect().top +
  pageYOffset -
  window.innerHeight * 0.4;
let $exclusiveEnd =
  $exclusiveStart +
  document.querySelector(".exclusive").getBoundingClientRect().height +
  window.innerHeight * 0.05;

window.addEventListener("scroll", function () {
  let $links = document.querySelectorAll(".header-nav-link");

/*   if (pageYOffset < window.innerHeight) {
    for (let i = 0; i < $links.length; i++) {
      $links[i].classList.add("whitelink");
    }
  } else */ if (pageYOffset > $exclusiveStart && pageYOffset < $exclusiveEnd) {
    document.querySelector("body").classList.add("violet");
    document.querySelector("body").classList.remove("normal");
    for (let i = 0; i < $links.length; i++) {
      $links[i].classList.add("whitelink");
    }
  } else {
    document.querySelector("body").classList.remove("violet");
    document.querySelector("body").classList.add("normal");

    for (let i = 0; i < $links.length; i++) {
      $links[i].classList.remove("whitelink");
    }
  }
});

function baranScroll() {
  var examples = document.querySelector('.slider-big');
  examples.scrollIntoView({behavior: "smooth", block: "start"});
}

function offset(el) {
  return el.getBoundingClientRect().top;
}

if (window.innerWidth < 1079) {
  document.querySelector(".hero").style = `height: ${window.innerHeight}px`;
}

$(document).ready(function () {
  $(".slider-big").slick({
    centerMode: true,
    centerPadding: "200px",
    slidesToShow: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: true,
          centerMode: true,
          centerPadding: "40px",
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: true,
          centerMode: true,
          centerPadding: "40px",
          slidesToShow: 1,
        },
      },
    ],
  });
});


$(document).ready(function () {
  $(".example-picture").slick({
    centerMode: true,
    dots: true,
    swipe: false,
    fade: true,
    centerPadding: "0px",
    slidesToShow: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: true,
          centerMode: true,
          centerPadding: "40px",
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: true,
          centerMode: true,
          centerPadding: "40px",
          slidesToShow: 1,
        },
      },
    ],
  });
});
