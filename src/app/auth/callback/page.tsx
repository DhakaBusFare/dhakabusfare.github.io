'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = window.location.search;

      if (hash.includes('type=recovery') || search.includes('type=recovery')) {
        router.replace('/update-password');
        return;
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/verify');
      } else {
        router.replace('/');
      }
    });
  }, [router]);

  return (
    <main className="flex-1 min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
        <p className="text-sm font-medium text-slate-400">Verifying authentication...</p>
      </div>
    </main>
  );
}
