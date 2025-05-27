"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "@/components/global/sidebar";
import { MobileNav } from "@/components/global/mobile-nav";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DashboardSkeleton() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex">
      <Sidebar user={null} onToggle={handleSidebarToggle} />
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <MobileNav />
        <main className="flex-1 px-4 py-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="mt-6 space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-48 bg-zinc-800/60" />
              <Skeleton className="h-8 w-32 bg-zinc-800/60" />
            </div>

            {/* Performance Overview Section */}
            <section className="space-y-4">
              <Skeleton className="h-6 w-40 bg-zinc-800/60" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm"
                  >
                    <Skeleton className="h-5 w-24 mb-2 bg-zinc-800/60" />
                    <Skeleton className="h-8 w-32 bg-zinc-800/60" />
                    <Skeleton className="h-4 w-20 mt-2 bg-zinc-800/60" />
                  </div>
                ))}
              </div>
            </section>

            {/* Conversation Activity Section */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Skeleton className="h-6 w-48 bg-zinc-800/60" />
                <Skeleton className="h-6 w-24 bg-zinc-800/60" />
              </div>
              <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                <Skeleton className="h-64 w-full bg-zinc-800/60" />
              </div>
            </section>

            {/* Recent Activity Section */}
            <section className="space-y-4">
              <Skeleton className="h-6 w-40 bg-zinc-800/60" />
              <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center gap-4 mb-4 last:mb-0">
                    <Skeleton className="h-8 w-8 rounded-full bg-zinc-800/60" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4 bg-zinc-800/60" />
                      <Skeleton className="h-3 w-1/2 bg-zinc-800/60" />
                    </div>
                    <Skeleton className="h-3 w-16 bg-zinc-800/60" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}