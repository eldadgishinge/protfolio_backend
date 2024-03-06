var mongoose = require("mongoose");
var commentSchema = new mongoose.Schema({
    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true,
    },
    commenter_name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    comment: {
        type: String,
        required: [true, "Please enter your comment"],
    },
}, {
    timestamps: true,
});
var Comments = mongoose.model("Comment", commentSchema);
module.exports = Comments;
