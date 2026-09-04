'use client';

import React, { useState } from 'react';
import { MessageSquare, Mail, Phone, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-8 space-y-6">
      
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Contact Support</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bangla">আমাদের টিমকে আপনার মতামত বা সহায়তার অনুরোধ পাঠান।</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Email Support</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">support@dhakabus.bd</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Helpline</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">+880 9612-889900</span>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 text-center space-y-3">
          <Check className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Message Sent Successfully!</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Thank you for reaching out. Our support team will get back to your email within 24 hours.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold mt-2"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 md:p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Name</label>
            <input
              type="text"
              placeholder="e.g. Tanvir Ahmed"
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Email Address</label>
            <input
              type="email"
              placeholder="tanvir@dhakabus.bd"
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Message / feedback</label>
            <textarea
              rows={4}
              placeholder="Describe your inquiry, suggestion, or bus fare complaint..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Message / বার্তা পাঠান</span>
          </button>
        </form>
      )}

    </main>
  );
}
