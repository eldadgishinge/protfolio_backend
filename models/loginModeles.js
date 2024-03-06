// loginModel.ts
var mongoose = require("mongoose");
var loginSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
    },
    user_password: {
        type: String,
        required: true,
        select: false,
    },
}, {
    timestamps: true,
});
var Login = mongoose.model("Login", loginSchema);
module.exports = Login;
