document.querySelector("#searchInput").addEventListener("input", function (e) {
  let filter = e.target.value.toUpperCase();

  matchingSamplesArray = [];

  for (i = 0; i < samplesArray.length; i++) {
    txtValue = samplesArray[i].color.toUpperCase();
    //brand = samplesArray[i].brand.toUpperCase();
    if (txtValue.indexOf(filter) > -1 /* || brand.indexOf(filter) > -1 */) {
      matchingSamplesArray.push(samplesArray[i]);
    }
  }

  //console.log(e.target.value);

  renderSamples();
  recalc();
  renderSamplesSummary(matchingSamplesArray);
});

function setSameFilterValues(id, prop) {
  let tmpList = document.getElementById(id).querySelectorAll("input");

  for (let i = 0; i < tmpList.length; i++) {
    if (filterValues[prop].includes(tmpList[i].value)) {
      tmpList[i].checked = true;
    } else if (
      id === "surfacelist" &&
      filterValues[prop].join(" ") === tmpList[i].value
    ) {
      tmpList[i].checked = true;
    } else {
      tmpList[i].checked = false;
    }
  }
}

function lookalike(e) {
  //console.log("begu iskat!");

  if (window.innerWidth <= 1078) {
    var allFilterTitles = document.getElementsByClassName("filter-card-title");

    for (var i = 0; i < allFilterTitles.length; i++) {
      allFilterTitles[i].classList.remove("active");
    }

    document.querySelector("#showmorebrands").style.display = "none";
    document.querySelector("#showlessbrands").style.display = "none";
  }

  let matte = [
    "matte",
    "leather",
    "seta",
    "honed",
    "velvet-touch",
    "brushed",
    "suede",
  ].includes(e.target.getAttribute("data-surface"));

  let drift = ["drift", "spacco", "chenille", "brash", "volcano"].includes(
    e.target.getAttribute("data-surface")
  );

  let glanz = e.target.getAttribute("data-surface") === "glanz";

  let S = [];

  switch (true) {
    case matte:
      S = [
        "matte",
        "leather",
        "seta",
        "honed",
        "velvet-touch",
        "brushed",
        "suede",
      ];
      break;

    case drift:
      S = ["drift", "spacco", "chenille", "brash", "volcano"];
      break;

    case glanz:
      S = ["glanz"];
      break;

    default:
      break;
  }

  filterValues = {
    pattern: e.target.getAttribute("data-pattern").split(","),

    colorgroup: e.target.getAttribute("data-colorgroup").split(","),

    surface: S,

    brand: [],
  };

  //console.log(filterValues);

  document.querySelector("#filter2").checked = true;
  setSameFilterValues("colorlist", "colorgroup");
  setSameFilterValues("patternlist", "pattern");
  setSameFilterValues("brandlist", "brand");
  setSameFilterValues("surfacelist", "surface");

  matchingSamplesArray = [];

  applyFilters();

  document.querySelector("#searchInput").style = "display: none";
  document.querySelector("#searchInput").value = "";
  let filtercards = document.querySelectorAll(".filter-card");
  for (let i = 0; i < filtercards.length; i++) {
    filtercards[i].style = "display: block";
  }

  renderSamples();
  renderMinMaxPrice();
  renderSamplesSummary(filteredSamplesArray, filterValues);
  window.scrollTo(0, 0);
}

document.querySelector("#samples123").addEventListener("click", function (e) {
  if (e.target.className === "lookalike text-bold") {
    lookalike(e);
  }
  return;
});
