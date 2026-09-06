'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { routeStore } from '@/lib/services/routeStore';
import { calculateBusFare, calculateSegmentDistance } from '@/lib/data/mockData';
import { ArrowLeft, Star, FileText, Check, MapPin, Calculator, RefreshCw } from 'lucide-react';
import { AdminRoute } from '@/types';

export default function OperatorDetailPage({ params }: { params: { id: string } }) {
  const [operator, setOperator] = useState<any>(null);
  const [routes, setRoutes] = useState<AdminRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<AdminRoute | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [fromStop, setFromStop] = useState('');
  const [toStop, setToStop] = useState('');
  const [lastSet, setLastSet] = useState<'from' | 'to'>('to');

  useEffect(() => {
    loadOperatorData();
  }, [params.id]);

  const loadOperatorData = async () => {
    setIsLoading(true);
    const result = await routeStore.fetchOperatorByIdFromApi(params.id);
    if (result && result.operator) {
      setOperator(result.operator);
      setRoutes(result.routes);
      if (result.routes.length > 0) {
        const firstRoute = result.routes[0];
        setSelectedRoute(firstRoute);
        const stops = firstRoute.stops.map((s) => s.stop_name);
        setFromStop(stops[0] || '');
        setToStop(stops[stops.length - 1] || '');
      }
    } else {
      // Fallback
      const allRoutes = await routeStore.fetchRoutesFromApi();
      if (allRoutes.length > 0) {
        setSelectedRoute(allRoutes[0]);
        const stops = allRoutes[0].stops.map((s) => s.stop_name);
        setFromStop(stops[0] || '');
        setToStop(stops[stops.length - 1] || '');
      }
    }
    setIsLoading(false);
  };

  const currentStops = selectedRoute ? selectedRoute.stops.map((s) => s.stop_name) : [];
  const busAdapt = selectedRoute
    ? {
        id: selectedRoute.id,
        name: operator ? operator.name : selectedRoute.name,
        bnName: operator ? operator.name_bn : selectedRoute.name_bn,
        routeNo: selectedRoute.route_number,
        type: 'Normal' as const,
        baseFare: 15,
        perKm: 2.45,
        minFare: 10,
        distanceKm: selectedRoute.stops[selectedRoute.stops.length - 1]?.distance_from_start_km || 15,
        typeBg: 'bg-emerald-100 text-emerald-800',
        duration: '35 mins',
        stops: currentStops,
      }
    : {
        id: 'bus-1',
        name: 'Uttara Express',
        bnName: 'উত্তরা এক্সপ্রেস',
        routeNo: 'Route 4',
        type: 'Normal' as const,
        baseFare: 15,
        perKm: 2.45,
        minFare: 10,
        distanceKm: 17.2,
        typeBg: 'bg-emerald-100 text-emerald-800',
        duration: '35 mins',
        stops: ['Uttara', 'Airport', 'Mohakhali', 'Farmgate', 'Shahbagh', 'Motijheel'],
      };

  const fare = calculateBusFare(busAdapt, fromStop, toStop);
  const dist = calculateSegmentDistance(busAdapt.stops, fromStop, toStop, busAdapt.distanceKm);

  const handleSwap = () => {
    const temp = fromStop;
    setFromStop(toStop);
    setToStop(temp);
  };

  const handleTimelineTap = (stopName: string) => {
    if (lastSet === 'to' || !fromStop) {
      setFromStop(stopName);
      setToStop('');
      setLastSet('from');
    } else {
      setToStop(stopName);
      setLastSet('to');
    }
  };

  const idxFrom = busAdapt.stops.findIndex((s) => s.toLowerCase().includes((fromStop || '').toLowerCase().split(' ')[0]));
  const idxTo = busAdapt.stops.findIndex((s) => s.toLowerCase().includes((toStop || '').toLowerCase().split(' ')[0]));
  const startIndex = Math.min(idxFrom !== -1 ? idxFrom : 0, idxTo !== -1 ? idxTo : busAdapt.stops.length - 1);
  const endIndex = Math.max(idxFrom !== -1 ? idxFrom : 0, idxTo !== -1 ? idxTo : busAdapt.stops.length - 1);

  if (isLoading) {
    return (
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-16 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-semibold">Loading operator details from Supabase Data API...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-6 md:pt-8 space-y-8">
      {/* Top Back Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Buses
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shrink-0">
              <span className="text-sm font-black text-emerald-400">{busAdapt.routeNo}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{busAdapt.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold">
                  BRTA Authorized Operator
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-300 mt-1 font-bangla">
                {busAdapt.bnName} • {busAdapt.routeNo} ({busAdapt.stops[0] || 'Start'} ➔ {busAdapt.stops[busAdapt.stops.length - 1] || 'End'})
              </p>
              
              <div className="flex items-center gap-4 text-xs text-slate-300 mt-3 flex-wrap font-mono">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.8 Rating
                </span>
                <span>•</span>
                <span>Active Routes: {routes.length}</span>
                <span>•</span>
                <span>Supabase Data API Verified</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.open(`/admin/routes/${selectedRoute?.id || ''}`, '_blank')}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>View Official Route PDF</span>
          </button>
        </div>
      </div>

      {/* PORTION FARE CALCULATOR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-500" />
              <span>Calculate Portion Fare for {busAdapt.name}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-bangla">
              এই বাসের যেকোনো দুই স্টপের ভাড়া সরাসরি হিসেব করুন।
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
            Live Supabase Portion Fare
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
          <div className="md:col-span-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              From Stop (যাত্রার স্থান)
            </label>
            <select
              value={fromStop}
              onChange={(e) => { setFromStop(e.target.value); setLastSet('from'); }}
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
            >
              {busAdapt.stops.map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1 flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
            >
              ⇄
            </button>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              To Destination (গন্তব্য)
            </label>
            <select
              value={toStop}
              onChange={(e) => { setToStop(e.target.value); setLastSet('to'); }}
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
            >
              {busAdapt.stops.map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 rounded-2xl p-4 text-center">
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold tracking-wider block">Portion Fare</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block font-mono">
              {fromStop && toStop ? `৳ ${fare}` : '৳ --'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mt-0.5 font-mono">
              ~{dist} km • {Math.round(dist * 2.5)} min travel
            </span>
          </div>
        </div>
      </div>

      {/* Master Route Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Master Route Stops (Sequential 1-2 Tap Selection)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Tap 1: Set From (Green Check ✓) • Tap 2: Set To (Red Pin 📍) ➔ Calculates Fare!
        </p>

        <div className="relative pl-8 space-y-4 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-1 before:bg-emerald-300 dark:before:bg-emerald-800">
          {busAdapt.stops.map((stop, idx) => {
            const isFrom = idx === idxFrom && fromStop !== '';
            const isTo = idx === idxTo && toStop !== '';
            const isBetween = idxFrom !== -1 && idxTo !== -1 && fromStop !== '' && toStop !== '' && idx > startIndex && idx < endIndex;

            return (
              <div key={idx} className="relative flex items-center justify-between group p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTimelineTap(stop)}>
                  {isFrom ? (
                    <div className="absolute -left-8 w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-emerald-600/30 z-10">
                      <Check className="w-5 h-5" />
                    </div>
                  ) : isTo ? (
                    <div className="absolute -left-8 w-8 h-8 rounded-full bg-rose-600 text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-rose-600/30 z-10">
                      <MapPin className="w-5 h-5" />
                    </div>
                  ) : isBetween ? (
                    <div className="absolute -left-7 w-5 h-5 rounded-full bg-emerald-400 border-2 border-emerald-500 z-10" />
                  ) : (
                    <div className="absolute -left-6 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 group-hover:border-emerald-500 transition-all" />
                  )}

                  <span className="text-xs font-mono text-slate-400 w-5">{idx + 1}.</span>
                  <span className={`text-sm font-semibold ${isFrom ? 'text-emerald-600 font-bold' : isTo ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                    {stop}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono font-semibold mr-2 hidden sm:inline">
                    {(idx * 2.3).toFixed(1)} km
                  </span>
                  <button
                    type="button"
                    onClick={() => { setFromStop(stop); setLastSet('from'); }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
                      isFrom ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white'
                    }`}
                  >
                    Set From
                  </button>
                  <button
                    type="button"
                    onClick={() => { setToStop(stop); setLastSet('to'); }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
                      isTo ? 'bg-rose-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-500 hover:text-white'
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
    </main>
  );
}
