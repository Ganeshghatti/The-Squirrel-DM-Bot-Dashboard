import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ChatHistory } from "@/models/ChatHistorySchema";
import { randomUUID } from "crypto"; // Add this

export async function GET() {
  await connectDB();

  const companyId = "68343217174a87c0ca3f7542";
  const instaBotId = "6653cfc1bf1c4b3d0f51a5a5";
  const realUserId = "6653d1234567890abcde1234";

  const messages = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const userTimestamp = new Date(now.getTime() - (30 - i) * 60 * 1000);
    const replyTimestamp = new Date(userTimestamp.getTime() + (2 + i) * 60 * 1000);

    // Real user message
    messages.push({
      sender_id: realUserId,
      recipient_id: companyId,
      company_id: companyId,
      text: `Real user message #${i + 1}`,
      mid: `mid_user_${randomUUID()}`,
      company_instagram_id: companyId,
      createdAt: userTimestamp,
    });

    // Company reply
    messages.push({
      sender_id: companyId,
      recipient_id: realUserId,
      company_id: companyId,
      text: `Company reply #${i + 1}`,
      mid: `mid_company_${randomUUID()}`,
      company_instagram_id: companyId,
      createdAt: replyTimestamp,
    });
  }

  try {
    await ChatHistory.insertMany(messages);
    return NextResponse.json({
      success: true,
      message: "Realistic dummy messages with unique mids created",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to create messages" },
      { status: 500 }
    );
  }
}
