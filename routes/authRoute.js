// express router
const router = require("express").Router();

// importing signup validation
const signupValidation = require("../validators/auth/signupValidator");

// importing login validation
const loginValidation = require("../validators/auth/loginValidator");

// importing auth controllers
const {
  signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  logout,
} = require("../controllers/authController");

// import isUnauthenticated middleware
const { isUnauthenticated } = require("../middlewares/authMiddleware");

// routes
router.get("/signup", isUnauthenticated, signupGetController);
router.post(
  "/signup",
  isUnauthenticated,
  signupValidation,
  signupPostController
);
router.get("/login", isUnauthenticated, loginGetController);
router.post("/login", isUnauthenticated, loginValidation, loginPostController);
router.get("/logout", logout);

// export the router
module.exports = router;
