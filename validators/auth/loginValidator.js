// express validator
const { body } = require("express-validator");

// User model
const User = require("../../database/models/User");

// argon2
const argon2 = require("argon2");

// login validation
const loginValidation = [
  body("username")
    .notEmpty()
    .withMessage("ইউজার নাম আবশ্যক")
    .custom(async (username) => {
      const userExists = await User.findOne({ username });
      if (!userExists) throw new Error("সঠিক ক্রীডেনশাল দিন");
    }),
  body("password")
    .notEmpty()
    .withMessage("পাসওয়ার্ড আবশ্যক")
    .custom(async (password, { req }) => {
      const userExists = await User.findOne({ username: req.body.username });
      if (!userExists) throw new Error("সঠিক ক্রীডেনশাল দিন");
      const passwordMatch = await argon2.verify(
        userExists.password,
        req.body.password
      );
      if (!passwordMatch) throw new Error("সঠিক ক্রীডেনশাল দিন");
    }),
];

module.exports = loginValidation;
