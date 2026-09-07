'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bus, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, signOut, isLoading } = useAuth();

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '/images/avatar.jpg';
  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'Guest User');
  const userEmail = user?.email || 'Not Signed In';

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
              DhakaBusFare
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">ঢাকা বাস ভাড়া ও রুট গাইড</p>
          </div>
        </Link>

        {/* Desktop Nav Controls & Supabase User Profile Pic */}
        <div className="flex items-center gap-3 md:gap-6">
          <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
            <Link href="/" className="px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <a href="/#features" className="px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Features
            </a>
            <a href="/#how" className="px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              How it works
            </a>
            <Link href="/documents" className="px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Documents
            </Link>
            <a href="/#download" className="px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Download
            </a>
          </nav>

          {/* USER PROFILE PIC / AUTH BUTTON */}
          {user ? (
            <div className="relative group">
              <Link href="/profile" className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-500/80 dark:border-emerald-400 shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform">
                  <Image
                    src={avatarUrl}
                    alt={fullName}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
              </Link>

              {/* HOVER TOOLTIP SHOWING REAL USER FULL NAME & EMAIL */}
              <div className="absolute right-0 top-full mt-2 w-64 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                <div className="flex items-center gap-3 mb-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-emerald-500">
                    <Image
                      src={avatarUrl}
                      alt={fullName}
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {fullName}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {userEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified User
                  </span>
                  <button
                    type="button"
                    onClick={signOut}
                    className="text-rose-500 hover:underline font-bold flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
