'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex-1 min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans">
      <div className="w-full max-w-lg text-center space-y-6">
        
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-white text-slate-950 font-extrabold text-3xl mx-auto flex items-center justify-center shadow-lg">
          🚌
        </div>

        {/* 404 Code */}
        <p className="text-8xl sm:text-9xl font-black tracking-tighter text-emerald-400 leading-none">
          404
        </p>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
          <h1 className="text-2xl font-extrabold text-white">Oops! Page not found.</h1>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যায়নি। ঠিকানা পরিবর্তন হয়ে থাকতে পারে অথবা পেজটি আর নেই।
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform"
            >
              <ArrowLeft className="w-4 h-4" /> Back to DhakaBusFare
            </Link>
          </div>
        </div>

        <div className="text-xs text-slate-600 font-medium">
          <strong className="text-slate-400">DhakaBusFare</strong> · Dhaka bus fare & route guide
        </div>

      </div>
    </main>
  );
}
