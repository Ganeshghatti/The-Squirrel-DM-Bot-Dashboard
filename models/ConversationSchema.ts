import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    company_instagram_id: {
      type: String,
      required: true,
    },
    isConversationActive: {
      type: Boolean,
    },
    messages: [],
  },
  {
    timestamps: { createdAt: true, updatedAt: 'lastUpdate' },
  }
);

export default mongoose.model('Conversation', ConversationSchema);
