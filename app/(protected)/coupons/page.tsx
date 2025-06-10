"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MobileNav } from "@/components/global/mobile-nav";
import { Sidebar } from "@/components/global/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Ticket,
  Search,
  Filter,
  Download,
  Copy,
  Eye,
  Calendar,
  Percent,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Gift,
  DollarSign,
} from "lucide-react";

// Dummy coupon data
const couponsData = [
  {
    id: 1,
    code: "WELCOME20",
    user: {
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      id: "USR001",
    },
    discount: {
      type: "percentage",
      value: 20,
      amount: "$45.00",
    },
    status: "Active",
    generatedDate: "2024-01-15",
    expiryDate: "2024-02-15",
    usageCount: 0,
    maxUsage: 1,
    checkoutValue: "$225.00",
    reason: "Abandoned checkout after 1 hour",
  },
  {
    id: 2,
    code: "COMEBACK15",
    user: {
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      id: "USR002",
    },
    discount: {
      type: "percentage",
      value: 15,
      amount: "$78.00",
    },
    status: "Used",
    generatedDate: "2024-01-14",
    expiryDate: "2024-02-14",
    usageCount: 1,
    maxUsage: 1,
    checkoutValue: "$520.00",
    reason: "Cart abandoned for 24 hours",
  },
  {
    id: 3,
    code: "SAVE25NOW",
    user: {
      name: "Michael Chen",
      email: "m.chen@business.co",
      id: "USR003",
    },
    discount: {
      type: "fixed",
      value: 25,
      amount: "$25.00",
    },
    status: "Active",
    generatedDate: "2024-01-13",
    expiryDate: "2024-02-13",
    usageCount: 0,
    maxUsage: 1,
    checkoutValue: "$180.00",
    reason: "Multiple visits without purchase",
  },
  {
    id: 4,
    code: "RETURN10",
    user: {
      name: "Emily Rodriguez",
      email: "emily.r@startup.io",
      id: "USR004",
    },
    discount: {
      type: "percentage",
      value: 10,
      amount: "$34.00",
    },
    status: "Expired",
    generatedDate: "2024-01-10",
    expiryDate: "2024-01-25",
    usageCount: 0,
    maxUsage: 1,
    checkoutValue: "$340.00",
    reason: "Left checkout page after payment info",
  },
  {
    id: 5,
    code: "SPECIAL30",
    user: {
      name: "David Thompson",
      email: "david.thompson@corp.net",
      id: "USR005",
    },
    discount: {
      type: "percentage",
      value: 30,
      amount: "$123.00",
    },
    status: "Active",
    generatedDate: "2024-01-12",
    expiryDate: "2024-02-12",
    usageCount: 0,
    maxUsage: 2,
    checkoutValue: "$410.00",
    reason: "High-value cart abandonment",
  },
  {
    id: 6,
    code: "FIRSTBUY20",
    user: {
      name: "Lisa Anderson",
      email: "l.anderson@enterprise.com",
      id: "USR006",
    },
    discount: {
      type: "percentage",
      value: 20,
      amount: "$150.00",
    },
    status: "Used",
    generatedDate: "2024-01-11",
    expiryDate: "2024-02-11",
    usageCount: 1,
    maxUsage: 1,
    checkoutValue: "$750.00",
    reason: "First-time visitor abandoned cart",
  },
];

export default function Coupons() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [couponsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState("all");

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsTransitioning(true);
    setSidebarCollapsed(collapsed);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  useEffect(() => {
    if (!hasHydrated) return;

    const fetchUser = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          toast.error("Authentication failed. Please try again.");
          console.error("API error:", res.status);
          return;
        }

        const data = await res.json();
        setUser(data.company);
        setLoading(false);
      } catch (err) {
        toast.error("Unable to connect. Please check your connection.");
        console.error("Network error:", err);
        router.push("/login");
      }
    };

    fetchUser();
  }, [token, router, hasHydrated]);

  // Filter coupons based on search term and status
  const filteredCoupons = couponsData.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || coupon.status.toLowerCase() === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = filteredCoupons.slice(
    indexOfFirstCoupon,
    indexOfLastCoupon
  );
  const totalPages = Math.ceil(filteredCoupons.length / couponsPerPage);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-600/20 text-green-400 border-green-500/30";
      case "used":
        return "bg-blue-600/20 text-blue-400 border-blue-500/30";
      case "expired":
        return "bg-red-600/20 text-red-400 border-red-500/30";
      default:
        return "bg-neutral-600/20 text-neutral-400 border-neutral-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "used":
        return <CheckCircle className="w-4 h-4" />;
      case "expired":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied to clipboard!");
  };

  // Premium loading state
  if (!hasHydrated || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/10 via-neutral-950 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-neutral-800/5 via-transparent to-transparent" />
        </div>

        {/* Floating elements */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-white/[0.015] to-transparent rounded-full blur-3xl pointer-events-none"
          style={{ animation: "float 8s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-neutral-400/[0.02] to-transparent rounded-full blur-3xl pointer-events-none"
          style={{
            animation: "float 10s ease-in-out infinite",
            animationDelay: "2s",
          }}
        />

        {/* Loading content */}
        <div className="relative z-10 min-h-screen flex">
          <div className="w-64 bg-neutral-900/40 backdrop-blur-2xl border-r border-neutral-800/30">
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-32 bg-neutral-800/60" />
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full bg-neutral-800/60" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <Skeleton className="h-12 w-64 mb-8 bg-neutral-800/60" />
              <div className="bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800/30 rounded-3xl p-8">
                <div className="space-y-6">
                  <div className="flex space-x-4">
                    <Skeleton className="h-12 flex-1 bg-neutral-800/60" />
                    <Skeleton className="h-12 w-32 bg-neutral-800/60" />
                  </div>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton
                        key={i}
                        className="h-20 w-full bg-neutral-800/60"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            33% {
              transform: translateY(-20px) rotate(1deg);
            }
            66% {
              transform: translateY(10px) rotate(-1deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex relative overflow-hidden selection:bg-white/10"
      role="application"
      aria-label="Coupon Management"
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/10 via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-neutral-800/5 via-transparent to-transparent" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Floating elements */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-white/[0.015] to-transparent rounded-full blur-3xl pointer-events-none"
        style={{ animation: "float 8s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-neutral-400/[0.02] to-transparent rounded-full blur-3xl pointer-events-none"
        style={{
          animation: "float 10s ease-in-out infinite",
          animationDelay: "2s",
        }}
      />

      {/* Sidebar */}
      <div className="relative z-20">
        <div className="fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-out">
          <Sidebar user={user} onToggle={handleSidebarToggle} />
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-out relative z-10",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64",
          isTransitioning && "transition-transform"
        )}
      >
        {/* Mobile navigation */}
        <div className="lg:hidden bg-neutral-900/60 backdrop-blur-3xl border-b border-neutral-800/30 shadow-lg shadow-black/10">
          <MobileNav />
        </div>

        {/* Main content */}
        <main
          className="flex-1 relative"
          role="main"
          aria-label="Coupon Content"
        >
          <div className="h-full px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            {/* Header Section */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-4 mb-6"
              >
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    Coupon Management
                  </h1>
                  <p className="text-neutral-400 text-lg font-medium">
                    Automated discount coupons for abandoned checkout recovery
                  </p>
                </div>
              </motion.div>

              {/* Elegant divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-800/30 to-transparent" />
            </div>

            {/* Coming Soon Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-8 relative overflow-hidden"
            >
              <div className="bg-gradient-to-br from-neutral-900/60 via-neutral-900/40 to-neutral-800/30 backdrop-blur-3xl border border-neutral-700/30 rounded-3xl p-12 relative">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 rounded-3xl opacity-50">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"
                    style={{
                      animation: "shimmer 3s ease-in-out infinite",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full mb-6 backdrop-blur-sm border border-purple-500/20"
                  >
                    <Gift className="w-10 h-10 text-purple-400" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent mb-4"
                  >
                    Coming Soon for Premium Users
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed"
                  >
                    Automated coupon generation and abandoned cart recovery
                    features are being crafted for our premium users. Get ready
                    to boost conversions with intelligent discount campaigns.
                  </motion.p>

                  {/* Feature highlights */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                  >
                    {[
                      {
                        icon: <TrendingUp className="w-6 h-6" />,
                        title: "Smart Analytics",
                        description: "Track coupon performance and ROI",
                      },
                      {
                        icon: <Users className="w-6 h-6" />,
                        title: "User Targeting",
                        description: "Personalized discount strategies",
                      },
                      {
                        icon: <DollarSign className="w-6 h-6" />,
                        title: "Revenue Recovery",
                        description: "Convert abandoned carts to sales",
                      },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                        className="p-4 bg-neutral-800/20 backdrop-blur-sm rounded-2xl border border-neutral-700/20"
                      >
                        <div className="text-purple-400 mb-3 flex justify-center">
                          {feature.icon}
                        </div>
                        <h3 className="text-white font-semibold mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-neutral-400 text-sm">
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Premium badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 2 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span className="text-purple-400 font-medium">
                      Premium Feature
                    </span>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    />
                  </motion.div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-xl" />
                <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl" />
              </div>
            </motion.div>

            {/* Bottom spacing */}
            <div className="h-12" />
          </div>

          {/* Floating accent elements */}
          <div
            className="absolute top-32 right-32 w-24 h-24 bg-white/[0.01] rounded-full blur-2xl pointer-events-none"
            style={{
              animation: "float 8s ease-in-out infinite",
              animationDelay: "1s",
            }}
          />
          <div
            className="absolute bottom-32 left-32 w-20 h-20 bg-neutral-400/[0.015] rounded-full blur-xl pointer-events-none"
            style={{
              animation: "float 10s ease-in-out infinite",
              animationDelay: "4s",
            }}
          />
        </main>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          33% {
            transform: translateY(-20px) rotate(1deg) scale(1.02);
          }
          66% {
            transform: translateY(10px) rotate(-1deg) scale(0.98);
          }
        }
      `}</style>

      {/* Additional shimmer animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
