'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from '../../components/global/sidebar';
import { MobileNav } from '../../components/global/mobile-nav';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FAQ {
  question: string;
  answer: string;
}

interface Company {
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
}

export default function CompanyProfile() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  useEffect(() => {
    if (!hasHydrated) return;

    const fetchCompany = async () => {
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/auth', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Failed to fetch profile');
          setLoading(false);
          toast.error('Failed to fetch profile');
          router.push('/login');
          return;
        }

        const data = await res.json();
        setCompany(data.company);
        setLoading(false);
      } catch (err) {
        toast.error('Network Error: ' + err);
        console.error('Network error:', err);
        setError('Something went wrong');
        setLoading(false);
        router.push('/login');
      }
    };

    fetchCompany();
  }, [token, router, hasHydrated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-slate-100 flex overflow-x-hidden">
        <Sidebar user={company} onToggle={handleSidebarToggle} />
        <div
          className={cn(
            'flex-1 flex flex-col transition-all duration-300',
            sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
          )}
        >
          <MobileNav />
          <main className="flex-1 px-4 py-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="mt-6 space-y-6">
              <Skeleton className="h-8 w-64 bg-zinc-800/60" />
              <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-4 w-32 bg-zinc-800/60" />
                      <Skeleton className="h-6 w-full bg-zinc-800/60" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-6 backdrop-blur-sm">
                <Skeleton className="h-6 w-40 bg-zinc-800/60 mb-4" />
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="space-y-2 mb-4 last:mb-0">
                    <Skeleton className="h-5 w-3/4 bg-zinc-800/60" />
                    <Skeleton className="h-4 w-full bg-zinc-800/60" />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-slate-100 flex overflow-x-hidden">
        <Sidebar user={company} onToggle={handleSidebarToggle} />
        <div
          className={cn(
            'flex-1 flex flex-col transition-all duration-300',
            sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
          )}
        >
          <MobileNav />
          <main className="flex-1 px-4 py-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="mt-6">
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-md p-3">
                {error}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex overflow-x-hidden">
      <Sidebar user={company} onToggle={handleSidebarToggle} />
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        <MobileNav />
        <main className="flex-1 px-4 py-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 space-y-6"
          >
            <div className="w-full flex justify-between md:flex-row flex-col gap-6">
              <h2 className="text-3xl font-display font-medium text-white tracking-tight">
                Company Profile
              </h2>
              <div className="flex space-x-4 items-center">
                <Button
                  onClick={() => router.push('/settings')}
                  variant="default"
                  className="text-white"
                >
                  Update Company
                </Button>
                <Button
                  onClick={() => {
                    clearToken();
                  }}
                  variant="secondary"
                >
                  Logout
                </Button>
                {/* <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-rose-700 hover:bg-rose-800 text-white">
                      Delete Company
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-0 border-transparent">
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <Button
                      onClick={deleteAccount}
                      className="bg-rose-700 hover:bg-rose-800 text-white"
                    >
                      Delete Company
                    </Button>
                  </DialogContent>
                </Dialog> */}
              </div>
            </div>
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-6 backdrop-blur-sm"
            >
              <h3 className="text-xl font-medium text-white mb-4">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-400">Phone</p>
                  <p className="text-base text-white break-words">{company?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-base text-white break-words">{company?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Instagram ID</p>
                  <p className="text-base text-white break-words">{company?.company_instagram_id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Instagram Profile</p>
                  <p className="text-base text-white break-words">{company?.instagram_profile || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Name</p>
                  <p className="text-base text-white break-words">{company?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Bot Identity</p>
                  <p className="text-base text-white break-words">{company?.bot_identity}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Role</p>
                  <p className="text-base text-white break-words">{company?.Role}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-400">Background Context</p>
                  <p className="text-base text-white break-words">{company?.Back_context}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-400">Conversation Flow</p>
                  <p className="text-base text-white break-words">{company?.Conversation_Flow}</p>
                </div>
              </div>
            </motion.section>
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-6 backdrop-blur-sm"
            >
              <h3 className="text-xl font-medium text-white mb-4">FAQs</h3>
              {company?.FAQ && company.FAQ?.length > 0 ? (
                <div className="space-y-4">
                  {company.FAQ.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    >
                      <p className="text-base font-medium text-white break-words">{faq.question}</p>
                      <p className="text-sm text-slate-300 break-words">{faq.answer}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No FAQs available</p>
              )}
            </motion.section>
          </motion.div>
        </main>
      </div>
    </div>
  );
}