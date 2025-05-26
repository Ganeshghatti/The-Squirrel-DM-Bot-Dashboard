"use client";

import { Sidebar } from "../components/global/sidebar";
import { DashboardHeader } from "../components/global/Dashboard/dashboard-header";
import { KpiCards } from "../components/global/Dashboard/kpi-cards";
import { ConversationChart } from "../components/global/Dashboard/conversation-chart";
import { DailyActiveUsersChart } from "../components/global/Dashboard/daily-active-users";
import { NewVsReturningUsersChart } from "../components/global/Dashboard/new-vs-returning-user-charts";
import { MessageVolumeTrendChart } from "../components/global/Dashboard/MessageVolumeTrendChart";
import { ActivityLog } from "../components/global/Dashboard/activity-log";
import { BotStatus } from "../components/global/Dashboard/bot-status";
import { MobileNav } from "../components/global/mobile-nav";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSkeleton from "@/components/global/Dashboard/Skeleton";
import { toast } from "sonner";
import ResponseRateChart from "@/components/global/Dashboard/response-rate-chart";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState("7d");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedKpi, setSelectedKpi] = useState<"Users" | "Messages" | null>(
    "Messages"
  ); // New state for KPI selection

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleKpiClick = (category: "Users" | "Messages" | null) => {
    setSelectedKpi(category); // Update selected KPI category
  };

  useEffect(() => {
    if (!hasHydrated) return;

    const fetchUser = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          toast.error("API Error");
          console.error("API error:", res.status);
          return;
        }

        const data = await res.json();
        setUser(data.company);
        setLoading(false);
      } catch (err) {
        toast.error("Network Error: " + err);
        console.error("Network error:", err);
        router.push("/login");
      }
    };

    fetchUser();
  }, [token, router, hasHydrated]);

  if (!hasHydrated || loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen  text-slate-100 flex">
      <Sidebar user={user}  onToggle={handleSidebarToggle} />
<div
  className={cn(
    "flex-1 flex flex-col transition-all duration-300",
    sidebarCollapsed ? "lg:ml-16" : "lg:ml-64" // Apply margin only on lg screens
  )}
>
        <MobileNav />
        <main className="flex-1 px-4 py-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <DashboardHeader
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            onRefresh={handleRefresh}
          />

          <div className="mt-6 space-y-6">
            <section className="animate-fade-in">
              <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                Performance Overview
              </h2>
              <KpiCards
                timeRange={timeRange}
                refreshKey={refreshKey}
                onKpiClick={handleKpiClick}
                selectedKpi={selectedKpi}
              />
            </section>

            {/* Conditionally render charts based on selected KPI */}
            {(selectedKpi === null || selectedKpi === "Messages") && (
              <>
                <section className="animate-fade-in animation-delay-100">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <h2 className="text-xl font-display font-medium text-white tracking-tight">
                      Conversation Activity
                    </h2>
                    <BotStatus />
                  </div>
                  <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                    <ConversationChart timeRange={timeRange} refreshKey={refreshKey} />
                  </div>
                </section>

                <section className="animate-fade-in animation-delay-400">
                  <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                    Message Volume Trend
                  </h2>
                  <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                    <MessageVolumeTrendChart timeRange={timeRange} refreshKey={refreshKey} />
                  </div>
                </section>

                <section className="animate-fade-in animation-delay-400">
                  <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                    Response Rate Chart
                  </h2>
                  <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                    <ResponseRateChart timeRange={timeRange} refreshKey={refreshKey} />
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
                    <DailyActiveUsersChart timeRange={timeRange} refreshKey={refreshKey} />
                  </div>
                </section>

                <section className="animate-fade-in animation-delay-300">
                  <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                    New vs Returning Users
                  </h2>
                  <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                    <NewVsReturningUsersChart timeRange={timeRange} refreshKey={refreshKey} />
                  </div>
                </section>
              </>
            )}

            <section className="animate-fade-in animation-delay-450">
              <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                Recent Activity
              </h2>
              <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                <ActivityLog timeRange={timeRange} refreshKey={refreshKey} />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}