function filterChipBuilder(element) {
  return `
        <div class="chip-basic">
            <input type="checkbox" id="${element}" name="${element}" value="${element}">
            <label for="${element}" class="text-bold">${element}</label>
        </div>
        `;
}

function SAMPLEBASE(sample) {
  return `
<div class="sample ${sample.surface}">
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
      </div> `};

function sampleTemplate(sample) {

  if (sample.fabricSilestoneTotalcost) {
    return SAMPLEBASE(sample) + `
        <div class="sample-bottom">
            <div class="sample-name text-bold">${sample.color}</div>
            <div class="sample-price text-bold"></div>
        </div>
        <div class="sample-bottom">
            <div class="text">c клееной мойкой:</div>
            <div class="sample-price text-bold">от ${Math.round(
              sample.totalCost
            )}$<span class="${formatsObj[sample.slab][2]}"></span></div>
        </div>
        <div class="sample-bottom" style="color: teal">
            <div class="text" style="display:flex; align-items: center;">
            <button class="aboutsinks" aria-label="more about quartz sinks"></button>
            c фабричной мойкой </div>
            <div class="sample-price text-bold">от ${sample.fabricSilestoneTotalcost}$<span class="${formatsObj[sample.slab][2]}"></span></div>
        </div>
    </div>
    </div>
    `
  } else {

  return SAMPLEBASE(sample) + `
            <div class="sample-bottom">
                <div class="sample-name text-bold">${sample.color}</div>
                <div class="sample-price text-bold">от ${
                  sample.totalCost
                }$<span class="${formatsObj[sample.slab][2]}"></span></div>
            </div>
        </div>
    </div>
      `};
}

function sampleLookalike(sample) {
  return `
        <div class="sample ${sample.surface}">
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
                    <div class="sample-slabs">${
                      formatsObj[sample.slab][0]
                    }</div>
                </div>
                <div class="sample-bottom">
                    <div class="sample-name text-bold">${sample.color}</div>
                    <div class="sample-price text-bold">от ${Math.round(
                      sample.totalCost
                    )}$<span class="${formatsObj[sample.slab][2]}"></span></div>
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

function addCustom(detailType) {
  let tmpNode = document.createElement("div");
  tmpNode.id = Date.now();

  switch (detailType) {
    case "island":
      tmpNode.className = `parameter-options customInput ${detailType}`;
      tmpNode.innerHTML = `

      <button class='removenode'></button>
        <input type="text" class="input-small text-bold length" placeholder="${defaultKitchen.island.l}">
        <span class="text">x</span>
        <input type="text" class="input-small text-bold width" placeholder="${defaultKitchen.island.w}">

      `;

      kitchen.island = {
        l: defaultKitchen.island.l,
        w: defaultKitchen.island.w,
      };

      break;

    case "bar":
      tmpNode.className = `parameter-options customInput ${detailType}`;
      tmpNode.innerHTML = `
  
        <button class='removenode'></button>
          <input type="text" class="input-small text-bold length" placeholder="${defaultKitchen.bar.l}">
          <span class="text">x</span>
          <input type="text" class="input-small text-bold width" placeholder="${defaultKitchen.bar.w}">
  
        `;

      kitchen.bar = {
        l: defaultKitchen.bar.l,
        w: defaultKitchen.bar.w,
      };

      break;

    case "panel":
      tmpNode.className = `parameter-options customInput ${detailType}`;
      tmpNode.innerHTML = `
  
        <button class='removenode'></button>
          <input type="text" class="input-small text-bold length" placeholder="${kitchen.details[0].l}">
          <span class="text">x</span>
          <input type="text" class="input-small text-bold width" placeholder="560">
  
        `;

      kitchen.panels[tmpNode.id] = {
        l: kitchen.details[0].l,
        w: 560,
      };

      break;

    case "leg":
      tmpNode.className = `parameter-options customInput ${detailType}`;
      tmpNode.innerHTML = `
  
          <button class='removenode'></button>
          <input type="text" class="input-small text-bold length" placeholder="850">
          <span class="text">x</span>
          <input type="text" class="input-small text-bold width" placeholder="${kitchen.details[0].w}">
          <input type="checkbox" class="visible" id='${tmpNode.id}-checkbox'>
          <label for='${tmpNode.id}-checkbox' class='text'>изнанка</label>
  
        `;

      kitchen.legs[tmpNode.id] = {
        l: 850,
        w: kitchen.details[0].w,
        visibility: false,
      };

      break;

    default:
      break;
  }

  document.getElementById(detailType).appendChild(tmpNode);

  recalc();
  renderSamples();
  adjustCustom();

  return;
}

function renderKitchenSummary() {
  switch (kitchen.shape) {
    case "I":
      document.querySelector(
        ".kitchen-summary"
      ).textContent = `Кухня ${kitchen.details[0].l} мм`;
      break;

    case "L":
      document.querySelector(
        ".kitchen-summary"
      ).textContent = `Кухня ${kitchen.details[0].l}x${kitchen.details[1].l} мм`;
      break;
    case "U":
      document.querySelector(
        ".kitchen-summary"
      ).textContent = `Кухня ${kitchen.details[0].l}x${kitchen.details[1].l}х${kitchen.details[2].l} мм`;
      break;

    default:
      break;
  }

  if (kitchen.island) {
    document.querySelector(
      ".kitchen-summary"
    ).textContent += ` + остров ${kitchen.island.l}x${kitchen.island.w}мм`;
  }

  document.querySelector(
    ".kitchen-summary"
  ).textContent += `, столешница ${kitchen.thickness}мм, `;

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
let uniqueSamplesArray = [];
let uniqueColors = [];
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
      ${uniqueSamplesArray.map(sampleTemplate).join("")}
    `;
      console.log("дефолтній вид unique");
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

function addCutout(detailType) {
  let tmpNode = document.createElement("div");
  tmpNode.id = Date.now();

  tmpNode.className = `cutout-card ${detailType}`;

  switch (detailType) {
    case "sink":
      tmpNode.innerHTML = `
                        <div class="cutout-header">
                          <span class="cutout-title text-bold">Мойка</span>
                          <button class="removenode"></button>
                        </div>
                        <div class="parameter-options cutout-options-64">
                          <div class="btn-text-64">
                            <input type="radio" id="${tmpNode.id}-undermount" name='${tmpNode.id}-cutout-type' value="undermount" checked>
                            <label for="${tmpNode.id}-undermount" class="icon-undermount text">подстол.</label>
                          </div>
                          <div class="btn-text-64">
                            <input type="radio" id="${tmpNode.id}-levelmount" name='${tmpNode.id}-cutout-type' value="levelmount">
                            <label for="${tmpNode.id}-levelmount" class="icon-levelmount text">заподлицо</label>
                          </div>
                          <div class="btn-text-64">
                            <input type="radio" id="${tmpNode.id}-quartz" name='${tmpNode.id}-cutout-type' value="quartz">
                            <label for="${tmpNode.id}-quartz" class="icon-quartz text">из кварца</label>
                          </div>
                        </div>
                        <div class="parameter-options cutout-options-48" style="display: none">
                          <div class="btn-text-48">
                            <input type="radio" id="${tmpNode.id}-round"  name='${tmpNode.id}-quartz-type' value="round" checked>
                            <label for="${tmpNode.id}-round" class="icon-round text">круглый сток</label>
                          </div>
                          <div class="btn-text-48">
                            <input type="radio" id="${tmpNode.id}-line" name='${tmpNode.id}-quartz-type' value="line">
                            <label for="${tmpNode.id}-line" class="icon-line text">щелевая</label>
                          </div>
                        </div>
                        <div class="parameter-options cutout-size-radios" style="display: none">
                          <div class="chip-basic">
                            <input type="radio" id="${tmpNode.id}-400x400" name="${tmpNode.id}-sinksize" value="540x440" checked>
                            <label for="${tmpNode.id}-400x400" class="text">540x440</label>
                          </div>
                          <div class="chip-basic">
                            <input type="radio" id="${tmpNode.id}-500x400" name="${tmpNode.id}-sinksize" value="670x435">
                            <label for="${tmpNode.id}-500x400" class="text">670x435</label>
                          </div>
                          <div class="chip-basic">
                            <input type="radio" id="${tmpNode.id}-600x400" name="${tmpNode.id}-sinksize" value="370x400">
                            <label for="${tmpNode.id}-600x400" class="text">370x400</label>
                          </div>
                          <div class="chip-basic">
                            <input type="radio" id="${tmpNode.id}-700x400" name="${tmpNode.id}-sinksize" value="540x400">
                            <label for="${tmpNode.id}-700x400" class="text">540x400</label>
                          </div>
                        </div>
                        <div>
                          <div class="parameter-options cutout-size-inputs" style="display: none">
                              <input type="text" id='${tmpNode.id}-l' class="input-small text-bold" placeholder="600">
                              <span class="text">x</span>
                              <input type="text" id='${tmpNode.id}-w' class="input-small text-bold" placeholder="350">
                          </div>
                        </div>
                        <div>
                          <div class="parameter-options cutout-cannelures cannelures">
                            <input type="checkbox" class="tick" id='${tmpNode.id}-cannelures'>
                            <label for='${tmpNode.id}-cannelures' class='text-bold'>мокрый стол (каннелюры)</label>
                          </div>
                        </div>

`;

      kitchen.cutouts[tmpNode.id] = {
        class: detailType,
        type: "undermount",
        cannelures: false,
      };

      break;

    case "cooktop":
      tmpNode.innerHTML = `
                          <div class="cutout-header">
                              <span class="cutout-title text-bold">Варочная</span>
                              <button class="removenode"></button>
                          </div>
                          <div class="parameter-options cutout-options-48">
                              <div class="btn-text-48">
                                  <input type="radio" id="${tmpNode.id}-round"  name='${tmpNode.id}-quartz-type' value="undermount" checked>
                                  <label for="${tmpNode.id}-round" class="icon-round text">подстол.</label>
                              </div>
                              <div class="btn-text-48">
                                  <input type="radio" id="${tmpNode.id}-line" name='${tmpNode.id}-quartz-type' value="levelmount">
                                  <label for="${tmpNode.id}-line" class="icon-line text">заподлицо</label>
                              </div>
                          </div>
  
  `;

      kitchen.cutouts[tmpNode.id] = {
        class: detailType,
        type: "levelmount",
      };

      break;

    default:
      break;
  }

  document.getElementById("cutouts-here").appendChild(tmpNode);

  recalc();
  renderSamples();
}
