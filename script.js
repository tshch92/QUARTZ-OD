const UAHRATE = 0.037;
const EURRATE = 1.18;
const DELIVERY = 40;
const GREEDRATE = 1.3;
const WAGE = {
  //0.5sl - 300,
  20: { 0.5: 300, 1: 450 },
  //1.5sl - 450*1.5
  //0.5sl - 300,
  40: { 0.5: 300, 1: 550 },
  //1.5sl - 550*1.5
};
const SHAPEDEDGE = 35;

//норма расхода клея на 1 сляб
const GLUE = 40;

const discounts = {
  Atem: 0,
  Avant: 0.29,
  Belenco: 0.2,
  Caesarstone: 0.27,
  Hanstone: 0,
  Reston: 0,
  Vicostone: 0.25,
  Silestone: 0.2,
  Ginger: 0,
  Quarella: 0,
  Quartzforms: 0,
  Royal: 0.27,
  Çimstone: 0,
  Intekstone: 0,
  Radianz: 0.15,
  SantaMargherita: 0,
};

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

const $brandlist = getBrandList(samplesArray);

function filterChipBuilder(element) {
  return `
      <div class="chip-basic">
        <input type="checkbox" id="${element}" name="${element}" value="${element}">
        <label for="${element}" class="text-bold">${element}</label>
      </div>
      `;
}

function alignPrices(array) {
  array.forEach((element) => {
    if (!element.price.usd && element.price.eur) {
      element.price.usd = element.price.eur * EURRATE;
    } else if (!element.price.usd && element.price.uah) {
      element.price.usd = element.price.uah * UAHRATE;
    }
  });
}

alignPrices(samplesArray);

function getCosts(array) {
  array.forEach((element) => {
    let slabSpent = formatsObj[element.slab];

    element.cost =
      element.price.usd * (1 - discounts[element.brand]) * slabSpent;

    let totalCost = element.cost;

    //console.log(element.brand + " " + element.color);
    //console.log(
    //formatsObj[element.slab] + " сляба: " + Math.round(element.cost)
    //);
    //console.log("доставка: " + DELIVERY * formatsObj[element.slab]);

    totalCost += DELIVERY * slabSpent;

    if (kitchen.thickness === 40) {
      totalCost += GLUE * slabSpent;
      //console.log("клей: " + GLUE * slabSpent);
    }

    if (slabSpent === 0.5) {
      totalCost += WAGE[kitchen.thickness]["0.5"];
      //console.log("работа: " + WAGE[kitchen.thickness]["0.5"]);
    } else {
      totalCost += WAGE[kitchen.thickness]["1"] * slabSpent;
      //console.log("работа: " + WAGE[kitchen.thickness]["1"] * slabSpent);
    }

    let edgeLength = 0;
    switch (kitchen.shape) {
      case "I":
        edgeLength = kitchen.details[0].l + kitchen.details[0].w;
        break;

      case "L":
        edgeLength = kitchen.details[0].l + kitchen.details[1].l;
        break;

      case "U":
        edgeLength =
          kitchen.details[0].l +
          kitchen.details[1].l -
          kitchen.details[0].w -
          kitchen.details[2].w +
          kitchen.details[2].l;
        break;

      default:
        break;
    }

    if (
      kitchen.profile === "edge3" ||
      kitchen.profile === "edge4" ||
      kitchen.profile === "edge5" ||
      kitchen.profile === "edge6" ||
      kitchen.profile === "edge7"
    ) {
      totalCost += (SHAPEDEDGE * edgeLength) / 1000;
    }

    //console.log("ИТОГО для мебельщика: " + Math.round(totalCost));

    totalCost *= GREEDRATE;
    element.totalCost = Math.round(totalCost);

    //console.log("умножаем на коэффициент жадности " + GREEDRATE);
    //console.log("--ИТОГО для конечника: " + element.totalCost);
  });
}

getCosts(samplesArray);

function getMinPrice(array) {
  let tempArray = [];
  array.forEach((element) => {
    if (element.totalCost) {
      tempArray.push(element.totalCost);
    }
  });
  return Math.min(...tempArray);
}

function getMaxPrice(array) {
  let tempArray = [];
  array.forEach((element) => {
    if (element.totalCost) {
      tempArray.push(element.totalCost);
    }
  });
  return Math.max(...tempArray);
}

function sampleTemplate(sample) {
  return `
    <div class="sample ${sample.recommend} ${sample.preorder} ${sample.out}">
        <div style="background-image: url(${sample.picture})" alt='${
    sample.brand
  } ${sample.color}' class="sample-image ${sample.surface} ${
    sample.pattern
  }"></div>
        <div class="sample-text">
            <div class="sample-top">
                <div class="sample-brand text">${sample.brand}</div>
                <div class="sample-slabs">${formatsObj[sample.slab]}</div>
            </div>
            <div class="sample-bottom">
                <div class="sample-name text-bold">${sample.color}</div>
                <div class="sample-price text-bold">от ${Math.round(
                  sample.totalCost
                )}$</div>
            </div>
        </div>
    </div>
    `;
}

document.querySelector("#brandlist").innerHTML = `${$brandlist
  .map(filterChipBuilder)
  .join("")}`;

samplesArray.sort(function (a, b) {
  if (a.brand < b.brand) {
    return -1;
  }
  if (a.brand > b.brand) {
    return 1;
  }

  // names must be equal
  return 0;
});

document.getElementById("samples123").innerHTML = `
${samplesArray.map(sampleTemplate).join("")}
`;

document.querySelector(".result-sum").textContent = `
${getMinPrice(samplesArray)}$ - ${getMaxPrice(samplesArray)}$
`;

// поиск и рендер цветов по критериям фильтра

let filteredSamplesArray = [];

document.querySelector("#colorselect").addEventListener("change", function (e) {
  const filterValues = {
    brand: [...document.querySelectorAll("#brandlist input:checked")].map(
      (n) => n.value
    ),

    colorgroup: [...document.querySelectorAll("#colorlist input:checked")].map(
      (n) => n.value
    ),

    pattern: [...document.querySelectorAll("#patternlist input:checked")].map(
      (n) => n.value
    ),

    surface: [...document.querySelectorAll("#surfacelist input:checked")].map(
      (n) => n.value
    ),
  };

  //console.log(filterValues);

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

  let filtersAreEmpty = true;

  for (let i in filterValues) {
    if (filterValues[i].length !== 0) {
      filtersAreEmpty = false;
      break;
    }
  }

  //console.log(filtersAreEmpty);

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
  } else {
    filteredSamplesArray.sort(function (a, b) {
      if (a.brand < b.brand) {
        return -1;
      }
      if (a.brand > b.brand) {
        return 1;
      }

      // names must be equal
      return 0;
    });
  }

  //console.log(filteredSamplesArray);

  document.querySelector("#samples123").innerHTML = filteredSamplesArray
    .map(sampleTemplate)
    .join("");

  if (getMinPrice(filteredSamplesArray) === getMaxPrice(filteredSamplesArray)) {
    document.querySelector(".result-sum").textContent = `от 
    ${getMaxPrice(filteredSamplesArray)}$
    `;
  } else {
    document.querySelector(".result-sum").textContent = `
    ${getMinPrice(filteredSamplesArray)}$ - ${getMaxPrice(
      filteredSamplesArray
    )}$
    `;
  }

  if (!filteredSamplesArray.length) {
    document.querySelector(".result-sum").textContent = `???`;
    document.getElementById("samples123").textContent = `
    Извините, такого кварца у нас нет :(
    `;
  }

  renderSamplesSummary(filterValues);
});

function renderKitchenSummary() {
  switch (kitchen.shape) {
    case "I":
      document.getElementByClassName(
        ".kitchen-summary"
      ).textContent = `Кухня ${kitchen.details[0].l} мм, `;
      break;

    case "L":
      document.querySelector(
        ".kitchen-summary"
      ).textContent = `Кухня ${kitchen.details[0].l}x${kitchen.details[1].l} мм, `;
      break;
    case "U":
      document.querySelector(
        ".kitchen-summary"
      ).textContent = `Кухня ${kitchen.details[0].l}x${kitchen.details[1].l}х${kitchen.details[2].l} мм, `;
      break;

    default:
      break;
  }

  document.querySelector(
    ".kitchen-summary"
  ).textContent += `столешница ${kitchen.thickness}мм, `;

  switch (kitchen.profile) {
    case "edge1":
      document.querySelector(".kitchen-summary").textContent += `фаска 3х3, `;
      break;

    case "edge2":
      document.querySelector(".kitchen-summary").textContent += `фаска R3, `;
      break;
    case "edge3":
      document.querySelector(".kitchen-summary").textContent += `о-профиль, `;
      break;
    case "edge4":
      document.querySelector(".kitchen-summary").textContent += `M-профиль, `;
      break;
    case "edge5":
      document.querySelector(".kitchen-summary").textContent += `рваный край, `;
      break;
    case "edge6":
      document.querySelector(
        ".kitchen-summary"
      ).textContent += `лофт профиль, `;
      break;
    case "edge7":
      document.querySelector(".kitchen-summary").textContent += `M-профиль, `;
      break;

    default:
      break;
  }

  switch (kitchen.backsplash) {
    case true:
      document.querySelector(
        ".kitchen-summary"
      ).textContent += `пристенки 40мм`;
      break;

    default:
      document.querySelector(
        ".kitchen-summary"
      ).textContent += `без пристенков`;
      break;
  }
}

renderKitchenSummary();

function renderSamplesSummary(obj) {
  let end = Math.abs(filteredSamplesArray.length % 100);
  let word = "";

  if (end >= 11 && end <= 14) {
    word = "цветов";
  } else if ((end >= 2 && end <= 4) || (end % 10 >= 2 && end % 10 <= 4)) {
    word = "цвета";
  } else if (end === 1 || end % 10 === 1) {
    word = "цвет";
  } else {
    word = "цветов";
  }

  document.querySelector(
    ".stones-summary"
  ).textContent = `Найдено: ${filteredSamplesArray.length} ${word}. `;
  for (let i in obj) {
    document.querySelector(".stones-summary").textContent += obj[i];
  }
}

// переключалка выбора кухни и цветов камней - на мобильном

document
  .querySelector(".stones-collapsed")
  .addEventListener("click", function () {
    document.querySelector(".kitchen-collapsed").style = "display: flex";
    document.querySelector("#samples123").style = "display: flex";
    document.querySelector(".colorselect").style = "display: block";
    document.querySelector(".kitchen").style = "display: none";
    document.querySelector(".stones-collapsed").style = "display: none";
  });

document
  .querySelector(".kitchen-collapsed")
  .addEventListener("click", function () {
    document.querySelector(".stones-collapsed").style = "display: flex";
    document.querySelector("#samples123").style = "display: none";
    document.querySelector(".colorselect").style = "display: none";
    document.querySelector(".kitchen").style = "display: block";
    document.querySelector(".kitchen-collapsed").style = "display: none";
  });

// фильтры цветов на мобильном

var acc = document.getElementsByClassName("filter-card-title");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    if (window.innerWidth <= 1078) {
      /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
      this.classList.toggle("active");

      /* Toggle between hiding and showing the active panel */
      var panel = this.nextElementSibling;
      if (panel.style.display === "flex") {
        panel.style.display = "none";
      } else {
        panel.style.display = "flex";
      }
    }
  });
}
