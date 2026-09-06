'use client';

import React from 'react';
import Image from 'next/image';
import { Phone, Mail, ShieldCheck, Heart, History, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, signInWithGoogle, signOut, isLoading } = useAuth();

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '/images/avatar.jpg';
  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'Commuter Guest');
  const userEmail = user?.email || 'Not Signed In';

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-8 space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-lg shadow-emerald-500/20 relative shrink-0">
            <Image
              src={avatarUrl}
              alt={fullName}
              width={96}
              height={96}
              className="w-full h-full rounded-full object-cover"
              unoptimized
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>

          <div className="text-center sm:text-left flex-1 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{fullName}</h2>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {user ? 'Verified Supabase Account' : 'Guest Commuter'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-500" /> {userEmail}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-2">
              <UserIcon className="w-3.5 h-3.5 text-emerald-500" /> Provider: <strong className="font-mono text-slate-700 dark:text-slate-300">{user?.app_metadata?.provider || 'Guest'}</strong>
            </p>

            <div className="pt-2">
              {user ? (
                <button
                  type="button"
                  onClick={signOut}
                  className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 transition-colors inline-flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" /> Sign Out from App
                </button>
              ) : (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs transition-transform active:scale-95 inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Commuter Activity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
            <History className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white block">142</span>
            <span className="text-xs text-slate-500">Route Fare Searches</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white block">8</span>
            <span className="text-xs text-slate-500">Saved Favorite Routes</span>
          </div>
        </div>
      </div>

    </main>
  );
}
