'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Edit3,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Download,
  Smartphone,
  Search,
  BookOpen,
  Zap,
  Check,
  Sparkles,
  Layers,
  Clock,
  Compass,
  FileDown
} from 'lucide-react';
import { WHATSAPP_CONFIG, getWhatsAppChatUrl } from '@/config/whatsapp';

export default function LandingPage() {
  const [installDeferredPrompt, setInstallDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (installDeferredPrompt) {
      installDeferredPrompt.prompt();
      const { outcome } = await installDeferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsAppInstalled(true);
      }
      setInstallDeferredPrompt(null);
    } else {
      alert('To install DhakaBusFare on your mobile device or browser, tap "Add to Home Screen" or use your browser menu options.');
    }
  };

  const handleShareOrCopy = () => {
    if (navigator.share) {
      navigator.share({
        title: 'DhakaBusFare - Official Dhaka Bus Fare & Route Portal',
        url: window.location.origin,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 font-sans overflow-x-hidden">

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
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

      {/* FEATURES SECTION (id="features") */}
      <section id="features" className="py-24 bg-slate-950 relative border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Key Features / প্রধান বৈশিষ্ট্যসমূহ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything You Need For Dhaka Bus Commutes
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-medium">
              ঢাকা মহানগরের প্রতিটি বাস রুট এবং সরকারি ভাড়া তালিকা সহজে পর্যবেক্ষণ করার জন্য উন্নত সুবিধাসমূহ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all hover:-translate-y-1 shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Official BRTA Gazettes</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Access official government published distance-based fare charts and route notification gazettes in continuous PDF viewer format.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all hover:-translate-y-1 shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fast Route & Fare Lookup</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Search routes across Mirpur, Uttara, Motijheel, Gulshan, Dhanmondi, and Savar with exact distance metrics and stop details.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all hover:-translate-y-1 shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Edit3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Crowdsourced Fare Updates</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Report route updates or fare changes directly. Submissions are verified by data reviewers to keep information accurate.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all hover:-translate-y-1 shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Mobile & Offline Friendly</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Installable Progressive Web App (PWA) that loads instantly and caches documents for quick offline reference on your phone.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all hover:-translate-y-1 shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">WhatsApp Admin Support</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Need immediate help or route clarification? Connect directly with our transit admin team over WhatsApp with one tap.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all hover:-translate-y-1 shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Verified Transit Data</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                All fare rates are cross-referenced with Ministry of Road Transport & BRTA circulars to prevent fare manipulation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (id="how") */}
      <section id="how" className="py-24 bg-slate-900/60 border-t border-slate-800/80 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-400 text-xs font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>Step-by-Step Guide / ব্যবহার নির্দেশিকা</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How DhakaBusFare Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-medium">
              সহজ ৩টি ধাপে বাস ভাড়া এবং অফিসিয়াল ডকুমেন্টস খতিয়ে দেখুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="relative p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Select Route or Document</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Open the <strong>Documents Vault</strong> to view government-approved bus fare circulars or search your origin and destination bus stop.
              </p>
              <div className="pt-2">
                <Link href="/documents" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                  <span>Browse Vault</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-400 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Verify Official Fare Rate</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Check the official kilometer distance matrix and per-kilometer rate set by BRTA to ensure you pay the correct fare.
              </p>
              <div className="pt-2">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Government Verified
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Submit Community Updates</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Found a new bus service, route change, or fare revision? Submit updates so thousands of commuters stay informed.
              </p>
              <div className="pt-2">
                <Link href="/community-update" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                  <span>Submit Update</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DOWNLOAD SECTION (id="download") */}
      <section id="download" className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800/80 relative">
        <div className="max-w-5xl mx-auto px-4">
          <div className="p-8 sm:p-12 md:p-16 rounded-3xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-2xl space-y-8 relative overflow-hidden">
            
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

            <div className="text-center max-w-2xl mx-auto space-y-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <Download className="w-8 h-8" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Download App & Transit Documents
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-medium">
                ডকুমেন্টস সরাসরি ডাউনলোড করুন অথবা মোবাইলে অ্যাপ ইনস্টল করে অফলাইনেও ব্যবহার করুন।
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 relative z-10">
              
              {/* Install PWA / App */}
              <button
                type="button"
                onClick={handleInstallApp}
                className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:scale-[1.02] active:scale-95 transition-all text-left font-bold shadow-lg flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <Smartphone className="w-6 h-6" />
                  <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-slate-950/20">
                    {isAppInstalled ? 'Installed' : 'Free App'}
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-black">Install Web App</h4>
                  <p className="text-xs font-semibold text-slate-900/80 mt-1">
                    {isAppInstalled ? 'App is installed on your device' : 'Add to home screen for fast offline access'}
                  </p>
                </div>
              </button>

              {/* Download Gazette PDFs */}
              <Link
                href="/documents"
                className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white hover:scale-[1.02] active:scale-95 transition-all text-left font-bold shadow-lg flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-4">
                  <FileDown className="w-6 h-6 text-emerald-400" />
                  <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    PDF Vault
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold">BRTA Gazette PDFs</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Download full official government route fare circulars
                  </p>
                </div>
              </Link>

              {/* Share / Copy Link */}
              <button
                type="button"
                onClick={handleShareOrCopy}
                className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white hover:scale-[1.02] active:scale-95 transition-all text-left font-bold shadow-lg flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <Zap className="w-6 h-6 text-teal-400" />
                  <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {copiedLink ? 'Copied!' : 'Share'}
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold">Share Portal</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {copiedLink ? 'Link copied to clipboard!' : 'Share DhakaBusFare with fellow daily commuters'}
                  </p>
                </div>
              </button>

            </div>

            {/* Support Callout */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 relative z-10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Free & Open Transit Information</span>
              </div>
              <a
                href={getWhatsAppChatUrl('Hello! I would like to download the Dhaka bus fare documents or ask a question.')}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-400 hover:underline flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Admin on WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
