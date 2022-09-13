"use strict";

document.querySelector("#formImage").addEventListener("input", function () {
  document.querySelector(".form__steptwo").style = "";
  document.querySelector(".form__stepone").classList.add("form__stepone__hide");
  document.querySelector(".form__stepone").classList.remove("form__stepone");
  document
    .querySelector("#complexkitchenshape .disclaimer-card")
    .classList.add("longcard-mob");
  document.querySelector(".form__stepone__hide .btn").textContent =
    "выбрать другую картинку";
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#complexkitchenshape .form__body");
  form.addEventListener("submit", formSend);

  async function formSend(e) {
    e.preventDefault();

    let error = formValidate(form);

    let formData = new FormData(form);
    formData.append("image", formImage.files[0]);

    if (error === 0) {
      form.classList.add("_sending");
      let response = await fetch("sendmail.php", {
        method: "POST",
        body: formData,
      });
      let result = await response.json();
      if (response.ok) {
        console.log(result.message);
        formPreview.innerHTML = "";
        form.reset();
        form.classList.remove("_sending");
        displaySuccessMessage(
          "complexkitchenshape",
          result.message,
          "success-message"
        );
        document.querySelector(".form__steptwo").style = "display: none";
        document
          .querySelector(".form__stepone__hide")
          .classList.add("form__stepone");
        document
          .querySelector(".form__stepone__hide")
          .classList.remove("form__stepone__hide");

        document
          .querySelector("#complexkitchenshape .disclaimer-card")
          .classList.remove("longcard-mob");
        document.querySelector(".form__stepone .btn").textContent =
          "Выбрать файл";
      } else {
        console.log(result.message);
        formPreview.innerHTML = "";
        form.reset();
        form.classList.remove("_sending");
        displaySuccessMessage(
          "complexkitchenshape",
          result.message,
          "fail-message"
        );
      }
    } else {
      alert("Заполните обязательные поля");
    }
  }

  function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll("#complexkitchenshape ._req");

    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index];
      formRemoveError(input);

      if (input.classList.contains("_email") && emailTest(input)) {
        console.log('пустой email');
        formAddError(input);
        error++;
      } else if (input.classList.contains("_phone") && phoneTest(input)) {
        console.log('пустой телефон');
        formAddError(input);
        error++;
      } else if (input.value === "") {
        console.log('хуета какая-то');
        formAddError(input);
        error++;
      }
      /* else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
				formAddError(input);
				error++;
			} */
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

  //Получаем инпут file в переменную
  const formImage = document.getElementById("formImage");
  //Получаем див для превью в переменную
  const formPreview = document.getElementById("formPreview");

  //Слушаем изменения в инпуте file
  formImage.addEventListener("change", () => {
    uploadFile(formImage.files[0]);
  });

  function uploadFile(file) {
    // провераяем тип файла
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      alert("Разрешены только изображения.");
      formImage.value = "";
      return;
    }
    // проверим размер файла (<2 Мб)
    if (file.size > 2 * 1024 * 1024) {
      alert("Файл должен быть менее 2 МБ.");
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
    };
    reader.onerror = function (e) {
      alert("Ошибка");
    };
    reader.readAsDataURL(file);
  }
});

function displaySuccessMessage(id, message, statusID) {
  document.getElementById(id).style = "display: none";
  document.getElementById(statusID).style = "";
  document.querySelector("#" + statusID + " .text-bold").textContent = message;

  setTimeout(hideMessage, 3000, statusID);
}

function hideMessage(id) {
  document.getElementById(id).style = "display: none";
}

//Функция теста email
function emailTest(input) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input);
}

/* function emailTest(val) {
  console.log(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
  console.log('sisis');
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
} */

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

function adjust(phone) {
  let ph = phone.replace(/[^\d]/g, "");
  if (ph.length === 10) {
    phone = '+38'+ph;
  } else if (ph.length === 12) {
    phone = '+'+ph;
  }

  return phone;
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