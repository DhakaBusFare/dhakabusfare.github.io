'use client';

import React from 'react';
import { Info, ShieldCheck, Bus, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-8 space-y-6">
      
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">About DhakaBusFare</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bangla">ঢাকা বাস ভাড়া প্রজেক্টের উদ্দেশ্য ও পরিচিতি।</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 md:p-8 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shrink-0">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Empowering 10M+ Daily Dhaka Commuters</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              DhakaBusFare is an open digital transit platform standardizing bus fare calculation and route transparency across Dhaka Metropolitan City.
            </p>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">Key Core Values</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>BRTA Official Data</span>
            </div>
            <p className="text-xs text-slate-500">
              All base fare formulas dynamically align with official Bangladesh Road Transport Authority (BRTA) gazettes.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <div className="flex items-center gap-2 text-rose-500 font-bold">
              <Heart className="w-4 h-4" />
              <span>Community Driven</span>
            </div>
            <p className="text-xs text-slate-500">
              Crowdsourced user submissions keep new route stops and fare updates accurate in real-time.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
