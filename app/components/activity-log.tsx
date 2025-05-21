"use client"

import { useEffect, useState } from "react"

interface LogEntry {
  id: string
  type: "sent" | "received" | "started" | "error"
  username: string
  message: string
  timestamp: Date
}

export function ActivityLog() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading log data
  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date()

      const sampleLogs: LogEntry[] = [
        {
          id: "1",
          type: "received",
          username: "sarah_parker",
          message: "Received DM from @sarah_parker",
          timestamp: new Date(now.getTime() - 2 * 60 * 1000), // 2 minutes ago
        },
        {
          id: "2",
          type: "sent",
          username: "sarah_parker",
          message: "Sent response to @sarah_parker",
          timestamp: new Date(now.getTime() - 1.5 * 60 * 1000), // 1.5 minutes ago
        },
        {
          id: "3",
          type: "received",
          username: "mike_johnson",
          message: "Received DM from @mike_johnson",
          timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
        },
        {
          id: "4",
          type: "sent",
          username: "mike_johnson",
          message: "Sent response to @mike_johnson",
          timestamp: new Date(now.getTime() - 4.5 * 60 * 1000), // 4.5 minutes ago
        },
        {
          id: "5",
          type: "started",
          username: "alex_design",
          message: "Started new conversation with @alex_design",
          timestamp: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
        },
        {
          id: "6",
          type: "error",
          username: "john_doe",
          message: "Failed to send message to @john_doe",
          timestamp: new Date(now.getTime() - 22 * 60 * 1000), // 22 minutes ago
        },
        {
          id: "7",
          type: "received",
          username: "emma_watson",
          message: "Received DM from @emma_watson",
          timestamp: new Date(now.getTime() - 35 * 60 * 1000), // 35 minutes ago
        },
        {
          id: "8",
          type: "sent",
          username: "emma_watson",
          message: "Sent response to @emma_watson",
          timestamp: new Date(now.getTime() - 34 * 60 * 1000), // 34 minutes ago
        },
      ]

      setLogs(sampleLogs)
      setIsLoading(false)

      // Simulate new log entries coming in
      const interval = setInterval(() => {
        const types = ["sent", "received", "started"] as const
        const randomType = types[Math.floor(Math.random() * types.length)]
        const randomUsername = `user_${Math.floor(Math.random() * 1000)}`

        let message = ""
        if (randomType === "sent") {
          message = `Sent response to @${randomUsername}`
        } else if (randomType === "received") {
          message = `Received DM from @${randomUsername}`
        } else {
          message = `Started new conversation with @${randomUsername}`
        }

        const newLog: LogEntry = {
          id: Date.now().toString(),
          type: randomType,
          username: randomUsername,
          message,
          timestamp: new Date(),
        }

        setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 7)])
      }, 15000) // Add new log every 15 seconds

      return () => clearInterval(interval)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`
    } else {
      return `${Math.floor(diffInSeconds / 86400)}d ago`
    }
  }

  return (
    <div className="space-y-1">
      {isLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-md animate-pulse">
            <div className="h-2 w-2 rounded-full bg-slate-700"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-800 rounded w-1/4"></div>
            </div>
          </div>
        ))
      ) : (
        <div className="max-h-[320px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
          {logs.map((log, index) => (
            <div
              key={log.id}
              className={`flex items-start gap-3 p-3 rounded-md transition-all duration-200 hover:bg-blue-900/10 animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                  log.type === "sent"
                    ? "bg-blue-500"
                    : log.type === "received"
                      ? "bg-emerald-500"
                      : log.type === "started"
                        ? "bg-purple-500"
                        : "bg-rose-500"
                }`}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 leading-tight">{log.message}</p>
                <p className="text-xs text-slate-500 mt-1 font-mono">{formatRelativeTime(log.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
