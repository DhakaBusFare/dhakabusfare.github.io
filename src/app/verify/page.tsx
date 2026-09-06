'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function VerifyEmailPage() {
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    // Process session if token in URL
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsVerified(true);
      }
    });
  }, []);

  return (
    <main className="flex-1 min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans">
      <div className="w-full max-w-md text-center p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
        
        {/* App Logo */}
        <div className="w-16 h-16 rounded-2xl bg-white text-slate-950 font-extrabold text-3xl mx-auto flex items-center justify-center shadow-lg">
          🚌
        </div>

        {/* Success Checkmark Circle */}
        <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold text-2xl mx-auto flex items-center justify-center shadow-inner">
          ✓
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">DhakaBusFare</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Email Verified Successfully</h1>
          <p className="text-slate-400 text-sm leading-relaxed font-medium pt-1">
            আপনার ইমেইল সফলভাবে ভেরিফাই হয়েছে।<br />
            আপনি এখন আপনার অ্যাকাউন্টে লগইন করতে পারেন।
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Link
            href="/"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm block shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform"
          >
            Open DhakaBusFare Home
          </Link>
          <Link
            href="/"
            className="inline-block text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Back to website
          </Link>
        </div>

      </div>
    </main>
  );
}
