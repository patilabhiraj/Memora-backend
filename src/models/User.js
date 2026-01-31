const mongoose = require('mongoose');

// This defines how a User looks in DB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Create model from schema
const User = mongoose.model('User', userSchema);

module.exports = User;
