// get donation controller
const getDonationController = (req, res, next) => {
  res.render("pages/donation/donation", {
    title: "ডোনেশন - মুসলিম ওয়েলফেয়ার কমিউনিটি",
  });
};

module.exports = { getDonationController };
