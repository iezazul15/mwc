// import toBangla utility
const toBangla = require("./toBanglaNum");

const estimateReadTime = (text) => {
  const words = text.split(/\s+/).filter(Boolean);
  const minutes = Math.ceil(words.length / 200);
  return toBangla(minutes);
};

module.exports = estimateReadTime;
