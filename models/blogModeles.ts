const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter the blog title"],
    },
    image: {
      type: String,
      required: [true, "Please enter the image URL"],
    },
    description: {
      type: String,
      required: [true, "Please enter the description"],
    },
    content: {
      type: String,
      required: [true, "Please enter the content"],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "Login",
      },
    ],
    totalLikes: {
      type: Number,
      default: () => this.likedBy.length,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
