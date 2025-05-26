"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function DashboardHeader({ 
  timeRange, 
  setTimeRange, 
  onRefresh 
}: { 
  timeRange: string, 
  setTimeRange: (range: string) => void,
  onRefresh: () => void 
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="border-blue-900/30 bg-blue-950/30 text-slate-300 hover:bg-blue-900/20 hover:text-white"
            >
              {timeRange === "24h" && "Last 24 Hours"}
              {timeRange === "7d" && "Last 7 Days"}
              {timeRange === "30d" && "Last 30 Days"}
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
                className="ml-2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900 border-blue-900/30 text-slate-300">
            <DropdownMenuItem
              className="hover:bg-blue-900/20 hover:text-white focus:bg-blue-900/20 focus:text-white cursor-pointer"
              onClick={() => setTimeRange("24h")}
            >
              Last 24 Hours
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-blue-900/20 hover:text-white focus:bg-blue-900/20 focus:text-white cursor-pointer"
              onClick={() => setTimeRange("7d")}
            >
              Last 7 Days
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-blue-900/20 hover:text-white focus:bg-blue-900/20 focus:text-white cursor-pointer"
              onClick={() => setTimeRange("30d")}
            >
              Last 30 Days
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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