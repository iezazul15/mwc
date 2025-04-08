// Name, Email, Password, Profile

const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      maxlength: 15,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    profilePic: {
      type: String,
      default: "/images/default-pro-picture-mwc.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
