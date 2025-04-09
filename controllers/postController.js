// import fs and path module
const fs = require("fs");
const path = require("path");

// utility function for readTIme
const estimateReadTime = require("../utils/readTIme");

// import Profile & Post model
const Profile = require("../database/models/Profile");
const Post = require("../database/models/Post");

// express validator
const { validationResult } = require("express-validator");

// error formatter
const {
  validationErrorFormatter,
} = require("../utils/validationErrorFormatter");

// get createPost controller
const getCreatePostController = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      req.flash("flash-error", "প্রোফাইল আবশ্যক");
      return res.redirect("/dashboard/create-profile");
    }
    res.render("pages/post/createPost", {
      title: "নতুন পোস্ট তৈরি করুন - মুসলিম ওয়েলফেয়ার কমিউনিটি",
      name: profile.name,
      error: {},
      value: {},
    });
  } catch (e) {
    next(e);
  }
};

// post createPost controller
const postCreatePostController = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    const errors = validationResult(req).formatWith(validationErrorFormatter);
    if (!errors.isEmpty() || req.multerError) {
      if (req.file) {
        const filePath = path.join(
          __dirname,
          "../public/uploads/",
          req.file.filename
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.render("pages/post/createPost", {
        title: "নতুন পোস্ট তৈরি করুন - মুসলিম ওয়েলফেয়ার কমিউনিটি",
        name: profile.name,
        error: errors.mapped(),
        value: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          tags: req.body.tags,
        },
      });
    }
    if (!profile) {
      req.flash("flash-error", "প্রোফাইল আবশ্যক");
      return res.redirect("/dashboard/create-profile");
    }
    const { title, description, htmlDescription, category, tags } = req.body;
    const tagsArr = tags.split(",").map((tag) => tag.trim());
    const thumbnail = req.file
      ? "/uploads/" + req.file.filename
      : "/images/b&w-thumbnail.jpg";
    const readTime = estimateReadTime(description);
    const post = new Post({
      title,
      description,
      htmlDescription,
      category: category.split(",")[0], // rare case, if someone mistakenly adds more than one, separated with comma(,) then first one will be taken
      tags: tagsArr,
      author: profile._id,
      thumbnail,
      readTime,
    });
    await post.save();
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          posts: [...profile.posts, post._id],
        },
      },
      { new: true }
    );
    req.flash("flash-success", "পোস্ট সফলভাবে তৈরি হয়েছে");
    res.redirect("/dashboard/post/single/" + post._id);
  } catch (e) {
    next(e);
  }
};

// get edit post controller
const getEditPostController = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      req.flash("flash-error", "প্রোফাইল আবশ্যক");
      res.redirect("/dashboard/create-profile");
    }
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate("author", "name");
    const {
      title,
      description,
      htmlDescription,
      category,
      tags,
      thumbnail,
      createdAt,
    } = post;
    const formattedDate = () => {
      let dateStr = post.createdAt.toLocaleString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
        timeZone: "Asia/Dhaka",
      });
      const parts = dateStr.split(" এ ");
      return parts.length > 1 ? `${parts[0]} - ${parts[1]}` : dateStr;
    };
    res.render("pages/post/editPost", {
      title: "পোস্ট এডিট করুন - মুসলিম ওয়েলফেয়ার কমিউনিটি",
      error: {},
      value: {
        title,
        htmlDescription,
        category,
        tags: tags.join(", "),
        thumbnail,
        createdAt: formattedDate(),
      },
      post,
    });
  } catch (e) {
    next(e);
  }
};

// post edit post controller
const postEditPostController = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.redirect("/dashboard/create-profile");
    }

    const postId = req.params.postId;
    const post = await Post.findById(postId).populate("author", "name");
    if (!post) {
      return res.redirect("/");
    }

    const errors = validationResult(req).formatWith(validationErrorFormatter);
    const { title, description, htmlDescription, category, tags } = req.body;
    const tagsArr = tags.split(",").map((tag) => tag.trim());

    const formattedDate = () => {
      let dateStr = post.createdAt.toLocaleString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
        timeZone: "Asia/Dhaka",
      });
      const parts = dateStr.split(" এ ");
      return parts.length > 1 ? `${parts[0]} - ${parts[1]}` : dateStr;
    };

    if (!errors.isEmpty() || req.multerError) {
      if (req.file) {
        const filePath = path.join(
          __dirname,
          "../public/uploads/",
          req.file.filename
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.render("pages/post/editPost", {
        title: "পোস্ট এডিট করুন - মুসলিম ওয়েলফেয়ার কমিউনিটি",
        error: errors.mapped(),
        value: {
          title,
          htmlDescription,
          category,
          tags: tagsArr.join(", "),
          thumbnail: post.thumbnail,
          createdAt: formattedDate(),
        },
        post,
      });
    }

    let thumbnail = post.thumbnail;
    if (req.file) {
      if (post.thumbnail && post.thumbnail !== "/images/b&w-thumbnail.jpg") {
        const filePath = path.join(__dirname, "../public", post.thumbnail);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      thumbnail = "/uploads/" + req.file.filename;
    }

    // Update post
    await Post.findByIdAndUpdate(postId, {
      $set: {
        title,
        description,
        htmlDescription,
        category: category.split(",")[0],
        tags: tagsArr,
        thumbnail,
        readTime: estimateReadTime(description),
      },
    });

    req.flash("flash-success", "পোস্ট সফলভাবে আপডেট করা হয়েছে");
    res.redirect("/dashboard/post/single/" + postId);
  } catch (e) {
    next(e);
  }
};

// delete post thumbnail controller (back to default one)
const deleteThumbnailController = async (req, res, next) => {
  const defaultThumbnail = "/images/b&w-thumbnail.jpg";
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (post.thumbnail && post.thumbnail !== defaultThumbnail) {
      const filePath = path.join(__dirname, "../public", post.thumbnail);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await Post.findOneAndUpdate(
      { _id: postId },
      { $set: { thumbnail: defaultThumbnail } }
    );
    res.redirect("/dashboard/post/edit/" + postId);
  } catch (e) {
    next(e);
  }
};

// delete post controller
const deletePostController = async (req, res, next) => {
  const defaultThumbnail = "/images/b&w-thumbnail.jpg";
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (post.thumbnail && post.thumbnail !== defaultThumbnail) {
      const filePath = path.join(__dirname, "../public", post.thumbnail);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await Post.findByIdAndDelete(postId);
    // also delete the post ref from profile
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { posts: postId } }
    );
    req.flash("flash-success", "পোস্ট সফলভাবে ডিলিট করা হয়েছে");
    res.redirect("/");
  } catch (e) {
    next(e);
  }
};

// get single post controller
const getSinglePostController = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.postId).populate(
      "author",
      "name"
    );
    if (!post) return res.redirect("/");
    let profile = null;
    if (req.user) {
      profile = await Profile.findOne({ user: req.user._id });
    }

    const formattedDate = post.createdAt
      .toLocaleString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
        timeZone: "Asia/Dhaka",
      })
      .replace(" এ ", " - ");

    res.render("pages/post/singlePost", {
      title: post.title + " - মুসলিম ওয়েলফেয়ার কমিউনিটি",
      profile,
      post,
      formattedDate,
    });
  } catch (e) {
    next(e);
  }
};

// get controller for profile who viewed a post
const getPostViewerController = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({ _id: postId });
    const profile = req.user && (await Profile.findOne({ user: req.user._id }));
    if (profile && !post.viewer.includes(profile._id)) {
      post.viewer.push(profile._id);
      post.views += 1;
      await post.save();
    }
    next();
  } catch (e) {
    next(e);
  }
};

// add bookmark controller
const addBookmarkController = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile.bookmarks.includes(postId)) {
      profile.bookmarks.push(postId);
      await profile.save();
    }
    req.flash("flash-success", "সফলভাবে বুকমার্ক করা হয়েছে");
    res.redirect("/dashboard/post/single/" + postId);
  } catch (e) {
    next(e);
  }
};

// remove bookmark controller
const removeBookmarkController = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const profile = await Profile.findOne({ user: req.user._id });
    const index = profile.bookmarks.indexOf(postId);
    if (index !== -1) {
      profile.bookmarks.splice(index, 1);
      await profile.save();
    }
    if (req.query.redirect === "bookmarks") {
      req.flash("flash-success", "সফলভাবে বুকমার্ক সরানো হয়েছে");
      return res.redirect("/dashboard/bookmarks");
    }
    req.flash("flash-success", "সফলভাবে বুকমার্ক সরানো হয়েছে");
    return res.redirect("/dashboard/post/single/" + postId);
  } catch (e) {
    next(e);
  }
};

module.exports = {
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
};
