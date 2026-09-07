'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { checkRateLimit } from '@/lib/rateLimit';
import { getCommunityUpdateWhatsAppUrl, CommunityUpdateData } from '@/config/whatsapp';

export default function CommunityUpdatePage() {
  const [busLine, setBusLine] = useState('');
  const [fromStation, setFromStation] = useState('');
  const [toDestination, setToDestination] = useState('');
  const [updatedFare, setUpdatedFare] = useState('');
  const [notes, setNotes] = useState('');
  const [sendToWhatsapp, setSendToWhatsapp] = useState(true);

  const [submitted, setSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<CommunityUpdateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    // Client-side rate limiting (10 updates per 15 mins)
    const rateLimit = checkRateLimit('community_update', 10, 15 * 60 * 1000);
    if (!rateLimit.success) {
      setLoading(false);
      setErrorMessage(`Submission rate limit reached. Please wait ${rateLimit.retryAfter} seconds before submitting another update.`);
      return;
    }

    const updateData: CommunityUpdateData = {
      busLine,
      fromStation,
      toDestination,
      updatedFare: Number(updatedFare),
      notes,
    };

    try {
      await supabase.from('community_updates').insert([
        {
          bus_line: busLine,
          from_station: fromStation,
          to_destination: toDestination,
          updated_fare: Number(updatedFare),
          notes,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (_) {}

    setLastSubmission(updateData);
    setLoading(false);
    setSubmitted(true);

    if (sendToWhatsapp) {
      const whatsappUrl = getCommunityUpdateWhatsAppUrl(updateData);
      window.open(whatsappUrl, '_blank');
    }
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
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thank You for Your Contribution!</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Our data verification team will review your submitted bus fare info and update the database.
          </p>

          {lastSubmission && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={getCommunityUpdateWhatsAppUrl(lastSubmission)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Direct Copy to Admin on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setBusLine('');
                  setFromStation('');
                  setToDestination('');
                  setUpdatedFare('');
                  setNotes('');
                  setLastSubmission(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                Submit Another Update
              </button>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 md:p-8 space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center gap-3 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Bus Line / Operator Name</label>
            <input
              type="text"
              value={busLine}
              onChange={(e) => setBusLine(e.target.value)}
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
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                placeholder="e.g. Farmgate"
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">To Destination</label>
              <input
                type="text"
                value={toDestination}
                onChange={(e) => setToDestination(e.target.value)}
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
              value={updatedFare}
              onChange={(e) => setUpdatedFare(e.target.value)}
              placeholder="e.g. 15"
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Additional Notes / Ticket Photo Link</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain any new stop addition or ticket fare notice..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80">
            <input
              type="checkbox"
              id="sendToWhatsapp"
              checked={sendToWhatsapp}
              onChange={(e) => setSendToWhatsapp(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
            <label htmlFor="sendToWhatsapp" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Also send a copy of this update directly to Admin on WhatsApp</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{loading ? 'Submitting...' : 'Submit Update / তথ্য জমা দিন'}</span>
          </button>
        </form>
      )}
    </main>
  );
}

