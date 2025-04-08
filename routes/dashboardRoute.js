// express router
const router = require("express").Router();

// importing profile validation
const profileValidator = require("../validators/profile/profileValidator");

// importing dashboard controllers
const {
  getDashboardController,
  getCreateProfileController,
  postCreateProfileController,
  getEditProfileController,
  postEditProfileController,
  deleteProfilePicController,
  getAllPostsController,
  getBookmarksController,
} = require("../controllers/dashboardController");

// importing isAuthenticated middleware
const { isAuthenticated } = require("../middlewares/authMiddleware");

// importing upload middleware and controller
const multerMiddleware = require("../middlewares/uploadMiddleware");

// routes
router.get("/", isAuthenticated, getDashboardController);
router.get("/create-profile", isAuthenticated, getCreateProfileController);
router.post(
  "/create-profile",
  isAuthenticated,
  multerMiddleware("profile-pic"),
  profileValidator,
  postCreateProfileController
);
router.get("/edit-profile", isAuthenticated, getEditProfileController);
router.post(
  "/edit-profile",
  isAuthenticated,
  multerMiddleware("profile-pic"),
  profileValidator,
  postEditProfileController
);
router.get("/delete-profile-pic", isAuthenticated, deleteProfilePicController);
router.get("/posts", isAuthenticated, getAllPostsController);
router.get("/bookmarks", isAuthenticated, getBookmarksController);

module.exports = router;
