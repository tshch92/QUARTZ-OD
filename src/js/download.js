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
      let response = await fetch("commercial.php", {
        method: "POST",
        body: formData,
      });
      let result = await response.json();
      if (response.ok) {
        //alert(result.message);
        //formPreview.innerHTML = "";
        form.reset();
        form.classList.remove("_sending");
        goToDownload();
      } else {
        alert(result.message);
        //formPreview.innerHTML = "";
        form.reset();
        form.classList.remove("_sending");
      }
    } else {
      alert("Заполните обязательные поля");
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
    let step1height = document.querySelector(".step-1").offsetHeight;
    document.querySelector(".step-2").style  =  'height: '+step1height+'px';
    document.querySelector(".step-1").style = "display: none";
    
  }
});

function phoneTest(input) {
    //console.log("phone contains 12 digits: " + Boolean(input.value.replace(/[^\d]/g, "").length === 12));
    return (
      input.value.replace(/[^\d]/g, "").length !== 10 &&
      input.value.replace(/[^\d]/g, "").length !== 12
    );
  }