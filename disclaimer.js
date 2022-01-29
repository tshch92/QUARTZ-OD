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

function openKitchenSummary(el) {
  lastopened = el.parentNode;
  console.log(el.parentNode.querySelector(".sample-brand").textContent);
  document.querySelector("#projectsummary .sample-brand").textContent = el.parentNode.querySelector(".sample-brand").textContent;
  document.querySelector("#projectsummary .sample-name").textContent = el.parentNode.querySelector(".sample-name").textContent;
  document.querySelector("#projectsummary .sample-price").textContent = el.parentNode.querySelector(".sample-price").textContent;
  document.querySelector("#projectsummary").style="display: flex";
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

function opendrawing(w,h) {
  document.getElementById('slab'+w+'x'+h).style= "";
}

function openSaveSetup() {
  document.getElementById("saveproject").style = "";
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

function catchNewUser(el) {
  if ([...el.parentNode.parentNode.classList].includes("save2")) {
    phone = document.getElementById("save-phone");
    if (phoneTest(phone)) {
      alert("Ошибка в номере телефона");
      return;
    }
    window.localStorage.setItem("phone", adjust(phone.value));
    window.localStorage.setItem("sendMethod", "phone");
  } else {
    email = document.getElementById("save-email").value;
    if (!emailTest(email)) {
      alert("Ошибка в адресе email");
      return;
    } else if (!document.getElementById("save-email").value) {
      alert("Заполните поле email");
      return;
    }
    window.localStorage.setItem("email", email);
    window.localStorage.setItem("sendMethod", "email");
  }

  if (window.innerWidth < 1079) {
    document.querySelector(".kitchen-collapsed").style = "display: flex";
    document.querySelector("#samples123").style = "display: flex";
    document.querySelector(".colorselect").style = "display: block";
    document.querySelector(".kitchen").style = "display: none";
    document.querySelector(".stones-collapsed").style = "display: none";
    if (
      scrollY <
      document.querySelector("#samples123").getBoundingClientRect().top
    ) {
      window.scrollTo(0, 300);
    }
  }

  checkSaveSetthigs();

  document.querySelector("#saveproject").style = "display: none";
  renderSamples();

  let savebtns = document.querySelectorAll(".save");

  for (let i = 0; i < Object.keys(savebtns).length; i++) {
    savebtns[i].classList.toggle("blik");
  }

  setTimeout(() => {
    for (let i = 0; i < Object.keys(savebtns).length; i++) {
      savebtns[i].classList.toggle("blik");
    }
  }, 2000);

  return;
}

document.addEventListener("DOMContentLoaded", checkSaveSetthigs());

function checkSaveSetthigs() {
  if (window.localStorage.getItem("sendMethod")) {
    document.querySelector(".save-setup").classList.add("save-settings");
    document.querySelector(".save-setup").classList.remove("save-setup");

    if (window.localStorage.getItem("sendMethod") === "email") {
      document.getElementById("save-email").value =
        window.localStorage.getItem("email");
    } else {
      document.getElementById("save-email").value =
        window.localStorage.getItem("phone");
    }
  }
  return;
}

async function saveThis(sample) {
  let sendMethod = window.localStorage.getItem("sendMethod");

  sample.classList.add("infinity");

  if (sendMethod === "phone") {
    if (!window.localStorage.getItem("phone")) {
      alert("unknown error");
    } else {
      let currentKitchenSummary = tgKitchenSummary();
      let currentSample = tgSample(sample);
      let file = tgSampleImg(sample);
      let formData = new FormData();

      formData.set("phone", window.localStorage.getItem("phone"));

      if (window.localStorage.getItem("kitchen") !== currentKitchenSummary) {
        window.localStorage.setItem("kitchen", currentKitchenSummary);

        formData.set("message", currentKitchenSummary);

        let response = await fetch("madeline/index.php", {
          method: "POST",
          body: formData,
        });
      }

      //console.log(formData.get("phone"));

      formData.set("message", currentSample);
      //formData.set('file', file);

      let response = await fetch("madeline/index.php", {
        method: "POST",
        body: formData,
      });
    }
  } /* else {
    if (!window.localStorage.getItem("email")) {
      alert("unknown error");
    } else if (window.localStorage.getItem("email") === "tshch92@gmail.com") {
      let currentSample = mailSample(sample);
      let formData = new FormData();

      formData.set("samplebrand", currentSample["brand"]);
      formData.set("samplename", currentSample["name"]);
      formData.set("retailprice", currentSample["retailprice"]);
      formData.set(
        "furnprice",
        Math.round(Number(currentSample["retailprice"]) * 0.8)
      );
      formData.set("samplesurface", currentSample["surface"]);

      let response = await fetch("tg-internalbot.php", {
        method: "POST",
        body: formData,
      });

      let result = await response.json();

      setTimeout(() => {
        sample.classList.remove("infinity");
      }, 2000);

      if (!response.ok) {
        alert(result.message);
      }
    } */ else {
    let currentKitchenSummary = tgKitchenSummary();
    //let file = tgSampleImg(sample);
    let currentSample = mailSample(sample);

    let formData = new FormData();

    formData.set("email", window.localStorage.getItem("email"));
    formData.set("samplebrand", currentSample["brand"]);
    formData.set("samplename", currentSample["name"]);
    formData.set("sampleprice", currentSample["price"]);
    formData.set("sampleslabs", currentSample["slabs"]);
    formData.set("samplesurface", currentSample["surface"]);

    formData.set("message", currentKitchenSummary);

    /*       function getFile(url, form){

      var request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.send(null);
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          //var type = url.split(url.lastIndexof('.'), url.length());
          var filename = url.split(url.lastIndexof('/'), url.length());
        }
        ///form.append('filename', filename);
        form.append('file', request.responseText, filename);
        //form.append('saved', 'true');
        //form.append('type', type);
      };

      return form;
    }

      getFile(file, formData);  */

    //formData.set("file", file);

    let response = await fetch("savetomail.php", {
      method: "POST",
      body: formData,
    });

    //console.log("sending email");

    let result = await response.json();

    setTimeout(() => {
      sample.classList.remove("infinity");
    }, 2000);

    if (!response.ok) {
      alert(result.message);
    }
  }
}
