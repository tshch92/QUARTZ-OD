/* document.querySelector(".btn.OK").addEventListener("click", function () {
  document.querySelector("#disclaimer").style = "display: none";
}); */

document
  .querySelector("#opendisclaimer")
  .addEventListener("click", function () {
    document.querySelector("#disclaimer").style = "display: flex";
  });

let aboutsinks = document.querySelectorAll(".aboutsinks");

for (let i = 0; i < Object.keys(aboutsinks).length; i++) {
  aboutsinks[i].addEventListener("click", function () {
    document.querySelector("#about-sinks").style = "display: flex";
  });
}

var lastopened;
var lasttwinbutton;

function openKitchenSummary(el) {
  lastopened = el.parentNode.parentNode;
  document.querySelector("#projectsummary .sample-brand").textContent =
    lastopened.querySelector(".sample-brand").textContent;
  document.querySelector("#projectsummary .sample-name").textContent =
    lastopened.querySelector(".sample-name").textContent;
  document.querySelector("#projectsummary .sample-price").textContent =
    lastopened.querySelector(".sample-price").textContent;
  document.querySelector("#projectsummary").style = "display: flex";
}

document.querySelector(".openpopup").addEventListener("click", function () {
  document.querySelector("#complexkitchenshape").style = "display: flex";
});

/*   document.querySelector(".btn-close").addEventListener("click", function () {
    document.querySelector("#complexkitchenshape").style = "display: none";
  }); */

function closePopup(el) {
  document.getElementById(el.parentNode.parentNode.id).style = "display: none";
}

function opendrawing(w, h) {
  document.getElementById("slab" + w + "x" + h).style = "";
}

function openNext(el) {
  el.parentNode.parentNode.style = "display: none";

  if (document.querySelector("#saveEmail").checked) {
    document.querySelector(".save3.form").style = "";
  } else {
    document.querySelector(".save2.form").style = "";
  }
}

function openPrev(el) {
  document.querySelector(".save1.form").style = "";
  el.parentNode.parentNode.style = "display: none";
}

function catchNewUser(a, b) {
  //console.log("catch new user");

  //console.log(a);
  //console.log(b);
  let email = document.getElementById("save-email").value;

  if (!emailTest(email)) {
    alert("Ошибка в адресе email");
    return false;
  } else if (!document.getElementById("save-email").value) {
    alert("Заполните поле email");
    return false;
  } else {
    document.getElementById("saveproject").style = "display: none";
    window.localStorage.setItem("email", email);
    window.localStorage.setItem("lastTimeSaved", new Date().getTime());
  }
  saveThis(a, b);
  return true;
}

function checkSaveSetthigs() {
  let lastTimeSaved = window.localStorage.getItem("lastTimeSaved");
  let currentTime = new Date().getTime();

  let timeDifference = currentTime - lastTimeSaved;

  if (timeDifference > 120000) {
    return true;
  }
  return false;
}

async function saveThis(sample, twinbutton) {
  let needToUpdateEmail = checkSaveSetthigs();
  lasttwinbutton = twinbutton;
  lastopened = sample;

  if (window.localStorage.getItem("email")) {
    document.getElementById("save-email").value =
      window.localStorage.getItem("email");
  }

  if (needToUpdateEmail && twinbutton) {
    //нужно обновить имейл, вызов был из модального окна. Закрываем модальное окно, открываем окно ввода имейла
    document.getElementById("saveproject").style = "";
    document.getElementById("projectsummary").style = "display: none";
  } else if (needToUpdateEmail) {
    // нужно обновить имейл, вызов был с образца. Открываем окно ввода имейла
    document.getElementById("saveproject").style = "";
  } else {
    // имейл у нас есть. Если предыдущий вызов функции был из модального окна - открываем это окно и накидываем инфинити
    if (twinbutton) {
      document.getElementById("projectsummary").style = "";
      twinbutton.classList.add("infinity");
      twinbutton.classList.add("text");
      twinbutton.classList.remove("text-bold");
      twinbutton.textContent = `отправляем на ${window.localStorage.getItem(
        "email"
      )}`;

      setTimeout(() => {
        twinbutton.classList.remove("infinity");
        twinbutton.classList.remove("text");
        twinbutton.classList.add("text-bold");
        twinbutton.textContent = "Сохранить просчёт";
      }, 1500);
    } else {
      sample.querySelector(".save").classList.add("infinity");
      sample.querySelector(".save").classList.add("text");
      sample.querySelector(".save").classList.remove("text-bold");

      setTimeout(() => {
        sample.querySelector(".save").classList.remove("infinity");
        sample.querySelector(".save").classList.remove("text");
        sample.querySelector(".save").classList.add("text-bold");
      }, 1500);

      if (sample.querySelector(".save").textContent) {
        sample.querySelector(
          ".save"
        ).textContent = `відправляємо на ${window.localStorage.getItem("email")}`;
        setTimeout(() => {
          sample.querySelector(".save").textContent = "Зберегти прорахунок";
        }, 1500);
      }
    }

    let currentSample = mailSample(sample);

    let currentKitchenSummary = tgKitchenSummary();

    let formData = new FormData();

    formData.set("email", window.localStorage.getItem("email"));
    formData.set("samplebrand", currentSample["brand"]);
    formData.set("samplename", currentSample["name"]);
    formData.set("sampleprice", currentSample["price"]);
    formData.set("sampleslabs", currentSample["slabs"]);
    formData.set("samplesurface", currentSample["surface"]);
    formData.set("sampleimage", currentSample["picture"]);

    formData.set("message", currentKitchenSummary);

    formData.set("signature", `<br><br><b>З повагою, quartz_stone_od<br>+38 095 656 84 80<b>`);

    let response = await fetch("savetomail.php", {
      method: "POST",
      body: formData,
    });

    let result = await response.json();

    if (!response.ok) {
      alert(result.message);
    }
  }
}
