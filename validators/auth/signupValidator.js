// express validator
const { body } = require("express-validator");

// User model
const User = require("../../database/models/User");

// signup validation
const signupValidation = [
  body("username")
    .isLength({ min: 3, max: 15 })
    .withMessage("ইউজার নাম অবশ্যই ৩ থেকে ১৫ ক্যারেক্টারের মধ্যে হতে হবে")
    .custom(async (username) => {
      let existingUser = await User.findOne({ username });
      if (existingUser) throw new Error("ইউজার নাম ইতিমধ্যে ব্যবহার হয়ে গেছে");
    })
    .trim(),
  body("email")
    .isEmail()
    .withMessage("অনুগ্রহ করে ভ্যালিড ইমেইল এড্রেস দিন")
    .custom(async (email) => {
      let existingEmail = await User.findOne({ email });
      if (existingEmail) throw new Error("ইমেইল ইতিমধ্যে ব্যবহার হয়ে গেছে");
    })
    .normalizeEmail(),
  body("password")
    .isLength({ min: 5 })
    .withMessage("পাসওয়ার্ড অবশ্যই ৫ ক্যারেক্টারের বেশি হতে হবে"),
  body("confirmPassword")
    .isLength({ min: 5 })
    .withMessage("পাসওয়ার্ড অবশ্যই ৫ ক্যারেক্টারের বেশি হতে হবে")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password)
        throw new Error("পাসওয়ার্ড মিলে নি, আবার চেষ্টা করুন");
      return true;
    }),
];

module.exports = signupValidation;
