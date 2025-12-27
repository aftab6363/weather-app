import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true  // prevents duplicate emails
  },
  password: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

const User = mongoose.model("User", userSchema);

export default User;
