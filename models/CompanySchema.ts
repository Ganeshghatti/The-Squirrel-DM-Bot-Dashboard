import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    company_id: { type: String, required: true, unique: true },
    company_instagram_id: { type: String, required: true, unique: true },
    instagram_profile: { type: String },
    phone: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    access_token: { type: String },
    name: { type: String, required: true },
    FAQ: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    keywords: {type:[String]},
    bot_identity: { type: String, required: true },
    Back_context: { type: String, required: true },
    Role: { type: String, required: true },
    Conversation_Flow: { type: String, required: true },
    isBotActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Company =
  mongoose.models.Company || mongoose.model("Company", CompanySchema);
