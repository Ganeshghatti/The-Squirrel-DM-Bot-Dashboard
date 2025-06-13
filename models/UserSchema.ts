import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true },
    instagram_profile: { type: String },
    password: { type: String, required: true },
    phone: { type: String },
    keywords: { type: [String], default: [] },
    terms: { type: Boolean, default: false },
    onboardingStatus: {
      type: String,
      enum: ["not verified", "verified", "onboarded"],
      default: "not verified",
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
