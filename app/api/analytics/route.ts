import { connectDB } from "@/lib/db";
import Conversation from "@/models/ConversationSchema";
import { NextRequest, NextResponse } from "next/server";
import { authenticateCompany } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await authenticateCompany(request);

    if (!authResult.success) return authResult.response;

    const company = authResult.company; // Count total conversations for the authenticated company
    const totalConversation = await Conversation.countDocuments({
      company_instagram_id: company.company_instagram_id,
    });

    // Get all conversations and sum up the messages in each conversation
    const conversations = await Conversation.find({
      company_instagram_id: company.company_instagram_id,
    }).select("messages");

    // Calculate total messages by summing the length of messages array in each conversation
    const totalMessages = conversations.reduce((sum, conversation) => {
      return sum + (conversation.messages ? conversation.messages.length : 0);
    }, 0);

    return NextResponse.json(
      {
        success: true,
        analytics: {
          totalConversation,
          totalMessages,
        },
        company,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
