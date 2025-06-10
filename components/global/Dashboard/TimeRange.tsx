"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, ChevronDown, CheckCircle2 } from "lucide-react";

export type TimeRangeOption = {
  label: string;
  value: string;
  days?: number;
};

const timeRangeOptions: TimeRangeOption[] = [
  { label: "Last 24 Hours", value: "24h", days: 1 },
  { label: "Last 7 Days", value: "7d", days: 7 },
  { label: "Last 30 Days", value: "30d", days: 30 },
  { label: "Last 90 Days", value: "90d", days: 90 },
  { label: "Last Year", value: "1y", days: 365 },
  { label: "All Time", value: "all" },
];

interface TimeRangeProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
  className?: string;
}

export function TimeRange({
  selectedRange,
  onRangeChange,
  className,
}: TimeRangeProps) {
  const selectedOption = timeRangeOptions.find(
    (option) => option.value === selectedRange
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`h-12 px-4 bg-neutral-800/30 border border-neutral-700/50 rounded-xl text-white placeholder:text-neutral-500 hover:bg-neutral-800/50 hover:border-neutral-700/70 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-200 flex items-center justify-between text-sm font-medium ${className}`}
        >
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <span className="text-white">
              {selectedOption?.label || "Select Range"}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-neutral-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="min-w-[220px] bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800/30 rounded-3xl p-3 shadow-2xl shadow-black/20 animate-in fade-in-0 slide-in-from-top-2 duration-300"
        sideOffset={8}
      >
        {/* Header */}
        <div className="px-3 py-2 mb-2 border-b border-neutral-800/30">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
            Select Time Range
          </p>
        </div>

        {/* Options */}
        <div className="space-y-1">
          {timeRangeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onRangeChange(option.value)}
              className={`relative px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium focus:outline-none group ${
                selectedRange === option.value
                  ? "bg-white/10 text-white border border-white/20 shadow-lg shadow-white/5"
                  : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      selectedRange === option.value
                        ? "bg-emerald-400 shadow-lg shadow-emerald-400/30"
                        : "bg-neutral-600 group-hover:bg-neutral-500"
                    }`}
                  />
                  <span>{option.label}</span>
                </div>
                {selectedRange === option.value && (
                  <CheckCircle2 className="w-4 h-4 pl-1 text-emerald-400 animate-in zoom-in-50 duration-200" />
                )}
              </div>
              {option.days && (
                <div className="mt-1 ml-5">
                  <p className="text-xs text-neutral-500">
                    {option.days === 1 ? "24 hours" : `${option.days} days`} of
                    data
                  </p>
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-neutral-800/30">
          <p className="text-xs text-neutral-500 text-center">
            Data updates every 5 minutes
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
