const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true, 
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
      'Please fill a valid email address'
    ]
  },
  password: {
    type: String, 
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, 
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'instructor'], 
    default: 'user' 
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);