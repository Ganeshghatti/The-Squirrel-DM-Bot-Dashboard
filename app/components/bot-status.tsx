"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type BotStatusType = "running" | "stopped" | "error" | "starting"

export function BotStatus() {
  const [status, setStatus] = useState<BotStatusType>("starting")

  useEffect(() => {
    // Simulate bot starting up
    const timer = setTimeout(() => {
      setStatus("running")

      // Simulate occasional status changes
      const interval = setInterval(() => {
        const random = Math.random()
        if (random < 0.1) {
          setStatus("error")
          setTimeout(() => setStatus("starting"), 3000)
          setTimeout(() => setStatus("running"), 6000)
        } else if (random < 0.2) {
          setStatus("stopped")
          setTimeout(() => setStatus("starting"), 4000)
          setTimeout(() => setStatus("running"), 7000)
        }
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-blue-900/30">
      <div
        className={cn(
          "h-2.5 w-2.5 rounded-full relative",
          status === "running" && "bg-emerald-500",
          status === "stopped" && "bg-amber-500",
          status === "error" && "bg-rose-500",
          status === "starting" && "bg-blue-500",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full animate-ping",
            status === "running" && "bg-emerald-500/40",
            status === "stopped" && "bg-amber-500/40",
            status === "error" && "bg-rose-500/40",
            status === "starting" && "bg-blue-500/40",
          )}
        ></div>
      </div>
      <span className="text-xs font-medium text-slate-300 font-mono tracking-wide">
        {status === "running" && "BOT RUNNING"}
        {status === "stopped" && "BOT STOPPED"}
        {status === "error" && "BOT ERROR"}
        {status === "starting" && "BOT STARTING"}
      </span>
    </div>
  )
}
