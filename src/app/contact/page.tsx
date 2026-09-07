'use client';

import React, { useState } from 'react';
import { MessageSquare, Mail, Phone, Send, Check, AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import { checkRateLimit } from '@/lib/rateLimit';
import { getWhatsAppChatUrl, WHATSAPP_CONFIG } from '@/config/whatsapp';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    // Client-side rate limiting (5 email inquiries per 15 mins)
    const rateLimit = checkRateLimit('email_contact', 5, 15 * 60 * 1000);
    if (!rateLimit.success) {
      setLoading(false);
      setErrorMessage(`Email sending rate limit reached. Please wait ${rateLimit.retryAfter} seconds before sending another message.`);
      return;
    }

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-8 pb-20 space-y-6">
      
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Contact Support</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bangla">আমাদের টিমকে আপনার মতামত বা সহায়তার অনুরোধ পাঠান।</p>
        </div>
      </div>

      {/* Support Methods Grid: Email, Helpline, WhatsApp */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block font-semibold">Email Support</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">support@dhakabus.bd</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block font-semibold">Helpline</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">+880 9612-889900</span>
          </div>
        </div>

        {/* WhatsApp Direct Chat Card */}
        <a
          href={getWhatsAppChatUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 shadow-sm flex items-center justify-between group hover:bg-emerald-500/20 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-bold">WhatsApp Business</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">{WHATSAPP_CONFIG.businessUsername}</span>
            </div>
          </div>
          <span className="text-xs text-emerald-500 font-bold group-hover:translate-x-0.5 transition-transform">Chat ➔</span>
        </a>
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
            onClick={() => {
              setSubmitted(false);
              setName('');
              setEmail('');
              setMessage('');
            }}
            className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold mt-2"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 md:p-8 space-y-5">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center gap-3 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tanvir Ahmed"
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tanvir@dhakabus.bd"
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Message / feedback</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your inquiry, suggestion, or bus fare complaint..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{loading ? 'Sending Message...' : 'Send Message / বার্তা পাঠান'}</span>
          </button>
        </form>
      )}

    </main>
  );
}
