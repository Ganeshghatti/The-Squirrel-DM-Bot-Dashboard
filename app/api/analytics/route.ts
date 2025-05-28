import { connectDB } from "@/lib/db";
import { Company } from "@/models/CompanySchema";
import { ChatHistory } from "@/models/ChatHistorySchema";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { authenticateCompany } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await authenticateCompany(request);

    if (!authResult.success) return authResult.response;

    const company = authResult.company;

    // Parse time range parameters
    // const { searchParams } = new URL(request.url);
    // const timeRange = searchParams.get("timeRange");
    // const startDate = searchParams.get("startDate");
    // const endDate = searchParams.get("endDate");

    // let timeFilter: any = {};
    // const now = new Date();
    // // Adjust for IST (UTC+5:30)
    // const istOffset = 5.5 * 60 * 60 * 1000;
    // const nowIST = new Date(now.getTime());
    // let bucketType: "hour" | "day" | "week" = "day";
    // let buckets: { time: string; count: number }[] = [];

    // Handle time range
    // if (startDate && endDate) {
    //   const start = new Date(startDate);
    //   const end = new Date(endDate);
    //   if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    //     return NextResponse.json(
    //       { error: "Invalid startDate or endDate", success: false },
    //       { status: 400 }
    //     );
    //   }
    //   timeFilter = {
    //     createdAt: {
    //       $gte: new Date(start.getTime() - istOffset),
    //       $lte: new Date(end.getTime() - istOffset),
    //     },
    //   };
    //   const daysDiff =
    //     (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    //   bucketType = daysDiff <= 1 ? "hour" : daysDiff <= 7 ? "day" : "week";

    //   if (bucketType === "hour") {
    //     for (let i = 0; i <= Math.floor(daysDiff * 24); i++) {
    //       const time = new Date(start.getTime() + i * 60 * 60 * 1000);
    //       buckets.push({
    //         time: time.toISOString().slice(0, 13) + ":00",
    //         count: 0,
    //       });
    //     }
    //   } else if (bucketType === "day") {
    //     for (let i = 0; i <= daysDiff; i++) {
    //       const time = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    //       buckets.push({
    //         time: time.toISOString().slice(0, 10),
    //         count: 0,
    //       });
    //     }
    //   } else {
    //     for (let i = 0; i <= Math.ceil(daysDiff / 7); i++) {
    //       const time = new Date(start.getTime() + i * 7 * 24 * 60 * 60 * 1000);
    //       buckets.push({
    //         time: time.toISOString().slice(0, 10),
    //         count: 0,
    //       });
    //     }
    //   }
    // } else {
    //   let since: Date;
    //   switch (timeRange) {
    //     case "24h":
    //       since = new Date(nowIST.getTime() - 24 * 60 * 60 * 1000);
    //       timeFilter = {
    //         createdAt: { $gte: new Date(since.getTime() - istOffset) },
    //       };
    //       bucketType = "hour";
    //       for (let i = 0; i < 24; i++) {
    //         const time = new Date(since.getTime() + i * 60 * 60 * 1000);
    //         buckets.push({
    //           time: time.toISOString().slice(0, 13) + ":00",
    //           count: 0,
    //         });
    //       }
    //       break;
    //     case "30d":
    //       since = new Date(nowIST.getTime() - 30 * 24 * 60 * 60 * 1000);
    //       timeFilter = {
    //         createdAt: { $gte: new Date(since.getTime() - istOffset) },
    //       };
    //       bucketType = "week";
    //       for (let i = 0; i < 5; i++) {
    //         const time = new Date(
    //           since.getTime() + i * 7 * 24 * 60 * 60 * 1000
    //         );
    //         buckets.push({
    //           time: time.toISOString().slice(0, 10),
    //           count: 0,
    //         });
    //       }
    //       break;
    //     case "7d":
    //     default:
    //       since = new Date(nowIST.getTime() - 7 * 24 * 60 * 60 * 1000);
    //       timeFilter = {
    //         createdAt: { $gte: new Date(since.getTime() - istOffset) },
    //       };
    //       bucketType = "day";
    //       for (let i = 0; i < 7; i++) {
    //         const time = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
    //         buckets.push({
    //           time: time.toISOString().slice(0, 10),
    //           count: 0,
    //         });
    //       }
    //       break;
    //   }
    // }

    // // Debugging: Log time filter
    // console.log("Time Filter:", JSON.stringify(timeFilter, null, 2));
    // console.log("Bucket Type:", bucketType);
    // console.log("Buckets:", buckets);

    // Test query to verify data
    // const testData = await ChatHistory.find({
    //   company_instagram_id: company.company_instagram_id,
    //   ...timeFilter,
    // }).limit(5);
    // console.log("Test Data:", testData);

    // 1. Total number of messages (no time filter)
    const now = new Date();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 2. Aggregate messages from last 24 hours, excluding specific company_instagram_id
    const hourlyCounts = await ChatHistory.aggregate([
      {
        $match: {
          createdAt: {
            $gte: twentyFourHoursAgo,
            $lte: now,
          },
          company_instagram_id: { $ne: "YOUR_EXCLUDED_ID" }, // replace with actual ID
        },
      },
      {
        $group: {
          _id: { hour: { $hour: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.hour": 1 },
      },
    ]);

    console.log("history ", hourlyCounts);

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const weeklyCounts = await ChatHistory.aggregate([
      {
        $match: {
          createdAt: {
            $gte: oneWeekAgo,
            $lte: now,
          },
          company_id: company.company_instagram_id,
        },
      },
      {
        $group: {
          _id: { hour: { $hour: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.hour": 1 },
      },
    ]);
    console.log("weekly  ", weeklyCounts);

    const chats = await ChatHistory.find({}, { createdAt: 1 }).lean();
    console.log(chats.map((c) => c.createdAt));

    const totalMessages = await ChatHistory.countDocuments({
      company_instagram_id: company.company_instagram_id,
    });

    // 2. Number of unique users (no time filter)
    const uniqueUsers = await ChatHistory.aggregate([
      {
        $match: {
          company_instagram_id: company.company_instagram_id,
        },
      },
      {
        $group: {
          _id: null,
          senderIds: { $addToSet: "$sender_id" },
          recipientIds: { $addToSet: "$recipient_id" },
        },
      },
      {
        $project: {
          allUsers: { $setUnion: ["$senderIds", "$recipientIds"] },
        },
      },
      {
        $unwind: "$allUsers",
      },
      {
        $group: {
          _id: null,
          uniqueUsersCount: { $sum: 1 },
        },
      },
    ]);

    const uniqueUsersCount =
      uniqueUsers.length > 0 ? uniqueUsers[0].uniqueUsersCount : 0;

    // 3. Get 10 most recent messages (no time filter)
    const recentMessages = await ChatHistory.find({
      company_instagram_id: company.company_instagram_id,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("sender_id recipient_id createdAt");

    const recentActivity = recentMessages.map((message) => ({
      id: message._id,
      type:
        message.sender_id.toString() === company._id.toString()
          ? "sent"
          : "received",
      userId:
        message.sender_id.toString() === company._id.toString()
          ? message.recipient_id.toString()
          : message.sender_id.toString(),
      timestamp: message.createdAt,
    }));

    // 4. Average messages per user (no time filter)
    const avgMessagesPerUser =
      uniqueUsersCount > 0
        ? (totalMessages / uniqueUsersCount).toFixed(1)
        : "0.0";

    // 5. Sent vs Received messages breakdown (no time filter)
    const messageTypeBreakdown = await ChatHistory.aggregate([
      {
        $match: {
          company_instagram_id: company.company_instagram_id,
        },
      },
      {
        $group: {
          _id: null,
          sent: {
            $sum: {
              $cond: [{ $eq: ["$sender_id", company._id.toString()] }, 1, 0],
            },
          },
          received: {
            $sum: {
              $cond: [{ $ne: ["$sender_id", company._id.toString()] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          sent: 1,
          received: 1,
        },
      },
    ]);

    const { sent = 0, received = 0 } =
      messageTypeBreakdown.length > 0 ? messageTypeBreakdown[0] : {};

    // 6. Message Volume Graph
    // const messageVolumeData = await ChatHistory.aggregate([
    //   {
    //     $match: {
    //       company_instagram_id: company.company_instagram_id,
    //       ...timeFilter,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         $dateTrunc: {
    //           date: "$createdAt",
    //           unit: bucketType,
    //           binSize: 1,
    //         },
    //       },
    //       count: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $sort: { _id: 1 },
    //   },
    //   {
    //     $project: {
    //       time: {
    //         $dateToString: {
    //           format: bucketType === "hour" ? "%Y-%m-%d %H:00" : "%Y-%m-%d",
    //           date: "$_id",
    //           timezone: "Asia/Kolkata", // Ensure IST output
    //         },
    //       },
    //       count: 1,
    //       _id: 0,
    //     },
    //   },
    // ]);

    // console.log("Raw messageVolumeData:", messageVolumeData);

    // Merge with buckets to ensure all time slots are represented
    // const messageVolumeGraph = buckets.map((bucket) => {
    //   const dataPoint = messageVolumeData.find((d) => d.time === bucket.time);
    //   return { time: bucket.time, count: dataPoint ? dataPoint.count : 0 };
    // });

    // 7. Unique Users Graph
    // const uniqueUsersData = await ChatHistory.aggregate([
    //   {
    //     $match: {
    //       company_instagram_id: company.company_instagram_id,
    //       ...timeFilter,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         date: {
    //           $dateTrunc: {
    //             date: "$createdAt",
    //             unit: bucketType,
    //             binSize: 1,
    //           },
    //         },
    //         user: {
    //           $cond: [
    //             { $eq: ["$sender_id", company._id.toString()] },
    //             "$recipient_id",
    //             "$sender_id",
    //           ],
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$_id.date",
    //       users: { $addToSet: "$_id.user" },
    //     },
    //   },
    //   {
    //     $sort: { _id: 1 },
    //   },
    //   {
    //     $project: {
    //       time: {
    //         $dateToString: {
    //           format: bucketType === "hour" ? "%Y-%m-%d %H:00" : "%Y-%m-%d",
    //           date: "$_id",
    //           timezone: "Asia/Kolkata", // Ensure IST output
    //         },
    //       },
    //       count: { $size: "$users" },
    //       _id: 0,
    //     },
    //   },
    // ]);

    // console.log("Raw uniqueUsersData:", uniqueUsersData);

    // // Merge with buckets to ensure all time slots are represented
    // const uniqueUsersGraph = buckets.map((bucket) => {
    //   const dataPoint = uniqueUsersData.find((d) => d.time === bucket.time);
    //   return { time: bucket.time, count: dataPoint ? dataPoint.count : 0 };
    // });

    return NextResponse.json(
      {
        success: true,
        analytics: {
          totalMessages,
          uniqueUsers: uniqueUsersCount,
          recentActivity,
          avgMessagesPerUser,
          messageTypeBreakdown: { sent, received },
          // messageVolumeGraph,
          // uniqueUsersGraph,
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
