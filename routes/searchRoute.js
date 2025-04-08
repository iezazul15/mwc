// router
const router = require("express").Router();

// search controller
const { searchController } = require("../controllers/searchController");

// routes
router.get("/", searchController);

module.exports = router;
