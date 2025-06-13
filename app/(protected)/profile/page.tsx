"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { Sidebar } from "@/components/global/sidebar";
import { MobileNav } from "@/components/global/mobile-nav";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  Instagram,
  MessageSquare,
  Settings,
  LogOut,
  Sparkles,
  Hash,
  UserCheck,
  MessageCircle,
  Workflow,
  HelpCircle,
} from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface Company {
  _id: string;
  company_id: string;
  company_instagram_id: string;
  instagram_profile?: string;
  phone?: string;
  email: string;
  name: string;
  access_token?: string;
  bot_identity: string;
  Back_context: string;
  Role: string;
  Conversation_Flow: string;
  FAQ: FAQ[];
  keywords: string[];
  isBotActive: boolean;
}

export default function CompanyProfile() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isUpdatingBotStatus, setIsUpdatingBotStatus] = useState(false);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsTransitioning(true);
    setSidebarCollapsed(collapsed);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  useEffect(() => {
    if (!hasHydrated) return;

    const fetchCompany = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to fetch profile");
          setLoading(false);
          toast.error("Failed to fetch profile");
          router.push("/login");
          return;
        }

        const data = await res.json();
        setCompany(data.company);
        setLoading(false);
      } catch (err) {
        toast.error("Network Error: " + err);
        console.error("Network error:", err);
        setError("Something went wrong");
        setLoading(false);
        router.push("/login");
      }
    };

    fetchCompany();
  }, [token, router, hasHydrated]);

  const updateBotStatus = async (newStatus: boolean) => {
    if (!company || !token) return;

    setIsUpdatingBotStatus(true);
    try {
      const res = await fetch(`/api/company/${company._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBotActive: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update bot status");
      }

      const data = await res.json();

      // Update local state
      setCompany((prev) => (prev ? { ...prev, isBotActive: newStatus } : null));
      toast.success(
        `Bot ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      toast.error("Failed to update bot status");
      console.error("Error updating bot status:", err);
    } finally {
      setIsUpdatingBotStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
        {/* Elegant background with subtle texture */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/10 via-neutral-950 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-neutral-800/5 via-transparent to-transparent" />
        </div>

        {/* Floating elements */}
        <div
          className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-white/[0.02] to-transparent rounded-full blur-3xl"
          style={{ animation: "floatSlow 15s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-neutral-700/[0.03] to-transparent rounded-full blur-3xl"
          style={{
            animation: "floatSlow 20s ease-in-out infinite",
            animationDelay: "5s",
          }}
        />

        <div className="relative z-10 flex text-white">
          <Sidebar user={company} onToggle={handleSidebarToggle} />
          <div
            className={cn(
              "flex-1 flex flex-col transition-all duration-300 ease-out",
              sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
            )}
          >
            <div className="lg:hidden bg-neutral-900/60 backdrop-blur-3xl border-b border-neutral-800/30 relative z-[110]">
              <MobileNav />
            </div>
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-16 lg:pt-0">
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-2xl bg-neutral-800/60" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-64 bg-neutral-800/60" />
                    <Skeleton className="h-4 w-48 bg-neutral-800/60" />
                  </div>
                </div>

                {/* Premium glass container skeleton */}
                <div className="bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800/30 rounded-3xl p-8 shadow-2xl shadow-black/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[...Array(8)].map((_, index) => (
                      <div key={index} className="space-y-3">
                        <Skeleton className="h-4 w-24 bg-neutral-800/60" />
                        <Skeleton className="h-6 w-full bg-neutral-800/60" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800/30 rounded-3xl p-8 shadow-2xl shadow-black/20">
                  <Skeleton className="h-6 w-32 bg-neutral-800/60 mb-6" />
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="space-y-3 mb-6 last:mb-0">
                      <Skeleton className="h-5 w-3/4 bg-neutral-800/60" />
                      <Skeleton className="h-4 w-full bg-neutral-800/60" />
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>

        <style jsx>{`
          @keyframes floatSlow {
            0%,
            100% {
              transform: translateY(0px) scale(1);
              opacity: 0.6;
            }
            50% {
              transform: translateY(-30px) scale(1.1);
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/10 via-neutral-950 to-black" />
        </div>

        <div className="relative z-10 flex text-white">
          <Sidebar user={company} onToggle={handleSidebarToggle} />
          <div
            className={cn(
              "flex-1 flex flex-col transition-all duration-300 ease-out",
              sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
            )}
          >
            <div className="lg:hidden bg-neutral-900/60 backdrop-blur-3xl border-b border-neutral-800/30 relative z-[110]">
              <MobileNav />
            </div>
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-16 lg:pt-0">
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-red-900/20 backdrop-blur-2xl border border-red-800/30 rounded-3xl p-8 text-center max-w-md">
                  <div className="w-16 h-16 bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Something went wrong
                  </h3>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex relative overflow-hidden selection:bg-white/10">
      {/* Enhanced background with subtle patterns */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/10 via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-neutral-800/5 via-transparent to-transparent" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Floating elements for depth */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-white/[0.015] to-transparent rounded-full blur-3xl pointer-events-none"
        style={{
          animation: "float 8s ease-in-out infinite",
          animationDelay: "0s",
        }}
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
          <Sidebar user={company} onToggle={handleSidebarToggle} />
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
        {" "}
        {/* Mobile navigation */}
        <div className="lg:hidden">
          <MobileNav />
        </div>
        <main
          className="flex-1 relative pt-16 lg:pt-0"
          role="main"
          aria-label="Profile Content"
        >
          <div className="h-full px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            {/* Header section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                      {company?.name}
                    </h1>
                    <p className="text-neutral-400 font-medium">
                      Company Profile
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={() => router.push("/settings")}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white backdrop-blur-xl transition-all duration-200 rounded-xl px-6"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                  <Button
                    onClick={() => clearToken()}
                    className="border-red-700/50 border hover:border-red-600 text-red-300 hover:text-red-400 bg-red-800/30 hover:bg-red-800/50 backdrop-blur-xl transition-all duration-200 rounded-xl px-6"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>

              {/* Elegant divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-800/30 to-transparent" />
            </motion.div>

            {/* Profile content grid */}
            <div className="space-y-8">
              {/* Basic Information Card */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800/30 rounded-3xl p-8 shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all duration-500"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white tracking-tight">
                    Basic Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Company Name */}
                  <div className="group">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-4 h-4 text-neutral-400" />
                      <p className="text-sm font-medium text-neutral-400">
                        Company Name
                      </p>
                    </div>
                    <p className="text-white font-medium bg-neutral-800/30 rounded-xl px-4 py-3 border border-neutral-700/30 group-hover:border-neutral-600/50 transition-colors">
                      {company?.name}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mail className="w-4 h-4 text-neutral-400" />
                      <p className="text-sm font-medium text-neutral-400">
                        Email Address
                      </p>
                    </div>
                    <p className="text-white font-medium bg-neutral-800/30 rounded-xl px-4 py-3 border border-neutral-700/30 group-hover:border-neutral-600/50 transition-colors break-all">
                      {company?.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="group">
                    <div className="flex items-center space-x-2 mb-2">
                      <Phone className="w-4 h-4 text-neutral-400" />
                      <p className="text-sm font-medium text-neutral-400">
                        Phone Number
                      </p>
                    </div>
                    <p className="text-white font-medium bg-neutral-800/30 rounded-xl px-4 py-3 border border-neutral-700/30 group-hover:border-neutral-600/50 transition-colors">
                      {company?.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Instagram Integration Card */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800/30 rounded-3xl p-8 shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all duration-500"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-pink-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white tracking-tight">
                    Instagram Integration
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Instagram Profile */}
                  <div className="group">
                    <div className="flex items-center space-x-2 mb-2">
                      <Instagram className="w-4 h-4 text-neutral-400" />
                      <p className="text-sm font-medium text-neutral-400">
                        Profile URL
                      </p>
                    </div>
                    <p className="text-white font-medium bg-neutral-800/30 rounded-xl px-4 py-3 border border-neutral-700/30 group-hover:border-neutral-600/50 transition-colors break-all">
                      {company?.instagram_profile || "Not connected"}
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Bot Configuration Card */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800/30 rounded-3xl p-8 shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all duration-500"
              >
                {" "}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-green-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                      Bot Configuration
                    </h2>
                  </div>

                  {/* Bot Status Toggle */}
                  <div className="flex items-center space-x-3">
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors",
                        company?.isBotActive
                          ? "text-green-400"
                          : "text-neutral-400"
                      )}
                    >
                      {company?.isBotActive ? "Active" : "Inactive"}
                    </span>
                    <button
                      onClick={() => updateBotStatus(!company?.isBotActive)}
                      disabled={isUpdatingBotStatus}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed",
                        company?.isBotActive ? "bg-green-600" : "bg-neutral-600"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          company?.isBotActive
                            ? "translate-x-6"
                            : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                </div>
                <div className="space-y-6">
                  {/* Bot Identity */}
                  <div className="group">
                    <div className="flex items-center space-x-2 mb-3">
                      <UserCheck className="w-4 h-4 text-neutral-400" />
                      <p className="text-sm font-medium text-neutral-400">
                        Bot Identity
                      </p>
                    </div>
                    <div className="bg-neutral-800/30 rounded-xl px-6 py-4 border border-neutral-700/30 group-hover:border-neutral-600/50 transition-colors">
                      <p className="text-white leading-relaxed">
                        {company?.bot_identity}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="group">
                    <div className="flex items-center space-x-2 mb-3">
                      <UserCheck className="w-4 h-4 text-neutral-400" />
                      <p className="text-sm font-medium text-neutral-400">
                        Role
                      </p>
                    </div>
                    <div className="bg-neutral-800/30 rounded-xl px-6 py-4 border border-neutral-700/30 group-hover:border-neutral-600/50 transition-colors">
                      <p className="text-white leading-relaxed">
                        {company?.Role}
                      </p>
                    </div>
                  </div>

                  {/* Background Context */}
                  <div className="group">
                    <div className="flex items-center space-x-2 mb-3">
                      <MessageCircle className="w-4 h-4 text-neutral-400" />
                      <p className="text-sm font-medium text-neutral-400">
                        Background Context
                      </p>
                    </div>
                    <div className="bg-neutral-800/30 rounded-xl px-6 py-4 border border-neutral-700/30 group-hover:border-neutral-600/50 transition-colors">
                      <p className="text-white leading-relaxed">
                        {company?.Back_context}
                      </p>
                    </div>
                  </div>

                  {/* Conversation Flow */}
                  <div className="group">
                    <div className="flex items-center space-x-2 mb-3">
                      <Workflow className="w-4 h-4 text-neutral-400" />
                      <p className="text-sm font-medium text-neutral-400">
                        Conversation Flow
                      </p>
                    </div>
                    <div className="bg-neutral-800/30 rounded-xl px-6 py-4 border border-neutral-700/30 group-hover:border-neutral-600/50 transition-colors">
                      <p className="text-white leading-relaxed whitespace-pre-line">
                        {company?.Conversation_Flow}
                      </p>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="group">
                    <div className="flex items-center space-x-2 mb-3">
                      <Hash className="w-4 h-4 text-neutral-400" />
                      <p className="text-sm font-medium text-neutral-400">
                        Keywords
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {company?.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30 font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* FAQ Section */}
            </div>

            {/* Bottom spacing */}
            <div className="h-8" />
          </div>

          {/* Subtle accent elements */}
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
    </div>
  );
}
