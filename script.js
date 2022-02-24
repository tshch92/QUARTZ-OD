const UAHRATE = 0.03466;
const EURRATE = 1.130;
const DELIVERY = {
  kiev: 40,
  odesa: 30,
  brovary: 50,
};
const GREEDRATE = 1.3;
const OLHARATE = 0.05;

const WAGE = {
  //0.5sl - 300,
  20: { 0.5: 300, 1: 500 },
  //1.5sl - 500*1.5
  //0.5sl - 300,
  40: { 0.5: 350, 1: 600 },
  //1.5sl - 600*1.5
};
const HANDPOLISH = 300;
const SHAPEDEDGE = 35;

//норма расхода клея на 1 сляб
const GLUE = 40;

// стоимость моек и вырезов
const QUARTZSINKLINE = 300;
const QUARTZSINKROUND = 300;
const QUARTZSINKROUNDSILE = 200;

const CANNELURES = 100;

const LEVELMOUNT = 50;
const UNDERMOUNTCOOK = 50;

const RASPILQUARTZUA = 23;

const discounts = {
  Atem: 0,
  Avant: 0.29,
  Belenco: 0.2,
  Compac: 0.2,
  Caesarstone: 0.27,
  Caesarstone_quartzua: 0,
  Hanstone: 0,
  Reston: 0,
  Vicostone: 0.3,
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
  "Modern Stone": 0,
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
    //сколько реально будет затрачено камня
    let slabSpent = formatsObj[element.slab][0];
    //сколько нужно купить и привезти, если это камень под заказ
    let fakeSlabSpent = slabSpent;

    if (element.preorder && slabSpent !== Math.round(slabSpent)) {
      fakeSlabSpent = Math.round(slabSpent) * 2;
    }

    switch (true) {
      case element.brand === "Quartzforms" && !element.price.eur:
        element.cost =
          element.price.usd *
          (1 - discounts["Quartzforms_termopal"]) *
          fakeSlabSpent;
        break;

      case element.brand === "Caesarstone" &&
        element.slab[0] === 3060:
        element.cost =
          element.price.usd * (1 - discounts['Caesarstone_quartzua']) * fakeSlabSpent;

          if (slabSpent !== Math.round(slabSpent)) {
            element.cost += RASPILQUARTZUA;
          }      
           
        break;

      case element.brand === "Атем":
        element.cost =
          element.price.usd * (1 - discounts["Atem"]) * fakeSlabSpent;
        break;

      default:
        element.cost =
          element.price.usd * (1 - discounts[element.brand]) * fakeSlabSpent;
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
        element.brand === "Hanstone" ||
        element.brand === "Intekstone") &&
        fakeSlabSpent <= 0.5:
        //кварцформ половинка с термопала
        break;
      case ((element.brand === "Quartzforms" && !element.price.eur) ||
        element.brand === "Hanstone" ||
        element.brand === "Intekstone") &&
        fakeSlabSpent > 0.5:
        totalCost += DELIVERY.odesa * slabSpent;
        break;
      case element.brand === "Reston" || element.brand === "Ginger":
        break;
      case (element.brand === "Belenco" || element.brand === "Vicostone") &&
        fakeSlabSpent <= 0.5:
        totalCost += DELIVERY.kiev;
        break;
      case (element.brand === "Quarella" ||
        element.brand === "Quartzforms" ||
        element.brand === "Technistone" ||
        (element.brand === "Caesarstone" && element.slab[0] === 3060)) &&
        fakeSlabSpent <= 0.5:
        totalCost += DELIVERY.brovary;
        break;
      case element.brand === "Quarella" ||
        element.brand === "Quartzforms" ||
        element.brand === "Technistone" ||
        (element.brand === "Caesarstone" && element.slab[0] === 3060):
        totalCost += DELIVERY.brovary * slabSpent;
        break;
      default:
        totalCost += DELIVERY.kiev * slabSpent;
        break;
    }

    if (kitchen.thickness === 40) {
      totalCost += GLUE * slabSpent;
      //console.log("клей: " + GLUE * slabSpent);
    }

    switch (true) {
      case slabSpent === 0.5:
        totalCost += WAGE[kitchen.thickness]["0.5"];
        //console.log("работа: " + WAGE[kitchen.thickness]["0.5"]);
        break;

      default:
        totalCost += WAGE[kitchen.thickness]["1"] * slabSpent;
        //console.log("работа: " + WAGE[kitchen.thickness]["1"] * slabSpent);
        break;
    }

    totalCost = AddStaticCosts(totalCost);

    if (Object.keys(kitchen.cutouts).length) {
      let levelmount = 0;
      let undermountCook = 0;
      let cannelures = 0;
      let quartzRound = 0;
      let quartzLine = 0;

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

      totalCost +=
        levelmount * LEVELMOUNT +
        undermountCook * UNDERMOUNTCOOK +
        cannelures * CANNELURES +
        quartzLine * QUARTZSINKLINE +
        quartzRound * QUARTZSINKROUND;
    }

    //console.log("ИТОГО для мебельщика: " + Math.round(totalCost));

    totalCost *= GREEDRATE + OLHARATE;
    element.totalCost = Math.round(totalCost);

    //
    //
    //

    // доп вычисления для столешки с мойкой сайлстоун

    if (kitchen.qsinkslistR.length && element.brand === "Silestone") {
      let allSinksFound = false;
      let fabricSilestoneTotalcost = 0;

      //console.log(fabricSilestoneTotalcost);

      for (let i = 0; i < kitchen.qsinkslistR.length; i++) {
        qsinkprice = SINKS.find(
          (e) =>
            e.color === element.color &&
            e.surface === element.surface &&
            e.prices[kitchen.qsinkslistR[i]]
        );

        if (qsinkprice) {
          allSinksFound = true;

          qsinkprice = qsinkprice.prices[kitchen.qsinkslistR[i]];

          qsinkprice *= EURRATE;

          fabricSilestoneTotalcost += qsinkprice;

          //console.log(fabricSilestoneTotalcost);
        } else {
          element.fabricSilestoneTotalcost = 0;
          allSinksFound = false;
          break;
        }
      }

      if (allSinksFound) {
        let SilestoneSlabSpent = formatsObj[element.slab][3];

        //console.log(fabricSilestoneTotalcost);

        fabricSilestoneTotalcost +=
          element.price.usd *
          (1 - discounts[element.brand]) *
          SilestoneSlabSpent.total;

        //console.log(SilestoneSlabSpent);

        fabricSilestoneTotalcost += DELIVERY.kiev * SilestoneSlabSpent.total;

        if (kitchen.thickness === 40) {
          fabricSilestoneTotalcost += GLUE * SilestoneSlabSpent.total;
          //console.log("клей: " + GLUE * slabSpent);
        }

        if (SilestoneSlabSpent.total === 0.5) {
          fabricSilestoneTotalcost += WAGE[kitchen.thickness]["0.5"];
          //console.log("работа: " + WAGE[kitchen.thickness]["0.5"]);
        } else {
          fabricSilestoneTotalcost +=
            WAGE[kitchen.thickness]["1"] * SilestoneSlabSpent.total;
          //console.log("работа: " + WAGE[kitchen.thickness]["1"] * slabSpent);
        }

        fabricSilestoneTotalcost = AddStaticCosts(fabricSilestoneTotalcost);

        if (Object.keys(kitchen.cutouts).length) {
          let levelmount = 0;
          let undermountCook = 0;
          let cannelures = 0;
          let quartzRound = 0;
          let quartzLine = 0;

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

          fabricSilestoneTotalcost +=
            levelmount * LEVELMOUNT +
            undermountCook * UNDERMOUNTCOOK +
            cannelures * CANNELURES +
            quartzLine * QUARTZSINKLINE;
          quartzRound * QUARTZSINKROUNDSILE;
        }

        fabricSilestoneTotalcost *= GREEDRATE + OLHARATE;

        element.fabricSilestoneTotalcost = Math.round(fabricSilestoneTotalcost);

        //console.log(fabricSilestoneTotalcost);
      } else {
        element.fabricSilestoneTotalcost = 0;
      }
    } else {
      element.fabricSilestoneTotalcost = 0;
    }
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

    num += (HANDPOLISH * polishArea) / 1000000;
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
    gtag_report_conversion();

    if (
      window.localStorage.getItem("onboardingm3") !== "true" &&
      window.innerWidth <= 766
    ) {
      window.localStorage.setItem("onboardingm2", true);
      document.getElementById("onboarding-mobile-2").style = "display: none";
      document.querySelector(".stones-collapsed").classList.remove("hint");

      window.scroll({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      setTimeout(() => {
        let firstsamplepos = document
          .querySelector(".sample")
          .getBoundingClientRect();

        let scrollTo = firstsamplepos.top;

        //console.log(firstsamplepos.bottom - window.innerHeight + 80);

        window.scroll({
          top: firstsamplepos.bottom - window.innerHeight + 180,
          left: 0,
          behavior: "smooth",
        });
      }, 1000);

      setTimeout(() => {
        document.getElementById(
          "onboarding-mobile-3"
        ).style = `height: ${window.innerHeight}`;

        document.querySelector(
          "#onboarding-mobile-3 .paranja"
        ).style = `background: radial-gradient(circle closest-side at ${
          window.innerWidth - 76
        }px ${window.innerHeight - 280}px, rgba(0,0,0,0) 50%, black 100%);`;
      }, 1500);
    }

    document.querySelector(".kitchen-collapsed").style = "display: flex";
    document.querySelector("#samples123").style = "display: flex";
    document.querySelector(".colorselect").style = "display: block";
    document.querySelector(".kitchen").style = "display: none";
    document.querySelector(".stones-collapsed").style = "display: none";
  });

document
  .querySelector(".kitchen-collapsed")
  .addEventListener("click", function () {
    gtag_report_conversion();

    if (
      window.localStorage.getItem("onboardingm2") !== "true" &&
      window.innerWidth <= 766
    ) {
      document.getElementById("onboarding-mobile-1").style = "display: none";
      document.querySelector(".kitchen-collapsed").classList.remove("hint");
      window.localStorage.setItem("onboardingm1", true);

      setTimeout(() => {
        document.getElementById("onboarding-mobile-2").style = `height: ${
          window.innerHeight - 106
        }px`;
        document.querySelector(".stones-collapsed").classList.add("hint");
        document.querySelector("body").style =
          "height: 100vh; overflow-y: hidden;";
      }, 2000);
    }

    document.querySelector(".stones-collapsed").style = "display: flex";
    document.querySelector("#samples123").style = "display: none";
    document.querySelector(".colorselect").style = "display: none";
    document.querySelector(".kitchen").style = "display: block";
    document.querySelector(".kitchen-collapsed").style = "display: none";
  });

function openEdits() {
  gtag_report_conversion();
  document.querySelector("#projectsummary").style = "display: none";

  if (window.screen.width <= 1078) {
    document.querySelector(".stones-collapsed").style = "display: flex";
    document.querySelector("#samples123").style = "display: none";
    document.querySelector(".colorselect").style = "display: none";
    document.querySelector(".kitchen").style = "display: block";
    document.querySelector(".kitchen-collapsed").style = "display: none";
  } else {
    document.querySelector(".kitchen").classList.add("hint");
    setTimeout(() => {
      document.querySelector(".kitchen").classList.remove("hint");
    }, 1000);
  }
}

if (window.innerWidth >= 1079) {
  document.getElementById("cta").href = "tel:+380956568480";
}
