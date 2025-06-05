'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(5, 'Password must be at least 8 characters').max(100, 'Password must be 100 characters or less'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const [showSignupNotice, setShowSignupNotice] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (hasHydrated && token) {
      router.push('/');
    }
  }, [hasHydrated, token, router]);

  const onSubmit = async (data: LoginForm) => {

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const response = await res.json();

      if (!res.ok) {
        toast.error("Login Failed")
        setError(response.error || 'Login failed');
        setLoading(false);
        return;
      }
      toast.success("Login Successfull")
      setToken(response.token);
      router.push('/');
    } catch (err:any) {
      toast.error("Something Went Wrong " + err)
      setError('Something went wrong '+ err);
      setLoading(false);
    }
  };

  if (!hasHydrated || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-slate-100 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl bg-zinc-900/60 border border-blue-900/30 rounded-xl p-10 backdrop-blur-sm animate-fade-in">
          <Skeleton className="h-8 w-64 mb-8 bg-zinc-800/60" />
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-zinc-800/60" />
                <Skeleton className="h-10 w-full bg-zinc-800/60" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-zinc-800/60" />
                <Skeleton className="h-10 w-full bg-zinc-800/60" />
              </div>
            </div>
            <Skeleton className="h-12 w-full bg-zinc-800/60" />
            <Skeleton className="h-4 w-40 mx-auto bg-zinc-800/60" />
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className={`$ min-h-screen bg-zinc-950 text-slate-100 flex items-center justify-center px-4 py-8`}>
      {showSignupNotice && (
  <div className={`fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4 ${showSignupNotice ? 'block backdrop-blur-sm' : 'hidden'}`}>
    <div className="bg-zinc-900 border border-blue-900/30 rounded-xl p-6 max-w-md text-center space-y-4 shadow-lg">
      <h3 className="text-xl font-semibold text-white">Sign-Up Unavailable</h3>
      <p className="text-sm text-slate-300">
        We're currently fixing an issue with the sign-up process. Meanwhile, if you'd like to try our product, please feel free to reach out to us.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="https://smartinsta.thesquirrel.tech/#contact"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
        >
          Contact Us
        </Link>
        <button
          onClick={() => setShowSignupNotice(false)}
          className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      <div className="w-full max-w-3xl bg-zinc-900/60 border border-blue-900/30 rounded-xl p-10 backdrop-blur-sm animate-fade-in">
        <h2 className="text-3xl font-display font-medium text-white mb-8 tracking-tight">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label className="block text-sm font-medium text-slate-200 mb-2">Email</Label>
              <Input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2 bg-zinc-800/50 border border-blue-900/30 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label className="block text-sm font-medium text-slate-200 mb-2">Password</Label>
              <Input
                {...register('password')}
                type="password"
                className="w-full px-4 py-2 bg-zinc-800/50 border border-blue-900/30 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-md p-3">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

      </div>
    </div>
  );
}