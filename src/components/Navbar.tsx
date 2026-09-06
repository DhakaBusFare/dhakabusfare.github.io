'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bus, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, signInWithGoogle, signOut, isLoading } = useAuth();

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
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 text-xs font-bold transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
