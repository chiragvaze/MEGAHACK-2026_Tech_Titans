import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  baselineProfile: {
    typingSpeed: {
      type: Number,
      default: 0
    },
    avgKeyDelay: {
      type: Number,
      default: 0
    },
    mouseSpeed: {
      type: Number,
      default: 0
    },
    clickLatency: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);

export default User;
