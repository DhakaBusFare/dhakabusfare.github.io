'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { KeyRound, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Lock, ArrowLeft } from 'lucide-react';

export default function UpdatePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionVerified, setIsSessionVerified] = useState(false);

  useEffect(() => {
    // 1. Check current session or recovery tokens
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsSessionVerified(true);
      }
    });

    // 2. Listen for auth state events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setIsSessionVerified(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      setIsLoading(false);

      if (error) {
        setErrorMessage(error.message);
      } else {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Failed to update password.');
    }
  };

  // SUCCESS STATE (Matching password-reset-success.html)
  if (isSuccess) {
    return (
      <main className="flex-1 min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans">
        <div className="w-full max-w-md text-center p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
          
          <div className="w-16 h-16 rounded-2xl bg-white text-slate-950 font-extrabold text-3xl mx-auto flex items-center justify-center shadow-lg">
            🚌
          </div>

          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold text-2xl mx-auto flex items-center justify-center shadow-inner">
            ✓
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">DhakaBusFare</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Password Reset Successful</h1>
            <p className="text-slate-400 text-sm leading-relaxed font-medium pt-1">
              আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।<br />
              দয়া করে অ্যাপটি খুলে নতুন পাসওয়ার্ড দিয়ে লগইন করুন।
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

  return (
    <main className="flex-1 min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Reset Link Verified</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white pt-1">Set New Password</h1>
          <p className="text-slate-400 text-xs font-medium">
            Enter your new password below to update your DhakaBusFare account.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* FORM FOR UPDATING PASSWORD */}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              New Password / নতুন পাসওয়ার্ড
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Confirm New Password / পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Real-time match indicator */}
          {newPassword && confirmPassword && (
            <div className="text-[11px] font-semibold">
              {newPassword === confirmPassword ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  ✓ Passwords match
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1">
                  ✕ Passwords do not match
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || (confirmPassword.length > 0 && newPassword !== confirmPassword)}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Update Password</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to DhakaBusFare
          </Link>
        </div>

      </div>
    </main>
  );
}
