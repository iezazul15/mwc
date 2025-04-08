// import models
const Profile = require("../database/models/Profile");
const Post = require("../database/models/Post");

// get root controller
const getRootController = async (req, res, next) => {
  try {
    const currentPage = parseInt(req.query.page) || 1;
    const postPerPage = 12;
    const profile = req.user && (await Profile.findOne({ user: req.user._id }));
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / postPerPage);
    const posts = await Post.find()
      .populate("author", "name title, profilePic")
      .sort({ createdAt: -1 })
      .skip(postPerPage * currentPage - postPerPage)
      .limit(postPerPage);
    res.render("pages/index", {
      title: "হোম - মুসলিম ওয়েলফেয়ার কমিউনিটি",
      profile,
      posts,
      postPerPage,
      currentPage,
      totalPages,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { getRootController };
