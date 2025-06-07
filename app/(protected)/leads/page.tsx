"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MobileNav } from "@/components/global/mobile-nav";
import { Sidebar } from "@/components/global/sidebar";
import ComingSoon from "@/components/global/ComingSoon"; // Import the new component
import ComingSoonSkeleton from "@/components/ComingSoonSkeleton";
import { cn } from "@/lib/utils";

export default function Leads() {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);
    const hasHydrated = useAuthStore((state) => state.hasHydrated);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleSidebarToggle = (collapsed: boolean) => {
        setSidebarCollapsed(collapsed);
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
                    toast.error("API Error");
                    console.error("API error:", res.status);
                    return;
                }

                const data = await res.json();
                setUser(data.company);
                setLoading(false);
            } catch (err) {
                toast.error("Network Error: " + err);
                console.error("Network error:", err);
                router.push("/login");
            }
        };

        fetchUser();
    }, [token, router, hasHydrated]);

    if (!hasHydrated || loading) {
        return <ComingSoonSkeleton />;
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-slate-100 flex">
            <Sidebar user={user} onToggle={handleSidebarToggle} />
            <div
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300",
                    sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
                )}
            >
                <MobileNav />
                <main className="flex-1 px-4 py-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    <ComingSoon />
                </main>
            </div>
        </div>
    );
}