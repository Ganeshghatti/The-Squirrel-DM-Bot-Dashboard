"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PercentCircle, Puzzle, Target, UsersRound } from "lucide-react";
import Image from "next/image";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <div className="flex h-16 items-center justify-between border-b border-blue-900/30 bg-zinc-950 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-12 w-10 items-center justify-center rounded-md bg-transparent text-white">
                      <Image
                          src={"/images/logo.png"}
                          quality={100}
                          width={48}
                          height={48}
                          alt="Logo"
                          className="h-8 w-10 sm:h-10 sm:w-12"  
                        />
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
          style={{ top: "4rem" }}
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
                    {item.icon === "layout-dashboard" && (
                      <LayoutDashboard size={18} />
                    )}
                    {item.icon === "target" && (
                      <Target size={18} />
                    )}
                    {item.icon === "percent-circle" && (
                      <PercentCircle size={18} />
                    )}
                    {item.icon === "users-round" && (
                      <UsersRound size={18} />
                    )}
                    {item.icon === "puzzle" && (
                      <Puzzle size={18} />
                    )}
                  </svg>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}