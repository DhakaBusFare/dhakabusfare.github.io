'use client';

import React from 'react';
import { Check, MapPin, FileText } from 'lucide-react';

interface RouteTimelineProps {
  stops: string[];
  currentFrom: string;
  currentTo: string;
  onStopTap: (stopName: string) => void;
  onSetFrom: (stopName: string) => void;
  onSetTo: (stopName: string) => void;
  onOpenPdf: () => void;
}

export const RouteTimeline: React.FC<RouteTimelineProps> = ({
  stops,
  currentFrom,
  currentTo,
  onStopTap,
  onSetFrom,
  onSetTo,
  onOpenPdf,
}) => {
  const idxFrom = stops.findIndex(s => s.toLowerCase().includes((currentFrom || '').toLowerCase().split(' ')[0]));
  const idxTo = stops.findIndex(s => s.toLowerCase().includes((currentTo || '').toLowerCase().split(' ')[0]));

  const startIndex = Math.min(idxFrom !== -1 ? idxFrom : 0, idxTo !== -1 ? idxTo : stops.length - 1);
  const endIndex = Math.max(idxFrom !== -1 ? idxFrom : 0, idxTo !== -1 ? idxTo : stops.length - 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span>Sequential Stop Selection (1st Tap: From ➔ 2nd Tap: To ➔ 3rd Tap: New From...)</span>
          </h5>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-bold">✓</span> Green Check = From
            </span> •{' '}
            <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">📍</span> Red Pin = To
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPdf}
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 hover:underline shrink-0"
        >
          <FileText className="w-3.5 h-3.5" />
          Show Official PDF Chart
        </button>
      </div>

      <div className="relative pl-8 space-y-4 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {stops.map((stop, idx) => {
          const isFrom = idx === idxFrom && currentFrom !== '';
          const isTo = idx === idxTo && currentTo !== '';
          const isBetween = idxFrom !== -1 && idxTo !== -1 && currentFrom !== '' && currentTo !== '' && idx > startIndex && idx < endIndex;

          let textColor = 'text-slate-600 dark:text-slate-400 font-medium';
          let badge = null;

          if (isFrom) {
            textColor = 'text-emerald-700 dark:text-emerald-400 font-extrabold text-sm';
            badge = (
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200">
                FROM (GREEN CHECK)
              </span>
            );
          } else if (isTo) {
            textColor = 'text-rose-600 dark:text-rose-400 font-extrabold text-sm';
            badge = (
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold border border-rose-200">
                TO (RED PIN)
              </span>
            );
          } else if (isBetween) {
            textColor = 'text-emerald-800 dark:text-emerald-200 font-semibold';
          }

          return (
            <div key={idx} className="relative flex items-center justify-between group py-1">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => onStopTap(stop)}>
                {isFrom ? (
                  <div className="absolute -left-8 w-7 h-7 rounded-full bg-emerald-500 border-2 border-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-emerald-500/30 z-10">
                    <Check className="w-4 h-4" />
                  </div>
                ) : isTo ? (
                  <div className="absolute -left-8 w-7 h-7 rounded-full bg-rose-500 border-2 border-rose-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-rose-500/30 z-10">
                    <MapPin className="w-4 h-4" />
                  </div>
                ) : isBetween ? (
                  <div className="absolute -left-6 w-4 h-4 rounded-full bg-emerald-400 border-2 border-emerald-500 z-10" />
                ) : (
                  <div className="absolute -left-5 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 group-hover:border-emerald-500 group-hover:scale-125 transition-all" />
                )}

                <span className="text-xs font-mono text-slate-400 w-5">{idx + 1}.</span>
                <span className={`text-sm ${textColor} group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors`}>
                  {stop}
                </span>
                {badge}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onSetFrom(stop)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
                    isFrom
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white'
                  }`}
                >
                  Set From
                </button>
                <button
                  type="button"
                  onClick={() => onSetTo(stop)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
                    isTo
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-500 hover:text-white'
                  }`}
                >
                  Set To
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
