import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

export function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  return (
    <Card className="bg-blue-900/20 backdrop-blur-sm border-blue-800/30 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent" />
      <CardHeader className="pb-2 relative">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-blue-100">{title}</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-800/30 p-1.5 text-blue-100">{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold text-white">{value}</div>
        <p
          className={cn(
            "text-xs flex items-center gap-1 mt-1",
            trend === "up" && "text-emerald-400",
            trend === "down" && "text-rose-400",
            trend === "neutral" && "text-blue-200",
          )}
        >
          {trend === "up" && (
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
              className="lucide lucide-trending-up"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          )}
          {trend === "down" && (
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
              className="lucide lucide-trending-down"
            >
              <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
              <polyline points="16 17 22 17 22 11" />
            </svg>
          )}
          {change}
        </p>
      </CardContent>
    </Card>
  )
}
