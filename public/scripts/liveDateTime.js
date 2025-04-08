document.addEventListener("DOMContentLoaded", () => {
  //   date time script
  function updateDateTime() {
    let dateTIme = new Date().toLocaleString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      timeZone: "Asia/Dhaka",
    });
    const splitted = dateTIme.split(" এ ");
    if (splitted.length > 1) {
      dateTIme = splitted[0] + " - " + splitted[1];
    }
    document.getElementById("live-date-time").innerText = dateTIme;
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);
});
