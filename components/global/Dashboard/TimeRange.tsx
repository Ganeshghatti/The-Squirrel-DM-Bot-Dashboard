"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, ChevronDown } from "lucide-react";

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

export function TimeRange({ selectedRange, onRangeChange, className }: TimeRangeProps) {
  const selectedOption = timeRangeOptions.find(option => option.value === selectedRange);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white ${className}`}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {selectedOption?.label || "Select Range"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="center" 
        className="bg-slate-800  text-slate-200  border-transparent w-full "
      >
        {timeRangeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onRangeChange(option.value)}
            className={`  text-slate-200  focus-visible:border-ring:bg-blue-600/10 hover:text-blue-500  cursor-pointer   ${
              selectedRange === option.value ? "bg-blue-600/10 text-blue-500" : ""
            }`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}