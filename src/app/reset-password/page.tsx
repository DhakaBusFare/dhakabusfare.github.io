'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { KeyRound, Mail, CheckCircle2, ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user navigated here via recovery link in URL hash/query
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash.includes('type=recovery') || hash.includes('access_token') || search.includes('type=recovery')) {
        setIsRecoveryMode(true);
      }
    }

    // Also listen for Supabase auth state change PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/reset-password/` : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    setIsLoading(false);
    if (error) {
      setErrorMessage(error.message);
    } else {
      setIsSubmitted(true);
    }
  };

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
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setIsSuccess(true);
    }
  };

  // SUCCESS STATE CARD (from password-reset-success.html)
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
              দয়া করে অ্যাপটি খুলে আবার লগইন করুন।
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

  // EMAIL SENT SUBMITTED STATE
  if (isSubmitted) {
    return (
      <main className="flex-1 min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans">
        <div className="w-full max-w-md text-center p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto">
            <Mail className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white">Check Your Email</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              We have sent a password reset link to <strong className="text-emerald-400">{email}</strong>.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors pt-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // FORM INPUT STATE
  return (
    <main className="flex-1 min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {isRecoveryMode ? 'Set New Password' : 'Reset Password'}
          </h1>
          <p className="text-slate-400 text-xs font-medium">
            {isRecoveryMode
              ? 'Enter your new password below to update your account.'
              : 'Enter your email address and we will send you a reset link.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* RECOVERY MODE FORM (Set New Password) */}
        {isRecoveryMode ? (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">
                New Password
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
                Confirm New Password
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save New Password</span>
            </button>
          </form>
        ) : (
          /* REQUEST RESET EMAIL FORM */
          <form onSubmit={handleSendResetEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">
                Account Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Send Reset Email</span>
            </button>
          </form>
        )}

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
