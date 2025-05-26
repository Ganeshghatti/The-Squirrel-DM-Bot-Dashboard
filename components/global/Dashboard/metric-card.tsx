import type React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

export function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  return (
    <Card className="border-blue-800/30 bg-blue-900/20 backdrop-blur-sm overflow-hidden relative group transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-700/40 hover:-translate-y-0.5">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="p-6 relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-blue-200/80">{title}</span>
          <div className="rounded-full bg-blue-800/30 p-1.5 text-blue-100 group-hover:bg-blue-700/40 transition-colors duration-300">
            {icon}
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
          <div
            className={cn(
              "text-xs flex items-center gap-1 mt-1.5 font-medium",
              trend === "up" && "text-emerald-400",
              trend === "down" && "text-rose-400",
              trend === "neutral" && "text-blue-200",
            )}
          >
            {trend === "up" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-0.5"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            )}
            {trend === "down" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-0.5"
              >
                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                <polyline points="16 17 22 17 22 11" />
              </svg>
            )}
            {change}
          </div>
        </div>
      </div>
    </Card>
  )
}
