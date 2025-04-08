// Profile model
const Profile = require("../database/models/Profile");

// get author controller
const getAuthorController = async (req, res, next) => {
  const authorId = req.params.authorId;
  try {
    const profile = await Profile.findOne({ _id: authorId }).populate("posts");
    const postPerPage = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const totalPosts = profile.posts.length;
    const totalPages = Math.ceil(totalPosts / postPerPage);
    const posts = profile.posts.slice(
      (currentPage - 1) * postPerPage,
      currentPage * postPerPage
    );
    res.render("pages/author/author", {
      title: `লেখক ${profile.name} - মুসলিম ওয়েলফেয়ার কমিউনিটি`,
      profile,
      posts,
      currentPage,
      totalPages,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { getAuthorController };
