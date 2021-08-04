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
  maxIlength: 7000,
  minWidth: 300,
  maxLlength: 8000,
  maxUlength: 10000,
  maxWidth: 1400,
  smallRemainder: 0.05,
  bigRemainder: 0.5,
}

const kitchen = {
  shape: "I",
  details: [
    { l: 3000, w: 600 },
    { l: 3600, w: 600 },
    { l: 2400, w: 600 },
  ],
  profile: "edge1",
  thickness: 40,
  backsplash: true,
};

const defaultKitchen = {
  shape: "I",
  details: [
    { l: 3000, w: 600 },
    { l: 3600, w: 600 },
    { l: 2400, w: 600 },
  ],
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
  if (profile === "profile1" || profile === "profile2") {
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
  if (addAllowance(element[0], 2) >= slab[0]) {
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
function split20(element, slab) {
  if (element[0] >= slab[0]) {
    var det1 = slab[0];
    var det2 = element[0] - det1;

    return [
      [det1, element[1], "основная"],
      [det2, element[1], "основная"],
    ];
  }

  return [[element[0], element[1], "основная"]];
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
    //console.log(myList);
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

      //console.log(tmpSet);

      myList[key] = tmpSet;

      myList[key] = myList[key].concat(addLowerLayer(myList[key])); //вставляем подклейки в массив деталей
    });
  }

  if (kitchen.thickness === 20) {
    myList.forEach((set) => {
      let tmpSet = [];

      set.forEach((element) => {
        tmpSet = tmpSet.concat(split20(element, format));
      });

      set = tmpSet;
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
          [kitchen.details[0].w, cutParameters.backsplashHeight],
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
          [kitchen.details[0].w, cutParameters.backsplashHeight],
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
          [kitchen.details[0].w, cutParameters.backsplashHeight],
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

let formatsObj = new Object();


function calcSpending(array) {
  // console.log('caclspending');
  array.forEach((format) => {
    //console.log(`Slab format: ${format[0]}x${format[1]} mm`);

    let set1 = setDetails(kitchen, array);

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

      let countRemainder = 1-(getArea(element) / ((format[0] * format[1]) * countSlabs / 1000000));

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
}

function validateInputs(n, d, num) {
  if (!num) {
    kitchen.details[n][d] = defaultKitchen.details[n][d];
    return kitchen.details[n][d];
  } else {
    return (kitchen.details[n][d] = num);
  }
}

document
  .querySelector("#kitchen-dimensions")
  .addEventListener("input", function (e) {
    let target = e.target;
    let val = Number(target.value);
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
    recalc();
    renderSamples();
    renderMinMaxPrice();
    renderKitchenSummary();
  });

document.querySelector("#backsplash").addEventListener("click", (evt) => {
  //  event delegation: only act if the click originated from input[type=radio]
  if (evt.target.type === "radio") {
    kitchen.backsplash = +evt.target.value;
    /* console.log(
      `Value: ${evt.target.value}, text: ${
        document.querySelector(`label[for='${evt.target.id}']`).textContent
      }`
    ); */
    recalc();
    renderSamples();
    renderMinMaxPrice();
    renderKitchenSummary();
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
    renderMinMaxPrice();
    renderKitchenSummary();
  }
});

document.querySelector("#edges").addEventListener("click", (evt) => {
  //  event delegation: only act if the click originated from input[type=radio]
  if (evt.target.type === "radio") {
    kitchen.profile = evt.target.value;
    recalc();
    renderSamples();
    renderMinMaxPrice();
    renderKitchenSummary();
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
    recalc();
    renderSamples();
    renderMinMaxPrice();
    renderKitchenSummary();
  }
});
