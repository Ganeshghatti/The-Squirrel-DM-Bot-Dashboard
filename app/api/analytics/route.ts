import { connectDB } from "@/lib/db";
import { Company } from "@/models/CompanySchema";
import { ChatHistory } from "@/models/ChatHistorySchema";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange");

    // Validate timeRange
    const validTimeRanges = ["24h", "7d", "30d"];
    if (!timeRange || !validTimeRanges.includes(timeRange)) {
      return NextResponse.json(
        { error: "Invalid time range. Use 24h, 7d, or 30d.", success: false },
        { status: 400 }
      );
    }

    // Authenticate and get company
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    ) as { companyId: string };

    const company = await Company.findById(decoded.companyId).select(
      "-password"
    );
    if (!company) {
      return NextResponse.json(
        { error: "Company not found", success: false },
        { status: 404 }
      );
    }

    let timeFilter: any = {};
    let activityData = [];
    let dailyActiveUsers = [];
    let newVsReturningUsers = { newUsers: 0, returningUsers: 0 };
    let messageVolumeTrend = [];
    let activeConversations = [];
    let responseRateTrend = [];
    const now = new Date();

    if (timeRange === "24h") {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: since } };
      for (let i = 23; i >= 0; i--) {
        const hourStart = new Date(now);
        hourStart.setHours(now.getHours() - i, 0, 0, 0);
        const hourEnd = new Date(hourStart);
        hourEnd.setHours(hourStart.getHours() + 1, 0, 0, 0);

        const hourMessages = await ChatHistory.find({
          company_id: company._id,
          createdAt: { $gte: hourStart, $lt: hourEnd },
        });

        console.log("Hour Messages ", hourMessages);

        const userIds = new Set(
          hourMessages
            .filter(
              (msg) => msg.sender_id.toString() !== company._id.toString()
            )
            .map((msg) => msg.sender_id.toString())
        );

        // Calculate new users for this hour
        const newUsers = new Set<string>();
        for (const userId of userIds) {
          const priorMessages = await ChatHistory.findOne({
            company_id: company._id,
            sender_id: userId,
            createdAt: { $lt: hourStart },
          });
          if (!priorMessages) {
            newUsers.add(userId);
          }
        }

        console.log("New Users ", newUsers);

        // Calculate response rate for this hour
        const sentMessages = hourMessages.filter(
          (msg) => msg.sender_id.toString() === company._id.toString()
        ).length;
        console.log("Sent Messages  ", sentMessages);

        const responseRate =
          hourMessages.length > 0
            ? ((sentMessages / hourMessages.length) * 100).toFixed(1)
            : "0.0";

        activityData.push({
          time: hourStart.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          count: hourMessages.length,
        });
        dailyActiveUsers.push({
          time: hourStart.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          users: userIds.size,
          newUsers: newUsers.size,
        });
        messageVolumeTrend.push({
          time: hourStart.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          count: hourMessages.length,
        });
        responseRateTrend.push({
          time: hourStart.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          responseRate: responseRate,
        });
        console.log("activity data   ", activityData);
        console.log("dailyActiveUsers   ", dailyActiveUsers);
        console.log("messageVolume Trend   ", messageVolumeTrend);
        console.log("responseRate Trend   ", responseRateTrend);
      }
    } else if (timeRange === "7d") {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: since } };
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        const dayStr =
          i === 0
            ? "Today"
            : i === 1
            ? "Yesterday"
            : day.toLocaleDateString("en-US", { weekday: "short" });
        const dayStart = new Date(day);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(day);
        dayEnd.setHours(23, 59, 59, 999);

        const dayMessages = await ChatHistory.find({
          company_id: company._id,
          createdAt: { $gte: dayStart, $lte: dayEnd },
        });

        const userIds = new Set(
          dayMessages
            .filter(
              (msg) => msg.sender_id.toString() !== company._id.toString()
            )
            .map((msg) => msg.sender_id.toString())
        );

        // Calculate new users for this day
        const newUsers = new Set<string>();
        for (const userId of userIds) {
          const priorMessages = await ChatHistory.findOne({
            company_id: company._id,
            sender_id: userId,
            createdAt: { $lt: dayStart },
          });
          if (!priorMessages) {
            newUsers.add(userId);
          }
        }

        // Calculate response rate for this day
        const sentMessages = dayMessages.filter(
          (msg) => msg.sender_id.toString() === company._id.toString()
        ).length;
        const responseRate =
          dayMessages.length > 0
            ? ((sentMessages / dayMessages.length) * 100).toFixed(1)
            : "0.0";

        activityData.push({
          time: dayStr,
          count: dayMessages.length,
        });
        dailyActiveUsers.push({
          time: dayStr,
          users: userIds.size,
          newUsers: newUsers.size,
        });
        messageVolumeTrend.push({
          time: dayStr,
          count: dayMessages.length,
        });
        responseRateTrend.push({
          time: dayStr,
          responseRate: responseRate,
        });

        console.log("dayMessages   ", dayMessages);
        console.log("response rate   ", responseRate);
        console.log("activity data   ", activityData);
        console.log("dailyActiveUsers   ", dailyActiveUsers);
        console.log("messageVolume Trend   ", messageVolumeTrend);
        console.log("responseRate Trend   ", responseRateTrend);
      }
    } else if (timeRange === "30d") {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: since } };
      // Generate 5 weekly buckets for activity, DAU, message volume, active conversations, response rate
      for (let i = 4; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (i + 1) * 6);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const weekMessages = await ChatHistory.find({
          company_id: company._id,
          createdAt: { $gte: weekStart, $lte: weekEnd },
        });

        const userIds = new Set(
          weekMessages
            .filter(
              (msg) => msg.sender_id.toString() !== company._id.toString()
            )
            .map((msg) => msg.sender_id.toString())
        );

        // Calculate new users for this week
        const newUsers = new Set<string>();
        for (const userId of userIds) {
          const priorMessages = await ChatHistory.findOne({
            company_id: company._id,
            sender_id: userId,
            createdAt: { $lt: weekStart },
          });
          if (!priorMessages) {
            newUsers.add(userId);
          }
        }

        // Calculate response rate for this week
        const sentMessages = weekMessages.filter(
          (msg) => msg.sender_id.toString() === company._id.toString()
        ).length;
        const responseRate =
          weekMessages.length > 0
            ? ((sentMessages / weekMessages.length) * 100).toFixed(1)
            : "0.0";

        activityData.push({
          time: `Week ${5 - i}`,
          count: weekMessages.length,
        });
        dailyActiveUsers.push({
          time: `Week ${5 - i}`,
          users: userIds.size,
          newUsers: newUsers.size,
        });
        messageVolumeTrend.push({
          time: `Week ${5 - i}`,
          count: weekMessages.length,
        });
        responseRateTrend.push({
          time: `Week ${5 - i}`,
          responseRate: responseRate,
        });
      }
      console.log("activity data   ", activityData);
      console.log("dailyActiveUsers   ", dailyActiveUsers);
      console.log("messageVolume Trend   ", messageVolumeTrend);
      console.log("responseRate Trend   ", responseRateTrend);
    }

    // New vs Returning Users (overall for the time range)
    const messagesInTimeframe = await ChatHistory.find({
      company_id: company._id,
      createdAt: timeFilter.createdAt,
    });

    const userIdsInTimeframe = new Set(
      messagesInTimeframe
        .filter((msg) => msg.sender_id.toString() !== company._id.toString())
        .map((msg) => msg.sender_id.toString())
    );

    const newUsers = new Set<string>();
    for (const userId of userIdsInTimeframe) {
      const priorMessages = await ChatHistory.findOne({
        company_id: company._id,
        sender_id: userId,
        createdAt: { $lt: timeFilter.createdAt.$gte },
      });
      if (!priorMessages) {
        newUsers.add(userId);
      }
    }

    newVsReturningUsers = {
      newUsers: newUsers.size,
      returningUsers: userIdsInTimeframe.size - newUsers.size,
    };

    // Other analytics
    const messages = await ChatHistory.find({
      company_id: company._id,
      ...timeFilter,
    }).sort({ createdAt: -1 });

    const conversations: any = {};
    const recentActivity: any[] = [];
    let messageCount = 0;
    let uniqueUsersCount = 0;
    let responsesCount = 0;

    messages.forEach((message) => {
      messageCount++;
      const isFromCompany =
        message.sender_id.toString() === company._id.toString();
      const otherPartyId = isFromCompany
        ? message.recipient_id.toString()
        : message.sender_id.toString();

      if (isFromCompany) {
        responsesCount++;
      }

      if (recentActivity.length < 10) {
        recentActivity.push({
          id: message._id,
          type: isFromCompany ? "sent" : "received",
          message: message.text,
          timestamp: message.createdAt,
          userId: otherPartyId,
        });
      }

      if (!conversations[otherPartyId]) {
        conversations[otherPartyId] = {
          userId: otherPartyId,
          lastMessage: message.text,
          lastTimestamp: message.createdAt,
          messageCount: 1,
          unreadCount: isFromCompany ? 0 : 1,
        };
        uniqueUsersCount++;
      } else {
        conversations[otherPartyId].messageCount++;
        if (
          new Date(message.createdAt) >
          new Date(conversations[otherPartyId].lastTimestamp)
        ) {
          conversations[otherPartyId].lastMessage = message.text;
          conversations[otherPartyId].lastTimestamp = message.createdAt;
          if (!isFromCompany) {
            conversations[otherPartyId].unreadCount++;
          }
        }
      }
    });

    const conversationList = Object.values(conversations).sort(
      (a: any, b: any) =>
        new Date(b.lastTimestamp).getTime() -
        new Date(a.lastTimestamp).getTime()
    );

    // Active Conversations Over Time
    activeConversations = activityData.map(({ time }) => {
      const conversationsInBucket = conversationList.filter((conv: any) => {
        const lastTimestamp = new Date(conv.lastTimestamp);
        let bucketStart: Date;
        let bucketEnd: Date;

        if (timeRange === "24h") {
          bucketStart = new Date(now);
          bucketStart.setHours(
            parseInt(time.split(":")[0]) +
              (time.includes("PM") && time.split(":")[0] !== "12" ? 12 : 0),
            0,
            0,
            0
          );
          bucketEnd = new Date(bucketStart);
          bucketEnd.setHours(bucketStart.getHours() + 1);
        } else if (timeRange === "7d") {
          bucketStart = new Date(now);
          bucketStart.setDate(
            now.getDate() -
              (time === "Today"
                ? 0
                : time === "Yesterday"
                ? 1
                : parseInt(time.split(" ")[1]))
          );
          bucketStart.setHours(0, 0, 0, 0);
          bucketEnd = new Date(bucketStart);
          bucketEnd.setHours(23, 59, 59, 999);
        } else {
          bucketStart = new Date(now);
          bucketStart.setDate(
            now.getDate() - (5 - parseInt(time.split(" ")[1])) * 6
          );
          bucketEnd = new Date(bucketStart);
          bucketEnd.setDate(bucketStart.getDate() + 6);
          bucketEnd.setHours(23, 59, 59, 999);
        }

        return lastTimestamp >= bucketStart && lastTimestamp <= bucketEnd;
      });
      return { time, count: conversationsInBucket.length };
    });

    // Sent vs Received Messages (overall)
    const messageTypeBreakdown = {
      sent: messages.filter(
        (msg) => msg.sender_id.toString() === company._id.toString()
      ).length,
      received: messages.filter(
        (msg) => msg.sender_id.toString() !== company._id.toString()
      ).length,
    };

    // Peak Activity
    const peakMessage = messageVolumeTrend.reduce(
      (max, item) => (item.count > max.count ? item : max),
      messageVolumeTrend[0] || { time: "", count: 0 }
    );
    const peakUsers = dailyActiveUsers.reduce(
      (max, item) => (item.users > max.users ? item : max),
      dailyActiveUsers[0] || { time: "", users: 0 }
    );
    const peakActivity = {
      peakMessageTime: peakMessage.time,
      peakMessageCount: peakMessage.count,
      peakUsersTime: peakUsers.time,
      peakUsersCount: peakUsers.users,
    };

    const avgMessagesPerConversation =
      uniqueUsersCount > 0
        ? (messageCount / uniqueUsersCount).toFixed(1)
        : "0.0";

    const responseRate =
      messageCount > 0 ? (responsesCount / messageCount) * 100 : 0;

    console.log("peak Activity ", messageTypeBreakdown);
    console.log("peak Activity ", peakMessage);
    console.log("peak Activity ", peakActivity);
    console.log("avgMessagesPerConversation ", avgMessagesPerConversation);
    console.log("peakUsers ", peakUsers);

    return NextResponse.json(
      {
        success: true,
        analytics: {
          totalMessages: messageCount,
          uniqueUsers: uniqueUsersCount,
          responseRate: responseRate.toFixed(1),
          avgMessagesPerConversation,
          conversations: conversationList,
          recentActivity,
          activityData,
          dailyActiveUsers,
          newVsReturningUsers,
          messageVolumeTrend,
          activeConversations,
          messageTypeBreakdown,
          responseRateTrend,
          peakActivity,
        },
        company,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chat analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
