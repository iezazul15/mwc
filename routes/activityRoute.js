// router
const router = require("express").Router();

// activity controller
const { getActivityController } = require("../controllers/activityController");

// authentication middleware
const { isAuthenticated } = require("../middlewares/authMiddleware");

// routes
router.get("/", isAuthenticated, getActivityController);

module.exports = router;
