const UAHRATE = 0.037;
const EURRATE = 1.18;
const DELIVERY = {
  kiev: 40,
  odesa: 30,
};
const GREEDRATE = 1.3;
const WAGE = {
  //0.5sl - 300,
  20: { 0.5: 300, 1: 450 },
  //1.5sl - 450*1.5
  //0.5sl - 300,
  40: { 0.5: 300, 1: 550 },
  //1.5sl - 550*1.5
};
const HANDPOLISH = 300;
const SHAPEDEDGE = 35;

//норма расхода клея на 1 сляб
const GLUE = 40;

// стоимость моек и вырезов
const QUARTZSINKLINE = 300;
const QUARTZSINKROUND = 300;

const CANNELURES = 100;

const LEVELMOUNT = 50;
const UNDERMOUNTCOOK = 50;

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
  Quartzforms_termopal: 0,
  Royal: 0.27,
  Çimstone: 0,
  Intekstone: 0,
  Radianz: 0.15,
  SantaMargherita: 0,
  Technistone: 0.2,
  Quartzforms: 0.2,
};

function alignPrices(array) {
  array.forEach((element) => {
    if (!element.price.usd && element.price.eur) {
      element.price.usd = element.price.eur * EURRATE;
    } else if (!element.price.usd && element.price.uah) {
      element.price.usd = element.price.uah * UAHRATE;
    }
  });
}

function getCosts(array) {
  array.forEach((element) => {
    let slabSpent = formatsObj[element.slab][0];

    switch (true) {
      case element.brand === "Quartzforms" && !element.price.eur:
        element.cost =
          element.price.usd *
          (1 - discounts["Quartzforms_termopal"]) *
          slabSpent;
        break;

      default:
        element.cost =
          element.price.usd * (1 - discounts[element.brand]) * slabSpent;
        break;
    }

    let totalCost = element.cost;

    //console.log(element.brand + " " + element.color);
    /* console.log(
    formatsObj[element.slab] + " сляба: " + Math.round(element.cost)
    ); */

    //console.log(totalCost);

    switch (true) {
      case ((element.brand === "Quartzforms" && !element.price.eur) ||
        element.brand === "Hanstone") &&
        slabSpent <= 0.5:
        //кварцформ половинка с термопала
        break;
      case ((element.brand === "Quartzforms" && !element.price.eur) ||
        element.brand === "Hanstone") &&
        slabSpent > 0.5:
        totalCost += DELIVERY.odesa * slabSpent;
        break;
      case (element.brand === "Ginger" || element.brand === "Intekstone") &&
        slabSpent <= 0.5:
        //половинка
        break;
      case (element.brand === "Ginger" || element.brand === "Intekstone") &&
        slabSpent > 0.5:
        totalCost += DELIVERY.odesa * slabSpent;
        break;
      case element.brand === "Reston":
        break;
      case (element.brand === "Belenco" || element.brand === "Vicostone") &&
        slabSpent <= 0.5:
        totalCost += DELIVERY.kiev;
        break;
      default:
        totalCost += DELIVERY.kiev * slabSpent;
        break;
    }

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

    totalCost = AddStaticCosts(totalCost);

    if (kitchen.qsinkslist) {
      totalCost += kitchen.qsinkslist.length * QUARTZSINKROUND;

      if (element.brand === "Silestone") {
        kitchen.qsinkslist.forEach((sink) => {
          qsinkprice = SINKS.find(
            (e) =>
              e.color === element.color &&
              e.surface === element.surface &&
              e.prices[sink]
          );

          if (qsinkprice) {
            qsinkprice = qsinkprice.prices[sink];

            let fabricSilestoneTotalcost = totalCost;

            qsinkprice *= EURRATE;

            fabricSilestoneTotalcost += qsinkprice;

            fabricSilestoneTotalcost *= GREEDRATE;

            element.fabricSilestoneTotalcost = Math.round(
              fabricSilestoneTotalcost
            );
          } else {
            element.fabricSilestoneTotalcost = 0;
          }
        });
      }
    }

    //console.log("ИТОГО для мебельщика: " + Math.round(totalCost));

    totalCost *= GREEDRATE;
    element.totalCost = Math.round(totalCost);

    //console.log(element);

    //console.log("умножаем на коэффициент жадности " + GREEDRATE);
    //console.log("--ИТОГО для конечника: " + element.totalCost);
  });
}

function AddStaticCosts(num) {
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

  if (kitchen.island) {
    edgeLength += kitchen.island.l * 2 + kitchen.island.w * 2;
  }

  if (kitchen.bar) {
    edgeLength += kitchen.bar.l * 2 + kitchen.bar.w;
  }

  if (
    kitchen.profile === "edge3" ||
    kitchen.profile === "edge4" ||
    kitchen.profile === "edge5" ||
    kitchen.profile === "edge6" ||
    kitchen.profile === "edge7"
  ) {
    num += (SHAPEDEDGE * edgeLength) / 1000;
  }

  if (Object.keys(kitchen.legs).length && kitchen.thickness === 20) {
    let polishArea = 0;
    for (leg in kitchen.legs) {
      let currentLeg = kitchen.legs[leg];
      if (currentLeg.visibility) {
        polishArea += currentLeg.l * currentLeg.w;
      }
    }

    totalCost += (HANDPOLISH * polishArea) / 1000000;
  }

  if (Object.keys(kitchen.cutouts).length) {
    let levelmount = 0;
    let undermountCook = 0;
    let cannelures = 0;
    let quartzRound = 0;
    let quartzLine = 0;
    kitchen.qsinkslist = [];

    for (i in kitchen.cutouts) {
      switch (true) {
        case kitchen.cutouts[i].type === "levelmount":
          levelmount++;
          break;

        case kitchen.cutouts[i].type === "undermount" &&
          kitchen.cutouts[i].class === "cooktop":
          undermountCook++;
          break;

        case kitchen.cutouts[i].type === "quartz" &&
          kitchen.cutouts[i].option === "round":
          quartzRound++;
          kitchen.qsinkslist.push(kitchen.cutouts[i].size);
          break;

        case kitchen.cutouts[i].type === "quartz" &&
          kitchen.cutouts[i].option === "line":
          quartzLine++;
          break;
        default:
          break;
      }

      if (
        (kitchen.cutouts[i].type === "undermount" ||
          (kitchen.cutouts[i].type === "quartz" &&
            kitchen.cutouts[i].option === "round")) &&
        kitchen.cutouts[i].cannelures
      ) {
        cannelures++;
      }
    }

    num +=
      levelmount * LEVELMOUNT +
      undermountCook * UNDERMOUNTCOOK +
      cannelures * CANNELURES +
      quartzLine * QUARTZSINKLINE;
  }

  return num;
}

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

function getImages(array) {
  array.forEach((element) => {
    element.picture354 = element.picture.replace("samples", "samples354");
    element.picture706 = element.picture.replace("samples", "samples706");
  });
}

getImages(samplesArray);

alignPrices(samplesArray);

getCosts(samplesArray);

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

uniqueSamplesArray = samplesArray.filter(function (element) {
  if (!uniqueColors.includes(element.color)) {
    uniqueColors.push(element.color);
    return true;
  }
  return false;
});

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
