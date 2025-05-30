"use client"

import { useEffect, useRef } from "react"
import { Chart, ChartOptions, registerables } from "chart.js"

Chart.register(...registerables)

interface AnalyticsChartProps {
  type: "line" | "bar"
}

export function AnalyticsChart({ type }: AnalyticsChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Common options
    const options: ChartOptions<"line" | "bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
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
          backgroundColor: "rgba(30, 58, 138, 0.9)",
          titleColor: "rgba(255, 255, 255, 1)",
          bodyColor: "rgba(219, 234, 254, 0.9)",
          borderColor: "rgba(59, 130, 246, 0.5)",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 6,
          displayColors: false,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          callbacks: {
            label: (context: any) => {
              let label = context.dataset.label || ""
              if (label) label += ": "
              if (context.parsed.y !== null) {
                label += type === "line"
                  ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(context.parsed.y)
                  : new Intl.NumberFormat("en-US").format(context.parsed.y)
              }
              return label
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "rgba(191, 219, 254, 0.7)",
            font: {
              size: 11,
            },
            padding: 8,
          },
        },
        y: {
          grid: {
            color: "rgba(30, 58, 138, 0.2)",
            lineWidth: 0.5,
          },
          ticks: {
            color: "rgba(191, 219, 254, 0.7)",
            font: {
              size: 11,
            },
            padding: 10,
            callback: (value: any) => (type === "line" ? "$" + value.toLocaleString() : value.toLocaleString()),
          },
          border: {
            dash: [4, 4],
          },
        },
      },
    }


    // Data
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const data = {
      labels,
      datasets:
        type === "line"
          ? [
            {
              label: "Revenue",
              data: [12000, 19000, 13000, 15000, 22000, 30000, 42000, 33000, 34000, 52000, 49000, 62000],
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
              label: "Users",
              data: [1200, 1900, 1300, 1500, 2200, 3000, 4200, 3300, 3400, 5200, 4900, 6200],
              backgroundColor: "rgba(59, 130, 246, 0.7)",
              hoverBackgroundColor: "rgba(59, 130, 246, 0.9)",
              borderRadius: 6,
              borderSkipped: false,
              barPercentage: 0.6,
              categoryPercentage: 0.7,
            },
          ],
    }

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type,
      data,
      options,
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [type])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}
