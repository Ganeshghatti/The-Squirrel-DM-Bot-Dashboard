"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TimeRange } from "./TimeRange";

export function DashboardHeader({ 
  onRefresh,
  timeRange,
  onTimeRangeChange
}: { 
  onRefresh: () => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}) {
  const router = useRouter();

  return (
    <header className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <h1 className="text-2xl font-display font-semibold text-white tracking-tight md:text-3xl">
          Instagram Bot Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-400 font-body">Monitor and manage your Instagram DM automation</p>
      </div>
      <div className="flex items-center space-x-3">
        <TimeRange 
          selectedRange={timeRange}
          onRangeChange={onTimeRangeChange}
        />
        <Button 
          onClick={() => {
            router.refresh();
            onRefresh();
          }} 
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          Refresh
        </Button>
      </div>
    </header>
  );
}