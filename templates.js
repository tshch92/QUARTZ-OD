function filterChipBuilder(element) {
  if (element === "Атем") {
    return `
    <div class="chip-basic">
        <input type="checkbox" id="Atem" name="${element}" value="${element}">
        <label for="Atem" class="text-bold">${element}</label>
    </div>
    `;
  } else
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
          <source media="(max-width: 414px)" srcset=${sample.picture354} />
          <source media="(max-width: 766px)" srcset=${sample.picture706} />

          <img src=${sample.picture} alt="${sample.brand} ${sample.color}" loading="lazy" />
      </picture>
      <div class="sample-labels">
          <span class=${sample.recommend}></span>
          <span class=${sample.preorder}></span>
          <span class=${sample.out}></span>
      </div>
  </div> `;
}

function SAMPLEINFO(sample) {
  return `
      <div class="sample-text">
        <div class="sample-top">
            <div class="sample-brand text">${sample.brand}</div>
            <div class="sample-slabs" onclick="opendrawing(${sample.slab[0]},${
    sample.slab[1]
  })">${formatsObj[sample.slab][0]}</div>
        </div>
        <div class="sample-bottom">
          <div class="sample-name text-bold">${sample.color}</div>
          <div class="sample-price text-bold loading">${
            sample.totalCost
          }$<span class="${formatsObj[sample.slab][2]}"></span></div>
        </div>
        <button class="sample-kitchen" onclick="openKitchenSummary(this)"><p class="text">${KITCHENSUMMARY}</p></button>
      </div>
  `;
}

function SAMPLEINFOEXT(sample) {
  return `
      <div class="sample-text">
        <div class="sample-top">
            <div class="sample-brand text">${sample.brand}</div>
            <div class="sample-slabs" onclick="opendrawing(${sample.slab[0]},${
    sample.slab[1]
  })">${formatsObj[sample.slab][0]}</div>
        </div>
        <div class="sample-bottom">
          <div class="sample-name text-bold">${sample.color}</div>
          <div></div>
        </div>

        <div class="sample-bottom">
          <div class="text" style="display:flex; align-items: center;">
          c клееной мойкой:</div>
          <div class="sample-price text-bold loading sample-price-f">${
            sample.totalCost
          }$<span class="${formatsObj[sample.slab][2]}"></span></div>
        </div>

        <div class="sample-bottom" style="color: teal">
          <div class="text" style="display:flex; align-items: center;">
          <button class="aboutsinks" aria-label="more about quartz sinks"></button>
          c фабричной мойкой:</div>
          <div class="sample-price text-bold loading sample-price-f">${
            sample.fabricSilestoneTotalcost
          }$<span class="${formatsObj[sample.slab][2]}"></span></div>
        </div>

        <button class="sample-kitchen" onclick="openKitchenSummary(this)"><p class="text">${KITCHENSUMMARY}</p></button>
      </div>
  `;
}

function sampleTemplate(sample) {
  switch (true) {
    case Boolean(sample.fabricSilestoneTotalcost):
      return (
        SAMPLEBASE(sample) +
        SAMPLEINFOEXT(sample) +
        `
                  <div>
                    <button class="btn save text-bold" onclick="saveThis(this.parentNode.parentNode)">
                            Зберегти прорахунок
                    </button>
                  </div>
              </div>
          </div>
          `
      );

    default:
      return (
        SAMPLEBASE(sample) +
        SAMPLEINFO(sample) +
        `
                  <div>
                    <button class="btn save text-bold" onclick="saveThis(this.parentNode.parentNode)">
                            Зберегти прорахунок
                    </button>
                  </div>
              </div>
          </div>
          `
      );
  }
}

function sampleLookalike(sample) {
  switch (true) {
    case Boolean(sample.fabricSilestoneTotalcost):
      return (
        SAMPLEBASE(sample) +
        SAMPLEINFOEXT(sample) +
        `
                    <div class="lookandsave">
                      <button class="lookalike text-bold" data-colorgroup='${sample.colorGroup}' data-surface='${sample.surface}' data-pattern='${sample.pattern}'>
                              Знайти схожі кольори
                      </button>
                      <button class="btn save text-bold" onclick="saveThis(this.parentNode.parentNode)"></button>
                    </div>
              </div>
          </div>
          `
      );

    default:
      return (
        SAMPLEBASE(sample) +
        SAMPLEINFO(sample) +
        `
                  <div class="lookandsave">
                    <button class="lookalike text-bold" data-colorgroup='${sample.colorGroup}' data-surface='${sample.surface}' data-pattern='${sample.pattern}'>
                            Знайти схожі кольори
                    </button>
                    <button class="btn save text-bold" onclick="saveThis(this.parentNode.parentNode)"></button>
                  </div>
  
              </div>
          </div>
          `
      );
  }
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
          <label for='${tmpNode.id}-checkbox' class='text'>внутр. бік</label>
  
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
  setTimeout(removeLoading, 1000);
  adjustCustom();

  return;
}

function renderKitchenSummary() {
  let K = "";

  switch (kitchen.shape) {
    case "I":
      K = `Стільниця ${kitchen.details[0].l} мм`;
      break;

    case "L":
      K = `Стільниця ${kitchen.details[0].l}x${kitchen.details[1].l} мм`;
      break;
    case "U":
      K = `Стільниця ${kitchen.details[0].l}x${kitchen.details[1].l}х${kitchen.details[2].l} мм`;
      break;

    default:
      break;
  }

  if (kitchen.island) {
    K += ` + острів ${kitchen.island.l}x${kitchen.island.w}мм`;
  }

  if (kitchen.bar) {
    K += ` + барна ${kitchen.bar.l}x${kitchen.bar.w}мм`;
  }

  K += `, торець ${kitchen.thickness}мм, `;

  switch (kitchen.profile) {
    case "edge1":
      K += `фаска 3х3, `;
      break;

    case "edge2":
      K += `фаска R3, `;
      break;
    case "edge3":
      K += `о-профіль, `;
      break;
    case "edge4":
      K += `M-профіль, `;
      break;
    case "edge5":
      K += `рваний край, `;
      break;
    case "edge6":
      document.querySelector(
        ".kitchen-summary"
      ).textContent += `лофт профіль, `;
      break;
    case "edge7":
      K += `M-профіль, `;
      break;

    default:
      break;
  }

  switch (kitchen.backsplash) {
    case true:
      K += `пристінний бортик 40мм`;
      break;

    default:
      K += `без пристінного бортика`;
      break;
  }

  KITCHENSUMMARY = K;

  return K;
}

function renderSamplesSummary(arr, obj) {
  let end = Math.abs(arr.length % 100);
  let word = "";

  if (end >= 11 && end <= 14) {
    word = "кольорів";
  } else if ((end >= 2 && end <= 4) || (end % 10 >= 2 && end % 10 <= 4)) {
    word = "кольори";
  } else if (end === 1 || end % 10 === 1) {
    word = "колір";
  } else {
    word = "кольорів";
  }

  document.querySelector(
    ".stones-summary"
  ).textContent = `Знайдено: ${arr.length} ${word}. `;
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
      <span class='text-bold'>Вибачте, такого кварцу в нас немає :(</span>
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
  <span class='text-bold'>Вибачте, такого кварцу в нас немає :(</span>
  `;
      //console.log("нет камня, которій соответствует критериям фильтров");
      break;

    default:
      $sectionSamples.innerHTML = `
      ${uniqueSamplesArray.map(sampleTemplate).join("")}
    `;
      //console.log("дефолтній вид unique");
      break;
  }

  return $sectionSamples.innerHTML;
}

function removeLoading() {
  let s = document.querySelectorAll(".sample-price");

  let r = document.querySelector(".result-sum");

  for (i = 0; i < s.length; i++) {
    s[i].classList.remove("loading");
  }

  r.classList.remove("loading");
  console.log("removed");
}

function updLocalSampleKitchen() {
  let sampleslocalkitchen = document.querySelectorAll(".sample-kitchen p");
  for (let i = 0; i < sampleslocalkitchen.length; i++) {
    sampleslocalkitchen[i].textContent = KITCHENSUMMARY;
  }

  return;
}

function checkSamePrice(arr) {
  if (getMinPrice(arr) === getMaxPrice(arr)) {
    return `
        ${getMaxPrice(arr)}$
        `;
  }
  return `від 
        ${getMinPrice(arr)}$ - до ${getMaxPrice(arr)}$
        `;
}

function renderMinMaxPrice() {
  let $sumOutput = document.querySelector(".result-sum");

  $sumOutput.classList.add("loading");

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
                          <span class="cutout-title text-bold">Мийка</span>
                          <button class="removenode"></button>
                        </div>
                        <div class="parameter-options cutout-options-64">
                          <div class="btn-text-64">
                            <input type="radio" id="${tmpNode.id}-undermount" name='${tmpNode.id}-cutout-type' value="undermount" checked>
                            <label for="${tmpNode.id}-undermount" class="icon-undermount text">підстіл.</label>
                          </div>
                          <div class="btn-text-64">
                            <input type="radio" id="${tmpNode.id}-levelmount" name='${tmpNode.id}-cutout-type' value="levelmount">
                            <label for="${tmpNode.id}-levelmount" class="icon-levelmount text">запідлице</label>
                          </div>
                          <div class="btn-text-64">
                            <input type="radio" id="${tmpNode.id}-quartz" name='${tmpNode.id}-cutout-type' value="quartz">
                            <label for="${tmpNode.id}-quartz" class="icon-quartz text">з кварцу</label>
                          </div>
                        </div>
                        <div class="parameter-options cutout-options-48" style="display: none">
                          <div class="btn-text-48">
                            <input type="radio" id="${tmpNode.id}-round"  name='${tmpNode.id}-quartz-type' value="round" checked>
                            <label for="${tmpNode.id}-round" class="icon-round text">круглий стік</label>
                          </div>
                          <div class="btn-text-48">
                            <input type="radio" id="${tmpNode.id}-line" name='${tmpNode.id}-quartz-type' value="line">
                            <label for="${tmpNode.id}-line" class="icon-line text">щільова</label>
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
                        
                          <div class="parameter-options cutout-size-inputs" style="display: none">
                              <input type="text" id='${tmpNode.id}-l' class="input-small text-bold" placeholder="600">
                              <span class="text">x</span>
                              <input type="text" id='${tmpNode.id}-w' class="input-small text-bold" placeholder="350">
                          </div>
                        
                        
                          <div class="parameter-options cutout-cannelures cannelures">
                            <input type="checkbox" class="tick" id='${tmpNode.id}-cannelures'>
                            <label for='${tmpNode.id}-cannelures' class='text-bold'>мокрий стіл (каннелюри)</label>
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
                              <span class="cutout-title text-bold">Варочна</span>
                              <button class="removenode"></button>
                          </div>
                          <div class="parameter-options cutout-options-48">
                              <div class="btn-text-48">
                                  <input type="radio" id="${tmpNode.id}-undermount"  name='${tmpNode.id}-quartz-type' value="undermount" checked>
                                  <label for="${tmpNode.id}-undermount" class="icon-undermount text">підстіл.</label>
                              </div>
                              <div class="btn-text-48">
                                  <input type="radio" id="${tmpNode.id}-levelmount" name='${tmpNode.id}-quartz-type' value="levelmount">
                                  <label for="${tmpNode.id}-levelmount" class="icon-levelmount text">урівень</label>
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
  setTimeout(removeLoading, 1000);
}

function longKitchenSummary() {
  let msg = "";

  switch (kitchen.shape) {
    case "I":
      msg += `Стільниця ${kitchen.details[0].l}х${kitchen.details[0].w}мм <br>`;
      break;

    case "L":
      if (kitchen.details[0].w === kitchen.details[1].w) {
        msg += `Стільниця Г-подібна, ${kitchen.details[0].l}x${kitchen.details[1].l} мм, глибина ${kitchen.details[0].w}мм <br>`;
      } else {
        msg += `Стільниця Г-подібна, ${kitchen.details[0].l}x${kitchen.details[1].l} мм, глибина ${kitchen.details[0].w} и ${kitchen.details[1].w} мм <br>`;
      }
      break;
    case "U":
      if (
        kitchen.details[0].w === kitchen.details[1].w &&
        kitchen.details[0].w === kitchen.details[2].w
      ) {
        msg += `Стільниця П-подібна, ${kitchen.details[0].l}x${kitchen.details[1].l}х${kitchen.details[2].l} мм, глибина ${kitchen.details[0].w}мм <br>`;
      } else {
        msg += `Стільниця П-подібна, ${kitchen.details[0].l}x${kitchen.details[1].l}х${kitchen.details[2].l} мм, глибина ${kitchen.details[0].w}-${kitchen.details[1].w}-${kitchen.details[1].w}мм <br>`;
      }
      break;

    default:
      break;
  }

  if (kitchen.island) {
    msg += `+ острів ${kitchen.island.l}x${kitchen.island.w}мм <br>`;
  }

  if (kitchen.bar) {
    msg += `+ барна стійка ${kitchen.bar.l}x${kitchen.bar.w}мм <br>`;
  }

  for (leg in kitchen.legs) {
    msg += `+ нога ${kitchen.legs[leg].l}x${kitchen.legs[leg].w}мм, `;
    if (kitchen.legs[leg].visibility) {
      msg += `зворотній бік полирований (видимий)<br>`;
    } else {
      msg += `зворотній бік невидимий<br>`;
    }
  }

  msg += `Товщина ${kitchen.thickness}мм, `;

  switch (kitchen.profile) {
    case "edge1":
      msg += `фаска 3х3 <br>`;
      break;

    case "edge2":
      msg += `фаска R3 <br>`;
      break;
    case "edge3":
      msg += `о-профіль <br>`;
      break;
    case "edge4":
      msg += `M-профіль <br>`;
      break;
    case "edge5":
      msg += `рваний край <br>`;
      break;
    case "edge6":
      msg += `лофт профіль <br>`;
      break;
    case "edge7":
      msg += `M-профіль <br>`;
      break;

    default:
      break;
  }

  msg += "<hr>";

  switch (kitchen.backsplash) {
    case true:
      msg += `Пристінний бортик 40мм <br>`;
      break;

    default:
      msg += `Без пристінного бортика <br>`;
      break;
  }

  for (panel in kitchen.panels) {
    msg += `+ стінова панель ${kitchen.panels[panel].l}x${kitchen.panels[panel].w}мм <br>`;
  }

  msg += `<hr>виріз під накладну мийку - <span class="text-bold">в подарунок</span><br>`;
  msg += `виріз під накладну варочну чи ін. техніку - <span class="text-bold">в подарунок</span><br>`;

  for (c in kitchen.cutouts) {
    if (kitchen.cutouts[c].class === "sink") {
      if (kitchen.cutouts[c].type === "levelmount") {
        msg += `+ виріз під мийку урівень`;
      } else if (kitchen.cutouts[c].type === "undermount") {
        msg += `+ віріз під мойку нижного монтажу`;
      } else {
        msg += `+ мийка из кварцю `;
        if (kitchen.cutouts[c].option === "round") {
          msg += `${kitchen.cutouts[c].size}мм, круглий стік`;
        } else {
          msg += `${kitchen.cutouts[c].size[0]}x${kitchen.cutouts[c].size[1]}мм, щільова`;
        }
      }

      if (
        (kitchen.cutouts[c].type === "undermount" ||
          (kitchen.cutouts[c].type === "quartz" &&
            kitchen.cutouts[c].option === "round")) &&
        kitchen.cutouts[c].cannelures
      ) {
        msg += ' з каннелюрами ("мокрий стіл") <br>';
      } else {
        msg += `<br>`;
      }
    } else {
      msg += `+ виріз під варочну чи ін. техніку `;
      if (kitchen.cutouts[c].type === "levelmount") {
        msg += `урівень <br>`;
      } else {
        msg += `нижнього монтажу <br>`;
      }
    }
  }

  msg += `<hr>
  Заміри<br>
  Доставка по Одесі/Чорноморську<br>
  Підняття ліфтом<br>
  Монтаж стільниці<br><hr><br>
  `;

  return msg;
}

function tgKitchenSummary() {
  let msg = "";

  switch (kitchen.shape) {
    case "I":
      msg += `Стільниця ${kitchen.details[0].l}х${kitchen.details[0].w}мм <br>`;
      break;

    case "L":
      if (kitchen.details[0].w === kitchen.details[1].w) {
        msg += `Стільниця Г-подібна, ${kitchen.details[0].l}x${kitchen.details[1].l} мм, глубина ${kitchen.details[0].w}мм <br>`;
      } else {
        msg += `Стільниця Г-подібна, ${kitchen.details[0].l}x${kitchen.details[1].l} мм, глубина ${kitchen.details[0].w} и ${kitchen.details[1].w} мм <br>`;
      }
      break;
    case "U":
      if (
        kitchen.details[0].w === kitchen.details[1].w &&
        kitchen.details[0].w === kitchen.details[2].w
      ) {
        msg += `Стільниця П-подібна, ${kitchen.details[0].l}x${kitchen.details[1].l}х${kitchen.details[2].l} мм, глубина ${kitchen.details[0].w}мм <br>`;
      } else {
        msg += `Стільниця П-подібна, ${kitchen.details[0].l}x${kitchen.details[1].l}х${kitchen.details[2].l} мм, глубина ${kitchen.details[0].w}-${kitchen.details[1].w}-${kitchen.details[1].w}мм <br>`;
      }
      break;

    default:
      break;
  }

  if (kitchen.island) {
    msg += `+ острів ${kitchen.island.l}x${kitchen.island.w}мм <br>`;
  }

  if (kitchen.bar) {
    msg += `+ барна стійка ${kitchen.bar.l}x${kitchen.bar.w}мм <br>`;
  }

  for (leg in kitchen.legs) {
    msg += `+ нога ${kitchen.legs[leg].l}x${kitchen.legs[leg].w}мм, `;
    if (kitchen.legs[leg].visibility) {
      msg += `зворотній бік полірований (видимий)<br>`;
    } else {
      msg += `зворотній бік невидимий<br>`;
    }
  }

  msg += `<br>Товщина ${kitchen.thickness}мм, `;

  switch (kitchen.profile) {
    case "edge1":
      msg += `фаска 3х3 <br>`;
      break;

    case "edge2":
      msg += `фаска R3 <br>`;
      break;
    case "edge3":
      msg += `о-профіль <br>`;
      break;
    case "edge4":
      msg += `M-профіль <br>`;
      break;
    case "edge5":
      msg += `рваний край <br>`;
      break;
    case "edge6":
      msg += `лофт профіль <br>`;
      break;
    case "edge7":
      msg += `M-профіль <br>`;
      break;

    default:
      break;
  }

  switch (kitchen.backsplash) {
    case true:
      msg += `<br>Пристінний бортик 40мм <br>`;
      break;

    default:
      msg += `<br>Без пристінного бортика <br>`;
      break;
  }

  for (panel in kitchen.panels) {
    msg += `+ стінова панель ${kitchen.panels[panel].l}x${kitchen.panels[panel].w}мм <br>`;
  }

  msg += `<br><i>Вирізи під накладну техніку - в подарунок</i><br>`;

  for (c in kitchen.cutouts) {
    if (kitchen.cutouts[c].class === "sink") {
      msg += `+ мийка `;
      if (kitchen.cutouts[c].type === "levelmount") {
        msg += `урівень зі стільницею`;
      } else if (kitchen.cutouts[c].type === "undermount") {
        msg += `нижнього монтажу`;
      } else {
        msg += `кварцева, `;
        if (kitchen.cutouts[c].option === "round") {
          msg += `${kitchen.cutouts[c].size}мм, круглий стік`;
        } else {
          msg += `${kitchen.cutouts[c].size[0]}x${kitchen.cutouts[c].size[1]}мм, щільова`;
        }
      }

      if (
        (kitchen.cutouts[c].type === "undermount" ||
          (kitchen.cutouts[c].type === "quartz" &&
            kitchen.cutouts[c].option === "round")) &&
        kitchen.cutouts[c].cannelures
      ) {
        msg += ' з каннелюрами ("мокрий стіл") <br>';
      } else {
        msg += `<br>`;
      }
    } else {
      msg += `+ варочная чи ін. техніка `;
      if (kitchen.cutouts[c].type === "levelmount") {
        msg += `урівень зі стільницею <br>`;
      } else {
        msg += `нижнього монтажу <br>`;
      }
    }
  }

  msg += `<br><hr><i>Заміри, доставка в межах Одеси/Чорноморська, а також монтаж виробу - в подарунок!
  <br>Підняття деталей на поверх вручну (сходами) сплачується окремо, за необхідності.</i><br>`;

  return msg;
}

function tgSampleImg(sample) {
  let parent = sample.parentNode.parentNode.parentNode;

  let file =
    /* 'https://quartz-stone.od.ua/'+ */ parent.querySelector("img").src;

  return file;
}

function tgSample(sample) {
  let parent = sample.parentNode.parentNode.parentNode;

  let msg = "";

  msg += parent.querySelector(".sample-brand").textContent;
  msg += "\n";
  msg += parent.querySelector(".sample-name").textContent;
  msg += "\n";
  msg += "**" + parent.querySelector(".sample-price").textContent + "**";
  msg += "\n";
  msg += "[ " + parent.querySelector(".sample-slabs").textContent + " ]";

  return msg;
}

function mailSample(sample) {
  let pic = sample.querySelector(".sample-image img").src.split('images');


  return {
    brand: sample.querySelector(".sample-brand").textContent,
    name: sample.querySelector(".sample-name").textContent,
    price: sample.querySelector(".sample-price").textContent,
    slabs: sample.querySelector(".sample-slabs").textContent,
    surface: sample.className.replace("sample ", "").replace("glanz", ""),
    retailprice: sample
      .querySelector(".sample-price")
      .textContent.replace("от ", "")
      .replace("$", ""),
    picture: `<br><img src="https://quartz-stone.od.ua/images${pic[1]}">`,
  };
}
