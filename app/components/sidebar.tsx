"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col border-r border-blue-900/30 bg-zinc-950 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        "hidden lg:flex" // Hide on mobile
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-blue-900/30 px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
            </svg>
          </div>
          <span
            className={cn(
              "text-lg font-semibold text-white transition-opacity",
              collapsed ? "opacity-0 w-0" : "opacity-100"
            )}
          >
            InstaBot
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-slate-400 hover:text-white hover:bg-blue-600/10"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {[
            { name: "Dashboard", icon: "layout-dashboard", active: true },
            // { name: "Conversations", icon: "message-square", active: false },
            // { name: "Templates", icon: "file-text", active: false },
            // { name: "Analytics", icon: "bar-chart", active: false },
            { name: "Settings", icon: "settings", active: false },
          ].map((item) => (
            <Link
              key={item.name}
              href="#"
              className={cn(
                "group flex items-center gap-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                item.active
                  ? "bg-blue-600/10 text-blue-500"
                  : "text-slate-400 hover:bg-blue-600/10 hover:text-blue-500"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "flex-shrink-0 transition-colors",
                  item.active
                    ? "text-blue-500"
                    : "text-slate-400 group-hover:text-blue-500"
                )}
              >
                {item.icon === "layout-dashboard" && (
                  <>
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="16" rx="1" />
                  </>
                )}
                {item.icon === "message-square" && (
                  <>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </>
                )}
                {item.icon === "file-text" && (
                  <>
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" x2="8" y1="13" y2="13" />
                    <line x1="16" x2="8" y1="17" y2="17" />
                    <line x1="10" x2="8" y1="9" y2="9" />
                  </>
                )}
                {item.icon === "bar-chart" && (
                  <>
                    <line x1="12" x2="12" y1="20" y2="10" />
                    <line x1="18" x2="18" y1="20" y2="4" />
                    <line x1="6" x2="6" y1="20" y2="16" />
                  </>
                )}
                {item.icon === "settings" && (
                  <>
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
              <span
                className={cn(
                  "transition-opacity",
                  collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                )}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div
        className={cn(
          "border-t border-blue-900/30 p-4",
          collapsed ? "flex justify-center" : ""
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed ? "justify-center" : ""
          )}
        >
          <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-medium">
            JD
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-1 ring-black"></span>
          </div>
          <div
            className={cn(
              "overflow-hidden transition-opacity",
              collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
            )}
          >
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-slate-400 truncate">john@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
