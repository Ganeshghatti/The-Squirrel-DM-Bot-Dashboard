"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { Sidebar } from "@/components/global/sidebar";
import { MobileNav } from "@/components/global/mobile-nav";
import { cn } from "@/lib/utils";
import {
  Settings,
  User,
  Instagram,
  Phone,
  Bot,
  MessageSquare,
  Workflow,
  HelpCircle,
  Plus,
  Minus,
  Save,
  ArrowLeft,
  Sparkles,
  Hash,
} from "lucide-react";

// Define the Zod schema for the form (removed FAQ and keywords)
const UpdateCompanySchema = z.object({
  instagram_profile: z.string().min(1, "Instagram profile is required"),
  phone: z.string().optional().or(z.literal("")),
  name: z
    .string()
    .min(1, "Company Name is required")
    .max(100, "Company Name must be 100 characters or less"),
  bot_identity: z
    .string()
    .min(1, "Bot Identity is required")
    .max(600, "Bot Identity must be 600 characters or less"),
  Back_context: z
    .string()
    .min(1, "Background Context is required")
    .max(1000, "Background Context must be 1000 characters or less"),
  Role: z.string().min(1, "Role is required"),
  Conversation_Flow: z
    .string()
    .min(1, "Conversation Flow is required")
    .max(1000, "Conversation Flow must be 1000 characters or less"),
});

type UpdateCompanyForm = z.infer<typeof UpdateCompanySchema>;

export default function UpdateCompanyPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [user, setUser] = useState(null);
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateCompanyForm>({
    resolver: zodResolver(UpdateCompanySchema),
  });

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsTransitioning(true);
    setSidebarCollapsed(collapsed);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  useEffect(() => {
    if (!hasHydrated) return;

    const fetchCompanyData = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          toast.error("Failed to fetch company data");
          router.push("/login");
          return;
        }

        const response = await res.json();
        setUser(response.company);

        // Reset form with only the fields we need
        reset({
          instagram_profile: response.company.instagram_profile || "",
          phone: response.company.phone || "",
          name: response.company.name || "",
          bot_identity: response.company.bot_identity || "",
          Back_context: response.company.Back_context || "",
          Role: response.company.Role || "",
          Conversation_Flow: response.company.Conversation_Flow || "",
        });
        setLoading(false);
      } catch (err) {
        toast.error("Something went wrong while fetching data");
        setError("Failed to load company data");
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [reset, token, hasHydrated, router]);

  const onSubmit = async (data: UpdateCompanyForm) => {
    if (!hasHydrated) return;

    setError("");
    setSubmitting(true);

    console.log("Submitting data:", data);

    try {
      const res = await fetch("/api/company", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (!res.ok) {
        toast.error("Update Failed");
        setError(response.error || "Update failed");
        setSubmitting(false);
        return;
      }

      toast.success("Company Profile Updated Successfully");
      router.push("/profile");
    } catch (err) {
      toast.error("Update Failed");
      setError("Something went wrong");
      setSubmitting(false);
    }
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
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-10 w-64 mb-8 bg-neutral-800/60" />
              <div className="bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800/30 rounded-3xl p-8">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-4 w-24 bg-neutral-800/60" />
                        <Skeleton className="h-12 w-full bg-neutral-800/60" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-32 w-full bg-neutral-800/60" />
                  <Skeleton className="h-12 w-full bg-neutral-800/60" />
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
      aria-label="Company Settings"
    >
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
          aria-label="Settings Content"
        >
          <div className="h-full px-4 py-6 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-4 mb-6"
              >
                <Link
                  href="/profile"
                  className="inline-flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Profile</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className="p-3 bg-gradient-to-r from-neutral-800/50 to-neutral-700/30 rounded-2xl backdrop-blur-xl border border-neutral-700/50">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    Company Settings
                  </h1>
                  <p className="text-neutral-400 text-lg font-medium">
                    Update your company profile and bot configuration
                  </p>
                </div>
              </motion.div>

              {/* Elegant divider */}
              <div className="mt-8 w-full h-px bg-gradient-to-r from-transparent via-neutral-800/30 to-transparent" />
            </div>

            {/* Form container */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-neutral-900/40 backdrop-blur-3xl border border-neutral-800/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/25"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {/* Basic Information Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl backdrop-blur-xl border border-blue-500/30">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Basic Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-neutral-300 flex items-center space-x-2">
                        <span>Company Name</span>
                        <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        {...register("name")}
                        className="bg-neutral-800/50 border-neutral-700/50 text-white placeholder-neutral-500 focus:border-white/50 focus:ring-white/20 rounded-xl h-12"
                        placeholder="Enter company name"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm font-medium">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-neutral-300 flex items-center space-x-2">
                        <Instagram className="w-4 h-4" />
                        <span>Instagram Profile</span>
                        <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        {...register("instagram_profile")}
                        className="bg-neutral-800/50 border-neutral-700/50 text-white placeholder-neutral-500 focus:border-white/50 focus:ring-white/20 rounded-xl h-12"
                        placeholder="@your_instagram_handle"
                      />
                      {errors.instagram_profile && (
                        <p className="text-red-400 text-sm font-medium">
                          {errors.instagram_profile.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-neutral-300 flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Phone Number</span>
                      <span className="text-neutral-500 text-xs">
                        (Optional)
                      </span>
                    </Label>
                    <Input
                      {...register("phone")}
                      type="tel"
                      className="bg-neutral-800/50 border-neutral-700/50 text-white placeholder-neutral-500 focus:border-white/50 focus:ring-white/20 rounded-xl h-12"
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm font-medium">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Bot Configuration Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl backdrop-blur-xl border border-purple-500/30">
                      <Bot className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Bot Configuration
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-neutral-300 flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Bot Identity</span>
                        <span className="text-red-400">*</span>
                      </Label>
                      <Textarea
                        {...register("bot_identity")}
                        className="bg-neutral-800/50 border-neutral-700/50 text-white placeholder-neutral-500 focus:border-white/50 focus:ring-white/20 rounded-xl min-h-[100px] resize-none"
                        placeholder="You're Ganesh, Founder of The Squirrel which is an AI automation agency..."
                        rows={4}
                      />
                      {errors.bot_identity && (
                        <p className="text-red-400 text-sm font-medium">
                          {errors.bot_identity.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-neutral-300 flex items-center space-x-2">
                        <Hash className="w-4 h-4" />
                        <span>Background Context</span>
                        <span className="text-red-400">*</span>
                      </Label>
                      <Textarea
                        {...register("Back_context")}
                        className="bg-neutral-800/50 border-neutral-700/50 text-white placeholder-neutral-500 focus:border-white/50 focus:ring-white/20 rounded-xl min-h-[140px] resize-none"
                        placeholder="Ganesh is the founder of The Squirrel, a tech company that builds smart AI automations..."
                        rows={6}
                      />
                      {errors.Back_context && (
                        <p className="text-red-400 text-sm font-medium">
                          {errors.Back_context.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-neutral-300 flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Role</span>
                        <span className="text-red-400">*</span>
                      </Label>
                      <Textarea
                        {...register("Role")}
                        className="bg-neutral-800/50 border-neutral-700/50 text-white placeholder-neutral-500 focus:border-white/50 focus:ring-white/20 rounded-xl min-h-[100px] resize-none"
                        placeholder="When someone messages 'Automation,' thank them, introduce Me briefly..."
                        rows={4}
                      />
                      {errors.Role && (
                        <p className="text-red-400 text-sm font-medium">
                          {errors.Role.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-neutral-300 flex items-center space-x-2">
                        <Workflow className="w-4 h-4" />
                        <span>Conversation Flow</span>
                        <span className="text-red-400">*</span>
                      </Label>
                      <Textarea
                        {...register("Conversation_Flow")}
                        className="bg-neutral-800/50 border-neutral-700/50 text-white placeholder-neutral-500 focus:border-white/50 focus:ring-white/20 rounded-xl min-h-[200px] resize-none"
                        placeholder="User messages 'Automation' ➡️ Thank them for reaching out..."
                        rows={8}
                      />
                      {errors.Conversation_Flow && (
                        <p className="text-red-400 text-sm font-medium">
                          {errors.Conversation_Flow.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-900/20 border border-red-500/30 rounded-xl p-4"
                  >
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </motion.div>
                )}

                {/* Submit button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex space-x-4 pt-6"
                >
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r py-7 from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Update Profile</span>
                      </>
                    )}
                  </Button>

                  <Link
                    href="/profile"
                    className="bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 text-white font-medium py-4 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2"
                  >
                    <span>Cancel</span>
                  </Link>
                </motion.div>
              </form>
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
    </div>
  );
}
