"use client"

import { useEffect, useRef, useState } from "react"
import { Chart, registerables } from "chart.js"
import { Button } from "@/components/ui/button"

Chart.register(...registerables)

export function ConversationChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [chartType, setChartType] = useState<"both" | "sent" | "received">("both")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!chartRef.current || isLoading) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Generate dates for the last 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    })

    // Sample data
    const sentData = [42, 58, 69, 53, 92, 78, 86]
    const receivedData = [38, 52, 61, 47, 82, 68, 74]

    // Common options
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(13, 18, 30, 0.9)",
          titleColor: "rgba(255, 255, 255, 1)",
          bodyColor: "rgba(219, 234, 254, 0.9)",
          borderColor: "rgba(59, 130, 246, 0.5)",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 6,
          displayColors: true,
          boxPadding: 6,
          titleFont: {
            size: 14,
            weight: "bold",
            family: "'Inter', sans-serif",
          },
          bodyFont: {
            size: 13,
            family: "'Inter', sans-serif",
          },
          callbacks: {
            title: (tooltipItems: any) => {
              return tooltipItems[0].label
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: "rgba(148, 163, 184, 0.7)",
            font: {
              size: 11,
              family: "'JetBrains Mono', monospace",
            },
            padding: 8,
          },
        },
        y: {
          grid: {
            color: "rgba(30, 58, 138, 0.1)",
            drawBorder: false,
            lineWidth: 0.5,
          },
          ticks: {
            color: "rgba(148, 163, 184, 0.7)",
            font: {
              size: 11,
              family: "'JetBrains Mono', monospace",
            },
            padding: 10,
            stepSize: 20,
          },
          border: {
            dash: [4, 4],
          },
        },
      },
    }

    // Data
    const data = {
      labels: dates,
      datasets:
        chartType === "both"
          ? [
              {
                label: "Sent",
                data: sentData,
                borderColor: "rgba(59, 130, 246, 1)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: "rgba(59, 130, 246, 1)",
                pointHoverBorderColor: "rgba(255, 255, 255, 1)",
                pointHoverBorderWidth: 2,
                borderWidth: 3,
                order: 1,
              },
              {
                label: "Received",
                data: receivedData,
                borderColor: "rgba(16, 185, 129, 1)",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: "rgba(16, 185, 129, 1)",
                pointHoverBorderColor: "rgba(255, 255, 255, 1)",
                pointHoverBorderWidth: 2,
                borderWidth: 3,
                order: 2,
              },
            ]
          : chartType === "sent"
            ? [
                {
                  label: "Sent",
                  data: sentData,
                  borderColor: "rgba(59, 130, 246, 1)",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  tension: 0.4,
                  fill: true,
                  pointRadius: 0,
                  pointHoverRadius: 6,
                  pointBackgroundColor: "rgba(59, 130, 246, 1)",
                  pointHoverBorderColor: "rgba(255, 255, 255, 1)",
                  pointHoverBorderWidth: 2,
                  borderWidth: 3,
                },
              ]
            : [
                {
                  label: "Received",
                  data: receivedData,
                  borderColor: "rgba(16, 185, 129, 1)",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  tension: 0.4,
                  fill: true,
                  pointRadius: 0,
                  pointHoverRadius: 6,
                  pointBackgroundColor: "rgba(16, 185, 129, 1)",
                  pointHoverBorderColor: "rgba(255, 255, 255, 1)",
                  pointHoverBorderWidth: 2,
                  borderWidth: 3,
                },
              ],
    }

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data,
      options,
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [chartType, isLoading])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="text-sm text-slate-300 font-medium">Daily Conversation Activity</div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className={`text-xs px-3 py-1 h-8 border-blue-900/30 ${
              chartType === "both"
                ? "bg-blue-600/20 text-blue-400 border-blue-600/30"
                : "bg-transparent text-slate-400 hover:bg-blue-900/20 hover:text-blue-400"
            }`}
            onClick={() => setChartType("both")}
          >
            Both
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`text-xs px-3 py-1 h-8 border-blue-900/30 ${
              chartType === "sent"
                ? "bg-blue-600/20 text-blue-400 border-blue-600/30"
                : "bg-transparent text-slate-400 hover:bg-blue-900/20 hover:text-blue-400"
            }`}
            onClick={() => setChartType("sent")}
          >
            Sent
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`text-xs px-3 py-1 h-8 border-blue-900/30 ${
              chartType === "received"
                ? "bg-blue-600/20 text-blue-400 border-blue-600/30"
                : "bg-transparent text-slate-400 hover:bg-blue-900/20 hover:text-blue-400"
            }`}
            onClick={() => setChartType("received")}
          >
            Received
          </Button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-slate-400">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <canvas ref={chartRef} />
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
            <span>Sent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
            <span>Received</span>
          </div>
        </div>
        <div>Last 7 days</div>
      </div>
    </div>
  )
}
