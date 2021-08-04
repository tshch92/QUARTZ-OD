function filterChipBuilder(element) {
  return `
        <div class="chip-basic">
            <input type="checkbox" id="${element}" name="${element}" value="${element}">
            <label for="${element}" class="text-bold">${element}</label>
        </div>
        `;
}

function sampleTemplate(sample) {
  return `
      <div class="sample">
        <div class="sample-image">
            <picture class="${sample.pattern}">
                <source media="(max-width: 360px)" srcset=${sample.picture} />
                <source media="(max-width: 414px)" srcset=${
                  sample.picture354
                } />
                <source media="(max-width: 766px)" srcset=${
                  sample.picture706
                } />

                <img src=${sample.picture} alt="${sample.brand} ${
    sample.color
  }" loading="lazy" />
            </picture>
            <div class="sample-labels">
                <span class=${sample.recommend}></span>
                <span class=${sample.preorder}></span>
                <span class=${sample.out}></span>
            </div>
        </div>
        <div class="sample-text">
            <div class="sample-top">
                <div class="sample-brand text">${sample.brand}</div>
                <div class="sample-slabs">${formatsObj[sample.slab][0]}</div>
            </div>
            <div class="sample-bottom">
                <div class="sample-name text-bold">${sample.color}</div>
                <div class="sample-price text-bold">от ${Math.round(
                  sample.totalCost
                )}$<span class="${formatsObj[sample.slab][2]}"></span></div>
            </div>
        </div>
    </div>
      `;
}

function sampleLookalike(sample) {
  return `
        <div class="sample">
          <div class="sample-image">
            <picture class="${sample.pattern}">
                <source media="(max-width: 360px)" srcset=${sample.picture} />
                <source media="(max-width: 414px)" srcset=${
                  sample.picture354
                } />
                <source media="(max-width: 766px)" srcset=${
                  sample.picture706
                } />

                <img src=${sample.picture} alt="${sample.brand} ${
    sample.color
  }" loading="lazy" />
            </picture>
            <div class="sample-labels">
                <span class=${sample.recommend}></span>
                <span class=${sample.preorder}></span>
                <span class=${sample.out}></span>
            </div>
          </div>
            <div class="sample-text">
                <div class="sample-top">
                    <div class="sample-brand text">${sample.brand}</div>
                    <div class="sample-slabs">${formatsObj[sample.slab][0]}</div>
                </div>
                <div class="sample-bottom">
                    <div class="sample-name text-bold">${sample.color}</div>
                    <div class="sample-price text-bold ${formatsObj[sample.slab][2]}">от ${Math.round(
                      sample.totalCost
                    )}$</div>
                </div>
                <button class="lookalike text-bold" data-colorgroup='${
                  sample.colorGroup
                }' data-surface='${sample.surface}' data-pattern='${
    sample.pattern
  }'>
                        Искать похожие цвета
                </button>
            </div>
        </div>
        `;
}

function renderKitchenSummary() {
  switch (kitchen.shape) {
    case "I":
      document.querySelector(
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

function renderSamplesSummary(arr, obj) {
  let end = Math.abs(arr.length % 100);
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
  ).textContent = `Найдено: ${arr.length} ${word}. `;
  if (obj) {
    for (let i in obj) {
      document.querySelector(".stones-summary").textContent += obj[i];
      document.querySelector(".stones-summary").textContent += " ";
    }
  }
}

let filteredSamplesArray = [];
let matchingSamplesArray = [];
let filterValues = {};
let filtersAreEmpty = true;

function renderSamples() {
  let $sectionSamples = document.getElementById("samples123");

  switch (true) {
    case Boolean(document.querySelector("#search2").checked) &&
      Boolean(matchingSamplesArray.length) &&
      Boolean(document.querySelector("#searchInput").value):
      $sectionSamples.innerHTML = `
    ${matchingSamplesArray.map(sampleLookalike).join("")}
  `;
      //console.log("есть результаті текстового поиска");
      break;

    case Boolean(document.querySelector("#search2").checked) &&
      Boolean(document.querySelector("#searchInput").value):
      $sectionSamples.innerHTML = `
      <span class='text-bold'>Извините, такого кварца у нас нет :(</span>
      `;
      //console.log("текстовій поиск ничего не нашел");
      break;

    case Boolean(document.querySelector("#search2").checked):
      $sectionSamples.innerHTML = `
  ${samplesArray.map(sampleTemplate).join("")}
`;
      //console.log("пустое поле текстового поиска");
      break;

    case Boolean(filteredSamplesArray.length):
      $sectionSamples.innerHTML = `
  ${filteredSamplesArray.map(sampleTemplate).join("")}
`;
      console.log("результат фильтра");
      //console.log(filterValues);
      break;

    case Boolean(!filteredSamplesArray.length) && !filtersAreEmpty:
      $sectionSamples.innerHTML = `
  <span class='text-bold'>Извините, такого кварца у нас нет :(</span>
  `;
      console.log("нет камня, которій соответствует критериям фильтров");
      break;

    default:
      $sectionSamples.innerHTML = `
      ${samplesArray.map(sampleTemplate).join("")}
    `;
      console.log("дефолтній вид");
      break;
  }

  return $sectionSamples.innerHTML;
}

function checkSamePrice(arr) {
  if (getMinPrice(arr) === getMaxPrice(arr)) {
    return `от 
        ${getMaxPrice(arr)}$
        `;
  }
  return `
        ${getMinPrice(arr)}$ - ${getMaxPrice(arr)}$
        `;
}

function renderMinMaxPrice() {
  let $sumOutput = document.querySelector(".result-sum");

  if (matchingSamplesArray.length) {
    $sumOutput.textContent = checkSamePrice(matchingSamplesArray);
  } else if (filteredSamplesArray.length) {
    $sumOutput.textContent = checkSamePrice(filteredSamplesArray);
  } else if (!filteredSamplesArray.length && !filtersAreEmpty) {
    $sumOutput.textContent = "???";
  } else if (
    !matchingSamplesArray.length &&
    document.querySelector("#searchInput").value
  ) {
    $sumOutput.textContent = "???";
  } else {
    $sumOutput.textContent = checkSamePrice(samplesArray);
  }
}
