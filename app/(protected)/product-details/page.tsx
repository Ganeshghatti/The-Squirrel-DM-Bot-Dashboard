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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Upload,
  FileText,
  Image,
  File,
  Brain,
  Zap,
  Search,
  Trash2,
  Download,
  Eye,
  Plus,
  Database,
  BookOpen,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";

// Dummy uploaded files data
const uploadedFiles = [
  {
    id: 1,
    name: "Product_Catalog_2024.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    status: "Processed",
    content:
      "Complete product catalog with specifications, pricing, and descriptions",
    icon: FileText,
    color: "red",
  },
  {
    id: 2,
    name: "Brand_Guidelines.pdf",
    type: "PDF",
    size: "1.8 MB",
    uploadDate: "2024-01-14",
    status: "Processing",
    content:
      "Brand guidelines, logo usage, color schemes, and design principles",
    icon: FileText,
    color: "red",
  },
  {
    id: 3,
    name: "Product_Images.zip",
    type: "Images",
    size: "15.6 MB",
    uploadDate: "2024-01-13",
    status: "Processed",
    content: "High-resolution product images for all catalog items",
    icon: Image,
    color: "blue",
  },
  {
    id: 4,
    name: "FAQ_Document.txt",
    type: "Text",
    size: "245 KB",
    uploadDate: "2024-01-12",
    status: "Processed",
    content: "Frequently asked questions and detailed answers",
    icon: FileText,
    color: "green",
  },
  {
    id: 5,
    name: "Technical_Specs.xlsx",
    type: "Spreadsheet",
    size: "890 KB",
    uploadDate: "2024-01-11",
    status: "Failed",
    content: "Technical specifications and compatibility matrix",
    icon: File,
    color: "orange",
  },
];

export default function ProductDetails() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [savedProductDetails, setSavedProductDetails] = useState<any[]>([]);
  const [loadingProductDetails, setLoadingProductDetails] = useState(false);

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
  // Fetch saved product details
  const fetchProductDetails = async () => {
    if (!user?.company_instagram_id) return;

    setLoadingProductDetails(true);
    try {
      const response = await fetch(
        `/api/product-details?company_instagram_id=${encodeURIComponent(
          user.company_instagram_id
        )}&limit=10&sortOrder=desc`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }

      const data = await response.json();
      setSavedProductDetails(data.data || []);

      // Auto-load the most recent content into textarea if it exists and textarea is empty
      if (data.data && data.data.length > 0 && !textInput.trim()) {
        setTextInput(data.data[0].text_content);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Failed to load saved product details");
    } finally {
      setLoadingProductDetails(false);
    }
  };

  // Fetch product details when user is loaded
  useEffect(() => {
    if (user?.company_instagram_id) {
      fetchProductDetails();
    }
  }, [user]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Extract text from PDF using server-side API
  const extractTextFromPDF = async (file: File) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract PDF text");
      }

      const data = await response.json();

      // Add extracted text to textarea
      const newContent = textInput
        ? `${textInput}\n\n--- Content from ${file.name} ---\n${data.text}`
        : `--- Content from ${file.name} ---\n${data.text}`;

      setTextInput(newContent);
      toast.success(`Text extracted from "${file.name}"`);
    } catch (error) {
      console.error("Error extracting PDF text:", error);
      toast.error("Failed to extract text from PDF");
    } finally {
      setIsProcessing(false);
    }
  };
  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(async (file) => {
      if (file.type === "application/pdf") {
        await extractTextFromPDF(file);
      } else {
        toast.success(`File "${file.name}" uploaded successfully!`);
      }
    });
  };
  const sendTextToWebhook = async () => {
    if (!textInput.trim()) {
      toast.error("Please enter some text content");
      return;
    }

    if (!user?.company_instagram_id) {
      toast.error("User not authenticated or missing Instagram ID");
      return;
    }

    setIsSending(true);
    try {
      // First, save to our database
      const saveResponse = await fetch("/api/product-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_instagram_id: user.company_instagram_id,
          text_content: textInput.trim(),
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || "Failed to save product details");
      }

      const savedData = await saveResponse.json();

      // Then send to webhook
      const webhookResponse = await fetch(
        "https://n8n.srv833013.hstgr.cloud/webhook/db8862e2-a3f1-4bfc-b18d-37279febf0a2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: textInput,
            company_id: user.company_id,
            company_instagram_id: user.company_instagram_id,
            product_details_id: savedData.data.id,
          }),
        }
      );

      if (!webhookResponse.ok) {
        console.warn("Webhook failed, but data was saved successfully");
      }
      toast.success("Product details saved successfully! Content updated.");
      // Don't clear the textarea - keep showing the current content
      fetchProductDetails(); // Refresh the list
    } catch (error: any) {
      console.error("Error processing product details:", error);
      toast.error(
        error.message || "Failed to process content. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processed":
        return "bg-green-600/20 text-green-400 border-green-500/30";
      case "processing":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-500/30";
      case "failed":
        return "bg-red-600/20 text-red-400 border-red-500/30";
      default:
        return "bg-neutral-600/20 text-neutral-400 border-neutral-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processed":
        return <CheckCircle className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredFiles = uploadedFiles.filter(
    (file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-64 bg-neutral-800/60 rounded-3xl" />
                <Skeleton className="h-64 bg-neutral-800/60 rounded-3xl" />
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
      aria-label="Product Details Management"
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
        {" "}
        {/* Mobile navigation */}
        <div className="lg:hidden">
          <MobileNav />
        </div>
        {/* Main content */}
        <main
          className="flex-1 relative pt-16 lg:pt-0"
          role="main"
          aria-label="Product Details Content"
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
                    Product Details
                  </h1>
                  <p className="text-neutral-400 text-lg font-medium">
                    Upload and manage your product information for intelligent
                    bot responses
                  </p>
                </div>
              </motion.div>

              {/* Elegant divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-800/30 to-transparent" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1  gap-8 mb-8">
              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="bg-neutral-900/40 backdrop-blur-3xl border border-neutral-800/30 rounded-3xl p-8 shadow-2xl shadow-black/25"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30">
                    <Upload className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Upload Content
                  </h2>
                </div>

                {/* File Upload Area - Update this section */}

                {/* Text Input Section */}
                <div className="mt-6">
                  {" "}
                  <Textarea
                    placeholder={
                      savedProductDetails.length > 0
                        ? "Edit your current product details or add new content..."
                        : "Enter product descriptions, FAQs, or any relevant information..."
                    }
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="bg-neutral-800/50 border-neutral-700/50 text-white placeholder-neutral-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl min-h-32 resize-none"
                  />{" "}
                  <Button
                    onClick={sendTextToWebhook}
                    className="mt-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl transition-all duration-200"
                    disabled={!textInput.trim() || isSending}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {isSending
                      ? "Saving..."
                      : savedProductDetails.length > 0
                      ? "Update Content"
                      : "Add Content"}
                  </Button>{" "}
                </div>
              </motion.div>

              {/* Saved Product Details Section */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="bg-neutral-900/40 backdrop-blur-3xl border border-neutral-800/30 rounded-3xl p-8 shadow-2xl shadow-black/25"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl border border-purple-500/30">
                      <Database className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Saved Product Details
                    </h2>
                  </div>
                  <Button
                    onClick={fetchProductDetails}
                    variant="outline"
                    size="sm"
                    className="border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600"
                    disabled={loadingProductDetails}
                  >
                    {loadingProductDetails ? (
                      <Clock className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {loadingProductDetails ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-neutral-800/30 rounded-xl p-4">
                        <Skeleton className="h-4 w-3/4 mb-2 bg-neutral-700/50" />
                        <Skeleton className="h-3 w-1/2 bg-neutral-700/50" />
                      </div>
                    ))}
                  </div>
                ) : savedProductDetails.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {savedProductDetails.map((detail, index) => (
                      <div
                        key={detail._id}
                        className="bg-neutral-800/30 border border-neutral-700/30 rounded-xl p-4 hover:bg-neutral-800/40 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-neutral-400">
                              Entry #{savedProductDetails.length - index}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-500">
                            {new Date(detail.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-white text-sm leading-relaxed line-clamp-3">
                          {detail.text_content}
                        </p>
                        <div className="mt-3 flex items-center space-x-2">
                          <Button
                            onClick={() => setTextInput(detail.text_content)}
                            variant="outline"
                            size="sm"
                            className="text-xs border-emerald-600/30 text-emerald-400 hover:bg-emerald-600/10"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Load
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                    <p className="text-neutral-500">
                      No product details saved yet
                    </p>
                    <p className="text-neutral-600 text-sm">
                      Add some content above to get started
                    </p>
                  </div>
                )}
              </motion.div>
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
