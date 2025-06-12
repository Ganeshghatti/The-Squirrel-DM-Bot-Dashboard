"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PercentCircle,
  Puzzle,
  Target,
  UsersRound,
} from "lucide-react";
import Image from "next/image";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="lg:hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex h-16 items-center justify-between border-b border-zinc-800 bg-black/95 backdrop-blur-sm px-4">
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
          onClick={toggleMenu}
          className="text-slate-400 hover:text-white hover:bg-zinc-800/50 relative z-[101]"
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
          <span className="sr-only">Toggle menu</span>{" "}
        </Button>
      </div>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="fixed inset-y-0 left-0 z-[95] w-80 bg-black/95 backdrop-blur-md border-r border-zinc-800 lg:hidden transform transition-transform duration-300 ease-out">
          {/* Menu Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-transparent text-white">
                <Image
                  src={"/images/logo.png"}
                  quality={100}
                  width={40}
                  height={40}
                  alt="Logo"
                  className="h-8 w-8"
                />
              </div>
              <span className="text-lg font-semibold text-white">InstaBot</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="py-6 h-full overflow-y-auto">
            <div className="px-4 space-y-2">
              {" "}
              {[
                {
                  name: "Dashboard",
                  icon: "layout-dashboard",
                  href: "/",
                  active: pathname === "/",
                },
                {
                  name: "Appointments",
                  icon: "puzzle",
                  href: "/appointments",
                  active: pathname === "/appointments",
                },
                {
                  name: "Product Details",
                  icon: "target",
                  href: "/product-details",
                  active: pathname === "/product-details",
                },
                {
                  name: "Coupons",
                  icon: "percent-circle",
                  href: "/coupons",
                  active: pathname === "/coupons",
                },
                {
                  name: "Remarketing",
                  icon: "users-round",
                  href: "/remarketing",
                  active: pathname === "/remarketing",
                },
              ].map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={toggleMenu}
                  className={cn(
                    "flex items-center gap-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 group",
                    item.active
                      ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                      : "text-slate-300 hover:bg-zinc-800/60 hover:text-white border border-transparent hover:border-zinc-700/50"
                  )}
                >
                  {" "}
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
                    className={cn(
                      "flex-shrink-0 transition-colors",
                      item.active
                        ? "text-blue-400"
                        : "text-slate-400 group-hover:text-white"
                    )}
                  >
                    {" "}
                    {item.icon === "layout-dashboard" && (
                      <LayoutDashboard size={20} />
                    )}
                    {item.icon === "target" && <Target size={20} />}
                    {item.icon === "percent-circle" && (
                      <PercentCircle size={20} />
                    )}
                    {item.icon === "users-round" && <UsersRound size={20} />}
                    {item.icon === "puzzle" && <Puzzle size={20} />}
                  </svg>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
