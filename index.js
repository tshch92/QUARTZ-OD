window.addEventListener("scroll", function () {
  let $links = document.querySelectorAll(".header-nav-link");

  if (pageYOffset > window.innerHeight) {

    for (let i = 0; i< $links.length; i++) {
      $links[i].classList.remove('whitelink');
    }

  } else {

    for (let i = 0; i< $links.length; i++) {
      $links[i].classList.add('whitelink');
    }

  }
});
