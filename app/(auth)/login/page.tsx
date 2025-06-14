"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Instagram,
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(100, "Password must be 100 characters or less"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const email = watch("email");

  useEffect(() => {
    if (hasHydrated && token) {
      router.push("/");
    }
  }, [hasHydrated, token, router]);

  const onSubmit = async (data: LoginForm) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();

      if (!res.ok) {
        toast.error("Login Failed");
        setError(response.error || "Login failed");
        setLoading(false);
        return;
      }
      toast.success("Login Successful");
      setToken(response.token);
      router.push("/");
    } catch (err: any) {
      toast.error("Something went wrong");
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="bg-neutral-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-center mb-8">
              <Skeleton className="h-12 w-12 rounded-2xl bg-neutral-800/60 mr-4" />
              <Skeleton className="h-8 w-40 bg-neutral-800/60" />
            </div>
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-24 bg-neutral-800/60" />
                  <Skeleton className="h-12 w-full bg-neutral-800/60" />
                </div>
              ))}
            </div>
            <Skeleton className="h-12 w-full bg-neutral-800/60 mt-8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/20 via-neutral-950 to-black" />
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-white/[0.02] to-transparent rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-neutral-700/10 to-transparent rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "6s", animationDelay: "2s" }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Main Form Container */}
          <div className="bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800/30 rounded-3xl p-8 shadow-2xl shadow-black/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-neutral-400 leading-relaxed">
                Sign in to continue your Instagram automation journey
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Social Login Options */}
              <div className="space-y-3"></div>

              {/* Form Fields */}
              <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-neutral-300 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </Label>
                  <div className="relative">
                    <Input
                      {...register("email")}
                      type="email"
                      className="h-12 px-4 bg-neutral-800/30 border border-neutral-700/50 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all text-sm"
                      placeholder="your.email@company.com"
                    />
                    {email && !errors.email && (
                      <CheckCircle2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-400 flex items-center space-x-2 animate-in slide-in-from-left-2 duration-200">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-neutral-300 flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Password</span>
                  </Label>
                  <div className="relative">
                    <Input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      className="h-12 px-4 pr-12 bg-neutral-800/30 border border-neutral-700/50 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all text-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-400 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password.message}</span>
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-neutral-400 hover:text-white transition-colors underline underline-offset-2"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-in slide-in-from-bottom-2 duration-300">
                  <p className="text-red-400 text-sm flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center space-x-2 px-8 py-3 bg-white hover:bg-neutral-100 disabled:bg-neutral-700 text-neutral-950 font-medium rounded-xl transition-all duration-200 shadow-lg shadow-white/10 hover:shadow-white/20 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              {/* Signup Link */}
              <div className="text-center pt-4 border-t border-neutral-800/30">
                <p className="text-sm text-neutral-400">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-white hover:text-neutral-300 font-medium transition-colors underline underline-offset-2"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-neutral-500 text-xs">
            <p>© 2024 Insta Bot. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
