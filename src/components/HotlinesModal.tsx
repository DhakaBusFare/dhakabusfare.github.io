'use client';

import React from 'react';
import { Phone, X, MessageCircle } from 'lucide-react';
import { getWhatsAppChatUrl, WHATSAPP_CONFIG } from '@/config/whatsapp';

interface HotlinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HotlinesModal: React.FC<HotlinesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-md shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Phone className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Emergency & Support Lines</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-2 space-y-3">
          {/* WhatsApp Direct Messaging */}
          <a
            href={getWhatsAppChatUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm block">
                  WhatsApp Support
                </span>
                <span className="text-xs text-slate-500 font-medium">Direct Chat ({WHATSAPP_CONFIG.businessUsername})</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-xl">Chat Now</span>
          </a>

          <a
            href="tel:999"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-900 hover:scale-[1.02] transition-transform"
          >
            <div>
              <span className="font-bold text-rose-700 dark:text-rose-400 text-base block">
                National Emergency Service (999)
              </span>
              <span className="text-xs text-slate-500 font-bangla">জাতীয় জরুরি সেবা (পুলিশ, অ্যাম্বুলেন্স, ফায়ার)</span>
            </div>
            <span className="px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded-xl">Call 999</span>
          </a>

          <a
            href="tel:16107"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-[1.02] transition-transform"
          >
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm block">
                BRTA Helpline (16107)
              </span>
              <span className="text-xs text-slate-500">BRTA Bus Fare Complaint Line</span>
            </div>
            <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-xl">Call 16107</span>
          </a>

          <a
            href="tel:01713373127"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-[1.02] transition-transform"
          >
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm block">
                DMP Traffic Control Room
              </span>
              <span className="text-xs text-slate-500">Dhaka Traffic Congestion Helpline</span>
            </div>
            <span className="px-3 py-1 bg-slate-700 text-white font-bold text-xs rounded-xl">Call Traffic</span>
          </a>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
