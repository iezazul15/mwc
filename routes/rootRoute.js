// express router
const router = require("express").Router();

// importing root controllers
const { getRootController } = require("../controllers/rootController");

// routes
router.get("/", getRootController);

module.exports = router;
