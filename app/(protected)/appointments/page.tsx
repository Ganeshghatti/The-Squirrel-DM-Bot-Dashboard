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
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Phone,
  Clock,
  TrendingUp,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface Appointment {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  startTime: string;
  endTime: string;
  service: string;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export default function Appointments() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

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

        const appointmentsRes = await fetch(`/api/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!appointmentsRes.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const appointmentsData = await appointmentsRes.json();
        setAppointments(appointmentsData);
        setLoading(false);
      } catch (err) {
        toast.error("Unable to connect. Please check your connection.");
        console.error("Network error:", err);
        router.push("/login");
      }
    };

    fetchUser();
  }, [token, router, hasHydrated]);
  // Filter appointments based on search term and filters
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appointment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      appointment.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    const matchesService =
      serviceFilter === "all" || appointment.service === serviceFilter;

    const matchesDate = (() => {
      if (dateFilter === "all") return true;

      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      const monthFromNow = new Date(today);
      monthFromNow.setMonth(monthFromNow.getMonth() + 1);

      switch (dateFilter) {
        case "today":
          return appointmentDate.toDateString() === today.toDateString();
        case "tomorrow":
          return appointmentDate.toDateString() === tomorrow.toDateString();
        case "this-week":
          return appointmentDate >= today && appointmentDate <= weekFromNow;
        case "this-month":
          return appointmentDate >= today && appointmentDate <= monthFromNow;
        case "past":
          return appointmentDate < today;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesService && matchesDate;
  });

  // Get unique services for filter dropdown
  const uniqueServices = Array.from(
    new Set(appointments.map((appointment) => appointment.service))
  );

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all");
    setServiceFilter("all");
    setDateFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters =
    statusFilter !== "all" ||
    serviceFilter !== "all" ||
    dateFilter !== "all" ||
    searchTerm !== "";

  // Pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-500/30";
      case "confirmed":
        return "bg-green-600/20 text-green-400 border-green-500/30";
      case "cancelled":
        return "bg-red-600/20 text-red-400 border-red-500/30";
      default:
        return "bg-neutral-600/20 text-neutral-400 border-neutral-500/30";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExport = () => {
    // Create CSV header
    const headers = [
      "Name",
      "Date",
      "Start Time",
      "End Time",
      "Service",
      "Email",
      "Phone",
      "Status",
      "Notes",
    ];

    // Create CSV rows
    const rows = appointments.map((appointment) => [
      appointment.name,
      formatDate(appointment.date),
      formatTime(appointment.startTime),
      formatTime(appointment.endTime),
      appointment.service,
      appointment.email || "",
      appointment.phone,
      appointment.status,
      appointment.notes || "",
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `appointments_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading state
  if (!hasHydrated || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/10 via-neutral-950 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-neutral-800/5 via-transparent to-transparent" />
        </div>

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
                        className="h-16 w-full bg-neutral-800/60"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex relative overflow-hidden selection:bg-white/10"
      role="application"
      aria-label="Appointments Management"
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
        </div>{" "}
      </div>
      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-out relative",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64",
          isTransitioning && "transition-transform"
        )}
      >
        {/* Mobile navigation */}
        <div className="lg:hidden">
          <MobileNav />
        </div>
        {/* Main content */}
        <main
          className="flex-1 relative pt-16 lg:pt-0"
          role="main"
          aria-label="Appointments Content"
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
                    Appointments
                  </h1>
                  <p className="text-neutral-400 text-lg font-medium">
                    Track and manage your appointments efficiently
                  </p>
                </div>
              </motion.div>
              {/* Elegant divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-800/30 to-transparent" />
            </div>

            {/* Appointments Table Container */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-neutral-900/40 backdrop-blur-3xl border border-neutral-800/30 rounded-3xl shadow-2xl shadow-black/25 overflow-hidden"
            >
              {/* Table Header */}{" "}
              <div className="p-6 border-b border-neutral-800/30">
                {" "}
                <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">
                      Recent Appointments
                    </h2>
                    <p className="text-neutral-400 text-sm font-medium">
                      {filteredAppointments.length} appointments found
                    </p>
                  </div>

                  <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <Input
                        placeholder="Search appointments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-neutral-800/50 border-neutral-700/50 text-white placeholder-neutral-500 focus:border-white/50 focus:ring-white/20 rounded-xl h-11 w-full sm:w-64"
                      />
                    </div>{" "}
                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className={cn(
                              "border border-neutral-700/50 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 flex-1 sm:flex-none justify-center",
                              hasActiveFilters
                                ? "bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30 text-blue-400"
                                : "bg-neutral-800/60 hover:bg-neutral-700/60 text-white"
                            )}
                          >
                            <Filter className="w-4 h-4" />
                            <span className="hidden sm:inline">Filter</span>
                            {hasActiveFilters && (
                              <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {
                                  [
                                    statusFilter !== "all",
                                    serviceFilter !== "all",
                                    dateFilter !== "all",
                                    searchTerm !== "",
                                  ].filter(Boolean).length
                                }
                              </span>
                            )}
                          </Button>
                        </DropdownMenuTrigger>{" "}
                        <DropdownMenuContent className="w-80 max-h-[32rem] bg-neutral-900/95 backdrop-blur-3xl border border-neutral-800/50 rounded-2xl shadow-2xl shadow-black/40 text-white p-0 overflow-hidden flex flex-col">
                          {/* Header */}
                          <div className="relative px-6 py-4 bg-gradient-to-r from-neutral-800/20 via-neutral-700/10 to-neutral-800/20 border-b border-neutral-800/30 flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-50" />
                            <div className="relative">
                              <DropdownMenuLabel className="text-neutral-300 text-sm font-semibold tracking-wide flex items-center space-x-2">
                                <Filter className="w-4 h-4 text-blue-400" />
                                <span>Filter Options</span>
                              </DropdownMenuLabel>
                              <p className="text-xs text-neutral-500 mt-1">
                                Refine your appointment search
                              </p>
                            </div>
                          </div>

                          {/* Scrollable Content Area */}
                          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-neutral-800/20 scrollbar-thumb-neutral-600/50 hover:scrollbar-thumb-neutral-500/50">
                            <div className="p-4 space-y-6">
                              {/* Status Filter */}
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2 px-2">
                                  <div className="w-1 h-4 bg-gradient-to-b from-green-500 to-yellow-500 rounded-full" />
                                  <p className="text-sm font-semibold text-neutral-200">
                                    Status
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  {[
                                    "all",
                                    "pending",
                                    "confirmed",
                                    "cancelled",
                                  ].map((status) => (
                                    <DropdownMenuItem
                                      key={status}
                                      onClick={() =>
                                        setStatusFilter(
                                          statusFilter === status
                                            ? "all"
                                            : status
                                        )
                                      }
                                      className={cn(
                                        "cursor-pointer rounded-xl px-4 py-3 text-sm transition-all duration-200 border",
                                        statusFilter === status
                                          ? "bg-gradient-to-r from-blue-600/30 to-purple-600/20 text-blue-300 border-blue-500/30 shadow-lg shadow-blue-500/10"
                                          : "text-neutral-300 hover:bg-neutral-800/40 border-transparent hover:border-neutral-700/50 hover:shadow-md"
                                      )}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                          {status === "all"
                                            ? "All Status"
                                            : status.charAt(0).toUpperCase() +
                                              status.slice(1)}
                                        </span>
                                        {statusFilter === status && (
                                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                        )}
                                      </div>
                                    </DropdownMenuItem>
                                  ))}
                                </div>
                              </div>

                              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-800/50 to-transparent" />

                              {/* Service Filter */}
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2 px-2">
                                  <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                                  <p className="text-sm font-semibold text-neutral-200">
                                    Service
                                  </p>
                                </div>
                                <div className="space-y-1 max-h-36 overflow-y-auto scrollbar-thin scrollbar-track-neutral-800/20 scrollbar-thumb-neutral-600/50 hover:scrollbar-thumb-neutral-500/50">
                                  {" "}
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setServiceFilter(
                                        serviceFilter === "all" ? "all" : "all"
                                      )
                                    }
                                    className={cn(
                                      "cursor-pointer rounded-xl  px-4 py-3 text-sm transition-all duration-200 border",
                                      serviceFilter === "all"
                                        ? "bg-gradient-to-r from-blue-600/30 to-purple-600/20 text-blue-300 border-blue-500/30 shadow-lg shadow-blue-500/10"
                                        : "text-neutral-300 hover:bg-neutral-800/40 border-transparent hover:border-neutral-700/50 hover:shadow-md"
                                    )}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">
                                        All Services
                                      </span>
                                      {serviceFilter === "all" && (
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                      )}
                                    </div>
                                  </DropdownMenuItem>
                                  {uniqueServices.map((service) => (
                                    <DropdownMenuItem
                                      key={service}
                                      onClick={() =>
                                        setServiceFilter(
                                          serviceFilter === service
                                            ? "all"
                                            : service
                                        )
                                      }
                                      className={cn(
                                        "cursor-pointer rounded-xl px-4 py-3 text-sm transition-all duration-200 border",
                                        serviceFilter === service
                                          ? "bg-gradient-to-r from-blue-600/30 to-purple-600/20 text-blue-300 border-blue-500/30 shadow-lg shadow-blue-500/10"
                                          : "text-neutral-300 hover:bg-neutral-800/40 border-transparent hover:border-neutral-700/50 hover:shadow-md"
                                      )}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium truncate">
                                          {service}
                                        </span>
                                        {serviceFilter === service && (
                                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse ml-2 flex-shrink-0" />
                                        )}
                                      </div>
                                    </DropdownMenuItem>
                                  ))}
                                </div>
                              </div>

                              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-800/50 to-transparent" />

                              {/* Date Filter */}
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2 px-2">
                                  <div className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                                  <p className="text-sm font-semibold text-neutral-200">
                                    Date Range
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  {[
                                    {
                                      value: "all",
                                      label: "All Dates",
                                      icon: Calendar,
                                    },
                                    {
                                      value: "today",
                                      label: "Today",
                                      icon: Clock,
                                    },
                                    {
                                      value: "tomorrow",
                                      label: "Tomorrow",
                                      icon: TrendingUp,
                                    },
                                    {
                                      value: "this-week",
                                      label: "This Week",
                                      icon: Calendar,
                                    },
                                    {
                                      value: "this-month",
                                      label: "This Month",
                                      icon: Calendar,
                                    },
                                    {
                                      value: "past",
                                      label: "Past Appointments",
                                      icon: Clock,
                                    },
                                  ].map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                      <DropdownMenuItem
                                        key={option.value}
                                        onClick={() =>
                                          setDateFilter(
                                            dateFilter === option.value
                                              ? "all"
                                              : option.value
                                          )
                                        }
                                        className={cn(
                                          "cursor-pointer rounded-xl px-4 py-3 text-sm transition-all duration-200 border",
                                          dateFilter === option.value
                                            ? "bg-gradient-to-r from-blue-600/30 to-purple-600/20 text-blue-300 border-blue-500/30 shadow-lg shadow-blue-500/10"
                                            : "text-neutral-300 hover:bg-neutral-800/40 border-transparent hover:border-neutral-700/50 hover:shadow-md"
                                        )}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-3">
                                            <IconComponent className="w-4 h-4 text-neutral-400" />
                                            <span className="font-medium">
                                              {option.label}
                                            </span>
                                          </div>
                                          {dateFilter === option.value && (
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                          )}
                                        </div>
                                      </DropdownMenuItem>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Clear Filters Button */}
                              {hasActiveFilters && (
                                <>
                                  <div className="w-full h-px bg-gradient-to-r from-transparent via-red-800/30 to-transparent" />
                                  <DropdownMenuItem
                                    onClick={clearFilters}
                                    className="cursor-pointer rounded-xl px-4 py-3 text-sm bg-gradient-to-r from-red-600/20 to-red-500/10 hover:from-red-600/30 hover:to-red-500/20 text-red-300 border border-red-500/20 hover:border-red-500/30 transition-all duration-200 shadow-lg hover:shadow-red-500/10"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <X className="w-4 h-4" />
                                      <span className="font-semibold">
                                        Clear All Filters
                                      </span>
                                    </div>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="px-6 py-3 bg-gradient-to-r from-neutral-800/10 via-neutral-700/5 to-neutral-800/10 border-t border-neutral-800/30 flex-shrink-0">
                            <p className="text-xs text-neutral-500 text-center">
                              {filteredAppointments.length} appointments match
                              your filters
                            </p>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        onClick={handleExport}
                        className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 flex-1 sm:flex-none justify-center"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export</span>
                      </Button>
                    </div>
                  </div>
                </div>{" "}
              </div>{" "}
              {/* Table */}
              <div className="relative">
                {/* Mobile Card Layout (for screens < 640px) */}
                <div className="block sm:hidden space-y-4">
                  {currentAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-4 space-y-3"
                    >
                      {/* Header with name and status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
                            <span className="text-blue-400 font-semibold text-sm">
                              {appointment.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">
                              {appointment.name}
                            </p>
                            <p className="text-neutral-400 text-xs">
                              #{indexOfFirstAppointment + index + 1}
                            </p>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "px-2 py-1 rounded-full text-xs border inline-block",
                            getStatusColor(appointment.status)
                          )}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-neutral-500" />
                        <span className="text-sm text-neutral-300">
                          {formatDate(appointment.date)} at{" "}
                          {formatTime(appointment.startTime)} -{" "}
                          {formatTime(appointment.endTime)}
                        </span>
                      </div>

                      {/* Service */}
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-neutral-500" />
                        <span className="text-sm text-neutral-300">
                          {appointment.service}
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2">
                        {appointment.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-neutral-500" />
                            <span className="text-sm text-neutral-300">
                              {appointment.email}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-neutral-500" />
                          <span className="text-sm text-neutral-300">
                            {appointment.phone}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Desktop/Tablet Table Layout (for screens >= 640px) */}
                <div className="hidden sm:block">
                  {/* Scroll indicator for tablet */}
                  <div className="block md:hidden absolute top-2 right-2 z-10 bg-neutral-800/80 text-neutral-400 text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                    Scroll →
                  </div>
                  <div className="overflow-x-auto table-scroll scrollbar-thin scrollbar-track-neutral-800/20 scrollbar-thumb-neutral-700/50 hover:scrollbar-thumb-neutral-600/50 rounded-xl">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-neutral-800/20">
                        <tr>
                          <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider min-w-[60px]">
                            #
                          </th>
                          <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider min-w-[200px]">
                            Name
                          </th>
                          <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider min-w-[180px]">
                            Date & Time
                          </th>
                          <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider min-w-[150px]">
                            Service
                          </th>
                          <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider min-w-[200px]">
                            Contact
                          </th>
                          <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider min-w-[120px]">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/20">
                        {currentAppointments.map((appointment, index) => (
                          <motion.tr
                            key={appointment._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="hover:bg-neutral-800/20 transition-colors duration-200 group"
                          >
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-neutral-400">
                                {indexOfFirstAppointment + index + 1}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-blue-500/30 flex-shrink-0">
                                  <span className="text-blue-400 font-semibold text-sm">
                                    {appointment.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-white truncate">
                                    {appointment.name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                                  <span className="text-sm text-neutral-300">
                                    {formatDate(appointment.date)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                                  <span className="text-sm text-neutral-300">
                                    {formatTime(appointment.startTime)}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                                <span className="text-sm text-neutral-300 truncate">
                                  {appointment.service}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col space-y-1">
                                {appointment.email && (
                                  <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                                    <span className="text-sm text-neutral-300 truncate max-w-[150px]">
                                      {appointment.email}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-2">
                                  <Phone className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                                  <span className="text-sm text-neutral-300">
                                    {appointment.phone}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <div
                                className={cn(
                                  "px-3 py-1 rounded-full text-sm border inline-block",
                                  getStatusColor(appointment.status)
                                )}
                              >
                                {appointment.status.charAt(0).toUpperCase() +
                                  appointment.status.slice(1)}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-neutral-800/30">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <p className="text-sm text-neutral-400 text-center sm:text-left">
                      Showing {indexOfFirstAppointment + 1} to{" "}
                      {Math.min(
                        indexOfLastAppointment,
                        filteredAppointments.length
                      )}{" "}
                      of {filteredAppointments.length} results
                    </p>
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2 overflow-x-auto">
                      <Button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="bg-neutral-800/60 hover:bg-neutral-700/60 border border-neutral-700/50 text-white p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      <div className="flex items-center space-x-1 sm:space-x-2 max-w-[200px] sm:max-w-none overflow-x-auto">
                        {[...Array(totalPages)].map((_, index) => (
                          <Button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={cn(
                              "px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-shrink-0",
                              currentPage === index + 1
                                ? "bg-blue-600/30 border border-blue-500/50 text-blue-400"
                                : "bg-neutral-800/60 hover:bg-neutral-700/60 border border-neutral-700/50 text-white"
                            )}
                          >
                            {index + 1}
                          </Button>
                        ))}
                      </div>

                      <Button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="bg-neutral-800/60 hover:bg-neutral-700/60 border border-neutral-700/50 text-white p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
