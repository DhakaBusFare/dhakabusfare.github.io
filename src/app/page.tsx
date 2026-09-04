'use client';

import React, { useState, useEffect } from 'react';
import { FareSearchForm } from '@/components/FareSearchForm';
import { BusCard } from '@/components/BusCard';
import { routeStore } from '@/lib/services/routeStore';
import { AdminRoute } from '@/types';
import { Bus, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const [fromStop, setFromStop] = useState('');
  const [toStop, setToStop] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [routes, setRoutes] = useState<AdminRoute[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPublicRoutes();
  }, []);

  const loadPublicRoutes = async () => {
    setIsLoading(true);
    const data = await routeStore.fetchRoutesFromApi();
    setRoutes(data);
    setIsLoading(false);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);

    // Fetch matching routes from DRF
    const allRoutes = await routeStore.fetchRoutesFromApi();
    
    // Filter routes containing both stops in sequence
    const qFrom = fromStop.toLowerCase().trim();
    const qTo = toStop.toLowerCase().trim();

    if (!qFrom && !qTo) {
      setRoutes(allRoutes);
      setIsLoading(false);
      return;
    }

    const filtered = allRoutes.filter((r) => {
      if (!qFrom || !qTo) {
        return r.stops.some(
          (s) =>
            (qFrom && (s.stop_name.toLowerCase().includes(qFrom) || (s.stop_name_bn && s.stop_name_bn.includes(qFrom)))) ||
            (qTo && (s.stop_name.toLowerCase().includes(qTo) || (s.stop_name_bn && s.stop_name_bn.includes(qTo))))
        );
      }
      const idxA = r.stops.findIndex(
        (s) => s.stop_name.toLowerCase().includes(qFrom) || (s.stop_name_bn && s.stop_name_bn.includes(qFrom))
      );
      const idxB = r.stops.findIndex(
        (s) => s.stop_name.toLowerCase().includes(qTo) || (s.stop_name_bn && s.stop_name_bn.includes(qTo))
      );
      return idxA !== -1 && idxB !== -1 && idxA !== idxB;
    });

    setRoutes(filtered);
    setIsLoading(false);
  };

  // Convert AdminRoute to Bus prop shape for BusCard compatibility
  const adaptRouteToBus = (r: AdminRoute) => {
    const stopsNames = r.stops.map((s) => s.stop_name);
    const lastStop = r.stops[r.stops.length - 1];
    const distanceKm = lastStop ? lastStop.distance_from_start_km : 15;

    return {
      id: r.id,
      name: r.name || r.route_number,
      bnName: r.name_bn || r.route_number,
      routeNo: r.route_number,
      type: 'Normal' as const,
      baseFare: 15,
      perKm: 2.45,
      minFare: 10,
      typeBg: 'bg-emerald-100 text-emerald-800',
      duration: `${Math.round(distanceKm * 2.5)} mins`,
      distanceKm,
      stops: stopsNames.length > 0 ? stopsNames : ['Start', 'Destination'],
    };
  };

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-6 md:pt-10">
      {/* Hero Title Banner */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Official BRTA Dhaka City Rate Matrix 2026 (Connected to Supabase Data API)
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Find Exact Bus Fares <br className="hidden sm:inline" /> Across Dhaka City
        </h2>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-2 font-bangla">
          ঢাকা শহরের যেকোনো রুট ও বাস স্টপের ভাড়া জানুন কয়েক সেকেন্ডেই।
        </p>
      </div>

      {/* Search Fare Calculator Card */}
      <FareSearchForm
        fromStop={fromStop}
        toStop={toStop}
        onFromChange={setFromStop}
        onToChange={setToStop}
        onSearch={handleSearch}
      />

      {/* Initial Empty State vs Search Results */}
      {isLoading ? (
        <div className="text-center py-16 px-4 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 mb-8 space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Querying Supabase Data API...</p>
        </div>
      ) : !hasSearched ? (
        <div className="text-center py-12 px-4 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Bus className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Select From & To Stations</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 font-bangla">
            আপনার কাঙ্ক্ষিত স্টপ সিলেক্ট করুন এবং 'Show Fare' বাটনে চাপ দিয়ে উপলব্ধ বাস ও ভাড়ার বিবরণ দেখুন।
          </p>
        </div>
      ) : (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Available Buses</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold font-mono">
                  {routes.length} Options Found
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Search segment:{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">{fromStop || 'Start'}</span> ➔{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">{toStop || 'Destination'}</span>
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400 font-mono">Supabase Data API Powered</span>
          </div>

          {routes.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 text-slate-500 text-xs">
              No bus routes found connecting <strong className="text-amber-500">{fromStop}</strong> to <strong className="text-amber-500">{toStop}</strong>.
            </div>
          ) : (
            <div className="space-y-4">
              {routes.map((route) => {
                const busData = adaptRouteToBus(route);
                return (
                  <BusCard
                    key={route.id}
                    bus={busData}
                    initialFrom={fromStop}
                    initialTo={toStop}
                    onOpenPdf={() => window.open(`/admin/routes/${route.id}`, '_blank')}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
