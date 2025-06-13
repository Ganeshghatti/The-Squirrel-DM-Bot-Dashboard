"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Lucide icons
import {
  DollarSign,
  LayoutDashboard,
  PercentCircle,
  Puzzle,
  Target,
  User,
  UsersRound,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
} from "lucide-react";
import Image from "next/image";

export function Sidebar({
  user,
  onToggle,
}: {
  user: any;
  onToggle: (collapsed: boolean) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const handleToggle = () => {
    setCollapsed(!collapsed);
    onToggle(!collapsed);
  };

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/" },
    {
      name: "Appointments",
      icon: <Calendar size={18} />,
      href: "/appointments",
    },
    {
      name: "Product Details",
      icon: <Target size={18} />,
      href: "/product-details",
    },
    { name: "Coupons", icon: <PercentCircle size={18} />, href: "/coupons" },
    {
      name: "Remarketing",
      icon: <UsersRound size={18} />,
      href: "/remarketing",
    },
    { name: "Pricing", icon: <DollarSign size={18} />, href: "/pricing" },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col bg-transparent transition-all duration-500 ease-out",
        collapsed ? "w-16" : "w-64",
        "hidden lg:flex"
      )}
    >
      {/* Glass morphism container */}
      <div className="h-full bg-neutral-900/40 backdrop-blur-2xl border-r border-neutral-800/30">
        {/* Header */}
        <div className="flex h-16 items-center  px-4">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl">
              {/* Replace with Sparkles icon or keep your logo */}
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
                "text-lg font-semibold text-white transition-all duration-300",
                collapsed ? "opacity-0 w-0" : "opacity-100"
              )}
            >
              InstaBot
            </span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "ml-auto h-8 w-8 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-200",
              collapsed && "ml-0"
            )}
            onClick={handleToggle}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="px-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative",
                  pathname === item.href
                    ? "bg-white/10 text-white border border-white/20 shadow-lg shadow-white/5"
                    : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
                )}
              >
                {/* Active indicator */}
                {pathname === item.href && (
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />
                )}

                <span
                  className={cn(
                    "transition-colors shrink-0",
                    pathname === item.href
                      ? "text-white"
                      : "text-neutral-400 group-hover:text-white"
                  )}
                >
                  {item.icon}
                </span>

                <span
                  className={cn(
                    "transition-all duration-300 truncate",
                    collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Separator */}
          <div className="my-6 px-6">
            <div className="h-px bg-neutral-800/30" />
          </div>

          {/* Profile Section */}
          <div className="px-3 space-y-2">
            <Link
              href="/profile"
              className={cn(
                "group flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative",
                pathname === "/profile"
                  ? "bg-white/10 text-white border border-white/20 shadow-lg shadow-white/5"
                  : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
              )}
            >
              {pathname === "/profile" && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />
              )}

              <span
                className={cn(
                  "transition-colors shrink-0",
                  pathname === "/profile"
                    ? "text-white"
                    : "text-neutral-400 group-hover:text-white"
                )}
              >
                <User size={18} />
              </span>

              <span
                className={cn(
                  "transition-all duration-300",
                  collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                )}
              >
                Profile
              </span>
            </Link>
          </div>
        </nav>

        {/* User Profile Card */}
        <div className="border-t border-neutral-800/30 p-4">
          <Link href="/profile">
            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl bg-neutral-800/20 backdrop-blur-xl border border-neutral-700/30 hover:bg-neutral-800/30 hover:border-neutral-700/50 transition-all duration-200",
                collapsed ? "justify-center p-2" : ""
              )}
            >
              {/* Avatar */}
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white text-sm font-medium shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-neutral-900/40"></span>
              </div>

              {/* User Info */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 min-w-0",
                  collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                )}
              >
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}
