// get activity controller
const getActivityController = (req, res, next) => {
  res.render("pages/activity/activity", {
    title: "অ্যাক্টিভিটিজম - মুসলিম ওয়েলফেয়ার কমিউনিটি",
  });
};

module.exports = { getActivityController };
