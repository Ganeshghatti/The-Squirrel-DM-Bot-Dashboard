'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

// Define the Zod schema for the form, including the FAQ array
const UpdateCompanySchema = z.object({
  instagram_profile: z.string().min(1, 'Instagram profile is required'),
  phone: z.string().optional().or(z.literal('')),
  name: z.string().min(1, 'Company Name is required').max(100, 'Company Name must be 100 characters or less'),
  bot_identity: z.string().min(1, 'Bot Identity is required').max(600, 'Bot Identity must be 200 characters or less'),
  Back_context: z.string().min(1, 'Background Context is required').max(1000, 'Background Context must be 1000 characters or less'),
  Role: z.string().min(1, 'Role is required'),
  Conversation_Flow: z.string().min(1, 'Conversation Flow is required').max(1000, 'Conversation Flow must be 1000 characters or less'),
  FAQ: z.array(
    z.object({
      question: z.string().min(1, 'Question is required').max(500, 'Question must be 500 characters or less'),
      answer: z.string().min(1, 'Answer is required').max(1000, 'Answer must be 1000 characters or less'),
    })
  ).optional(),
});

type UpdateCompanyForm = z.infer<typeof UpdateCompanySchema>;

export default function UpdateCompanyPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<UpdateCompanyForm>({
    resolver: zodResolver(UpdateCompanySchema),
    defaultValues: {
      FAQ: [{ question: '', answer: '' }], // Initialize with one empty FAQ
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'FAQ',
  });

  useEffect(() => {
    if (!hasHydrated) {
      return
    }
    const fetchCompanyData = async (token: string) => {
      try {
        console.log("token ", token);
        const res = await fetch('/api/auth', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const response = await res.json();

        if (!res.ok) {
          setError(response.error || 'Failed to fetch company data');
          setLoading(false);
          return;
        }

        // Ensure FAQ array is included, even if empty
        reset({
          ...response.company,
          FAQ: response.company.FAQ?.length ? response.company.FAQ : [{ question: '', answer: '' }],
        });
        setLoading(false);
      } catch (err: any) {
        toast.error("Something went wrong " + err)
        setError('Something went wrong while fetching company data ' + err);
        setLoading(false);
      }
    };

    if (token) {
      fetchCompanyData(token);
    }
  }, [reset, token]);

  const onSubmit = async (data: UpdateCompanyForm) => {
    if (!hasHydrated) {
      return
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const response = await res.json();

      if (!res.ok) {
        toast.error("Update Failed");
        setError(response.error || 'Update failed');
        setLoading(false);
        return;
      }
      toast.success("Company Profile Updated");
      router.push('/profile');
    } catch (err) {
      toast.error("Update Failed");
      setError('Something went wrong');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-slate-100 flex items-center 
      justify-center px-4 py-8">
        <div className="w-full max-w-4xl bg-zinc-900/60 border border-blue-900/30 
        rounded-xl p-10 backdrop-blur-sm animate-fade-in">
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex items-center 
    justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-zinc-900/60 border border-blue-900/30 rounded-xl 
      p-4 md:p-10 backdrop-blur-sm animate-fade-in">
        <h2 className="text-3xl font-display font-medium text-white mb-8 tracking-tight">
          Update Company Profile
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium text-slate-200 mb-2">
                Company Name
              </Label>
              <Input
                {...register('name')}
                className="w-full px-4 py-2 bg-zinc-800/50 border border-blue-900/30 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Enter company name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label className="block text-sm font-medium text-slate-200 mb-2">
                Instagram Profile
              </Label>
              <Input
                {...register('instagram_profile')}
                className="w-full px-4 py-2 bg-zinc-800/50 border border-blue-900/30
                 rounded-md text-slate-100 focus:outline-none focus:ring-2 
                 focus:ring-blue-500/50"
                placeholder="Enter Instagram Profile"
              />
              {errors.instagram_profile && (
                <p className="mt-1 text-sm text-red-400">{errors.instagram_profile.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label className="block text-sm font-medium text-slate-200 mb-2">
              Phone
            </Label>
            <Input
              {...register('phone')}
              type="tel"
              className="w-full px-4 py-2 bg-zinc-800/50 border border-blue-900/30
               rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Enter phone number (optional)"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium text-slate-200 mb-2">
              Bot Identity
            </Label>
            <Input
              {...register('bot_identity')}
              className="w-full px-4 py-2 bg-zinc-800/50 border border-blue-900/30
               rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="You’re Ganesh, Founder of The Squirrel which is an AI automation agency."
            />
            {errors.bot_identity && (
              <p className="mt-1 text-sm text-red-400">{errors.bot_identity.message}</p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium text-slate-200 mb-2">
              Background Context
            </Label>
            <Textarea
              {...register('Back_context')}
              className="w-full px-4 py-2 bg-zinc-800/50 border border-blue-900/30 
              rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Ganesh is the founder of The Squirrel, a tech company that builds 
              smart AI automations to help businesses save time and grow faster. He recently 
              automated his own Instagram DMs and now helps others do the same. Ganesh offers a 
              free discovery call to business owners interested in Instagram automation or other 
              business automations. People often DM the word “Automation” to learn more. Your job is
               to start a warm conversation, ask a couple of quick questions to see if they’re a 
               good fit, collect their name and email, and then share Ganesh’s Calendly link if 
               they’re interested
"
              rows={6}
            />
            {errors.Back_context && (
              <p className="mt-1 text-sm text-red-400">{errors.Back_context.message}</p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium text-slate-200 mb-2">
              Role
            </Label>
            <Input
              {...register('Role')}
              className="w-full px-4 py-2 bg-zinc-800/50 border border-blue-900/30 rounded-md
               text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="When someone messages “Automation,” thank them, 
              introduce Me briefly, and ask if they’re up for a quick chat before getting the link.
               Then ask 2 simple questions (one at a time), collect name + email, trigger the lead
                capture automation, and then share the Calendly link."
            />
            {errors.Role && (
              <p className="mt-1 text-sm text-red-400">{errors.Role.message}</p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium text-slate-200 mb-2">
              Conversation Flow
            </Label>
            <Textarea
              {...register('Conversation_Flow')}
              className="w-full px-4 py-2 bg-zinc-800/50 border border-blue-900/30 
              rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="User messages “Automation”
➡️ Thank them for reaching out
➡️ Introduce Me and The Company
➡️ Ask: “Are you open to a quick chat before I send you the call link?”

If yes:
Question 1: “Are you looking for Instagram automation for your business?”
Question 2: “Do you want help with any other automations in your business (like lead capture,
 WhatsApp flows, AI replies, etc.)?”
➡️ Ask for their first name
➡️ Ask for their email
➡️ Trigger Google Sheets capture
➡️ Share Ganesh’s Calendly link : https://calendly.com/{yourname}/discovery-call

If not interested:
➡️ Politely thank them and let them know they can always reach out later if they’re curious
 about automation."
              rows={8}
            />
            {errors.Conversation_Flow && (
              <p className="mt-1 text-sm text-red-400">{errors.Conversation_Flow.message}</p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium text-slate-200 mb-2">
              FAQs
            </Label>
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 mb-4 p-4 bg-zinc-800/30 rounded-md">
                <div>
                  <Label className="block text-sm font-medium text-slate-200 mb-2">
                    Question {index + 1}
                  </Label>
                  <Input
                    {...register(`FAQ.${index}.question`)}
                    className="w-full px-4 py-2 bg-zinc-800/50 border
                     border-blue-900/30 rounded-md text-slate-100 focus:outline-none
                      focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Enter question"
                  />
                  {errors.FAQ?.[index]?.question && (
                    <p className="mt-1 text-sm text-red-400">{errors.FAQ[index].question.message}</p>
                  )}
                </div>
                <div>
                  <Label className="block text-sm font-medium text-slate-200 mb-2">
                    Answer {index + 1}
                  </Label>
                  <Textarea
                    {...register(`FAQ.${index}.answer`)}
                    className="w-full px-4 py-2 bg-zinc-800/50 border border-blue-900/30
                     rounded-md text-slate-100 focus:outline-none focus:ring-2
                      focus:ring-blue-500/50"
                    placeholder="Enter answer"
                    rows={3}
                  />
                  {errors.FAQ?.[index]?.answer && (
                    <p className="mt-1 text-sm text-red-400">{errors.FAQ[index].answer.message}</p>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  Remove FAQ
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => append({ question: '', answer: '' })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Add FAQ
            </Button>
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 
            rounded-md p-3">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg
             text-white font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
        <p className="mt-6 text-sm text-slate-400 text-center">
          Return to{' '}
          <Link href="/profile" className="text-blue-400 hover:underline">
            Profile
          </Link>
        </p>
      </div>
    </div>
  );
}