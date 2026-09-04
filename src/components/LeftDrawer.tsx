'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Settings, Info, MessageSquare, User, Edit3, Sun, Moon, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface LeftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
  onOpenSettings?: () => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
}

export const LeftDrawer: React.FC<LeftDrawerProps> = ({
  isOpen,
  onClose,
  isDark,
  onToggleDarkMode,
}) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Keydown Escape Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '/images/avatar.jpg';
  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'Commuter Guest');
  const userEmail = user?.email || 'Guest User';

  return (
    <div className="fixed inset-0 z-50 transition-opacity duration-300">
      {/* Backdrop overlay (click outside drawer closes it!) */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Left Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col transition-transform duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 relative">
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-[140px]">{fullName}</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[140px]">{userEmail}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Options */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          {/* User Auth Status Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Authentication:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {user ? 'Supabase Verified' : 'Guest Mode'}
              </span>
            </div>
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full mt-2 py-2.5 px-3 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>
            )}
          </div>

          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pt-2 px-1">Menu & Navigation</h4>

          <Link
            href="/settings"
            onClick={onClose}
            className="w-full p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-left text-sm font-semibold transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-blue-500" />
              <span>App Settings / সেটিংস</span>
            </div>
            <span className="text-slate-400 text-xs">➔</span>
          </Link>

          <Link
            href="/about"
            onClick={onClose}
            className="w-full p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-left text-sm font-semibold transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-purple-500" />
              <span>About App & Developer</span>
            </div>
            <span className="text-slate-400 text-xs">➔</span>
          </Link>

          <Link
            href="/contact"
            onClick={onClose}
            className="w-full p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-left text-sm font-semibold transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>Contact Support</span>
            </div>
            <span className="text-slate-400 text-xs">➔</span>
          </Link>

          <Link
            href="/community-update"
            onClick={onClose}
            className="w-full p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-left text-sm font-semibold transition-colors"
          >
            <div className="flex items-center gap-3">
              <Edit3 className="w-4 h-4 text-amber-500" />
              <span>Submit Route Update</span>
            </div>
            <span className="text-slate-400 text-xs">➔</span>
          </Link>

          <Link
            href="/profile"
            onClick={onClose}
            className="w-full p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-left text-sm font-semibold transition-colors"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-slate-500" />
              <span>Full Profile Page</span>
            </div>
            <span className="text-slate-400 text-xs">➔</span>
          </Link>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            <span>Toggle Theme (Dark / Light)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
