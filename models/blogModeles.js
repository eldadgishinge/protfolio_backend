var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    blog_name: {
        type: String,
        required: [true, "Please enter the blog title"],
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
}, {
    timestamps: true,
});
blogSchema.virtual("totalLikes").get(function () {
    return this.populated("likedBy") ? this.likedBy.length : 0;
});
module.exports = mongoose.model("Blog", blogSchema);
