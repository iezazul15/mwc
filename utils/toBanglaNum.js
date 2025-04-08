const toBangla = (num) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯", "১০"];
  return num
    .toString()
    .split("")
    .map((digit) => banglaDigits[parseInt(digit)])
    .join("");
};

module.exports = toBangla;
