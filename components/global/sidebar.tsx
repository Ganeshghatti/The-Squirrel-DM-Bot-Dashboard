"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"


// Lucide icons
import { LayoutDashboard, PercentCircle, Puzzle, Target, User, UsersRound } from "lucide-react";
import Image from "next/image";

export function Sidebar({ user, onToggle }: { user: any; onToggle: (collapsed: boolean) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const handleToggle = () => {
    setCollapsed(!collapsed);
    onToggle(!collapsed);
  };

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/" },
    { name: "Product Details", icon: <Target size={18} />, href: "/product-details" },
    { name: "Coupons", icon: <PercentCircle size={18} />, href: "/coupons" },
    { name: "Remarketing", icon: <UsersRound size={18} />, href: "/remarketing" },
    { name: "Leads", icon: <Puzzle size={18} />, href: "/leads" },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col border-r border-blue-900/30 bg-zinc-950 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        "hidden lg:flex"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b border-blue-900/30  pr-4 pl-3 ">
      <Link href={"/"}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-transparent text-white">
            <Image
                src={"/images/logo.png"}
                quality={100}
                width={48}
                height={48}
                alt="Logo"
                className="h-8 w-10 sm:h-10 sm:w-12"  
              />
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
      </Link>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-slate-400 hover:text-white hover:bg-blue-600/10"
          onClick={handleToggle}
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
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                pathname === item.href
                  ? "bg-blue-600/10 text-blue-500"
                  : "text-slate-400 hover:bg-blue-600/10 hover:text-blue-500"
              )}
            >
              <span
                className={cn(
                  "transition-colors",
                  pathname === item.href
                    ? "text-blue-500"
                    : "text-slate-400 group-hover:text-blue-500"
                )}
              >
                {item.icon}
              </span>
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

        <Separator className="my-4" />

        <div className="px-3 space-y-1">
          <Link
            href="/profile"
            className={cn(
              "group flex items-center gap-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
              pathname === "/profile"
                ? "bg-blue-600/10 text-blue-500"
                : "text-slate-400 hover:bg-blue-600/10 hover:text-blue-500"
            )}
          >
            <span
              className={cn(
                "transition-colors",
                pathname === "/profile"
                  ? "text-blue-500"
                  : "text-slate-400 group-hover:text-blue-500"
              )}
            >
              <User size={18} />  
            </span>
            <span
              className={cn(
                "transition-opacity",
                collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
              )}
            >
              Profile
            </span>
          </Link>
          
        </div>
        
      </nav>

      {/* User Profile */}
      <div
        className={cn(
          "border-t border-blue-900/30 p-4",
          collapsed ? "flex justify-center" : ""
        )}
      >
        <Link href={"/profile"}>
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
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
