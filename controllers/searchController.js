const Post = require("../database/models/Post");

const searchController = async (req, res, next) => {
  const searchTerm = req.query.s?.trim() || "";
  const currentPage = parseInt(req.query.page) || 1;
  const postPerPage = 12;

  try {
    const totalPosts = await Post.countDocuments({
      $text: { $search: searchTerm },
    });
    const totalPages = Math.ceil(totalPosts / postPerPage);

    const posts = await Post.find({ $text: { $search: searchTerm } })
      .sort({ createdAt: -1 })
      .skip(postPerPage * (currentPage - 1))
      .limit(postPerPage);

    res.render("pages/search/search", {
      title: "সার্চ রেজাল্ট - মুসলিম ওয়েলফেয়ার কমিউনিটি",
      searchTerm,
      posts,
      totalPages,
      currentPage,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { searchController };
