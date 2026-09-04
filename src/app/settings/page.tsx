'use client';

import React, { useState } from 'react';
import { Settings, Globe, Bell, Check } from 'lucide-react';

export default function SettingsPage() {
  const [lang, setLang] = useState('bn');
  const [currency, setCurrency] = useState('BDT');
  const [notifications, setNotifications] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-8 space-y-6">
      
      {/* Page Title Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">App Settings & Preferences</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bangla">অ্যাপ সেটিংস ও ইউজার প্রেফারেন্সিয়াল সুবিধা সমূহ।</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 md:p-8 space-y-6">
        
        {/* Language Preference */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-500" />
            <span>Display Language / ভাষা নির্বাচন</span>
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
          >
            <option value="en">English (Primary)</option>
            <option value="bn">বাংলা (Bengali)</option>
          </select>
        </div>

        {/* Currency & Fare Unit */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Fare Currency Symbol
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
          >
            <option value="BDT">Bangladeshi Taka (৳)</option>
          </select>
        </div>

        {/* Push Notifications Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-amber-500" />
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">BRTA Fare Update Alerts</span>
              <span className="text-xs text-slate-500">Receive instant push notifications when BRTA updates bus fare gazettes.</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-white" /> : null}
          <span>{savedSuccess ? 'Settings Saved Successfully!' : 'Save Preferences'}</span>
        </button>

      </form>
    </main>
  );
}
