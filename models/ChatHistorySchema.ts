import mongoose from "mongoose";

const chat_history_schema = new mongoose.Schema(
  {
    sender_id: { type: String, required: true },
    recipient_id: { type: String, required: true },
    company_id: { type: String, ref: "Company", required: true },
    text: { type: String, required: true },
    mid: { type: String, required: true, unique: true },
    company_instagram_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "chat_history",
  }
);

export const ChatHistory =
  mongoose.models.ChatHistory ||
  mongoose.model("ChatHistory", chat_history_schema);
