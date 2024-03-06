const mongoose = require("mongoose");

const blogsSchema = new mongoose.Schema(
  {
    blog_name: {
      type: String,
      required: [true, "Please enter the blog name"],
    },
    blog_image: {
      type: String,
      required: [true, "Please enter the image URL"],
    },
    blog_description: {
      type: String,
      required: [true, "Please enter the description"],
    },
    blog_content: {
      type: String,
      required: [true, "Please enter the content"],
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogsSchema);
module.exports = Blog;
