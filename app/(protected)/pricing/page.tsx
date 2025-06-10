"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MobileNav } from "@/components/global/mobile-nav";
import { Sidebar } from "@/components/global/sidebar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Check,
  Star,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Users,
  MessageSquare,
  BarChart3,
  Infinity,
} from "lucide-react";

export default function Pricing() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly"
  );

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

  // Pricing plans data
  const pricingPlans = [
    {
      name: "Starter",
      upfront: true,
      uprfrontCost: 4000,
      description: "Perfect for small businesses getting started",
      price: { monthly: 1500, annually: 15000 },
      icon: Zap,
      popular: false,
      features: [
        "1000 messages per month",
        "Basic Instagram automation",
        "Standard support",
        "Basic analytics",
        "Email support",
        "RAG based Product Details System",
      ],
      limitations: [],
    },

    {
      name: "Enterprise",
      upfront: false,
      uprfrontCost: 0,
      description: "For Customized needs with complex problems",
      price: { monthly: 15000, annually: 150000 },
      icon: Sparkles,
      popular: true,
      features: [
        "Everything in Starter Pack",
        "Custom Enterprise Solutions",
        "Personalized Support",
        "Customized Analytics",
        "Early Access to New Features",

        "Custom integrations",
      ],
      limitations: [],
    },
  ];

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
              <div className="text-center mb-12">
                <Skeleton className="h-12 w-96 mx-auto mb-4 bg-neutral-800/60" />
                <Skeleton className="h-6 w-64 mx-auto bg-neutral-800/60" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800/30 rounded-3xl p-8"
                  >
                    <Skeleton className="h-8 w-24 mb-4 bg-neutral-800/60" />
                    <Skeleton className="h-12 w-32 mb-6 bg-neutral-800/60" />
                    <div className="space-y-3">
                      {[...Array(6)].map((_, j) => (
                        <Skeleton
                          key={j}
                          className="h-4 w-full bg-neutral-800/60"
                        />
                      ))}
                    </div>
                    <Skeleton className="h-12 w-full mt-8 bg-neutral-800/60" />
                  </div>
                ))}
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
      aria-label="Pricing Plans"
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
        <main className="flex-1 flex" role="main" aria-label="Pricing Content">
          <div className="h-full px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            {/* Header Section */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="inline-flex items-center space-x-3 mb-6 mt-10">
                  <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    Choose Your Plan
                  </h1>
                </div>
                <p className="text-xl text-neutral-400 font-medium max-w-2xl mx-auto leading-relaxed">
                  Scale your Instagram automation with flexible pricing that
                  grows with your business
                </p>
              </motion.div>

              {/* Elegant divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-800/30 to-transparent" />
            </div>

            {/* Pricing Cards */}
            <div className="flex justify-center mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl w-full">
                {pricingPlans.map((plan, index) => {
                  const IconComponent = plan.icon;
                  const price =
                    billingCycle === "monthly"
                      ? plan.price.monthly
                      : plan.price.annually;
                  const isPopular = plan.popular;

                  return (
                    <motion.div
                      key={plan.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                      className={cn(
                        "relative bg-neutral-900/40 backdrop-blur-3xl border rounded-3xl p-8 shadow-2xl shadow-black/25 transition-all duration-500 hover:shadow-black/40 hover:bg-neutral-900/50 group",
                        isPopular
                          ? "border-blue-500/50 ring-1 ring-blue-500/20 scale-105"
                          : "border-neutral-800/30 hover:border-neutral-700/50"
                      )}
                    >
                      {/* Popular badge */}
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-6 py-2 rounded-full border border-blue-400/30 shadow-lg">
                            <Star className="w-4 h-4 inline mr-2" />
                            Most Popular
                          </div>
                        </div>
                      )}

                      {/* Plan header */}
                      <div className="mb-8">
                        <div className="flex items-center space-x-4 mb-4">
                          <div
                            className={cn(
                              "p-3 rounded-2xl backdrop-blur-xl border",
                              isPopular
                                ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500/30"
                                : "bg-gradient-to-r from-neutral-700/20 to-neutral-600/20 border-neutral-600/30"
                            )}
                          >
                            <IconComponent
                              className={cn(
                                "w-6 h-6",
                                isPopular ? "text-blue-400" : "text-neutral-400"
                              )}
                            />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">
                              {plan.name}
                            </h3>
                            <p className="text-neutral-400 text-sm font-medium">
                              {plan.description}
                            </p>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-baseline space-x-2 mb-2">
                          <span className="text-5xl font-bold text-white">
                            ₹{price}
                          </span>

                          <span className="text-neutral-400 text-lg font-medium">
                            /{billingCycle === "monthly" ? "month" : "year"}
                          </span>
                        </div>
                        {plan.upfront && (
                          <div className="flex items-baseline space-x-2 mb-2">
                            <span className="text-md font-normal text-white/50">
                              ₹{plan.upfront && plan.uprfrontCost} Rupees for
                              Setup and Integration
                            </span>
                          </div>
                        )}
                        {billingCycle === "annually" && (
                          <p className="text-green-400 text-sm font-medium">
                            ₹
                            {Math.round(
                              (plan.price.monthly * 12 - price) * 100
                            ) / 100}{" "}
                            saved per year
                          </p>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-start space-x-3"
                          >
                            <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-neutral-300 text-sm font-medium leading-relaxed">
                              {feature}
                            </span>
                          </div>
                        ))}
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div
                            key={limitIndex}
                            className="flex items-start space-x-3 opacity-60"
                          >
                            <div className="w-5 h-5 mt-0.5 flex-shrink-0 flex items-center justify-center">
                              <div className="w-1 h-1 bg-neutral-500 rounded-full" />
                            </div>
                            <span className="text-neutral-500 text-sm font-medium leading-relaxed">
                              {limitation}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Button
                        className={cn(
                          "w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105",
                          isPopular
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
                            : "bg-neutral-800/60 hover:bg-neutral-700/60 border border-neutral-700/50 text-white"
                        )}
                      >
                        <span>Get Started</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

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
    </div>
  );
}
