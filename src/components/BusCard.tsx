'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BusOperator, CardSelectionState } from '@/types';
import { calculateBusFare, calculateSegmentDistance } from '@/lib/data/mockData';
import { RouteTimeline } from './RouteTimeline';
import { ChevronDown, Clock, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

interface BusCardProps {
  bus: BusOperator;
  initialFrom: string;
  initialTo: string;
  onOpenPdf: (busName: string) => void;
}

export const BusCard: React.FC<BusCardProps> = ({
  bus,
  initialFrom,
  initialTo,
  onOpenPdf,
}) => {
  const [selection, setSelection] = useState<CardSelectionState>({
    from: initialFrom,
    to: initialTo,
    lastSet: 'to',
  });
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);

  const currentFare = calculateBusFare(bus, selection.from, selection.to);
  const currentDistance = calculateSegmentDistance(bus.stops, selection.from, selection.to, bus.distanceKm);

  // 1-2 ALTERNATING SELECTION LOGIC
  const handleStopTap = (stopName: string) => {
    if (selection.lastSet === 'to' || !selection.from) {
      setSelection({
        from: stopName,
        to: '',
        lastSet: 'from',
      });
    } else {
      setSelection({
        ...selection,
        to: stopName,
        lastSet: 'to',
      });
    }
  };

  const handleSetFrom = (stopName: string) => {
    setSelection({
      ...selection,
      from: stopName,
      lastSet: 'from',
    });
  };

  const handleSetTo = (stopName: string) => {
    setSelection({
      ...selection,
      to: stopName,
      lastSet: 'to',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href={`/operator/${bus.id}`}
            className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 flex flex-col items-center justify-center shrink-0 hover:scale-105 transition-transform"
            title="View Full Operator Profile"
          >
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{bus.routeNo}</span>
            <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/operator/${bus.id}`}
                className="text-base font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 group"
              >
                <span>{bus.name}</span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${bus.typeBg}`}>{bus.type}</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1 flex-wrap">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{selection.from || 'Select From'}</span>
              <span>➔</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{selection.to || 'Select To...'}</span>
              <span className="text-slate-400 ml-1">• {bus.bnName}</span>
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {bus.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                ~{currentDistance} km
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
          <div className="text-left md:text-right">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Calculated Fare</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 transition-all">
              {selection.from && selection.to ? `৳ ${currentFare}` : '৳ --'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <span>Route Stops</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isTimelineExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expandable Timeline */}
      {isTimelineExpanded && (
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-5">
          <RouteTimeline
            stops={bus.stops}
            currentFrom={selection.from}
            currentTo={selection.to}
            onStopTap={handleStopTap}
            onSetFrom={handleSetFrom}
            onSetTo={handleSetTo}
            onOpenPdf={() => onOpenPdf(bus.name)}
          />
        </div>
      )}
    </div>
  );
};
