// express router
const router = require("express").Router();

// import profile validator
const postValidator = require("../validators/post/postValidator");

// importing post controllers
const {
  getCreatePostController,
  postCreatePostController,
  getEditPostController,
  postEditPostController,
  deleteThumbnailController,
  deletePostController,
  getSinglePostController,
  getPostViewerController,
  addBookmarkController,
  removeBookmarkController,
} = require("../controllers/postController");

// importing isAuthenticated middleware
const { isAuthenticated } = require("../middlewares/authMiddleware");

// importing upload middleware and controller
const multerMiddleware = require("../middlewares/uploadMiddleware");

// routes
router.get("/create", isAuthenticated, getCreatePostController);
router.post(
  "/create/",
  isAuthenticated,
  multerMiddleware("postImage"),
  postValidator,
  postCreatePostController
);
router.get("/edit/:postId", isAuthenticated, getEditPostController);
router.post(
  "/edit/:postId",
  isAuthenticated,
  multerMiddleware("postImage"),
  postValidator,
  postEditPostController
);
router.get(
  "/:postId/delete-post-thumbnail",
  isAuthenticated,
  deleteThumbnailController
);
router.get("/delete/:postId", isAuthenticated, deletePostController);
router.get(
  "/single/:postId",
  isAuthenticated,
  getPostViewerController,
  getSinglePostController
);
router.post("/:postId/add-bookmark", isAuthenticated, addBookmarkController);
router.post(
  "/:postId/remove-bookmark",
  isAuthenticated,
  removeBookmarkController
);

module.exports = router;
