"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { MessageSquare, Users, BarChart3, Clock, User2 } from "lucide-react";
import { toast } from "sonner";

export function KpiCards({
  onKpiClick,
  selectedKpi,
  loading,
  metrics,
}: {
  onKpiClick: (
    category:
      | "TotalMessages"
      | "UniqueUsers"
      | "AvgMessages"
      | "ReceivedMessages"
      | null
  ) => void;
  selectedKpi:
    | "TotalMessages"
    | "UniqueUsers"
    | "AvgMessages"
    | "ReceivedMessages"
    | null;
  loading: boolean;
  metrics: {
    totalMessages: 0;
    uniqueUsers: 0;
    avgMessagesPerUser: 0;
    messageTypeBreakdown: 0;
  };
}) {
  const cards = [
    {
      title: "Total Messages",
      value: metrics?.totalMessages,
      icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
      description: "All-time message count",
      category: "TotalMessages" as const,
    },
    {
      title: "Unique Users",
      value: metrics?.uniqueUsers,
      icon: <Users className="w-5 h-5 text-green-400" />,
      description: "Unique conversations",
      category: "UniqueUsers" as const,
    },
    {
      title: "Average Messages",
      value: metrics?.avgMessagesPerUser,
      icon: <User2 className="w-5 h-5 text-amber-400" />,
      description: "Average Message Count For  User",
      category: "AvgMessages" as const,
    },
    {
      title: "Received Messages",
      value: metrics?.messageTypeBreakdown,
      icon: <Clock className="w-5 h-5 text-sky-600" />,
      description: "Total Received Messages",
      category: "ReceivedMessages" as const,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm animate-pulse"
          >
            <div className="h-8 w-24 bg-zinc-800 rounded mb-3"></div>
            <div className="h-10 w-16 bg-zinc-800 rounded mb-2"></div>
            <div className="h-4 w-32 bg-zinc-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-zinc-900/60 border ${
            selectedKpi === card.category
              ? "border-blue-500"
              : "border-blue-900/30"
          } rounded-xl p-5 backdrop-blur-sm cursor-pointer
             hover:border-blue-500 transition-colors justify-between flex flex-col`}
          onClick={() =>
            onKpiClick(selectedKpi === card.category ? null : card.category)
          }
        >
          <div className="flex items-center gap-2 mb-2 text-zinc-400">
            {card.icon}
            <span>{card.title}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-2xl font-semibold text-white mb-1">
              {card.value}
            </div>
            <div className="text-xs text-zinc-500">{card.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
