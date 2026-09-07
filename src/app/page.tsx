'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Edit3, ShieldCheck, ArrowRight, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { WHATSAPP_CONFIG, getWhatsAppChatUrl } from '@/config/whatsapp';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-teal-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-inner">
              <span className="text-sm">🇧🇩</span>
              <span>Official Dhaka Transit Gazette & Documents Portal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Official Dhaka Bus Fare & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">Route Gazette Portal</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
              Access verified government route gazette documents, read multi-page continuous PDF fare charts, and submit community transit updates — 100% free.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/documents"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                <span>Browse Route Documents / দলিলসমূহ</span>
              </Link>

              <Link
                href="/community-update"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Edit3 className="w-5 h-5 text-emerald-400" />
                <span>Submit Fare Update</span>
              </Link>
            </div>

            {/* Feature badge indicators */}
            <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-400 font-medium flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified PDF Reader
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> WhatsApp Direct Support
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Offline Protected Caching
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PORTAL SERVICES */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800/60 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Transit Services & Resources
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-medium">
              অফিসিয়াল গ্যাজেট এবং তথ্য হালনাগাদ সংক্রান্ত সেবা।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Documents */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 shadow-lg group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Official Gazette Documents</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Read complete, high-resolution PDF gazette sheets detailing official bus fares and station distance stops across Dhaka.
                </p>
              </div>

              <Link
                href="/documents"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Open Documents Vault</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Community Update */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 shadow-lg group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Edit3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Crowdsourced Updates</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Notice a recent fare change on your daily commute? Submit route fare corrections directly to our data verification team.
                </p>
              </div>

              <Link
                href="/community-update"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Submit Fare Correction</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 3: WhatsApp Support */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 shadow-lg group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">WhatsApp Direct Support</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Message our team directly on WhatsApp for inquiries, transit feedback, or official document requests.
                </p>
              </div>

              <a
                href={getWhatsAppChatUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Chat on WhatsApp ({WHATSAPP_CONFIG.businessUsername})</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK ACCESS CTA */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white text-slate-950 text-3xl font-bold mx-auto flex items-center justify-center shadow-lg">
              📜
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Looking for official route charts?
            </h2>

            <p className="text-emerald-300/80 text-sm max-w-lg mx-auto font-medium">
              গ্যাজেটের আসল কপি দেখতে আমাদের ডকুমেন্টস সেকশনে ভিজিট করুন।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/documents"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                <span>View Route Documents Vault</span>
              </Link>

              <a
                href={getWhatsAppChatUrl('Hello DhakaBusFare! I need assistance regarding route documents.')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-bold text-sm transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Admin</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
