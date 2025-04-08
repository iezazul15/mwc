const setLocals = (req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.isLoggedIn = req.session.isLoggedIn || false;

  res.locals.flashError = req.flash("flash-error");
  res.locals.flashSuccess = req.flash("flash-success");

  res.locals.fileError = null; // I have set the value in the uplaodMiddleware file, check that ***

  // it's for index ejs file to load the pagination number in bangla
  res.locals.toBangla = (num) => {
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
  next();
};

module.exports = setLocals;
