"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname=usePathname()

  return (
    <div className="lg:hidden">
      <div className="flex h-16 items-center justify-between border-b border-blue-900/30 bg-zinc-950 px-4">
        <div className="flex items-center gap-2">
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
          <span className="text-lg font-semibold text-white">InstaBot</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-400 hover:text-white hover:bg-blue-600/10"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-fade-in"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-fade-in"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 border-b border-blue-900/30 bg-zinc-950 animate-slide-in lg:hidden"
          style={{ top: "4rem" }} // Position below the header
        >
          <nav className="py-4 h-full">
            <div className="px-3 space-y-1">
              {[
                { name: "Dashboard", icon: "layout-dashboard", href: "/", active: pathname === "/" },
                { name: "Product Details", icon: "target", href: "/product-details", active: pathname === "/product-details" },
                { name: "Coupons", icon: "percent-circle", href: "/coupons", active: pathname === "/coupons" },
                { name: "Remarketing", icon: "users-round", href: "/remarketing", active: pathname === "/remarketing" },
                { name: "Leads", icon: "puzzle", href: "/leads", active: pathname === "/leads" },
              ].map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 animate-slide-in",
                    item.active
                      ? "bg-blue-600/10 text-blue-500"
                      : "text-slate-400 hover:bg-blue-600/10 hover:text-blue-500"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
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
                      item.active ? "text-blue-500" : "text-slate-400 group-hover:text-blue-500"
                    )}
                  >
                    {/* Icon paths as before */}
                    {item.icon === "layout-dashboard" && (
                      <>
                        <rect width="7" height="9" x="3" y="3" rx="1" />
                        <rect width="7" height="5" x="14" y="3" rx="1" />
                        <rect width="7" height="9" x="14" y="12" rx="1" />
                        <rect width="7" height="5" x="3" y="16" rx="1" />
                      </>
                    )}
                    {/* Add other icons as needed, matching Sidebar icons */}
                  </svg>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
