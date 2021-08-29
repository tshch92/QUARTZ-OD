let $exclusiveStart =
  document.querySelector(".exclusive").getBoundingClientRect().top +
  pageYOffset -
  window.innerHeight * 0.5;
let $exclusiveEnd =
  $exclusiveStart +
  document.querySelector(".exclusive").getBoundingClientRect().height -
  window.innerHeight * 0.5;

window.addEventListener("scroll", function () {
  let $links = document.querySelectorAll(".header-nav-link");

  if (pageYOffset < window.innerHeight) {
    for (let i = 0; i < $links.length; i++) {
      $links[i].classList.add("whitelink");
    }
  } else if (pageYOffset > $exclusiveStart && pageYOffset < $exclusiveEnd) {
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

function offset(el) {
  return el.getBoundingClientRect().top;
}
