const error = (req, res, next) => {
  const error = new Error("404 Not Found");
  error.status = 404;
  next(error);
};

const errorRoute = (error, req, res, next) => {
  if (error.status === 404) {
    return res.render("pages/error/404", { title: "404 Not Found" });
  }
  return res.render("pages/error/500", {
    title: "সার্ভারে কিছু সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।",
  });
};

module.exports = { error, errorRoute };
