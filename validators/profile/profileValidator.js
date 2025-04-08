const { body } = require("express-validator");

const profileValidator = [
  body("name")
    .notEmpty()
    .withMessage("নাম অবশ্যই পূরণ করতে হবে")
    .isLength({ max: 30 })
    .withMessage("নাম ৩০ অক্ষরের মধ্যে হতে হবে"),
  body("title")
    .notEmpty()
    .withMessage("পেশা অবশ্যই পূরণ করতে হবে")
    .isLength({ max: 100 })
    .withMessage("পেশা ১০০ অক্ষরের মধ্যে হতে হবে"),
  body("bio")
    .isLength({ max: 500 })
    .withMessage("বায়ো ৫০০ অক্ষরের মধ্যে হতে হবে"),
];

module.exports = profileValidator;
