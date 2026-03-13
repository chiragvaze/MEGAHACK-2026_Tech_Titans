import mongoose from "mongoose";

const behaviorDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
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
  },
  keyHoldVariance: {
    type: Number,
    default: 0
  },
  mouseAcceleration: {
    type: Number,
    default: 0
  },
  movementJitter: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const BehaviorData = mongoose.model("BehaviorData", behaviorDataSchema);

export default BehaviorData;
