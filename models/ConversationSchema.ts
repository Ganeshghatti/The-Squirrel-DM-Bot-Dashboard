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
    participants: {
  type: [String],
  required: true,
  validate: {
    validator: function (arr: string[]) {
      return arr.length === 2;
    },
    message: 'Participants array must contain exactly 2 user IDs.',
  },
},
    messages: [],
  },
  {
    timestamps: { createdAt: true, updatedAt: 'lastUpdate' },
  }
);

export default mongoose.model('Conversation', ConversationSchema);
