'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function CommunityUpdatePage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-8">
      <div className="mb-6">
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">
          Crowdsourced Transit Data
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
          Improve / Update Bus Route Info
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 font-bangla">
          বাসের রুট বা ভাড়ায় কোনো পরিবর্তন এসেছে? আমাদের জানিয়ে তথ্য হালনাগাদ করতে সাহায্য করুন।
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thank You for Your Contribution!</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Our data verification team will review your submitted bus fare info and update the database.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold mt-2"
          >
            Submit Another Update
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Bus Line / Operator Name</label>
            <input
              type="text"
              placeholder="e.g. Bikolpo Auto Service"
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">From Station</label>
              <input
                type="text"
                placeholder="e.g. Farmgate"
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">To Destination</label>
              <input
                type="text"
                placeholder="e.g. Shahbagh"
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Updated Fare Charged (৳)</label>
            <input
              type="number"
              placeholder="e.g. 15"
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Additional Notes / Ticket Photo Link</label>
            <textarea
              rows={3}
              placeholder="Explain any new stop addition or ticket fare notice..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit Update / তথ্য জমা দিন</span>
          </button>
        </form>
      )}
    </main>
  );
}
