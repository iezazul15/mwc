// router
const router = require("express").Router();

// author controller
const { getAuthorController } = require("../controllers/authorController");

// routes
router.get("/:authorId", getAuthorController);

module.exports = router;
