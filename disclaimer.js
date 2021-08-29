/* document.querySelector(".btn.OK").addEventListener("click", function () {
  document.querySelector("#disclaimer").style = "display: none";
}); */

document
  .querySelector("#opendisclaimer")
  .addEventListener("click", function () {
    document.querySelector("#disclaimer").style = "display: flex";
  });


let aboutsinks = document.querySelectorAll(".aboutsinks");

for (let i = 0; i < Object.keys(aboutsinks).length; i++) {
  aboutsinks[i].addEventListener("click", function () {
    document.querySelector("#about-sinks").style = "display: flex";
  });
}

document.querySelector(".openpopup").addEventListener("click", function () {
  document.querySelector("#complexkitchenshape").style = "display: flex";
});

/*   document.querySelector(".btn-close").addEventListener("click", function () {
    document.querySelector("#complexkitchenshape").style = "display: none";
  }); */

function closePopup(el) {
  document.getElementById(el.parentNode.parentNode.id).style = "display: none";
}
