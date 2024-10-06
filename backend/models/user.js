const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Removes any extra spaces
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Automatically creates `createdAt` and `updatedAt` fields

// Create a User model using the schema
const User = mongoose.model('User', UserSchema);

module.exports = User;
