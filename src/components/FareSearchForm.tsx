'use client';

import React, { useState, useEffect } from 'react';
import { routeStore } from '@/lib/services/routeStore';
import { MapPin, ArrowRightLeft, Search, X } from 'lucide-react';

interface FareSearchFormProps {
  fromStop: string;
  toStop: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  onSearch: () => void;
}

export const FareSearchForm: React.FC<FareSearchFormProps> = ({
  fromStop,
  toStop,
  onFromChange,
  onToChange,
  onSearch,
}) => {
  const [stopsList, setStopsList] = useState<Array<{ id: string; name: string; name_bn?: string }>>([]);
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);

  useEffect(() => {
    loadStops();
  }, []);

  const loadStops = async () => {
    const data = await routeStore.fetchStopsFromApi();
    setStopsList(data);
  };

  const filterStops = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return stopsList.slice(0, 15);
    return stopsList.filter(
      (s) => s.name.toLowerCase().includes(q) || (s.name_bn && s.name_bn.includes(q))
    ).slice(0, 15);
  };

  const handleSwap = () => {
    const temp = fromStop;
    onFromChange(toStop);
    onToChange(temp);
  };

  const setQuickRoute = (from: string, to: string) => {
    onFromChange(from);
    onToChange(to);
    onSearch();
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-3xl p-5 md:p-8 mb-8 relative">
      <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* FROM FIELD */}
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              From Station / যাত্রার স্থান
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600 dark:text-emerald-400">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={fromStop}
                onChange={(e) => onFromChange(e.target.value)}
                onFocus={() => setFromDropdownOpen(true)}
                onBlur={() => setTimeout(() => setFromDropdownOpen(false), 200)}
                placeholder="Search From Stop (e.g. Farmgate, Uttara, Savar)"
                className="w-full pl-11 pr-9 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm transition-all"
              />
              {fromStop && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onFromChange('');
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onFromChange('');
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold z-20 cursor-pointer"
                  title="Clear From Input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {fromDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-30 max-h-60 overflow-y-auto">
                {filterStops(fromStop).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => { onFromChange(s.name); setFromDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-0 flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{s.name}</span>
                      {s.name_bn && <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">({s.name_bn})</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SWAP BUTTON */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950 dark:hover:text-emerald-400 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all shadow-sm focus:outline-none"
              title="Swap From and To"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* TO FIELD */}
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              To Destination / গন্তব্য স্থান
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-500">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={toStop}
                onChange={(e) => onToChange(e.target.value)}
                onFocus={() => setToDropdownOpen(true)}
                onBlur={() => setTimeout(() => setToDropdownOpen(false), 200)}
                placeholder="Search To Stop (e.g. Shahbagh, Motijheel)"
                className="w-full pl-11 pr-9 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm transition-all"
              />
              {toStop && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToChange('');
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToChange('');
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold z-20 cursor-pointer"
                  title="Clear To Input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {toDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-30 max-h-60 overflow-y-auto">
                {filterStops(toStop).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => { onToChange(s.name); setToDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-0 flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{s.name}</span>
                      {s.name_bn && <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">({s.name_bn})</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Button & Popular Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400">Popular:</span>
            <button
              type="button"
              onClick={() => setQuickRoute('Farmgate', 'Shahbagh')}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 text-slate-600 dark:text-slate-300 transition-colors font-medium"
            >
              Farmgate ➔ Shahbagh
            </button>
            <button
              type="button"
              onClick={() => setQuickRoute('Uttara House Building', 'Motijheel')}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 text-slate-600 dark:text-slate-300 transition-colors font-medium"
            >
              Uttara ➔ Motijheel
            </button>
            <button
              type="button"
              onClick={() => setQuickRoute('Mirpur 10 Circle', 'Farmgate')}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 text-slate-600 dark:text-slate-300 transition-colors font-medium"
            >
              Mirpur 10 ➔ Farmgate
            </button>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span>Show Fare / ভাড়া দেখুন</span>
          </button>
        </div>
      </form>
    </div>
  );
};
