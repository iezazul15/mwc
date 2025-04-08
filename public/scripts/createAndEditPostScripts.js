document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("title");
  const charExceedAlert = document.getElementById("character-exceed-alert");
  const counter = document.getElementById("title-counter");
  const maxLength = 100;

  const updateCounter = () => {
    let value = titleInput.value;

    if (value.length > 55) {
      charExceedAlert.classList.remove("d-none");
    } else {
      charExceedAlert.classList.add("d-none");
    }

    if (value.length >= 100) {
      counter.classList.add("text-danger");
    } else {
      counter.classList.remove("text-danger");
    }

    if (value.length > maxLength) {
      titleInput.value = value.slice(0, maxLength);
      return;
    }

    const toBangla = (num) => {
      const banglaDigits = [
        "০",
        "১",
        "২",
        "৩",
        "৪",
        "৫",
        "৬",
        "৭",
        "৮",
        "৯",
        "১০",
      ];
      return num
        .toString()
        .split("")
        .map((digit) => banglaDigits[parseInt(digit)])
        .join("");
    };
    counter.textContent = `${toBangla(titleInput.value.length)}/${toBangla(
      maxLength
    )} ক্যারেক্টার`;
  };

  titleInput.addEventListener("input", updateCounter);
  updateCounter();
});
