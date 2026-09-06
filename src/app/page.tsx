'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bus, MapPin, Calculator, ShieldCheck, Download, ArrowRight, CheckCircle2, Star, Smartphone, Heart, History, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Glow ambient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-teal-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-inner">
                <span className="text-sm">🇧🇩</span>
                <span>Made for Dhaka Commuters</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Know your bus fare <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">before you ride.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                DhakaBusFare helps you find bus fares, stoppages, and routes across Dhaka city — quickly, clearly, and without guessing.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#download"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download App</span>
                </a>

                <a
                  href="#how"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>See How It Works</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </a>
              </div>

              {/* Micro feature pills */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium flex-wrap">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free to use
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> BRTA Fare Rates
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bangla & English
                </span>
              </div>
            </div>

            {/* Right Phone Mockup Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-[320px] w-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-[44px] blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <div className="relative bg-slate-900 border-4 border-slate-800/80 rounded-[40px] p-2.5 shadow-2xl shadow-slate-950/80">
                  <div className="rounded-[32px] overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src="/assets/app-home.svg"
                      alt="DhakaBusFare App Home Screen"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-900/50 border-y border-slate-800/60 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything you need for a better bus journey
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-medium">
              ঢাকার বাস ভাড়া খুঁজে বের করা এখন আরও সহজ ও ঝামেলামুক্ত।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Fare Calculator</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Choose your starting stoppage and destination to get precise BRTA segment fare breakdowns instantly.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Comprehensive Routes</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Explore 50+ active Dhaka city bus operators, route numbers, stoppage timelines, and total distances.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Official BRTA Rates</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ride with confidence using government gazette non-AC metro fare standards per kilometer.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* HOW IT WORKS SECTION */}
      <section id="how" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Steps */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  From stoppage to fare in 3 simple steps.
                </h2>
                <p className="text-emerald-400 text-sm font-medium">
                  কোথা থেকে কোথায় যাবেন? রুট নির্বাচন করুন এবং ভাড়া জেনে নিন।
                </p>
              </div>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center shrink-0 text-sm">
                    01
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-base">Pick your starting point</h4>
                    <p className="text-slate-400 text-xs mt-1">Search any Dhaka bus stoppage like Uttara, Farmgate, or Motijheel.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center shrink-0 text-sm">
                    02
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-base">Select your destination</h4>
                    <p className="text-slate-400 text-xs mt-1">View matching bus operators that service your exact travel route.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center shrink-0 text-sm">
                    03
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-base">Check the exact fare</h4>
                    <p className="text-slate-400 text-xs mt-1">Get instant breakdown of base fare, distance, and per-km pricing.</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <strong className="text-2xl sm:text-3xl font-black text-emerald-400 block">56+</strong>
                  <span className="text-[11px] text-slate-400">Bus Routes</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <strong className="text-2xl sm:text-3xl font-black text-emerald-400 block">৳</strong>
                  <span className="text-[11px] text-slate-400">Fare Focused</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <strong className="text-2xl sm:text-3xl font-black text-emerald-400 block">2</strong>
                  <span className="text-[11px] text-slate-400">Languages</span>
                </div>
              </div>
            </div>

            {/* Right Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-[320px] w-full">
                <div className="relative bg-slate-900 border-4 border-slate-800/80 rounded-[40px] p-2.5 shadow-2xl">
                  <div className="rounded-[32px] overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src="/assets/route-details.svg"
                      alt="DhakaBusFare Route Details Screen"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* USER ACCOUNT & PROFILE SECTION */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
              <div className="relative group max-w-[320px] w-full">
                <div className="relative bg-slate-900 border-4 border-slate-800/80 rounded-[40px] p-2.5 shadow-2xl">
                  <div className="rounded-[32px] overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src="/assets/profile.svg"
                      alt="DhakaBusFare Profile Screen"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-left order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Your routes. Your account. Your way.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Sign in with your Google account or email to save favorite daily commute routes, track recent fare searches, and sync preferences.
              </p>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Lock className="w-4 h-4" /> Secure Supabase Authentication
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Reset your password, verify account emails, and manage profile security directly through our secure web portal.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <Link
                    href="/reset-password"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700 transition-colors"
                  >
                    Reset Password
                  </Link>
                  <Link
                    href="/verify"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
                  >
                    Email Verification
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* DOWNLOAD CTA SECTION */}
      <section id="download" className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 shadow-2xl relative overflow-hidden space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white text-slate-950 text-3xl font-bold mx-auto flex items-center justify-center shadow-lg">
              🚌
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to ride Dhaka buses smarter?
            </h2>

            <p className="text-emerald-300/80 text-sm max-w-lg mx-auto font-medium">
              DhakaBusFare ডাউনলোড করুন এবং যাত্রার আগে আসল সরকারি বাস ভাড়া জেনে নিন।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                <span>Download DhakaBusFare App</span>
              </a>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Free to use • Android App Download
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
