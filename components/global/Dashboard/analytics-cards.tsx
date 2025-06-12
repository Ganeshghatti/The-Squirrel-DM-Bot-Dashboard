"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import {
  MessageSquare,
  Users,
  TrendingUp,
  Activity,
  Clock,
  BarChart3,
  UserPlus,
  Target,
} from "lucide-react";

interface AnalyticsData {
  totalConversation: number;
  activeConversations: number;
  totalMessages: number;
  uniqueCustomers: number;
  avgMessagesPerConversation: number;
  avgMessagesPerCustomer: number;
  avgConversationsPerCustomer: number;
  engagementRate: number;
  recentConversations: number;
  weeklyConversations: number;
  monthlyConversations: number;
  conversationDistribution: {
    short: number;
    medium: number;
    long: number;
  };
  insights: {
    conversionRate: number;
    customerRetention: number;
    messageVelocity: number;
  };
}

export function AnalyticsCards({
  refreshKey,
  timeRange,
}: {
  refreshKey: number;
  timeRange: string;
}) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    const fetchAnalytics = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch("/api/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          toast.error("Failed to fetch analytics data");
          console.error("Analytics API error:", res.status);
          return;
        }

        const data = await res.json();
        if (data.success && data.analytics) {
          setAnalyticsData(data.analytics);
        }
      } catch (err) {
        toast.error("Unable to fetch analytics data");
        console.error("Network error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token, refreshKey, hasHydrated]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-neutral-900/60 backdrop-blur-3xl border border-neutral-700/30 rounded-2xl p-6 shadow-2xl shadow-black/20 animate-pulse"
          >
            <div className="h-5 w-24 bg-neutral-800/60 rounded mb-3"></div>
            <div className="h-8 w-16 bg-neutral-800/60 rounded mb-2"></div>
            <div className="h-4 w-32 bg-neutral-800/60 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="bg-neutral-900/60 backdrop-blur-3xl border border-neutral-700/30 rounded-2xl p-8 text-center">
        <p className="text-neutral-400">No analytics data available</p>
      </div>
    );
  }

  const primaryCards = [
    {
      title: "Total Messages",
      value: analyticsData.totalMessages.toLocaleString(),
      icon: <MessageSquare className="w-5 h-5" />,
      description: "All messages across conversations",
      trend: "+12%",
      trendType: "up" as const,
      gradient: "from-blue-500/20 to-blue-600/5",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Total Conversations",
      value: analyticsData.totalConversation.toLocaleString(),
      icon: <Users className="w-5 h-5" />,
      description: "Active conversation threads",
      trend: "+8%",
      trendType: "up" as const,
      gradient: "from-green-500/20 to-green-600/5",
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
    },
    {
      title: "Active Conversations",
      value: analyticsData.activeConversations.toLocaleString(),
      icon: <Activity className="w-5 h-5" />,
      description: "Currently active chats",
      trend: "+15%",
      trendType: "up" as const,
      gradient: "from-purple-500/20 to-purple-600/5",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      title: "Unique Customers",
      value: analyticsData.uniqueCustomers.toLocaleString(),
      icon: <UserPlus className="w-5 h-5" />,
      description: "Individual customers reached",
      trend: "+6%",
      trendType: "up" as const,
      gradient: "from-amber-500/20 to-amber-600/5",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
    },
  ];

  const metricCards = [
    {
      title: "Avg Messages/Conversation",
      value: analyticsData.avgMessagesPerConversation.toString(),
      icon: <BarChart3 className="w-5 h-5" />,
      description: "Conversation depth metric",
      gradient: "from-cyan-500/20 to-cyan-600/5",
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-400",
    },
    {
      title: "Avg Messages/Customer",
      value: analyticsData.avgMessagesPerCustomer.toString(),
      icon: <Target className="w-5 h-5" />,
      description: "Customer engagement level",
      gradient: "from-rose-500/20 to-rose-600/5",
      iconBg: "bg-rose-500/20",
      iconColor: "text-rose-400",
    },
    {
      title: "Engagement Rate",
      value: `${analyticsData.engagementRate}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      description: "Active conversation percentage",
      gradient: "from-indigo-500/20 to-indigo-600/5",
      iconBg: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
    },
    {
      title: "Recent Activity (24h)",
      value: analyticsData.recentConversations.toString(),
      icon: <Clock className="w-5 h-5" />,
      description: "Last 24 hours conversations",
      gradient: "from-emerald-500/20 to-emerald-600/5",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Primary Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 tracking-tight">
          Core Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {primaryCards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-neutral-900/60 backdrop-blur-3xl border border-neutral-700/30 rounded-2xl p-6 shadow-2xl shadow-black/20 hover:shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-600/50"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}
              />

              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`${card.iconBg} ${card.iconColor} p-2 rounded-xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    {card.icon}
                  </div>
                  <div className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {card.trend}
                  </div>
                </div>

                {/* Value */}
                <div className="mb-2">
                  <h4 className="text-sm font-medium text-neutral-400 mb-1">
                    {card.title}
                  </h4>
                  <div className="text-3xl font-bold text-white tracking-tight">
                    {card.value}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 tracking-tight">
          Performance Insights
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-neutral-900/60 backdrop-blur-3xl border border-neutral-700/30 rounded-2xl p-6 shadow-2xl shadow-black/20 hover:shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-600/50"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}
              />

              <div className="relative">
                {/* Icon */}
                <div
                  className={`${card.iconBg} ${card.iconColor} p-2 rounded-xl mb-4 w-fit group-hover:scale-110 transition-transform duration-300`}
                >
                  {card.icon}
                </div>

                {/* Value */}
                <div className="mb-2">
                  <h4 className="text-sm font-medium text-neutral-400 mb-1">
                    {card.title}
                  </h4>
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {card.value}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 tracking-tight">
          Conversation Distribution
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-neutral-900/60 backdrop-blur-3xl border border-neutral-700/30 rounded-2xl p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500/20 text-blue-400 p-2 rounded-xl">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-400">
                  Short (1-5 msgs)
                </p>
                <p className="text-xl font-bold text-white">
                  {analyticsData.conversationDistribution.short}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/60 backdrop-blur-3xl border border-neutral-700/30 rounded-2xl p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500/20 text-green-400 p-2 rounded-xl">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-400">
                  Medium (6-20 msgs)
                </p>
                <p className="text-xl font-bold text-white">
                  {analyticsData.conversationDistribution.medium}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/60 backdrop-blur-3xl border border-neutral-700/30 rounded-2xl p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500/20 text-purple-400 p-2 rounded-xl">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-400">
                  Long (20+ msgs)
                </p>
                <p className="text-xl font-bold text-white">
                  {analyticsData.conversationDistribution.long}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
