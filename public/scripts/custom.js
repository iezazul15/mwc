document.addEventListener("DOMContentLoaded", function () {
  const flashMsg = document.querySelector(".custom-flash");
  setTimeout(() => {
    flashMsg.classList.add("d-none");
  }, 3000);
});
