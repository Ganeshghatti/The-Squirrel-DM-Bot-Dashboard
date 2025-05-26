'use client'

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export function BotStatus() {
  const token = useAuthStore((state) => state.token);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyStatus = async () => {
      try {
        const res = await fetch('/api/company', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Company API error:", res.status);
          return;
        }

        const data = await res.json();
        if (data.success && data.company) {
          setIsActive(data.company.isBotActive);
        }
      } catch (err) {
        console.error("Network error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCompanyStatus();
    }
  }, [token]);

  if (loading) {
    return <div className="h-6 w-24 bg-zinc-800 rounded animate-pulse"></div>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
      <span className="text-sm font-medium">
        {isActive ? 'Bot Active' : 'Bot Inactive'}
      </span>
    </div>
  );
}