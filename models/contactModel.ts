const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema(
  {
    Contact_name: {
      type: String,
      required: [true, "Please enter the contact name"],
    },
    contact_email: {
      type: String,
      required: [true, "Please enter the contact email"],
    },
    contact_message: {
      type: String,
      required: [true, "Please enter the conatact message"],
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
