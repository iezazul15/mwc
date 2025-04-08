// User model
const User = require("../database/models/User");

// bindUserWithReq
const bindUserWithReq = async (req, res, next) => {
  if (!req.session.user) return next();
  try {
    const user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

//  isAuthenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    req.flash("flash-error", "লগইন আবশ্যক");
    return res.redirect("/auth/login");
  }
  next();
};

// isUnAuthenticated
const isUnauthenticated = (req, res, next) => {
  if (req.session.isLoggedIn) {
    req.flash("flash-error", "ইউজার লগইন অবস্থায় আছেন");
    return res.redirect("/dashboard");
  }
  next();
};

module.exports = { bindUserWithReq, isAuthenticated, isUnauthenticated };
