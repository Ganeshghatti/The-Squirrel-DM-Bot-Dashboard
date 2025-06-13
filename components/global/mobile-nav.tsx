"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PercentCircle,
  Target,
  UsersRound,
  Calendar,
  DollarSign,
  User,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  // Fetch user data
  useEffect(() => {
    if (!hasHydrated) return;

    const fetchUser = async () => {
      if (!token) {
        setUserLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("API error:", res.status);
          setUserLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data.company);
        setUserLoading(false);
      } catch (err) {
        console.error("Network error:", err);
        setUserLoading(false);
      }
    };
    fetchUser();
  }, [token, hasHydrated]);

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
    <div className="lg:hidden">
      {/* Fixed Header with Glass Morphism */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex h-16 items-center justify-between bg-neutral-900/40 backdrop-blur-2xl border-b border-neutral-800/30 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl">
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
          className="h-8 w-8 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-200 relative z-[101]"
        >
          {isOpen ? (
            <X className="h-5 w-5 animate-in slide-in-from-top-1 duration-200" />
          ) : (
            <Menu className="h-5 w-5 animate-in slide-in-from-top-1 duration-200" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Backdrop Overlay with Blur */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Navigation Menu with Glass Morphism */}
      {isOpen && (
        <div className="fixed inset-y-0 left-0 z-[95] w-80 bg-neutral-900/40 backdrop-blur-2xl border-r border-neutral-800/30 lg:hidden animate-in slide-in-from-left duration-300 ease-out">
          {/* Menu Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-800/30">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl">
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
          </div>
          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="px-3 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={toggleMenu}
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

                  <span className="font-medium truncate">{item.name}</span>
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
                onClick={toggleMenu}
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

                <span className="font-medium">Profile</span>
              </Link>
            </div>
          </nav>{" "}
          {/* User Profile Card at Bottom */}
          <div className="border-t border-neutral-800/30 p-4">
            <Link href="/profile" onClick={toggleMenu}>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/20 backdrop-blur-xl border border-neutral-700/30 hover:bg-neutral-800/30 hover:border-neutral-700/50 transition-all duration-200">
                {/* Avatar */}
                <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white text-sm font-medium shrink-0">
                  {userLoading ? (
                    <div className="animate-pulse">
                      <div className="h-6 w-6 bg-neutral-700 rounded"></div>
                    </div>
                  ) : user?.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    "U"
                  )}
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-neutral-900/40"></span>
                </div>

                {/* User Info */}
                <div className="overflow-hidden min-w-0">
                  {userLoading ? (
                    <div className="animate-pulse space-y-1">
                      <div className="h-4 bg-neutral-700 rounded w-20"></div>
                      <div className="h-3 bg-neutral-700 rounded w-24"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-white truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
