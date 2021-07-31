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
  //"Atem",
  //"Avant",
  //"Caesarstone",
  "Belenco",
  "Reston",
  //"Vicostone",
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
      if (filterValues["surface"].length) {
        return filterValues["surface"].includes(sample["surface"]);
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

  console.log(filtersAreEmpty + " empty filters ex brands. APPLYING FILTERS?");

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
let custombrandlist = [];

filterValues = {
  brand: $staticbrandlist,
  colorgroup: [],
  pattern: [],
  surface: [],
};

let diff = $brandlist.length - $staticbrandlist.length;

document.querySelector("#brandlist").innerHTML = `${$brandlist
  .map(filterChipBuilder)
  .join("")}`;

document.querySelector(
  "#brandlist"
).innerHTML += `<button class="text-bold btn-simple" id="showmorebrands" onclick='showmorebrands()'>ещё...</button>`;
document.querySelector(
  "#brandlist"
).innerHTML += `<button class="text-bold btn-simple" id="showlessbrands" onclick='showlessbrandspro()'>показать основные</button>`;

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

function shortenbrands() {
  let checkedbrands = [
    ...document.querySelectorAll("#brandlist input:checked"),
  ].map((n) => n.value);

  if (!checkedbrands.length) {
    filterValues.brand = $staticbrandlist;
    applyFilters();
    renderSamples();
    renderMinMaxPrice();
  }
}

function showlessbrandspro() {
  showlessbrands();
  shortenbrands();
}

function showmorebrands() {
  let arr = document.querySelectorAll("#brandlist .chip-basic");

  arr.forEach((element) => {
    element.style = "display:flex";
  });

  let checkedbrands = [
    ...document.querySelectorAll("#brandlist input:checked"),
  ].map((n) => n.value);

  if (!checkedbrands.length) {
    console.log("не біло чекнутіх брендов, показіваем все ");
    filterValues.brand = [];
    applyFilters();
    renderSamples();
    renderMinMaxPrice();
  } else {
    console.log("есть чекнутые бренды, ничего не делаем!");
  }

  document.querySelector("#showlessbrands").style = "display: flex";
  document.querySelector("#showmorebrands").style = "display: none";
}

showlessbrandspro();
renderSamplesSummary(samplesArray, filterValues);
renderKitchenSummary();

// поиск и рендер цветов по критериям фильтра

document.querySelector("#colorselect").addEventListener("change", function (e) {
  function helper() {
    //console.log(filterValues);

    //console.log(isChip);
    applyFilters();

    if (
      !filteredSamplesArray.length &&
      Boolean(
        document.querySelector("#showmorebrands").style.display === "flex"
      )
    ) {
      showmorebrands();
    }

    renderSamples();
    renderMinMaxPrice();
    renderSamplesSummary(filteredSamplesArray, filterValues);
  }

  let isChip = Boolean(
    e.target.id !== "searchInput" &&
      e.target.name !== "tabs" &&
      e.target.name !== "tabs"
  );

  console.log(e.target);

  let checkedbrands = [
    ...document.querySelectorAll("#brandlist input:checked"),
  ].map((n) => n.value);

  switch (true) {
    case isChip &&
      Boolean(
        document.querySelector("#showmorebrands").style.display === "flex"
      ) &&
      Boolean(checkedbrands.length):
      //console.log("панель брендов свернута, checked brands: " + checkedbrands);

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

        surface: [
          ...document.querySelectorAll("#surfacelist input:checked"),
        ].map((n) => n.value),
      };
      helper();

      break;

    case Boolean(
      isChip &&
        Boolean(
          document.querySelector("#showmorebrands").style.display === "flex"
        ) &&
        Boolean(!checkedbrands.length)
    ):
      

      console.log(
        "панель брендов свернута, ни одного не вібрано, все значения брендов дефолтные"
      );

      //console.log(custombrandlist);

      filterValues = {
        brand: $staticbrandlist,

        colorgroup: [
          ...document.querySelectorAll("#colorlist input:checked"),
        ].map((n) => n.value),

        pattern: [
          ...document.querySelectorAll("#patternlist input:checked"),
        ].map((n) => n.value),

        surface: [
          ...document.querySelectorAll("#surfacelist input:checked"),
        ].map((n) => n.value),
      };

      if (custombrandlist.length) {
        filterValues.brand = custombrandlist;
      }

      helper();

      break;

    case isChip && Boolean(
      document.querySelector("#showlessbrands").style.display === "flex"
    ) && Boolean(!checkedbrands.length):
      console.log(
        "панель брендов развернута, все значения брендов дефолт"
      );

      ////console.log(custombrandlist);

      filterValues = {
        brand: $brandlist,

        colorgroup: [
          ...document.querySelectorAll("#colorlist input:checked"),
        ].map((n) => n.value),

        pattern: [
          ...document.querySelectorAll("#patternlist input:checked"),
        ].map((n) => n.value),

        surface: [
          ...document.querySelectorAll("#surfacelist input:checked"),
        ].map((n) => n.value),
      };

      helper();

      break;

      case isChip && Boolean(!checkedbrands.length):
        console.log(
          "pikapika"
        );
  
        ////console.log(custombrandlist);
  
        filterValues = {
          brand: custombrandlist,
  
          colorgroup: [
            ...document.querySelectorAll("#colorlist input:checked"),
          ].map((n) => n.value),
  
          pattern: [
            ...document.querySelectorAll("#patternlist input:checked"),
          ].map((n) => n.value),
  
          surface: [
            ...document.querySelectorAll("#surfacelist input:checked"),
          ].map((n) => n.value),
        };
  
        helper();
  
        break;
    

    case isChip:
      console.log("frooooog ");

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

        surface: [
          ...document.querySelectorAll("#surfacelist input:checked"),
        ].map((n) => n.value),
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
      switch (true) {
        case [...e.target.classList].includes("filter-card-title") &&
          [...e.target.classList].includes("active") &&
          Boolean(e.target.nextElementSibling.id === "brandlist"):
          showlessbrands();
          shortenbrands();
          document.querySelector("#showmorebrands").style = "display: none";
          e.target.classList.remove("active");
          break;

        case [...e.target.classList].includes("filter-card-title") &&
          [...e.target.classList].includes("active"):
          e.target.classList.remove("active");
          break;

        case [...e.target.classList].includes("filter-card-title") &&
          Boolean(e.target.nextElementSibling.id === "brandlist"):
          //console.log(e.target.nextElementSibling.id);

          document.querySelector("#showmorebrands").style = "display: flex";

          for (var i = 0; i < allFilterTitles.length; i++) {
            allFilterTitles[i].classList.remove("active");
          }
          e.target.classList.add("active");
          break;

        case [...e.target.classList].includes("filter-card-title") &&
          Boolean(e.target.nextElementSibling.id !== "brandlist"):
          showlessbrands();
          //shortenbrands();
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
  renderMinMaxPrice();
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
  renderMinMaxPrice();
});
