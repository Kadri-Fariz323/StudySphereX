const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true, // Removes whitespace from ends
    minLength: [2, "Name must be at least 2 characters"],
    maxLength: [50, "Name cannot exceed 50 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address"
    ],
    lowercase: true,
    trim: true
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
    minLength: [10, "Message must be at least 10 characters"]
  },
  // Useful for admin panels to track requests
  status: {
    type: String,
    enum: ["new", "read", "responded"],
    default: "new"
  }
}, {
  timestamps: true 
});

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

module.exports = Contact;