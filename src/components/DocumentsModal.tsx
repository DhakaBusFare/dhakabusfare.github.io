'use client';

import React from 'react';
import { FileText, X } from 'lucide-react';

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPdf: (title: string) => void;
}

export const DocumentsModal: React.FC<DocumentsModalProps> = ({ isOpen, onClose, onOpenPdf }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-opacity"
      onClick={onClose} // Click outside on backdrop closes popup!
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Official Documents & Notices</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <button
            type="button"
            onClick={() => { onClose(); onOpenPdf('BRTA Official Gazette'); }}
            className="w-full text-left p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm block">
                BRTA City Bus Fare Gazette 2026
              </span>
              <span className="text-xs text-slate-500">Government approved distance rates</span>
            </div>
            <span className="text-xs text-emerald-600 font-bold">View PDF ➔</span>
          </button>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white text-sm block">
              Dhaka Metropolitan Transport Policy
            </span>
            <span className="text-xs text-slate-500 block mt-0.5">
              Rules regarding AC minimum fares (৳ 20) and student discounts.
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
