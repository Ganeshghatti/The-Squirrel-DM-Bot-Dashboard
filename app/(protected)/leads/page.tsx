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
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  UserPlus,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Dummy leads data
const leadsData = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, New York, NY 10001",
    source: "Instagram",
    status: "New",
    date: "2024-01-15",
    value: "$2,500",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    phone: "+1 (555) 234-5678",
    address: "456 Corporate St, Los Angeles, CA 90210",
    source: "Direct Message",
    status: "Qualified",
    date: "2024-01-14",
    value: "$5,200",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "m.chen@business.co",
    phone: "+1 (555) 345-6789",
    address: "789 Enterprise Blvd, Chicago, IL 60601",
    source: "Instagram",
    status: "Contacted",
    date: "2024-01-13",
    value: "$1,800",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily.r@startup.io",
    phone: "+1 (555) 456-7890",
    address: "321 Innovation Dr, Austin, TX 73301",
    source: "Story Mention",
    status: "New",
    date: "2024-01-12",
    value: "$3,400",
  },
  {
    id: 5,
    name: "David Thompson",
    email: "david.thompson@corp.net",
    phone: "+1 (555) 567-8901",
    address: "654 Commerce Way, Seattle, WA 98101",
    source: "Direct Message",
    status: "Qualified",
    date: "2024-01-11",
    value: "$4,100",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "l.anderson@enterprise.com",
    phone: "+1 (555) 678-9012",
    address: "987 Trade Center, Miami, FL 33101",
    source: "Instagram",
    status: "Converted",
    date: "2024-01-10",
    value: "$7,500",
  },
];

export default function Leads() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(5);

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

  // Filter leads based on search term
  const filteredLeads = leadsData.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-600/20 text-blue-400 border-blue-500/30";
      case "Qualified":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-500/30";
      case "Contacted":
        return "bg-purple-600/20 text-purple-400 border-purple-500/30";
      case "Converted":
        return "bg-green-600/20 text-green-400 border-green-500/30";
      default:
        return "bg-neutral-600/20 text-neutral-400 border-neutral-500/30";
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
      aria-label="Leads Management"
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
          aria-label="Leads Content"
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
                    Lead Management
                  </h1>
                  <p className="text-neutral-400 text-lg font-medium">
                    Track and manage your Instagram leads efficiently
                  </p>
                </div>
              </motion.div>
              {/* Elegant divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-800/30 to-transparent" />
            </div>

            {/* Leads Table Container */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-neutral-900/40 backdrop-blur-3xl border border-neutral-800/30 rounded-3xl shadow-2xl shadow-black/25 overflow-hidden"
            >
              {/* Table Header */}
              <div className="p-6 border-b border-neutral-800/30">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Recent Leads
                    </h2>
                    <p className="text-neutral-400 text-sm font-medium">
                      {filteredLeads.length} leads found
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <Input
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-neutral-800/50 border-neutral-700/50 text-white placeholder-neutral-500 focus:border-white/50 focus:ring-white/20 rounded-xl h-11 w-64"
                      />
                    </div>

                    {/* Action Buttons */}
                    <Button className="bg-neutral-800/60 hover:bg-neutral-700/60 border border-neutral-700/50 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </Button>

                    <Button className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-800/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/20">
                    {currentLeads.map((lead, index) => (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-neutral-800/20 transition-colors duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-neutral-400">
                            {indexOfFirstLead + index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
                              <span className="text-blue-400 font-semibold text-sm">
                                {lead.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {lead.name}
                              </p>
                              <p className="text-xs text-neutral-400">
                                {lead.source}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-neutral-500" />
                            <span className="text-sm text-neutral-300">
                              {lead.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-neutral-500" />
                            <span className="text-sm text-neutral-300">
                              {lead.phone}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-neutral-800/30">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-400">
                      Showing {indexOfFirstLead + 1} to{" "}
                      {Math.min(indexOfLastLead, filteredLeads.length)} of{" "}
                      {filteredLeads.length} results
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="bg-neutral-800/60 hover:bg-neutral-700/60 border border-neutral-700/50 text-white p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      {[...Array(totalPages)].map((_, index) => (
                        <Button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                            currentPage === index + 1
                              ? "bg-blue-600/30 border border-blue-500/50 text-blue-400"
                              : "bg-neutral-800/60 hover:bg-neutral-700/60 border border-neutral-700/50 text-white"
                          )}
                        >
                          {index + 1}
                        </Button>
                      ))}

                      <Button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="bg-neutral-800/60 hover:bg-neutral-700/60 border border-neutral-700/50 text-white p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
