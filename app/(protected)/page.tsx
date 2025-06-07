"use client";

import { Sidebar } from "../../components/global/sidebar";
import { DashboardHeader } from "../../components/global/Dashboard/dashboard-header";
import { MobileNav } from "../../components/global/mobile-nav";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSkeleton from "@/components/global/Dashboard/Skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DashboardContent from "@/components/global/Dashboard/DashboardContent";

export default function Dashboard() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Add time range state
  const [timeRange, setTimeRange] = useState("7d"); // Default to last 7 days

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    // Optionally trigger a refresh when time range changes
    setRefreshKey((prev) => prev + 1);
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
    <div className="min-h-screen text-slate-100 flex">
      <Sidebar user={user} onToggle={handleSidebarToggle} />
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64" // Apply margin only on lg screens
        )}
      >
        <MobileNav />
        <main className="flex-1 px-4 py-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <DashboardHeader
            onRefresh={handleRefresh}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
          <DashboardContent 
            refreshKey={refreshKey}
            timeRange={timeRange}
          />
        </main>
      </div>
    </div>
  );
}