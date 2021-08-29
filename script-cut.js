const cutParameters = {
  blade: 3, //толщина пилы
  allowance: 10, //припуск на торцовку бутерброда на 1 сторону
  cornerAllowanceFaucet: 7, //припуск на угловой стык простого торца
  cornerAllowanceShaped: 40, //припуск на угловой стык фигурного торца
  cornerMillAllowance: 3, //припуск на чистовую фрезеровку углового стыка
  lowerLayerWidth: 60, //чистовая ширина подклейки
  backsplashHeight: 40, //высота пристенка
  minMiddlePartOffset: 100, //когда разбиваем среднюю деталь П-образной столешки, это регулирует минимальную длину маленького куска
};

const limits = {
  minIlength: 500,
  maxIlength: 7000,
  maxIslLength: 3000,
  minWidth: 200,
  maxLlength: 9000,
  maxUlength: 10000,
  maxWidth: 1400,
  smallRemainder: 0.05,
  bigRemainder: 0.5,
};

let kitchen = {
  shape: "I",
  island: false,
  details: [
    { l: 3000, w: 600 },
    { l: 3600, w: 600 },
    { l: 2400, w: 600 },
  ],
  legs: {},
  island: false,
  bar: false,
  panels: {},
  profile: "edge1",
  thickness: 40,
  backsplash: true,
  cutouts: {},
};

const defaultKitchen = {
  shape: "I",
  island: false,
  details: [
    { l: 3000, w: 600 },
    { l: 3600, w: 600 },
    { l: 2400, w: 600 },
  ],
  legs: {},
  island: { l: 1800, w: 900 },
  bar: { l: 2000, w: 600 },
  panels: {},
  profile: "edge1",
  thickness: 40,
  backsplash: true,
};

function getArea(arr) {
  return arr.reduce((acc, element) => {
    return (acc += (element[0] * element[1]) / 1000000);
  }, 0);
}

// добавить припуск на торцовку
function addAllowance(element, n = 1) {
  return (element += cutParameters.allowance * n);
}

//добавить припуск на угловой стік
function addCorner(dimension, profile, n = 1) {
  if (profile === "edge1" || profile === "edge2") {
    return (dimension +=
      cutParameters.cornerAllowanceFaucet * n +
      cutParameters.cornerMillAllowance * n);
  }
  return (dimension +=
    cutParameters.cornerAllowanceShaped * n +
    cutParameters.cornerMillAllowance * n);
}

//разбивка пристенков
function backsplashes(element, slab) {
  if (addAllowance(element.l, 2) >= slab[0]) {
    var det1 = slab[0] - cutParameters.allowance * 2;
    var det2 = element.l - det1;

    return [
      [addAllowance(det1, 2), cutParameters.backsplashHeight, "пристенок"],
      [addAllowance(det2, 2), cutParameters.backsplashHeight, "пристенок"],
    ];
  }

  return [
    [addAllowance(element.l, 2), cutParameters.backsplashHeight, "пристенок"],
  ];
}

// разбивка детали под поклейку бутербродом с учетом припусков
function split40(element, slab) {
  if (addAllowance(element[0], 2) > slab[0]) {
    var det1 = slab[0] - cutParameters.allowance * 2;
    var det2 = element[0] - det1;

    return [
      [addAllowance(det1, 2), addAllowance(element[1]), "основная"],
      [addAllowance(det2, 2), addAllowance(element[1]), "основная"],
    ];
  }

  return [[addAllowance(element[0], 2), addAllowance(element[1]), "основная"]];
}

//разбика детали на толщине 20мм
function split20(element, slab, type = "основная") {
  //console.log("split 20");
  if (element[0] > slab[0]) {
    var det1 = slab[0];
    var det2 = element[0] - det1;

    return [
      [det1, element[1], type],
      [det2, element[1], type],
    ];
  }

  return [[element[0], element[1], type]];
}

function tryU(kitchen) {
  //let kitchen.details = JSON.parse(JSON.stringify(kitchen.details)); // clone kitchen base dimensions to further split them
  let resultArr = [];

  // split base details

  //  _ _
  resultArr[0] = [
    //detal 1
    [
      addCorner(kitchen.details[0].l, kitchen.profile) - kitchen.details[1].w,
      kitchen.details[0].w,
    ],
    //detal 2
    [kitchen.details[1].l, kitchen.details[1].w],
    //detal 3
    [
      addCorner(kitchen.details[2].l, kitchen.profile) - kitchen.details[1].w,
      kitchen.details[2].w,
    ],
  ];

  // | |
  resultArr[1] = [
    //detal 1
    [kitchen.details[0].l, kitchen.details[0].w],
    //detal 2
    [
      addCorner(kitchen.details[1].l, kitchen.profile, 2) -
        kitchen.details[0].w -
        kitchen.details[2].w,
      kitchen.details[1].w,
    ],
    //detal 3
    [kitchen.details[2].l, kitchen.details[2].w],
  ];

  // _ |
  resultArr[2] = [
    //detal 1
    [
      addCorner(kitchen.details[0].l, kitchen.profile) - kitchen.details[1].w,
      kitchen.details[0].w,
    ],
    //detal 2
    [
      addCorner(kitchen.details[1].l, kitchen.profile) - kitchen.details[2].w,
      kitchen.details[1].w,
    ],
    //detal 3
    [kitchen.details[2].l, kitchen.details[2].w],
  ];

  // | _
  resultArr[3] = [
    //detal 1
    [kitchen.details[0].l, kitchen.details[0].w],
    //detal 2
    [
      addCorner(kitchen.details[1].l, kitchen.profile) - kitchen.details[0].w,
      kitchen.details[1].w,
    ],
    //detal 3
    [
      addCorner(kitchen.details[2].l, kitchen.profile) - kitchen.details[1].w,
      kitchen.details[2].w,
    ],
  ];
  return resultArr;
}

function tryL(kitchen) {
  //let kitchen.details = JSON.parse(JSON.stringify(kitchen.details)); // clone kitchen base dimensions to further split them
  let resultArr = [];

  // split base details

  // |
  resultArr[0] = [
    //detal 1
    [kitchen.details[0].l, kitchen.details[0].w],
    //detal 2
    [
      addCorner(kitchen.details[1].l, kitchen.profile) - kitchen.details[0].w,
      kitchen.details[1].w,
    ],
  ];

  // _
  resultArr[1] = [
    //detal 1
    [
      addCorner(kitchen.details[0].l, kitchen.profile) - kitchen.details[1].w,
      kitchen.details[0].w,
    ],
    //detal 2
    [kitchen.details[1].l, kitchen.details[1].w],
  ];
  return resultArr;
}

// добавляем в список детали подклейки. без жоп
function addLowerLayer(arr) {
  let lowerParts = [];

  arr.forEach((element) => {
    lowerParts.push([
      element[0],
      addAllowance(cutParameters.lowerLayerWidth),
      "лицо",
    ]); //подклейка перед
    lowerParts.push([
      element[1] -
        addAllowance(cutParameters.lowerLayerWidth) -
        cutParameters.lowerLayerWidth,
      addAllowance(cutParameters.lowerLayerWidth),
      "бочина",
    ]); //подклейка видимый бок
    /* lowerParts.push([
      element[1] -
        addAllowance(cutParameters.lowerLayerWidth) -
        cutParameters.lowerLayerWidth,
      cutParameters.lowerLayerWidth,
      "стык",
    ]); */ //подклейка где стык
  });
  return lowerParts;
}

function setDetails(kitchen, format) {
  //console.log('setdetails');
  let myList = [];

  // расставляем стіки
  if (kitchen.shape === "U") {
    myList = tryU(kitchen);
  }

  if (kitchen.shape === "L") {
    myList = tryL(kitchen);
  }

  if (kitchen.shape === "I") {
    myList = myList.concat([[[kitchen.details[0].l, kitchen.details[0].w]]]);
  }

  //разбиваем на детали

  if (kitchen.thickness === 40) {
    myList.forEach((set, key) => {
      let tmpSet = [];

      //console.log(set);

      set.forEach((element) => {
        tmpSet = tmpSet.concat(split40(element, format));
      });

      //console.log('format: '+format);

      myList[key] = tmpSet;

      myList[key] = myList[key].concat(addLowerLayer(myList[key])); //вставляем подклейки в массив деталей
    });
  }

  if (kitchen.thickness === 20) {
    myList.forEach((set, key) => {
      let tmpSet = [];

      set.forEach((element) => {
        tmpSet = tmpSet.concat(split20(element, format));
      });

      myList[key] = tmpSet;
    });
  }

  //add island

  if (kitchen.island && kitchen.thickness === 40) {
    let islandSet = [
      [
        addAllowance(kitchen.island.l, 2),
        addAllowance(kitchen.island.w, 2),
        "остров",
      ],
      [
        addAllowance(kitchen.island.l, 2),
        addAllowance(cutParameters.lowerLayerWidth, 1),
        "остров ж",
      ],
      [
        addAllowance(kitchen.island.l, 2),
        addAllowance(cutParameters.lowerLayerWidth, 1),
        "остров ж",
      ],
      [
        kitchen.island.w - cutParameters.lowerLayerWidth * 2,
        addAllowance(cutParameters.lowerLayerWidth, 1),
        "остров ж",
      ],
      [
        kitchen.island.w - cutParameters.lowerLayerWidth * 2,
        addAllowance(cutParameters.lowerLayerWidth, 1),
        "остров ж",
      ],
    ];

    myList.forEach((set, key) => {
      myList[key] = myList[key].concat(islandSet);
    });
  }

  if (kitchen.island && kitchen.thickness === 20) {
    let islandSet = [[kitchen.island.l, kitchen.island.w, "остров"]];

    myList.forEach((set, key) => {
      myList[key] = myList[key].concat(islandSet);
    });
  }

  //add bar

  if (kitchen.bar && kitchen.thickness === 40) {
    let barSet = [
      [
        addAllowance(kitchen.bar.l, 2),
        addAllowance(kitchen.bar.w, 2),
        "барная",
      ],
      [
        addAllowance(kitchen.bar.l, 2),
        addAllowance(cutParameters.lowerLayerWidth, 1),
        "барная ж",
      ],
      [
        addAllowance(kitchen.bar.l, 2),
        addAllowance(cutParameters.lowerLayerWidth, 1),
        "барная ж",
      ],
      [
        kitchen.bar.w - cutParameters.lowerLayerWidth * 2,
        addAllowance(cutParameters.lowerLayerWidth, 1),
        "барная ж",
      ],
    ];

    myList.forEach((set, key) => {
      myList[key] = myList[key].concat(barSet);
    });
  }

  if (kitchen.bar && kitchen.thickness === 20) {
    let barSet = [[kitchen.bar.l, kitchen.bar.w, "барная"]];

    myList.forEach((set, key) => {
      myList[key] = myList[key].concat(barSet);
    });
  }

  //add legs

  if (Object.keys(kitchen.legs).length && kitchen.thickness === 40) {
    let legSet = [];

    for (leg in kitchen.legs) {
      let currentLeg = kitchen.legs[leg];
      if (currentLeg.visibility) {
        legSet = legSet.concat([
          [
            addAllowance(currentLeg.l, 2),
            addAllowance(currentLeg.w, 2),
            "нога",
          ],
          [
            addAllowance(currentLeg.l, 2),
            addAllowance(currentLeg.w, 2),
            "нога изнанка",
          ],
        ]);
      } else {
        legSet = legSet.concat([
          [
            addAllowance(currentLeg.l, 2),
            addAllowance(currentLeg.w, 2),
            "нога",
          ],
          [
            addAllowance(currentLeg.l, 2),
            addAllowance(cutParameters.lowerLayerWidth, 1),
            "нога ж",
          ],
        ]);
      }
    }

    myList.forEach((set, key) => {
      myList[key] = myList[key].concat(legSet);
    });
  }

  if (Object.keys(kitchen.legs).length && kitchen.thickness === 20) {
    let legSet = [];

    for (leg in kitchen.legs) {
      let currentLeg = kitchen.legs[leg];
      legSet = legSet.concat([[currentLeg.l, currentLeg.w, "нога"]]);
    }

    myList.forEach((set, key) => {
      myList[key] = myList[key].concat(legSet);
    });
  }

  //add wall panels

  if (Object.keys(kitchen.panels).length) {
    let panelSet = [];

    for (panel in kitchen.panels) {
      let currentPanel = [kitchen.panels[panel].l, kitchen.panels[panel].w];

      panelSet = panelSet.concat(split20(currentPanel, format, "панель"));
    }

    myList.forEach((set, key) => {
      myList[key] = myList[key].concat(panelSet);
    });
  }

  // add backsplashes along walls

  if (kitchen.backsplash) {
    let myBacksplashes = [];

    switch (kitchen.shape) {
      case "I":
        myBacksplashes = myBacksplashes.concat(
          backsplashes(kitchen.details[0], format)
        );
        myBacksplashes = myBacksplashes.concat([
          [kitchen.details[0].w, cutParameters.backsplashHeight, "пристенок"],
        ]);
        /*         myBacksplashes = myBacksplashes.concat([
          [kitchen.details[0].w, cutParameters.backsplashHeight],
        ]); */
        break;

      case "L":
        myBacksplashes = myBacksplashes.concat(
          backsplashes(kitchen.details[0], format)
        );
        myBacksplashes = myBacksplashes.concat(
          backsplashes(kitchen.details[1], format)
        );
        myBacksplashes = myBacksplashes.concat([
          [kitchen.details[0].w, cutParameters.backsplashHeight, "пристенок"],
        ]);
        /*         myBacksplashes = myBacksplashes.concat([
          [kitchen.details[1].w, cutParameters.backsplashHeight],
        ]); */
        break;

      case "U":
        myBacksplashes = myBacksplashes.concat(
          backsplashes(kitchen.details[0], format)
        );
        myBacksplashes = myBacksplashes.concat(
          backsplashes(kitchen.details[1], format)
        );
        myBacksplashes = myBacksplashes.concat(
          backsplashes(kitchen.details[2], format)
        );
        myBacksplashes = myBacksplashes.concat([
          [kitchen.details[0].w, cutParameters.backsplashHeight, "пристенок"],
        ]);
        /*         myBacksplashes = myBacksplashes.concat([
          [kitchen.details[2].w, cutParameters.backsplashHeight],
        ]); */
        break;

      default:
        break;
    }

    myList.forEach((set, key) => {
      myList[key] = myList[key].concat(myBacksplashes);
    });
  }

  //console.log(myList);

  return myList;
}

function compareArrs(arr1, arr2) {
  if (arr1[0] === arr2[0] && arr1[1] === arr2[1]) {
    return true;
  }
  return false;
}

function myInclude(el, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (compareArrs(el, arr[i])) {
      return true;
    }
  }
  return false;
}

function getFormatList(arr) {
  let result = arr.map((element) => element.slab);

  cleanres = [];

  result.forEach((el) => {
    if (cleanres.length && !myInclude(el, cleanres)) {
      cleanres.push(el);
    } else if (!cleanres.length) {
      cleanres.push(el);
    }
  });

  return cleanres;
}

let formats = getFormatList(samplesArray);
//let formats = [[3030, 1420]];

let formatsObj = new Object();

function calcSpending(array) {
  // console.log('caclspending');
  array.forEach((format) => {
    //console.log(`Slab format: ${format[0]}x${format[1]} mm`);

    let set1 = setDetails(kitchen, format);

    let slabSet = [];

    /*     let slabSet = [
      [1, 0.2],
      [1.5, 0.7],
      [1, 0.05],
      [1, 0.8],
      [1.5, 0.333],
      [1, 0.49]
    ] */

    set1.forEach((element) => {
      let countSlabs =
        Math.ceil(getArea(element) / ((format[0] * format[1]) / 2000000)) * 0.5;

      let countRemainder =
        1 - getArea(element) / ((format[0] * format[1] * countSlabs) / 1000000);

      slabSet.push([countSlabs, countRemainder]);
      /*console.log(format[0] + ' x ' + format[1]);
      console.log(format[0]*format[1]/1000000);
      console.log('Area used: ' + getArea(element) + " m2");
      console.log('Slabs spent: '+ countSlabs);
      console.log(countRemainder); */
    });

    slabSet.sort(([a, b], [c, d]) => a - c || d - b);

    formatsObj[format] = slabSet[0];

    switch (true) {
      case formatsObj[format][1] <= limits.smallRemainder:
        formatsObj[format][2] = "priceup";
        break;

      case formatsObj[format][1] >= limits.bigRemainder:
        formatsObj[format][2] = "pricedown";
        break;

      default:
        formatsObj[format][2] = "";
        break;
    }
  });

  return formatsObj;
}

calcSpending(formats);

function recalc() {
  calcSpending(formats);
  getCosts(samplesArray);
  renderMinMaxPrice();
  renderKitchenSummary();
}

function validateInputs(n, d, num) {
  if (!num) {
    kitchen.details[n][d] = defaultKitchen.details[n][d];
    return kitchen.details[n][d];
  } else {
    return (kitchen.details[n][d] = num);
  }
}

let lastClickTime = 0;

let shot;

function timeChecker(t) {
  timeNow = new Date().getTime();

  if (timeNow - t > 300) {
    recalc();
    renderSamples();
    //console.log("shot!" + (timeNow - t));
    clearInterval(shot);
  }

  return;
}

document
  .querySelector("#kitchen-dimensions")
  .addEventListener("input", function (e) {
    let target = e.target;
    let val = Number(target.value);

    clearInterval(shot);

    let thisClickTime = new Date().getTime();

    switch (target.id) {
      case "l1":
        validateInputs(0, "l", val);

        break;
      case "w1":
        validateInputs(0, "w", val);
        break;

      case "length-A":
        validateInputs(0, "l", val);

        break;
      case "l-A":
        validateInputs(0, "l", val);
        break;
      case "length-B":
        validateInputs(1, "l", val);
        break;
      case "l-B":
        validateInputs(1, "l", val);
        break;
      case "length-C":
        validateInputs(2, "l", val);
        break;
      case "width-A":
        validateInputs(0, "w", val);
        break;
      case "w-A":
        validateInputs(0, "w", val);
        break;
      case "width-B":
        validateInputs(1, "w", val);
        break;
      case "w-B":
        validateInputs(1, "w", val);
        break;
      case "width-C":
        validateInputs(2, "w", val);

        break;

      default:
        return;
        break;
    }

    shot = setInterval(timeChecker, 50, thisClickTime);
  });

function dimensionsAlert() {
  //console.log('aleeeert!');

  let I = Boolean(kitchen.shape === "I");
  let L = Boolean(kitchen.shape === "L");
  let U = Boolean(kitchen.shape === "U");
  let island = Boolean(kitchen.island);

  let arrLlengths = [kitchen.details[0].l, kitchen.details[1].l];

  let arrUlengths = [
    kitchen.details[0].l,
    kitchen.details[1].l,
    kitchen.details[2].l,
  ];

  let arrLwidths = [kitchen.details[0].w, kitchen.details[1].w];

  let arrUwidths = [
    kitchen.details[0].w,
    kitchen.details[1].w,
    kitchen.details[2].w,
  ];

  let Uwidths = [
    document.querySelector("#width-A"),
    document.querySelector("#width-B"),
    document.querySelector("#width-C"),
  ];

  let Lwidths = [
    document.querySelector("#w-A"),
    document.querySelector("#w-B"),
  ];

  let Ulengths = [
    document.querySelector("#length-A"),
    document.querySelector("#length-B"),
    document.querySelector("#length-C"),
  ];

  let Llengths = [
    document.querySelector("#l-A"),
    document.querySelector("#l-B"),
  ];

  // красим инпуты, в которых значения вылезают за лимиты

  let Iwidth = document.querySelector("#w1");
  let Ilength = document.querySelector("#l1");
  let isllength = document.querySelector("#l-i");
  let islwidth = document.querySelector("#w-i");

  if (
    islwidth.value &&
    (islwidth.value <= limits.minWidth || islwidth.value > limits.maxWidth)
  ) {
    islwidth.classList.add("error-input");
  } else {
    islwidth.classList.remove("error-input");
  }

  if (
    Iwidth.value &&
    (Iwidth.value <= limits.minWidth || Iwidth.value >= limits.maxWidth)
  ) {
    Iwidth.classList.add("error-input");
  } else {
    Iwidth.classList.remove("error-input");
  }

  Lwidths.forEach((element) => {
    if (
      element.value &&
      (element.value <= limits.minWidth || element.value >= limits.maxWidth)
    ) {
      element.classList.add("error-input");
    } else {
      element.classList.remove("error-input");
    }
  });

  Uwidths.forEach((element) => {
    if (
      element.value &&
      (element.value <= limits.minWidth || element.value >= limits.maxWidth)
    ) {
      element.classList.add("error-input");
    } else {
      element.classList.remove("error-input");
    }
  });

  if (
    isllength.value &&
    (isllength.value <= limits.minIlength ||
      isllength.value > limits.maxIslLength)
  ) {
    isllength.classList.add("error-input");
  } else {
    isllength.classList.remove("error-input");
  }

  if (
    Ilength.value &&
    (Ilength.value >= limits.maxIlength || Ilength.value <= limits.minIlength)
  ) {
    Ilength.classList.add("error-input");
  } else {
    Ilength.classList.remove("error-input");
  }

  Llengths.forEach((element) => {
    if (element.value && element.value <= limits.minIlength) {
      element.classList.add("error-input");
    } else {
      element.classList.remove("error-input");
    }
  });

  Ulengths.forEach((element) => {
    if (element.value && element.value <= limits.minIlength) {
      element.classList.add("error-input");
    } else {
      element.classList.remove("error-input");
    }
  });

  //проверка на слишком маленькую длину

  if (
    (I && kitchen.details[0].l <= limits.minIlength) ||
    (L && arrLlengths.some((element) => element <= limits.minIlength)) ||
    (U && arrUlengths.some((element) => element <= limits.minIlength))
  ) {
    document.querySelector(".I-length-small").style = "display: block";
  } else {
    document.querySelector(".I-length-small").style = "display: none";
  }

  if (island && kitchen.island.l <= limits.minIlength) {
    document.querySelector(".isl-length-small").style = "display: block";
  } else {
    document.querySelector(".isl-length-small").style = "display: none";
  }

  //проверка на слишком большую длину

  switch (true) {
    case I && kitchen.details[0].l >= limits.maxIlength:
      document.querySelector(".I-length-big").style = "display: block";
      break;

    case L && arrLlengths.reduce((acc, el) => acc + el, 0) >= limits.maxLlength:
      document.querySelector(".L-length-big").style = "display: block";
      break;

    case U && arrUlengths.reduce((acc, el) => acc + el, 0) >= limits.maxUlength:
      document.querySelector(".U-length-big").style = "display: block";
      break;

    default:
      document.querySelector(".I-length-big").style = "display: none";
      document.querySelector(".L-length-big").style = "display: none";
      document.querySelector(".U-length-big").style = "display: none";
      break;
  }

  if (island && kitchen.island.l > limits.maxIslLength) {
    document.querySelector(".isl-length-big").style = "display: block";
  } else {
    document.querySelector(".isl-length-big").style = "display: none";
  }

  //проверка на слишком маленькую ширину

  if (
    (I && kitchen.details[0].w <= limits.minWidth) ||
    (L && arrLwidths.some((element) => element <= limits.minWidth)) ||
    (U && arrUwidths.some((element) => element <= limits.minWidth))
  ) {
    document.querySelector(".I-width-small").style = "display: block";
  } else {
    document.querySelector(".I-width-small").style = "display: none";
  }

  if (island && kitchen.island.w <= limits.minWidth) {
    document.querySelector(".isl-width-small").style = "display: block";
  } else {
    document.querySelector(".isl-width-small").style = "display: none";
  }

  //проверка на слишком большую ширину

  if (
    (I && kitchen.details[0].w >= limits.maxWidth) ||
    (L && arrLwidths.some((element) => element >= limits.maxWidth)) ||
    (U && arrUwidths.some((element) => element >= limits.maxWidth))
  ) {
    document.querySelector(".I-width-big").style = "display: block";
  } else {
    document.querySelector(".I-width-big").style = "display: none";
  }

  if (island && kitchen.island.w > limits.maxWidth) {
    document.querySelector(".isl-width-big").style = "display: block";
  } else {
    document.querySelector(".isl-width-big").style = "display: none";
  }
}

document.querySelector("#backsplash").addEventListener("click", (evt) => {
  //  event delegation: only act if the click originated from input[type=radio]
  if (evt.target.type === "radio") {
    kitchen.backsplash = +evt.target.value;
    /* console.log(
      `Value: ${evt.target.value}, text: ${
        document.querySelector(`label[for='${evt.target.id}']`).textContent
      }`
    ); */

    if (kitchen.backsplash) {
      document.querySelector(".backsplash-warning").style = "display: block";
    } else {
      document.querySelector(".backsplash-warning").style = "display: none";
    }
    recalc();
    renderSamples();
  }
});

document.querySelector("#thickness").addEventListener("click", (evt) => {
  //  event delegation: only act if the click originated from input[type=radio]
  if (evt.target.type === "radio") {
    kitchen.thickness = +evt.target.value;

    if (evt.target.value === "20") {
      document.querySelectorAll(".e40").forEach((node) => {
        node.style = "display: none;";
      });
      document.querySelectorAll(".e20").forEach((node) => {
        node.style = "display: block;";
      });
    }
    if (evt.target.value === "40") {
      document.querySelectorAll(".e20").forEach((node) => {
        node.style = "display: none;";
      });
      document.querySelectorAll(".e40").forEach((node) => {
        node.style = "display: block; margin-right: 20px";
      });
      document.querySelectorAll(".e40")[4].style = "margin: 0";
    }
    recalc();
    renderSamples();
  }
});

document.querySelector("#edges").addEventListener("click", (evt) => {
  //  event delegation: only act if the click originated from input[type=radio]
  if (evt.target.type === "radio") {
    kitchen.profile = evt.target.value;
    recalc();
    renderSamples();
  }
});

document.querySelector("#shapes").addEventListener("click", (evt) => {
  //  event delegation: only act if the click originated from input[type=radio]
  if (evt.target.type === "radio") {
    kitchen.shape = evt.target.value;
    switch (evt.target.value) {
      case "I":
        document.querySelector(".shapeI").style = "display: flex";
        document.querySelector(".shapeL").style = "display: none";
        document.querySelector(".shapeU").style = "display: none";
        if (document.querySelector("#l1").value) {
          kitchen.details[0].l = +document.querySelector("#l1").value;
        } else {
          kitchen.details[0].l = defaultKitchen.details[0].l;
        }
        if (document.querySelector("#w1").value) {
          kitchen.details[0].w = +document.querySelector("#w1").value;
        } else {
          kitchen.details[0].w = defaultKitchen.details[0].w;
        }
        //console.log(kitchen.details);
        break;

      case "L":
        document.querySelector(".shapeI").style = "display: none";
        document.querySelector(".shapeL").style = "display: block";
        document.querySelector(".shapeU").style = "display: none";
        if (document.querySelector("#l-A").value) {
          kitchen.details[0].l = +document.querySelector("#l-A").value;
        } else {
          kitchen.details[0].l = defaultKitchen.details[0].l;
        }
        if (document.querySelector("#w-A").value) {
          kitchen.details[0].w = +document.querySelector("#w-A").value;
        } else {
          kitchen.details[0].w = defaultKitchen.details[0].w;
        }
        if (document.querySelector("#l-B").value) {
          kitchen.details[1].l = +document.querySelector("#l-B").value;
        } else {
          kitchen.details[1].l = defaultKitchen.details[1].l;
        }
        if (document.querySelector("#w-B").value) {
          kitchen.details[1].w = +document.querySelector("#w-B").value;
        } else {
          kitchen.details[1].w = defaultKitchen.details[1].w;
        }
        //console.log(kitchen.details);
        break;

      case "U":
        document.querySelector(".shapeI").style = "display: none";
        document.querySelector(".shapeL").style = "display: none";
        document.querySelector(".shapeU").style = "display: block";
        if (document.querySelector("#length-A").value) {
          kitchen.details[0].l = +document.querySelector("#length-A").value;
        } else {
          kitchen.details[0].l = defaultKitchen.details[0].l;
        }
        if (document.querySelector("#width-A").value) {
          kitchen.details[0].w = +document.querySelector("#width-A").value;
        } else {
          kitchen.details[0].w = defaultKitchen.details[0].w;
        }
        if (document.querySelector("#length-B").value) {
          kitchen.details[1].l = +document.querySelector("#length-B").value;
        } else {
          kitchen.details[1].l = defaultKitchen.details[1].l;
        }
        if (document.querySelector("#width-B").value) {
          kitchen.details[1].w = +document.querySelector("#width-B").value;
        } else {
          kitchen.details[1].w = defaultKitchen.details[1].w;
        }
        if (document.querySelector("#length-C").value) {
          kitchen.details[2].l = +document.querySelector("#length-C").value;
        } else {
          kitchen.details[2].l = defaultKitchen.details[2].l;
        }
        if (document.querySelector("#width-C").value) {
          kitchen.details[2].w = +document.querySelector("#width-C").value;
        } else {
          kitchen.details[2].w = defaultKitchen.details[2].w;
        }
        //console.log(kitchen.details);
        break;

      default:
        break;
    }
    dimensionsAlert();
    recalc();
    renderSamples();
  }
});

function adjustCustom() {
  if (kitchen.island) {
    document.querySelector("#addisland").style = "display: none";
    document.querySelector("#island").style = "";
  } else {
    document.querySelector("#addisland").style = "";
    document.querySelector("#island").style = "display: none";
  }

  if (kitchen.bar) {
    document.querySelector("#addbar").style = "display: none";
    document.querySelector("#bar").style = "";
  } else {
    document.querySelector("#addbar").style = "";
    document.querySelector("#bar").style = "display: none";
  }

  if (
    Object.keys(kitchen.legs).length >=
    2 + Boolean(kitchen.island) * 2 + Boolean(kitchen.bar)
  ) {
    document.querySelector("#addleg").style = "display: none";
  } else {
    document.querySelector("#addleg").style = "";
  }

  switch (true) {
    case Object.keys(kitchen.legs).length > 1:
      document.querySelector("#leg .parameter-title").textContent = "Ноги";

      break;

    case Object.keys(kitchen.legs).length === 1:
      document.querySelector("#leg").style = "";
      document.querySelector("#leg .parameter-title").textContent = "Нога";

      break;

    case Object.keys(kitchen.legs).length === 0:
      document.querySelector("#leg").style = "display: none";
      break;

    default:
      break;
  }

  switch (true) {
    case Object.keys(kitchen.panels).length > 1:
      document.querySelector("#panel .parameter-title").textContent =
        "Стеновые панели";

      break;

    case Object.keys(kitchen.panels).length === 1:
      document.querySelector("#panel").style = "";
      document.querySelector("#panel .parameter-title").textContent =
        "Стеновая панель";

      break;

    case Object.keys(kitchen.panels).length === 0:
      document.querySelector("#panel").style = "display: none";
      break;

    default:
      break;
  }
}

const multipleCustom = document.querySelectorAll(".custom");

for (let i = 0; i < multipleCustom.length; i++) {
  multipleCustom[i].addEventListener("click", function (e) {
    let target = e.target;

    switch (true) {
      case target.className === "removenode":
        node = document.getElementById(target.parentNode.id);
        target.parentNode.parentNode.removeChild(node);

        if ([...target.parentNode.classList].includes("island")) {
          kitchen.island = false;
        }

        if ([...target.parentNode.classList].includes("bar")) {
          console.log("remove bar");
          kitchen.bar = false;
        }

        if ([...target.parentNode.classList].includes("leg")) {
          delete kitchen.legs[target.parentNode.id];
        }

        if ([...target.parentNode.classList].includes("panel")) {
          delete kitchen.panels[target.parentNode.id];
        }
        break;

      case target.className === "visible":
        if (target.checked) {
          kitchen.legs[target.parentNode.id].visibility = true;
        } else {
          kitchen.legs[target.parentNode.id].visibility = false;
        }
        break;

      default:
        return;
    }

    recalc();
    renderSamples();
    adjustCustom();

    return;
  });

  multipleCustom[i].addEventListener("input", function (e) {
    let target = e.target;
    let val = Number(target.value);

    clearInterval(shot);
    let thisClickTime = new Date().getTime();

    switch (true) {
      case [...target.classList].includes("length") &&
        [...target.parentNode.classList].includes("bar"):
        kitchen.bar.l = val;

        break;

      case [...target.classList].includes("length") &&
        [...target.parentNode.classList].includes("island"):
        kitchen.island.l = val;

        break;

      case [...target.classList].includes("width") &&
        [...target.parentNode.classList].includes("bar"):
        kitchen.bar.w = val;

        break;

      case [...target.classList].includes("width") &&
        [...target.parentNode.classList].includes("island"):
        kitchen.island.w = val;

        break;

      case [...target.classList].includes("length") &&
        [...target.parentNode.classList].includes("leg"):
        kitchen.legs[target.parentNode.id].l = val;

        break;

      case [...target.classList].includes("width") &&
        [...target.parentNode.classList].includes("leg"):
        kitchen.legs[target.parentNode.id].w = val;

        break;

      case [...target.classList].includes("length") &&
        [...target.parentNode.classList].includes("panel"):
        kitchen.panels[target.parentNode.id].l = val;

        break;

      case [...target.classList].includes("width") &&
        [...target.parentNode.classList].includes("panel"):
        kitchen.panels[target.parentNode.id].w = val;

        break;

      default:
        return;
        break;
    }

    shot = setInterval(timeChecker, 50, thisClickTime);
  });
}

document.querySelector("#cutouts-here").addEventListener("input", function (e) {
  let target = e.target;

  let tmpNode = target.parentNode.parentNode.parentNode;

  if ([...target.parentNode.parentNode.parentNode.classList].includes("sink")) {
    let cannelureSet = document.querySelector(
      '[id="' + tmpNode.id + '"] .cannelures'
    );
    let sizeRadioSet = document.querySelector(
      '[id="' + tmpNode.id + '"] .cutout-size-radios'
    );
    let sizeInputSet = document.querySelector(
      '[id="' + tmpNode.id + '"] .cutout-size-inputs'
    );
    let optionsSet = document.querySelector(
      '[id="' + tmpNode.id + '"] .cutout-options-48'
    );

    switch (true) {
      case [...target.parentNode.classList].includes("cannelures"):
        if (target.checked) {
          kitchen.cutouts[tmpNode.id].cannelures = true;
        } else {
          kitchen.cutouts[tmpNode.id].cannelures = false;
        }

        recalc();
        renderSamples();

        break;

      case target.name === tmpNode.id + "-cutout-type" &&
        target.value === "levelmount":
        console.log("level!");

        cannelureSet.style = "display: none";
        sizeRadioSet.style = "display: none";
        sizeInputSet.style = "display: none";
        optionsSet.style = "display: none";

        kitchen.cutouts[tmpNode.id].type = "levelmount";

        recalc();
        renderSamples();

        break;

      case target.name === tmpNode.id + "-cutout-type" &&
        target.value === "undermount":
        console.log("under!");

        cannelureSet.style = "";
        sizeRadioSet.style = "display: none";
        sizeInputSet.style = "display: none";
        optionsSet.style = "display: none";

        kitchen.cutouts[tmpNode.id].type = "undermount";

        recalc();
        renderSamples();

        break;

      case target.name === tmpNode.id + "-cutout-type" &&
        target.value === "quartz":
        console.log("quartz!");

        sizeRadioSet.style = "";
        sizeInputSet.style = "display: none";
        optionsSet.style = "";

        kitchen.cutouts[tmpNode.id].type = "quartz";
        kitchen.cutouts[tmpNode.id].option = document.querySelector(
          '[id="' + tmpNode.id + '"] .cutout-options-48 input:checked'
        ).value;

        if (kitchen.cutouts[tmpNode.id].option === "line") {
          sizeInputSet.style = "";
          sizeRadioSet.style = "display: none";
          cannelureSet.style = "display: none";
          validateSinkSize(tmpNode.id);
        } else {
          sizeInputSet.style = "display: none";
          sizeRadioSet.style = "";
          cannelureSet.style = "";
        }

        kitchen.cutouts[tmpNode.id].size = document.querySelector(
          '[id="' + tmpNode.id + '"] .cutout-size-radios input:checked'
        ).value;

        recalc();
        renderSamples();

        break;

      case target.name === tmpNode.id + "-quartz-type" &&
        target.value === "round":
        cannelureSet.style = "";
        sizeRadioSet.style = "";
        sizeInputSet.style = "display: none";
        optionsSet.style = "";

        kitchen.cutouts[tmpNode.id].type = "quartz";
        kitchen.cutouts[tmpNode.id].option = document.querySelector(
          '[id="' + tmpNode.id + '"] .cutout-options-48 input:checked'
        ).value;
        kitchen.cutouts[tmpNode.id].size = document.querySelector(
          '[id="' + tmpNode.id + '"] .cutout-size-radios input:checked'
        ).value;

        recalc();
        renderSamples();

        break;

      case target.name === tmpNode.id + "-sinksize":
        kitchen.cutouts[tmpNode.id].size = document.querySelector(
          '[id="' + tmpNode.id + '"] .cutout-size-radios input:checked'
        ).value;

        recalc();
        renderSamples();

        break;

      case target.name === tmpNode.id + "-quartz-type" &&
        target.value === "line":
        cannelureSet.style = "display: none";
        sizeRadioSet.style = "display: none";
        sizeInputSet.style = "";
        optionsSet.style = "";

        kitchen.cutouts[tmpNode.id].type = "quartz";
        kitchen.cutouts[tmpNode.id].option = document.querySelector(
          '[id="' + tmpNode.id + '"] .cutout-options-48 input:checked'
        ).value;

        validateSinkSize(tmpNode.id);
        recalc();
        renderSamples();

        break;

      case target.id === tmpNode.id + "-l" || target.id === tmpNode.id + "-w":
        clearInterval(shot);

        let thisClickTime = new Date().getTime();

        validateSinkSize(tmpNode.id);

        shot = setInterval(timeChecker, 50, thisClickTime);

        break;

      default:
        break;
    }
  } else {
    switch (true) {
      case target.name === tmpNode.id + "-cutout-type":
        kitchen.cutouts[tmpNode.id].type = target.value;
        recalc();
        renderSamples();

        break;

      default:
        break;
    }
  }
});

document.querySelector("#cutouts-here").addEventListener("click", function (e) {
  if (e.target.className === "removenode") {
    node = document.getElementById(e.target.parentNode.parentNode.id);
    e.target.parentNode.parentNode.parentNode.removeChild(node);
    delete kitchen.cutouts[e.target.parentNode.parentNode.id];
    recalc();
    renderSamples();
  }
});

function validateSinkSize(nodeID) {
  let length = 600;
  let width = 350;

  if (document.getElementById(nodeID + "-l").value) {
    length = document.getElementById(nodeID + "-l").value;
  }

  if (document.getElementById(nodeID + "-w").value) {
    width = document.getElementById(nodeID + "-w").value;
  }

  kitchen.cutouts[nodeID].size = [length, width];
}

function resetKitchen() {
  kitchen = {
    shape: "I",
    island: false,
    details: [
      { l: 3000, w: 600 },
      { l: 3600, w: 600 },
      { l: 2400, w: 600 },
    ],
    legs: {},
    island: false,
    bar: false,
    panels: {},
    profile: "edge1",
    thickness: 40,
    backsplash: true,
    cutouts: {},
  };

  document.querySelector("#cutouts-here").innerHTML = "";
  let custominputs = document.querySelectorAll(".customInput");

  for (let i = 0; i < Object.keys(custominputs).length; i++) {
    custominputs[i].parentNode.removeChild(custominputs[i]);
  }

  adjustCustom();
  recalc();
  renderSamples();
}
