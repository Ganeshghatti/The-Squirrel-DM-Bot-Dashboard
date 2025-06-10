import React, { useEffect, useState } from "react";
import { KpiCards } from "./kpi-cards";
import { ActivityLog } from "./activity-log";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
// import { filterDataByTimeRange } from "@/lib/timeRangeUtils";
// import { hasCustomGetInitialProps } from "next/dist/build/utils";

const DashboardContent = ({
  refreshKey,
  timeRange,
}: {
  refreshKey: number;
  timeRange: string;
}) => {
  const [selectedKpi, setSelectedKpi] = useState<
    "TotalMessages" | "UniqueUsers" | "AvgMessages" | "ReceivedMessages" | null
  >("TotalMessages");
  const [dashboardData, setdashboardData] = useState<any>(null);
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [loading, setLoading] = useState(false);
  // const filteredRecentActivity = dashboardData?.recentActivity
  //     ? filterDataByTimeRange(dashboardData.recentActivity, timeRange, 'createdAt')
  //     : [];

  const handleKpiClick = (
    category:
      | "TotalMessages"
      | "UniqueUsers"
      | "AvgMessages"
      | "ReceivedMessages"
      | null
  ) => {
    setSelectedKpi(category); // Update selected KPI category
  };

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const fetchAnalytics = async () => {
      if (!token) {
        return;
      }
      try {
        const res = await fetch(`/api/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Analytics API error:", res.status);
          return;
        }

        const data = await res.json();
        if (data.success && data.analytics) {
          setdashboardData(data.analytics);
        }
      } catch (err) {
        toast.error("Network Error in Getting Data");
        console.error("Network error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token, refreshKey, timeRange, hasHydrated]);
  if (loading) {
    return <p>Please Wait</p>;
  }

  return (
    <div className="mt-6 space-y-6">
      <section className="animate-fade-in">
        <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
          Performance Overview
        </h2>
        <KpiCards
          onKpiClick={handleKpiClick}
          selectedKpi={selectedKpi}
          loading={loading}
          metrics={{
            totalMessages: dashboardData?.totalMessages,
            uniqueUsers: dashboardData?.uniqueUsers,
            avgMessagesPerUser: dashboardData?.avgMessagesPerUser,
            messageTypeBreakdown: dashboardData?.messageTypeBreakdown.received,
          }}
        />
      </section>

      {/* Conditionally render charts based on selected KPI */}
      {/* {(selectedKpi === null || selectedKpi === "Messages") && (
                <>
                    <section className="animate-fade-in animation-delay-100">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <h2 className="text-xl font-display font-medium text-white tracking-tight">
                                Conversation Activity
                            </h2>
                            <BotStatus />
                        </div>
                        <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                            <ConversationChart
                                loading={loading}
                                chartData={dashboardData?.activityData}
                                timeRange={timeRange}
                                refreshKey={refreshKey}
                            />
                        </div>
                    </section>
                </>
            )}

            {(selectedKpi === null || selectedKpi === "Users") && (
                <>
                    <section className="animate-fade-in animation-delay-150">
                        <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                            Daily Active Users
                        </h2>
                        <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                            <DailyActiveUsersChart
                                loading={loading}
                                chartData={dashboardData?.dailyActiveUsers}
                                timeRange={timeRange}
                            />
                        </div>
                    </section>

                    <section className="animate-fade-in animation-delay-300">
                        <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                            New vs Returning Users
                        </h2>
                        <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                            <NewVsReturningUsersChart
                                chartData={[
                                    { name: "New Users", value: dashboardData?.newVsReturningUsers?.newUsers || 0 },
                                    { name: "Returning Users", value: dashboardData?.newVsReturningUsers?.returningUsers || 0 }
                                ]} loading={loading}
                            />
                        </div>
                    </section>
                </>
            )} */}

      <section className="animate-fade-in animation-delay-450">
        <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
          Recent Activity
        </h2>
        <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
          <ActivityLog
            activities={dashboardData?.recentActivity}
            loading={loading}
          />
        </div>
      </section>
    </div>
  );
};

export default DashboardContent;
