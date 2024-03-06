// loginModel.ts

const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    user_password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const Login = mongoose.model("Login", loginSchema);
module.exports = Login;
