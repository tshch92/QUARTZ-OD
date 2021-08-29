function titleCase(str) {
  str = str.toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

function getBrandList(arr) {
  let result = [];

  arr.forEach((element) => {
    if (!result.includes(element.brand.toLowerCase())) {
      result.push(element.brand.toLowerCase());
    }
  });

  result.sort();

  return result.map(titleCase);
}

const $staticbrandlist = [
  "Atem",
  "Avant",
  "Caesarstone",
  "Belenco",
  "Reston",
  "Vicostone",
];

function applyFilters() {
  //console.log("applying filters");

  filteredSamplesArray = samplesArray
    .filter(function (sample) {
      if (filterValues["brand"].length) {
        return filterValues["brand"].includes(sample["brand"]);
      } else {
        return true;
      }
    })
    .filter(function (sample) {
      if (filterValues["colorgroup"].length) {
        for (let i of filterValues["colorgroup"]) {
          if (sample["colorGroup"].includes(i)) {
            return true;
          }
        }
        return false;
      } else {
        return true;
      }
    })
    .filter(function (sample) {
      if (filterValues["pattern"].length) {
        for (let i of filterValues["pattern"]) {
          if (sample["pattern"].includes(i)) {
            return true;
          }
        }
        return false;
      } else {
        return true;
      }
    })
    .filter(function (sample) {
      if (
        filterValues["surface"].length &&
        filterValues["surface"].includes(sample["surface"])
      ) {
        return true;
      } else if (filterValues["surface"].length) {
        return false;
      } else {
        return true;
      }
    });

  for (let i in filterValues) {
    if (filterValues[i].length !== 0 && i !== "brand") {
      filtersAreEmpty = false;
      break;
    }
    filtersAreEmpty = true;
  }

  //console.log(filtersAreEmpty + " empty filters ex brands. APPLYING FILTERS?");

  if (!filtersAreEmpty) {
    filteredSamplesArray.sort(function (a, b) {
      if (a.recommend < b.recommend) {
        return 1;
      }
      if (a.recommend > b.recommend) {
        return -1;
      }

      // names must be equal
      return 0;
    });
  }

  return;
}

const $brandlist = getBrandList(samplesArray);

let diff = $brandlist.length - $staticbrandlist.length;

document.querySelector("#brandlist").innerHTML = `${$brandlist
  .map(filterChipBuilder)
  .join("")}`;

document.querySelector(
  "#brandlist"
).innerHTML += `<button class="text-bold btn-simple" id="showmorebrands" onclick='showmorebrands()'>ещё...</button>`;
document.querySelector(
  "#brandlist"
).innerHTML += `<button class="text-bold btn-simple" id="showlessbrands" onclick='showlessbrands()'>показать основные</button>`;

function showlessbrands() {
  let arr = document.querySelectorAll("#brandlist .chip-basic");

  diff = $brandlist.length;

  custombrandlist = [];

  //невібранніе и не стандартніе бренді - прячем

  arr.forEach((element) => {
    if (
      $staticbrandlist.includes(element.querySelector("input").value) ||
      element.querySelector("input:checked")
    ) {
      diff--;
      custombrandlist.push(element.querySelector("input").value);
      //console.log(diff);
    } else {
      element.style = "display:none";
    }
  });

  let end = Math.abs(diff % 100);
  let word = "";

  if (end >= 11 && end <= 14) {
    word = "брендов";
  } else if ((end >= 2 && end <= 4) || (end % 10 >= 2 && end % 10 <= 4)) {
    word = "бренда";
  } else if (end === 1 || end % 10 === 1) {
    word = "бренд";
  } else {
    word = "брендов";
  }

  document.querySelector("#showlessbrands").style = "display: none";
  document.querySelector("#showmorebrands").style = "display: flex";
  document.querySelector(
    "#showmorebrands"
  ).textContent = `ещё ${diff} ${word}...`;
}

function showmorebrands() {
  let arr = document.querySelectorAll("#brandlist .chip-basic");

  arr.forEach((element) => {
    element.style = "display:flex";
  });

  document.querySelector("#showlessbrands").style = "display: flex";
  document.querySelector("#showmorebrands").style = "display: none";
}

showlessbrands();
renderSamples();
renderMinMaxPrice();
renderSamplesSummary(uniqueSamplesArray, filterValues);
renderKitchenSummary();

// поиск и рендер цветов по критериям фильтра

document.querySelector("#colorselect").addEventListener("change", function (e) {
  function helper() {
    applyFilters();
    renderSamples();
    renderMinMaxPrice();
    renderSamplesSummary(filteredSamplesArray, filterValues);
  }

  let isChip = Boolean(
    e.target.id !== "searchInput" && e.target.name !== "tabs"
  );

  switch (true) {
    case isChip:
      //console.log("some filter values were changed");

      filterValues = {
        brand: [...document.querySelectorAll("#brandlist input:checked")].map(
          (n) => n.value
        ),
        colorgroup: [
          ...document.querySelectorAll("#colorlist input:checked"),
        ].map((n) => n.value),

        pattern: [
          ...document.querySelectorAll("#patternlist input:checked"),
        ].map((n) => n.value),

        surface: [...document.querySelectorAll("#surfacelist input:checked")]
          .map((n) => n.value.split(" "))
          .flat(),
      };
      helper();

      break;

    default:
      break;
  }
});

// аккордеон фильтры цветов на мобильном

if (window.innerWidth <= 1078) {
  //console.log("smallscreen");

  document.querySelector("#showmorebrands").style = "display: none";

  var allFilterTitles = document.getElementsByClassName("filter-card-title");

  document
    .querySelector("#colorselect")
    .addEventListener("click", function (e) {
      let isCardTitle = [...e.target.classList].includes("filter-card-title");
      let isActiveCardTitle = Boolean(
        [...e.target.classList].includes("filter-card-title") &&
          [...e.target.classList].includes("active")
      );

      switch (true) {
        case isActiveCardTitle &&
          Boolean(e.target.nextElementSibling.id === "brandlist"):
          showlessbrands();
          document.querySelector("#showmorebrands").style = "display: none";

          e.target.classList.remove("active");
          break;

        case isActiveCardTitle:
          e.target.classList.remove("active");
          break;

        case isCardTitle &&
          Boolean(e.target.nextElementSibling.id === "brandlist"):
          //console.log(e.target.nextElementSibling.id);

          document.querySelector("#showmorebrands").style = "display: flex";

          for (var i = 0; i < allFilterTitles.length; i++) {
            allFilterTitles[i].classList.remove("active");
          }
          e.target.classList.add("active");
          break;

        case isCardTitle:
          showlessbrands();
          document.querySelector("#showmorebrands").style = "display: none";

          for (var i = 0; i < allFilterTitles.length; i++) {
            allFilterTitles[i].classList.remove("active");
          }
          e.target.classList.add("active");
          break;

        default:
          break;
      }
    });
}

document.querySelector("#search2").addEventListener("click", function () {
  document.querySelector("#searchInput").style = "display: flex";

  let filtercards = document.querySelectorAll(".filter-card");
  for (let i = 0; i < filtercards.length; i++) {
    filtercards[i].style = "display: none";
  }
  //console.log('search on');

  renderSamples();
  recalc();
});

document.querySelector("#filter2").addEventListener("click", function () {
  matchingSamplesArray = [];

  document.querySelector("#searchInput").style = "display: none";
  document.querySelector("#searchInput").value = "";
  let filtercards = document.querySelectorAll(".filter-card");
  for (let i = 0; i < filtercards.length; i++) {
    filtercards[i].style = "display: block";
  }
  //console.log('filters on');

  renderSamples();
  recalc();
});
