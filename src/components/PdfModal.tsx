'use client';

import React from 'react';
import { X, FileText, Lock } from 'lucide-react';

interface PdfModalProps {
  isOpen: boolean;
  busName: string;
  onClose: () => void;
}

export const PdfModal: React.FC<PdfModalProps> = ({ isOpen, busName, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm transition-opacity"
      onClick={onClose} // Click outside backdrop closes PDF modal!
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Stop closing when clicking inside PDF viewer box
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Official BRTA Gazette Chart - {busName || 'Dhaka Metropolitan'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-500" /> View Only • Protected Document View
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className="p-6 overflow-y-auto flex-1 select-none relative bg-slate-100 dark:bg-slate-950"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 rotate-[-25deg]">
            <span className="text-6xl font-black uppercase tracking-widest text-slate-900 dark:text-white">
              BRTA OFFICIAL GAZETTE
            </span>
          </div>

          <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-serif text-sm leading-relaxed space-y-4">
            <div className="text-center border-b pb-4 border-slate-200 dark:border-slate-800">
              <span className="text-xs uppercase tracking-widest font-sans font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                Government of Bangladesh • BRTA
              </span>
              <h3 className="text-lg font-bold">Dhaka Metropolitan City Bus Fare Schedule 2026</h3>
              <p className="text-xs text-slate-500 font-sans mt-1">Gazette Notification No: BRTA/FAREDHK-2026-09</p>
            </div>

            <div className="font-sans text-xs space-y-2">
              <p><strong>Effective Date:</strong> January 1, 2026</p>
              <p><strong>Authorized Base Distance:</strong> ৳ 2.45 per kilometer for regular city services.</p>
              <p><strong>Minimum City Fare:</strong> ৳ 10.00 (Regular) / ৳ 20.00 (AC Metro Service).</p>
            </div>

            <table className="w-full font-sans text-xs border-collapse border border-slate-300 dark:border-slate-700 mt-4">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800">
                  <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">Route Segment</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2 text-center">Distance</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2 text-right">Standard Fare</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 dark:border-slate-700 p-2">Farmgate ➔ Shahbagh</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">3.8 km</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2 text-right font-bold">৳ 15.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/40">
                  <td className="border border-slate-300 dark:border-slate-700 p-2">Uttara ➔ Motijheel</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">18.5 km</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2 text-right font-bold">৳ 45.00</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 dark:border-slate-700 p-2">Mirpur 10 ➔ Farmgate</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">7.2 km</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2 text-right font-bold">৳ 22.00</td>
                </tr>
              </tbody>
            </table>

            <div className="text-xs text-slate-400 text-center font-sans pt-4 border-t border-slate-100 dark:border-slate-800">
              This is an embedded view of the government notification. Downloads are restricted.
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center text-xs text-slate-500">
          <span>Page 1 of 1 • Scroll View Enabled</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-xl transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
