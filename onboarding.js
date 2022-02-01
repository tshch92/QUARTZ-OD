setTimeout(() => {
  if (
    window.localStorage.getItem("onboarding") !== "true" &&
    window.innerWidth >= 1079
  ) {
    document.getElementById("onboarding-desktop-1").style = "";
    document.querySelector("#onboarding-desktop-1 .paranja").style = `width: ${document.querySelector(".kitchen").getBoundingClientRect().left}px`;
    document.getElementById("samples123").style =
      "height: calc(100vh - 80px); overflow-y: hidden;";
  } else if (
    window.localStorage.getItem("onboardingm1") !== "true" &&
    window.innerWidth <= 766
  ) {
    document.getElementById("onboarding-mobile-1").style = "";
    document.querySelector(".kitchen-collapsed").classList.add("hint");
    document.querySelector("body").style = "height: 100vh; overflow-y: hidden;";
  }
}, 2000);

document
  .getElementById("onboarding-desktop-1")
  .addEventListener("click", function () {
    document.getElementById("onboarding-desktop-1").style = "display: none";
    document.getElementById("onboarding-desktop-2").style = "";

    let firstsamplepos = document
      .querySelector(".sample")
      .getBoundingClientRect();

    document.querySelector("#onboarding-desktop-2 img").style = `left: ${
      firstsamplepos.left + 300 - 26
    }px`;
    document.querySelector(
      "#onboarding-desktop-2 .speech-bubble"
    ).style = `left: ${firstsamplepos.left + 60}px`;
    document.querySelector("#onboarding-desktop-2 .proceed").style = `left: ${
      firstsamplepos.left + 80
    }px`;
    document.querySelector(
      "#onboarding-desktop-2 .paranja"
    ).style = `background: radial-gradient(circle closest-side at ${
      firstsamplepos.left + 260
    }px 415px, rgba(0,0,0,0) 10%, black 40%);`;
  });

document
  .getElementById("onboarding-desktop-2")
  .addEventListener("click", function () {
    document.getElementById("onboarding-desktop-2").style = "display: none";
    document.getElementById("samples123").style = "";

    window.localStorage.setItem("onboarding", true);
  });

document
  .getElementById("onboarding-mobile-1")
  .addEventListener("click", function () {
    window.localStorage.setItem("onboardingm1", true);
    document.getElementById("onboarding-mobile-1").style = "display: none";
    document.querySelector(".kitchen-collapsed").classList.remove("hint");

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

      console.log(firstsamplepos.bottom - window.innerHeight + 80);

      window.scroll({
        top: firstsamplepos.bottom - window.innerHeight + 180,
        left: 0,
        behavior: "smooth",
      });
    }, 1000);

    setTimeout(() => {
      document.getElementById("onboarding-mobile-3").style = "";

      document.querySelector(
        "#onboarding-mobile-3 .paranja"
      ).style = `background: radial-gradient(circle closest-side at ${
        window.innerWidth - 76
      }px ${window.innerHeight - 280}px, rgba(0,0,0,0) 50%, black 100%);`;
    }, 1500);

    //document.querySelector("body").style = "";
  });

  document
  .getElementById("onboarding-mobile-2")
  .addEventListener("click", function () {
    document.getElementById("onboarding-mobile-2").style = "display: none";
    document.querySelector(".stones-collapsed").classList.remove("hint");
console.log('paranja');
    document.querySelector("body").style = "";
    window.localStorage.setItem("onboardingm2", true);
  });

document
  .getElementById("onboarding-mobile-3")
  .addEventListener("click", function () {
    document.getElementById("onboarding-mobile-3").style = "display: none";

    document.querySelector("body").style = "";
    window.localStorage.setItem("onboardingm3", true);
  });


