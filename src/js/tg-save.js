"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", formSend);

  async function formSend(e) {
    e.preventDefault();

    let error = formValidate(form);

    let formData = new FormData(form);

    if (error === 0) {
      form.classList.add("_sending");
      let response = await fetch("madeline/index.php", {
        method: "POST",
        body: formData,
      });
      let result = await response.json();
      if (response.ok) {
        console.log(result.message);
        //formPreview.innerHTML = "";
        form.reset();
        form.classList.remove("_sending");
        goToDownload();
      } else {
        alert(result.message);
        form.reset();
        form.classList.remove("_sending");
      }
    } else {
      alert("Правильн заполните обязательные поля");
    }
  }

  function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll("._req");

    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index];
      formRemoveError(input);

      if (input.classList.contains("_phone") && phoneTest(input)) {
        formAddError(input);
        error++;
      } else if (input.value === "") {
        formAddError(input);
        error++;
      }
    }
    return error;
  }

  function formAddError(input) {
    input.parentElement.classList.add("error-input");
    input.classList.add("error-input");
  }
  function formRemoveError(input) {
    input.parentElement.classList.remove("error-input");
    input.classList.remove("error-input");
  }

  function goToDownload() {
    window.location.href = "commercial-success.html";
  }
});

function phoneTest(input) {
  let phone = input.value.replace(/[^\d]/g, "");
  let res = true;
  if (phone.length === 10 && phonecodes.includes(phone.substr(0, 3))) {
    res = false;
  } else if (
    phone.length === 12 &&
    phone.substr(0, 3) === "380" &&
    phonecodes.includes(phone.substr(2, 3))
  ) {
    res = false;
  }

  return res;
}

const phonecodes = [
  "039",
  "067",
  "068",
  "096",
  "097",
  "098",
  "050",
  "066",
  "095",
  "099",
  "063",
  "093",
  "091",
  "094",
  "092",
];
