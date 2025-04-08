// argon2 for password hashing
const argon2 = require("argon2");

// express validator
const { validationResult } = require("express-validator");

// error formatter
const {
  validationErrorFormatter,
} = require("../utils/validationErrorFormatter");

// User model
const User = require("../database/models/User");

// get signup page
const signupGetController = (req, res, next) => {
  res.render("pages/auth/signup", {
    title: "নতুন অ্যাকাউন্ট তৈরি করুন - মুসলিম ওয়েলফেয়ার কমিউনিটি",
    error: {},
    value: {},
  });
};

// post signup form
const signupPostController = async (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = validationResult(req).formatWith(validationErrorFormatter);
  if (!errors.isEmpty()) {
    return res.render("pages/auth/signup", {
      title: "নতুন অ্যাকাউন্ট তৈরি করুন - মুসলিম ওয়েলফেয়ার কমিউনিটি",
      error: errors.mapped(),
      value: {
        username,
        email,
        password,
      },
    });
  }
  try {
    let hashedPassword = await argon2.hash(password);
    let user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    req.flash("flash-success", "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে");
    res.redirect("/auth/login");
  } catch (e) {
    next(e);
  }
};

// get login page
const loginGetController = (req, res) => {
  res.render("pages/auth/login", {
    title: "অ্যাকাউন্টে লগইন করুন - মুসলিম ওয়েলফেয়ার কমিউনিটি",
    error: {},
    value: {},
  });
};

// post login form
const loginPostController = async (req, res, next) => {
  const { username, password } = req.body;
  const errors = validationResult(req).formatWith(validationErrorFormatter);
  if (!errors.isEmpty()) {
    return res.render("pages/auth/login", {
      title: "অ্যাকাউন্টে লগইন করুন - মুসলিম ওয়েলফেয়ার কমিউনিটি",
      error: errors.mapped(),
      value: {
        username,
        password,
      },
    });
  }
  try {
    if (errors.isEmpty()) {
      const user = await User.findOne({ username });
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          return next(err);
        }
        req.flash("flash-success", "সফলভাবে লগইন হয়েছে");
        res.redirect("/");
      });
    }
  } catch (e) {
    return res.json({
      error: "An error occurred",
    });
  }
};

// logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to destroy session.");
    }
    res.clearCookie("connect.sid");
    res.redirect("/auth/login");
  });
};

// export all the controllers
module.exports = {
  signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  logout,
};
