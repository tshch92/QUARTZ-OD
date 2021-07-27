window.addEventListener("scroll", function () {
  if (pageYOffset > window.innerHeight) {
    document.querySelector(".header-nav").style = "color: black";
  } else {
    document.querySelector(".header-nav").style = "color: white";
  }
});
