const { body } = require("express-validator");

const postValidator = [
  body("title")
    .notEmpty()
    .withMessage("পোস্ট টাইটেল আবশ্যক")
    .isLength({ max: 100 })
    .withMessage("টাইটেল ১০০ ক্যারেক্টারের মধ্যে হতে হবে"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("পোস্ট ডেসক্রিপশন আবশ্যক")
    .isLength({ min: 10 })
    .withMessage("ডেসক্রিপশন খুব ছোট"),
];

module.exports = postValidator;
