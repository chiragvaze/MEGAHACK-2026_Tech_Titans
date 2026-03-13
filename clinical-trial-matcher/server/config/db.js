import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/clinical_trial_matcher";

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.warn(`MongoDB unavailable (${error.message}). Starting API in degraded mode.`);
    return false;
  }
}
