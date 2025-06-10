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
  const [timeRange, setTimeRange] = useState("7d");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsTransitioning(true);
    setSidebarCollapsed(collapsed);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleRefresh = () => {
    setDataLoading(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setDataLoading(false), 1200);
  };

  const handleTimeRangeChange = (range: string) => {
    setDataLoading(true);
    setTimeRange(range);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setDataLoading(false), 800);
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
          toast.error("Authentication failed. Please try again.");
          console.error("API error:", res.status);
          return;
        }

        const data = await res.json();
        setUser(data.company);
        setLoading(false);
      } catch (err) {
        toast.error("Unable to connect. Please check your connection.");
        console.error("Network error:", err);
        router.push("/login");
      }
    };

    fetchUser();
  }, [token, router, hasHydrated]);
  // Premium loading state with minimal elegance
  if (!hasHydrated || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/10 via-neutral-950 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-neutral-800/5 via-transparent to-transparent" />
        </div>

        {/* Minimal floating elements */}
        <div
          className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-white/[0.02] to-transparent rounded-full blur-3xl"
          style={{ animation: "floatSlow 15s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-neutral-700/[0.03] to-transparent rounded-full blur-3xl"
          style={{
            animation: "floatSlow 20s ease-in-out infinite",
            animationDelay: "5s",
          }}
        />

        <div className="relative z-10">
          <DashboardSkeleton />
        </div>

        <style jsx>{`
          @keyframes floatSlow {
            0%,
            100% {
              transform: translateY(0px) scale(1);
              opacity: 0.6;
            }
            50% {
              transform: translateY(-30px) scale(1.1);
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    );
  }
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex relative overflow-hidden selection:bg-white/10"
      role="application"
      aria-label="Business Dashboard"
    >
      {/* Enhanced background with subtle patterns */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/10 via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-neutral-800/5 via-transparent to-transparent" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>
      {/* Improved floating elements */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-white/[0.015] to-transparent rounded-full blur-3xl pointer-events-none"
        style={{
          animation: "float 8s ease-in-out infinite",
          animationDelay: "0s",
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-neutral-400/[0.02] to-transparent rounded-full blur-3xl pointer-events-none"
        style={{
          animation: "float 10s ease-in-out infinite",
          animationDelay: "2s",
        }}
      />
      {/* Sidebar with enhanced transitions */}
      <div className="relative z-20">
        <div className="fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-out">
          <Sidebar user={user} onToggle={handleSidebarToggle} />
        </div>
      </div>
      {/* Main content area with smooth transitions */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-out relative z-10",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64",
          isTransitioning && "transition-transform"
        )}
      >
        {/* Mobile navigation with enhanced glass effect */}
        <div className="lg:hidden bg-neutral-900/60 backdrop-blur-3xl border-b border-neutral-800/30 shadow-lg shadow-black/10">
          <MobileNav />
        </div>

        {/* Main content with improved spacing and typography */}
        <main
          className="flex-1 relative"
          role="main"
          aria-label="Dashboard Content"
        >
          {/* Content wrapper with premium spacing */}
          <div className="h-full px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            {/* Header section with refined typography */}
            <div className="mb-8">
              <div className="animate-in fade-in-0 slide-in-from-top-4 duration-500 delay-100">
                <DashboardHeader
                  onRefresh={handleRefresh}
                  timeRange={timeRange}
                  onTimeRangeChange={handleTimeRangeChange}
                />
              </div>

              {/* Elegant divider */}
              <div className="mt-6 w-full h-px bg-gradient-to-r from-transparent via-neutral-800/30 to-transparent" />
            </div>

            {/* Dashboard content with enhanced glass morphism */}
            <div className="space-y-6">
              {/* Data loading overlay */}
              {dataLoading && (
                <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-40 flex items-center justify-center">
                  <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/50 rounded-2xl p-6 shadow-2xl shadow-black/25">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-8 h-8 border-2 border-neutral-700/40 rounded-full"></div>
                        <div className="absolute inset-0 w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          Updating data...
                        </p>
                        <p className="text-xs text-neutral-400">
                          Fetching latest insights
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main dashboard content */}
              <div className="animate-in fade-in-0 slide-in-from-bottom-6 duration-700 delay-200">
                <DashboardContent
                  refreshKey={refreshKey}
                  timeRange={timeRange}
                />
              </div>
            </div>

            {/* Bottom spacing for content breathing room */}
            <div className="h-8" />
          </div>

          {/* Subtle accent elements for visual depth */}
          <div
            className="absolute top-32 right-32 w-24 h-24 bg-white/[0.01] rounded-full blur-2xl pointer-events-none"
            style={{
              animation: "float 8s ease-in-out infinite",
              animationDelay: "1s",
            }}
          />
          <div
            className="absolute bottom-32 left-32 w-20 h-20 bg-neutral-400/[0.015] rounded-full blur-xl pointer-events-none"
            style={{
              animation: "float 10s ease-in-out infinite",
              animationDelay: "4s",
            }}
          />
        </main>
      </div>{" "}
      {/* Premium loading overlay */}
      {loading && (
        <div
          className="fixed inset-0 bg-neutral-950/97 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-500"
          role="dialog"
          aria-label="Loading"
          aria-live="polite"
        >
          {/* Enhanced loading card */}
          <div className="bg-neutral-900/60 backdrop-blur-3xl border border-neutral-700/30 rounded-3xl p-10 shadow-2xl shadow-black/30 animate-in zoom-in-95 duration-500 max-w-sm w-full mx-4">
            <div className="flex flex-col items-center space-y-6">
              {/* Premium spinner design */}
              <div className="relative">
                <div className="w-12 h-12 border-2 border-neutral-700/40 rounded-full"></div>
                <div className="absolute inset-0 w-12 h-12 border-t-2 border-white rounded-full animate-spin"></div>
                <div className="absolute inset-2 w-8 h-8 border border-neutral-600/30 rounded-full"></div>
              </div>

              {/* Loading text with better typography */}
              <div className="text-center space-y-2">
                <h3 className="text-white font-semibold text-lg tracking-tight">
                  Loading Dashboard
                </h3>
                <p className="text-neutral-400 text-sm font-medium">
                  Preparing your workspace...
                </p>
              </div>

              {/* Progress indication */}
              <div className="w-full bg-neutral-800/50 rounded-full h-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-white/20 to-white/40 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          33% {
            transform: translateY(-20px) rotate(1deg) scale(1.02);
          }
          66% {
            transform: translateY(10px) rotate(-1deg) scale(0.98);
          }
        }

        @keyframes slideInFromRight {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slideInFromRight 0.7s ease-out;
        }
      `}</style>
    </div>
  );
}
