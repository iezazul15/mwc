// title, body, author, tags, thumbnail, readTime, likes, dislikes, comments

const { Schema, model, set, default: mongoose } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    htmlDescription: {
      type: String,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    category: {
      type: String,
      default: "অনির্ধারিত",
      set: (v) => (v && v.trim() !== "" ? v : "অনির্ধারিত"),
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    thumbnail: {
      type: String,
      default: "/images/b&w-thumbnail.jpg",
    },
    views: {
      type: Number,
      default: 0,
    },
    viewer: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile",
      },
    ],
    readTime: String,
  },
  { timestamps: true }
);

postSchema.index({
  title: "text",
  description: "text",
  category: "text",
  tags: "text",
});

const Post = model("Post", postSchema);

module.exports = Post;
