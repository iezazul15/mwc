// import path and fs
const path = require("path");
const fs = require("fs");

// express validator
const { validationResult } = require("express-validator");

// error formatter
const {
  validationErrorFormatter,
} = require("../utils/validationErrorFormatter");

// import Profile & User model
const Profile = require("../database/models/Profile");
const User = require("../database/models/User");

// get dashboard controller
const getDashboardController = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate(
      "user"
    );
    if (!profile) {
      req.flash("flash-error", "প্রোফাইল আবশ্যক");
      return res.redirect("/dashboard/create-profile");
    }
    res.render("pages/dashboard/dashboard", {
      title: "ড্যাশবোর্ড - মুসলিম ওয়েলফেয়ার কমিউনিটি",
      profile,
    });
  } catch (e) {
    next(e);
  }
};

// get create profile controller
const getCreateProfileController = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      req.flash("flash-error", "প্রোফাইল আবশ্যক");
      return res.render("pages/profile/createProfile", {
        title: "প্রোফাইল তৈরি করুন - মুসলিম ওয়েলফেয়ার কমিউনিটি",
        error: {},
        value: {},
      });
    }
    return res.redirect("/dashboard");
  } catch (e) {
    next(e);
  }
};

// post create profile controller
const postCreateProfileController = async (req, res, next) => {
  const errors = validationResult(req).formatWith(validationErrorFormatter);
  if (!errors.isEmpty() || req.multerError) {
    return res.render("pages/profile/createProfile", {
      title: "প্রোফাইল তৈরি করুন - মুসলিম ওয়েলফেয়ার কমিউনিটি",
      error: errors.mapped(),
      value: {
        name: req.body.name,
        title: req.body.title,
        bio: req.body.bio,
      },
    });
  }
  let profilePic = req.user.profilePic;
  if (req.file) {
    profilePic = "/uploads/" + req.file.filename;
  }
  const { name, title, bio } = req.body;
  const profile = new Profile({
    user: req.user._id,
    name,
    title,
    bio,
    profilePic,
  });
  try {
    await profile.save();
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { profilePic } }
    );
    req.flash("flash-success", "প্রোফাইল সফলভাবে তৈরি হয়েছে");
    res.redirect("/dashboard");
  } catch (e) {
    next(e);
    res.redirect("/dashboard/create-profile");
  }
};

// get edit profile controller
const getEditProfileController = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      req.flash("flash-error", "প্রোফাইল আবশ্যক");
      return res.redirect("/dashboard/create-profile");
    }
    res.render("pages/profile/editProfile", {
      title: "প্রোফাইল এডিট করুন - মুসলিম ওয়েলফেয়ার কমিউনিটি",
      error: {},
      value: {
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
      },
    });
  } catch (e) {
    next(e);
  }
};

// post edit profile controller
const postEditProfileController = async (req, res, next) => {
  const errors = validationResult(req).formatWith(validationErrorFormatter);
  if (!errors.isEmpty() || req.multerError) {
    return res.render("pages/profile/editProfile", {
      title: "প্রোফাইল এডিট করুন - মুসলিম ওয়েলফেয়ার কমিউনিটি",
      error: errors.mapped(),
      value: {
        name: req.body.name,
        title: req.body.title,
        bio: req.body.bio,
      },
    });
  }
  const defaultProfilePic = "/images/default-pro-picture-mwc.jpg";
  let profilePic = req.user.profilePic;
  const { name, title, bio } = req.body;
  try {
    if (req.file) {
      if (profilePic && profilePic !== defaultProfilePic) {
        const filePath = path.join(__dirname, "../public", profilePic);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      profilePic = "/uploads/" + req.file.filename;
    }
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: { name, title, bio, profilePic } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { profilePic } }
    );
    req.flash("flash-success", "প্রোফাইল সফলভাবে আপডেট করা হয়েছে");
    res.redirect("/dashboard/edit-profile");
  } catch (e) {
    next(e);
  }
};

// delete (back to default) profile pic controller
const deleteProfilePicController = async (req, res, next) => {
  const defaultProfilePic = "/images/default-pro-picture-mwc.jpg";
  try {
    const profilePicPath = req.user.profilePic;
    if (profilePicPath && profilePicPath !== defaultProfilePic) {
      const filePath = path.join(__dirname, "../public", profilePicPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: { profilePic: defaultProfilePic } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { profilePic: defaultProfilePic } }
    );

    res.redirect("/dashboard/edit-profile");
  } catch (e) {
    next(e);
  }
};

// ***** Sub Dashboard starts

// get all posts in the dashboard
const getAllPostsController = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate(
      "posts"
    );
    if (!profile) {
      res.redirect("/dashboard/create-profile");
    }
    const postPerPage = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const totalPosts = profile.posts.length;
    const totalPages = Math.ceil(totalPosts / postPerPage);
    // manual approach without skip and limit method because we're not directly querying from posts, rather we are populating, hard to understand? when I am trying this, I also felt hard first, google it, spend time with it, you'll understand just like how I understand the whole thing now
    const posts = profile.posts.slice(
      (currentPage - 1) * postPerPage,
      currentPage * postPerPage
    );
    res.render("pages/dashboard/posts", {
      title: "সব পোস্ট - মুসলিম ওয়েলফেয়ার কমিউনিটি",
      posts,
      currentPage,
      totalPages,
    });
  } catch (e) {
    next(e);
  }
};

// get bookmarks controller
const getBookmarksController = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate({
      path: "bookmarks",
      populate: { path: "author", select: "name" },
    });
    if (!profile) {
      res.redirect("/dashboard/create-profile");
    }
    const postPerPage = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const totalPosts = profile.bookmarks.length;
    const totalPages = Math.ceil(totalPosts / postPerPage);
    // manual approach without skip and limit method because we're not directly querying from posts, rather we are populating, hard to understand? when I am trying this, I also felt hard first, google it, spend time with it, you'll understand just like how I understand the whole thing now
    const bookmarks = profile.bookmarks.slice(
      (currentPage - 1) * postPerPage,
      currentPage * postPerPage
    );
    res.render("pages/dashboard/bookmarks", {
      title: "সব বুকমার্ক - মুসলিম ওয়েলফেয়ার কমিউনিটি",
      posts: bookmarks,
      currentPage,
      totalPages,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getDashboardController,
  getCreateProfileController,
  postCreateProfileController,
  getEditProfileController,
  postEditProfileController,
  deleteProfilePicController,
  getAllPostsController,
  getBookmarksController,
};
