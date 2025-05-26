"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  MessageSquare,
  Users,
  BarChart3,
  Clock,
  User2,
} from "lucide-react";
import { toast } from "sonner";

export function KpiCards({
  timeRange,
  refreshKey,
  onKpiClick,
  selectedKpi,
}: {
  timeRange: string;
  refreshKey: number;
  onKpiClick: (category: "Users" | "Messages" | null) => void;
  selectedKpi: "Users" | "Messages" | null;
}) {
  const token = useAuthStore((state) => state.token);
  const [metrics, setMetrics] = useState({
    totalMessages: 0,
    uniqueUsers: 0,
    newUsers: 0,
    avgMessagesPerConversation: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMetrics({
      totalMessages: 0,
      uniqueUsers: 0,
      newUsers: 0,
      avgMessagesPerConversation: 0,
    });
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/analytics?timeRange=${timeRange}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Analytics API error:", res.status);
          return;
        }

        const data = await res.json();
        if (data.success && data.analytics) {
          setMetrics({
            totalMessages: data.analytics.totalMessages || 0,
            uniqueUsers: data.analytics.uniqueUsers || 0,
            newUsers: data.analytics.newVsReturningUsers?.newUsers || 0,
            avgMessagesPerConversation: data.analytics.avgMessagesPerConversation || 0,
          });
        }
      } catch (err) {
        toast.error("Network Error in Getting Users");
        console.error("Network error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token, timeRange, refreshKey]);

  const cards = [
    {
      title: "Total Messages",
      value: metrics.totalMessages,
      icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
      description: "All-time message count",
      category: "Messages" as const,
    },
    {
      title: "Unique Users",
      value: metrics.uniqueUsers,
      icon: <Users className="w-5 h-5 text-green-400" />,
      description: "Unique conversations",
      category: "Users" as const,
    },
    {
      title: "New Users",
      value: metrics.newUsers,
      icon: <User2 className="w-5 h-5 text-amber-400" />,
      description: "New Users who DM You",
      category: "Users" as const,
    },
    {
      title: "Avg. Messages",
      value: metrics.avgMessagesPerConversation,
      icon: <Clock className="w-5 h-5 text-sky-600" />,
      description: "Avg. Message Per Conversation",
      category: "Messages" as const,
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
          } rounded-xl p-5 backdrop-blur-sm cursor-pointer hover:border-blue-500 transition-colors`}
          onClick={() =>
            onKpiClick(
              selectedKpi === card.category ? null : card.category
            )
          }
        >
          <div className="flex items-center gap-2 mb-2 text-zinc-400">
            {card.icon}
            <span>{card.title}</span>
          </div>
          <div className="text-2xl font-semibold text-white mb-1">
            {card.value}
          </div>
          <div className="text-xs text-zinc-500">{card.description}</div>
        </div>
      ))}
    </div>
  );
}