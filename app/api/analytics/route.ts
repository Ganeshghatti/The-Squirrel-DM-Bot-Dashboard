import { connectDB } from "@/lib/db";
import Conversation from "@/models/ConversationSchema";
import { NextRequest, NextResponse } from "next/server";
import { authenticateCompany } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await authenticateCompany(request);

    if (!authResult.success) return authResult.response;

    const company = authResult.company;

    // Count total conversations for the authenticated company
    const totalConversation = await Conversation.countDocuments({
      company_instagram_id: company.company_instagram_id,
    });

    // Get all conversations with messages and timestamps
    const conversations = await Conversation.find({
      company_instagram_id: company.company_instagram_id,
    }).select("messages createdAt isConversationActive");

    // Calculate total messages by summing the length of messages array in each conversation
    const totalMessages = conversations.reduce((sum, conversation) => {
      return sum + (conversation.messages ? conversation.messages.length : 0);
    }, 0);

    // Calculate additional metrics
    const activeConversations = conversations.filter(
      (conv) => conv.isConversationActive
    ).length;
    const inactiveConversations = totalConversation - activeConversations;

    // Calculate average messages per conversation
    const avgMessagesPerConversation =
      totalConversation > 0
        ? Number((totalMessages / totalConversation).toFixed(1))
        : 0;

    // Calculate conversations with no messages
    const emptyConversations = conversations.filter(
      (conv) => !conv.messages || conv.messages.length === 0
    ).length;

    // Calculate engagement rate (conversations with messages / total conversations)
    const engagementRate =
      totalConversation > 0
        ? Number(
            (
              ((totalConversation - emptyConversations) / totalConversation) *
              100
            ).toFixed(1)
          )
        : 0;

    // Calculate conversations by activity level
    const highActivityConversations = conversations.filter(
      (conv) => conv.messages && conv.messages.length >= 10
    ).length;
    const mediumActivityConversations = conversations.filter(
      (conv) =>
        conv.messages && conv.messages.length >= 3 && conv.messages.length < 10
    ).length;
    const lowActivityConversations = conversations.filter(
      (conv) =>
        conv.messages && conv.messages.length > 0 && conv.messages.length < 3
    ).length;

    // Calculate message density (total messages per active conversation)
    const messageDensity =
      activeConversations > 0
        ? Number((totalMessages / activeConversations).toFixed(1))
        : 0;

    // Calculate conversation completion rate (assuming conversations with 5+ messages are "completed")
    const completedConversations = conversations.filter(
      (conv) => conv.messages && conv.messages.length >= 5
    ).length;
    const completionRate =
      totalConversation > 0
        ? Number(
            ((completedConversations / totalConversation) * 100).toFixed(1)
          )
        : 0;

    return NextResponse.json(
      {
        success: true,
        analytics: {
          // Core metrics
          totalConversation,
          totalMessages,

          // Activity metrics
          activeConversations,
          inactiveConversations,

          // Engagement metrics
          avgMessagesPerConversation,
          engagementRate,
          messageDensity,
          completionRate,

          // Conversation distribution
          highActivityConversations,
          mediumActivityConversations,
          lowActivityConversations,
          emptyConversations,
          completedConversations,
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
