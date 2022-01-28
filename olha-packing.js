const insertMethods = {
  BestLongSideFit: tryLongSide,
  BestShortSideFit: tryShortSide,
  BestAreaFit: tryLongSide,
};

let BOXSET = [];

let container = {};

let result = {};

function mycontainer(zero, end, prop = "") {
  this.zero = zero;
  this.end = end;
  this.width = this.end[0] - this.zero[0];
  this.height = this.end[1] - this.zero[1];
  this.prop = prop;
}

function createContainer(el) {
  const canvasContainer = document.createElement("div");
  canvasContainer.classList.add("disclaimer");
  canvasContainer.style = "display: none";
  let id = "slab" + el[0] + "x" + el[1];
  canvasContainer.id = id;
  canvasContainer.innerHTML = `
  <div class='disclaimer-card longcard-mob'>

                <button class="btn-close" aria-label="close popup" onclick="closePopup(this)"></button>
    </div>
  `;
  document.body.append(canvasContainer);

  document.querySelector(
    "#" + id + " .disclaimer-card"
  ).innerHTML += `<h2 class="text-bold">Размер сляба: ${el[0]}x${el[1]}</h2>`;

  const div = document.createElement("div");
  div.classList.add(`canvas-wrapper`);
  document.querySelector("#" + id + " .disclaimer-card").appendChild(div);
  //canvasContainer.insertAdjacentElement("beforeend", div);

  return div;
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getColor(box) {
  switch (true) {
    case box.prop === "основная":
      return "#b5ead7";
    case box.prop === "остров":
      return "#ffb7b2";
    case box.prop === "нога":
      return "#ffdac1";
      case box.prop === "нога изн.":
        return "#ffdac1";
    case box.prop === "панель":
      return "#e2f0cb";
    case box.prop === "барная":
      return "#ff9aa2";
    case box.prop === "пристенок":
      return "#c7ceea";
    case box.prop === "дно":
      return "#b9c4e3";
    case box.prop === "стенка мойки":
      return "#b9c4e3";
    default:
      return "#c7ceea";
  }
}

function showCargo(format) {
  const wrapper = document.querySelector(
    "#slab" + format[0] + "x" + format[1] + " .disclaimer-card .canvas-wrapper"
  );
  wrapper.innerHTML = "";

  //console.log("!-");

  let roundtotal = Math.round(formatsObj[format][0]);

  for (let c = 1; c <= roundtotal; c++) {
    //console.log("==всего контейнеров: " + roundtotal);

    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "show_filled_container");
    wrapper.insertAdjacentElement("beforeend", canvas);

    canvas.width = slabSpent[c].dims.width * 0.1;
    canvas.height = slabSpent[c].dims.height * 0.1;
    canvas.style.backgroundColor = "#E8EDF2";

    formatsObj[format][3][c].boxes.forEach((box) => {
      const context = canvas.getContext("2d");
      context.fillStyle = getColor(box);
      context.lineWidth = 1;
      context.strokeStyle = "#E8EDF2";

      context.fillRect(
        box.zero[0] * 0.1,
        box.zero[1] * 0.1,
        box.width * 0.1,
        box.height * 0.1
      );
      context.strokeRect(
        box.zero[0] * 0.1,
        box.zero[1] * 0.1,
        box.width * 0.1,
        box.height * 0.1
      );

      if (
        box.height > 100 &&
        box.width > 400 &&
        box.prop !== "стенка мойки" &&
        box.prop !== "дно"
      ) {
        context.fillStyle = "#000000";
        context.textAlign = "center";

        context.fillText(
          box.prop + " " + box.width + "x" + box.height,
          box.zero[0] * 0.1 + (box.width * 0.1) / 2,
          box.zero[1] * 0.1 + 3 + (box.height * 0.1) / 2
        );
      }
    });
  }
}

function removeDuplicateCont(array) {
  let newarray = [];

  array.forEach((curr) => {
    let check = true;

    for (let i = 0; i < newarray.length; i++) {
      if (!newarray.length) {
        newarray.push(curr);
        check = false;
        break;
      } else if (
        curr.zero[0] >= newarray[i].zero[0] &&
        curr.zero[1] >= newarray[i].zero[1] &&
        curr.end[0] <= newarray[i].end[0] &&
        curr.end[1] <= newarray[i].end[1]
      ) {
        //console.log("вложен внутрь б0льшего контейнера, удаляем!");
        check = false;
        break;
      }
    }

    if (check) {
      newarray.push(curr);
    }
  });

  return newarray;
}

function removeIntersect(array, box) {
  let newarray = [];

  let A = box.zero;
  let B = [box.end[0], box.zero[1]];
  let C = [box.zero[0], box.end[1]];
  let D = box.end;

  //console.log("box " + A + " / " + B + " / " + C + " / " + D);

  for (let i = 0; i < array.length; i++) {
    const cc = array[i];

    let Acc = cc.zero;
    let Bcc = [cc.end[0], cc.zero[1]];
    let Ccc = [cc.zero[0], cc.end[1]];
    let Dcc = cc.end;

    //console.log("container " + Acc + " / " + Bcc + " / " + Ccc + " / " + Dcc);

    let horizIntersect = Boolean(
      (A[0] >= Acc[0] && A[0] < Bcc[0]) || (B[0] > Acc[0] && B[0] <= Bcc[0])
    );

    let vertIntersect = Boolean(
      (A[1] >= Acc[1] && A[1] < Ccc[1]) || (C[1] > Acc[1] && C[1] <= Ccc[1])
    );

    //console.log(" h intersect?" + horizIntersect);
    //console.log(" v intersect?" + vertIntersect);

    if (horizIntersect && vertIntersect) {
      let newconts = [];
      newconts.push(new mycontainer(Acc, [cc.end[0], box.zero[1]]));
      newconts.push(new mycontainer([cc.zero[0], box.end[1]], Dcc));
      newconts.push(new mycontainer(Acc, [box.zero[0], cc.end[1]]));
      newconts.push(new mycontainer([box.end[0], cc.zero[1]], Dcc));

      newconts.forEach((cont) => {
        if (cont.width > 0 && cont.height > 0) {
          newarray.push(cont);
        }
      });
    } else {
      newarray.push(cc);
    }
  }

  return newarray;
}

/* boxes.forEach(box => {
    console.log(box.width + 'x'+box.height);
    
}); */

function fit(box, freecontainers) {
  for (let i = 0; i < freecontainers.length; i++) {
    let cc = freecontainers[i];
    //console.log("container " + cc.width + "x" + cc.height + " / " + cc.zero);
    //console.log("box " + box.width + "x" + box.height);

    if (cc.width >= box.width && cc.height >= box.height) {
      //console.log("ok");
      let c1 = new mycontainer([cc.zero[0], cc.zero[1] + box.height], cc.end);
      let c2 = new mycontainer([cc.zero[0] + box.width, cc.zero[1]], cc.end);
      freecontainers.push(c1);
      freecontainers.push(c2);
      freecontainers.splice(i, 1);
      ub = new mycontainer(
        cc.zero,
        [cc.zero[0] + box.width, cc.zero[1] + box.height],
        box.prop
      );
      usedboxes.push(ub);

      freecontainers = removeDuplicateCont(freecontainers);
      freecontainers = removeIntersect(freecontainers, ub);

      return freecontainers;
    } else {
      //console.log("did not fit");
    }
  }
  return false;
}

//
//
// методы раскроя
//
//

function tryLongSide(boxesleft, freecontainers, rotate = false) {
  /*     console.log("freecontainers:");
        for (let i = 0; i < freecontainers.length; i++) {
          let cc = freecontainers[i];
          console.log(cc.width + "x" + cc.height + " / " + cc.zero);
        } */

  for (let j = 0; j < boxesleft.length; j++) {
    let box = boxesleft[j];
    let rotatedbox = box;

    if (rotate) {
      let w = box.width;
      let h = box.height;

      rotatedbox = { width: h, height: w, prop: box.prop };
    }

    let f = fit(rotatedbox, freecontainers);

    if (f) {
      freecontainers = f;
      boxesleft.splice(j, 1);
      j--;
      freecontainers.sort((a, b) => a.zero[1] - b.zero[1]);
      //freecontainers.sort((a, b) => b.width - a.width);
    }
  }

  /*   console.log("freecontainers:");
  for (let i = 0; i < freecontainers.length; i++) {
    let cc = freecontainers[i];
    console.log(cc.width + "x" + cc.height + " / " + cc.zero);
  }
  console.log("boxesleft:");
  for (let i = 0; i < boxesleft.length; i++) {
    let box = boxesleft[i];
    console.log(box.width + "x" + box.height);
  }
  console.log("usedboxes:");
  for (let i = 0; i < usedboxes.length; i++) {
    let box = usedboxes[i];
    console.log(box.width + "x" + box.height);
  } */

  return freecontainers;
}

function tryShortSide(boxesleft, freecontainers, rotate = false) {
  /*     console.log("freecontainers:");
          for (let i = 0; i < freecontainers.length; i++) {
            let cc = freecontainers[i];
            console.log(cc.width + "x" + cc.height + " / " + cc.zero);
          } */

  for (let j = 0; j < boxesleft.length; j++) {
    let box = boxesleft[j];
    let rotatedbox = box;

    if (rotate) {
      let w = box.width;
      let h = box.height;

      rotatedbox = { width: h, height: w, prop: box.prop };
    }

    let f = fit(rotatedbox, freecontainers);

    if (f) {
      freecontainers = f;
      boxesleft.splice(j, 1);
      j--;
      freecontainers.sort((a, b) => a.zero[0] - b.zero[0]);
    }
  }

  /*   console.log("freecontainers:");
  for (let i = 0; i < freecontainers.length; i++) {
    let cc = freecontainers[i];
    console.log(cc.width + "x" + cc.height + " / " + cc.zero);
  }
  console.log("boxesleft:");
  for (let i = 0; i < boxesleft.length; i++) {
    let box = boxesleft[i];
    console.log(box.width + "x" + box.height);
  }
  console.log("usedboxes:");
  for (let i = 0; i < usedboxes.length; i++) {
    let box = usedboxes[i];
    console.log(box.width + "x" + box.height);
  } */

  return freecontainers;
}

//
//
//     ВОТ ОНО! ПЕРЕБОР!
//
//

let usedboxes = [];

function reorder(boxes, method) {
  switch (method) {
    case "BestLongSideFit":
      boxes = orientBoxes(boxes, "horizontally");
      boxes.sort((a, b) => b.width - a.width);
      break;
    case "BestShortSideFit":
      //console.log(method);
      boxes = orientBoxes(boxes, "vertically");
      boxes.sort((a, b) => b.height - a.height);
      break;
    case "BestAreaFit":
      //console.log(method);
      boxes = orientBoxes(boxes, "horizontally");
      boxes.sort((a, b) => b.height * b.width - a.height * a.width);
      break;
    default:
      break;
  }

  return boxes;
}
function fn(boxes, container, callback, method) {
  boxes = BOXSET;

  let slabSpent = {
    total: 0,
  };

  usedboxes = [];

  boxes = reorder(boxes, method);

  let boxesleft = boxes;

  while (boxesleft.length > 0) {
    //try 0.5 slab

    //console.log("берем половинку..");

    let freecontainers = [
      new mycontainer([0, 0], [container.width, container.height / 2]),
    ];

    let offer = { width: container.width, height: container.height / 2 };

    slabSpent.total += 0.5;

    let roundtotal = Math.round(slabSpent.total);

    slabSpent[roundtotal] = {
      dims: offer,
      boxes: [],
    };

    freecontainers = callback(boxesleft, freecontainers);

    // если не всё влезло, пробуем повернуть оставшиеся детали

    if (boxesleft.length) {
      //console.log("не влазит! поворачиваю детали!");

      freecontainers = callback(boxesleft, freecontainers, "rotate");
    }

    boxesleft = checkTinyDetails(boxesleft, slabSpent);

    // если не всё влезло, берем целый сляб

    if (boxesleft.length) {
      //console.log("не влазит! берем целый сляб");

      freecontainers = [
        new mycontainer([0, 0], [container.width, container.height]),
      ];

      boxesleft = boxesleft.concat(usedboxes);

      boxesleft = reorder(boxesleft, method);

      usedboxes = [];

      let offer = { width: container.width, height: container.height };

      slabSpent.total += 0.5;

      roundtotal = Math.round(slabSpent.total);

      slabSpent[roundtotal] = {
        dims: offer,
        boxes: [],
      };

      freecontainers = callback(boxesleft, freecontainers);
    }

    // поворачиваем детали в целом слябе

    if (boxesleft.length) {
      //console.log("и в сляб не влазит! поворачиваю детали!");

      freecontainers = callback(boxesleft, freecontainers, "rotate");
    }

    boxesleft = checkTinyDetails(boxesleft, slabSpent);

    slabSpent[roundtotal].boxes = usedboxes;

    usedboxes = [];

    //console.log("=======");
  }

  return slabSpent;
}

function checkTinyDetails(boxesleft, slabSpent) {
  if (boxesleft.length > 0 && boxesleft.length < 5) {
    //console.log(boxesleft);
    for (let j = 0; j < boxesleft.length; j++) {

      if (
        boxesleft[j].prop !== "бочина" ||
        (boxesleft[j].prop === "пристенок" && boxesleft.width > 700) ||
        (boxesleft[j].prop === "пристенок" && boxesleft.height > 700) ||
        boxesleft[j].width * boxesleft[j].height > 60000
      ) {
        return boxesleft;
      }
    }

    //console.log('ubiraem');

    slabSpent["skipped"] = boxesleft;
    boxesleft = [];
  }

  return boxesleft;
}

function orientBoxes(boxes, direction) {
  boxes = boxes.map(function (box) {
    if (
      (direction === "horizontally" && box.height > box.width) ||
      (direction === "vertically" && box.height < box.width)
    ) {
      let x = { width: box.height, height: box.width, prop: box.prop };
      return x;
    } else return box;
  });

  return boxes;
}

function smartCutter(boxes, container) {
  for (const method in insertMethods) {
    slabSpent = fn(boxes, container, insertMethods[method], method);

    result[method] = slabSpent;
  }

  let x = 0;
  let best = {};

  for (const method in result) {
    if (!x) {
      x = result[method].total;
      best = result[method];
      best.name = method;
    } else if (result[method].total < x && method !== "best") {
      x = result[method].total;
      best = result[method];
      best.name = method;
    }
  }

  result.best = best;

  return result;
}

//smartCutter(boxes, container);

//console.log(result);

/* for (const method in result) {
  const data = result[method];
  if (method != "best") {
    showCargo(method, data);
  }
} */
