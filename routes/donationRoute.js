// router
const router = require("express").Router();

// donation controller
const { getDonationController } = require("../controllers/donationController");

// routes
router.get("/", getDonationController);

module.exports = router;
