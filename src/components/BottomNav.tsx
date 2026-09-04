'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Edit3, FileText, Phone } from 'lucide-react';

interface BottomNavProps {
  onOpenDocuments: () => void;
  onOpenHotlines: () => void;
  onCloseModals: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenDocuments, onOpenHotlines, onCloseModals }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-2xl px-4 py-2">
      <div className="max-w-5xl mx-auto flex items-center justify-around">
        <Link
          href="/"
          onClick={onCloseModals}
          className="flex flex-col items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>
        
        <Link
          href="/community-update"
          onClick={onCloseModals}
          className="flex flex-col items-center gap-0.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <Edit3 className="w-5 h-5" />
          <span className="text-[10px] font-bold">Update Info</span>
        </Link>

        <button
          type="button"
          onClick={onOpenDocuments}
          className="flex flex-col items-center gap-0.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-bold">Documents</span>
        </button>

        <button
          type="button"
          onClick={onOpenHotlines}
          className="flex flex-col items-center gap-0.5 text-rose-600 dark:text-rose-400 font-bold hover:scale-105 transition-transform"
        >
          <div className="relative">
            <Phone className="w-5 h-5" />
            <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
          </div>
          <span className="text-[10px]">999 / Emergency</span>
        </button>
      </div>
    </div>
  );
};
