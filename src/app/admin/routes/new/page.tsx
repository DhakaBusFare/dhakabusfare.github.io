'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { routeStore } from '@/lib/services/routeStore';
import { DHAKA_STOPS } from '@/lib/data/mockData';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  AlertTriangle,
  MoveUp,
  MoveDown,
  MapPin,
  Route as RouteIcon,
  ListPlus,
} from 'lucide-react';

interface StopDraft {
  stop_id: string;
  stop_name: string;
  stop_name_bn: string;
  sequence: number;
  distance_from_start_km: number;
  is_major_stop: boolean;
}

export default function AddNewRoutePage() {
  const router = useRouter();

  // Route General Fields
  const [routeNumber, setRouteNumber] = useState('');
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // RouteStops Draft State
  const [stops, setStops] = useState<StopDraft[]>([
    {
      stop_id: DHAKA_STOPS[0].id,
      stop_name: DHAKA_STOPS[0].en,
      stop_name_bn: DHAKA_STOPS[0].bn,
      sequence: 1,
      distance_from_start_km: 0.0,
      is_major_stop: true,
    },
    {
      stop_id: DHAKA_STOPS[1].id,
      stop_name: DHAKA_STOPS[1].en,
      stop_name_bn: DHAKA_STOPS[1].bn,
      sequence: 2,
      distance_from_start_km: 2.5,
      is_major_stop: false,
    },
    {
      stop_id: DHAKA_STOPS[4].id,
      stop_name: DHAKA_STOPS[4].en,
      stop_name_bn: DHAKA_STOPS[4].bn,
      sequence: 3,
      distance_from_start_km: 8.4,
      is_major_stop: true,
    },
  ]);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add a new stop row to the route
  const handleAddStop = () => {
    const nextSeq = stops.length + 1;
    const availableStop = DHAKA_STOPS.find(
      (ds) => !stops.some((s) => s.stop_id === ds.id)
    ) || DHAKA_STOPS[Math.min(nextSeq, DHAKA_STOPS.length - 1)];

    const lastDist = stops.length > 0 ? stops[stops.length - 1].distance_from_start_km : 0;
    setStops([
      ...stops,
      {
        stop_id: availableStop ? availableStop.id : `custom-${nextSeq}`,
        stop_name: availableStop ? availableStop.en : `Stop ${nextSeq}`,
        stop_name_bn: availableStop ? availableStop.bn : '',
        sequence: nextSeq,
        distance_from_start_km: parseFloat((lastDist + 2.5).toFixed(1)),
        is_major_stop: false,
      },
    ]);
  };

  // Remove stop
  const handleRemoveStop = (index: number) => {
    if (stops.length <= 2) {
      setErrorMessage('A route must have at least 2 stops.');
      return;
    }
    const updated = stops
      .filter((_, i) => i !== index)
      .map((s, idx) => ({ ...s, sequence: idx + 1 }));
    setStops(updated);
    setErrorMessage('');
  };

  // Move stop up/down
  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === stops.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...stops];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate sequences
    const reordered = updated.map((s, idx) => ({ ...s, sequence: idx + 1 }));
    setStops(reordered);
  };

  // Handle stop selection change
  const handleStopSelect = (index: number, selectedStopId: string) => {
    const matched = DHAKA_STOPS.find((s) => s.id === selectedStopId);
    const updated = [...stops];
    if (matched) {
      updated[index].stop_id = matched.id;
      updated[index].stop_name = matched.en;
      updated[index].stop_name_bn = matched.bn;
    } else {
      updated[index].stop_id = selectedStopId;
      updated[index].stop_name = selectedStopId;
    }
    setStops(updated);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!routeNumber.trim()) {
      setErrorMessage('Route Number is required (e.g. "Route 101" or "R-12").');
      return;
    }

    if (stops.length < 2) {
      setErrorMessage('A route must contain at least 2 stops.');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await routeStore.createRouteAsync({
        route_number: routeNumber.trim(),
        name: name.trim() || routeNumber.trim(),
        name_bn: nameBn.trim(),
        description: description.trim(),
        is_active: isActive,
        stops: stops.map((s) => ({
          id: `rs-${Date.now()}-${s.sequence}`,
          route_id: '',
          stop_id: s.stop_id,
          stop_name: s.stop_name,
          stop_name_bn: s.stop_name_bn,
          sequence: s.sequence,
          distance_from_start_km: Number(s.distance_from_start_km) || 0,
          is_major_stop: s.is_major_stop,
        })),
      });

      router.push(`/admin/routes/${created.id}`);
    } catch {
      setErrorMessage('Failed to create route. Please check input values.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-6 space-y-8 pb-16 text-slate-900 dark:text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black">
            <ListPlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <span>Create New Bus Route</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add a new Django Route model with initial RouteStops sequence.</p>
          </div>
        </div>

        <Link
          href="/admin"
          className="text-xs px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Back to Admin Routes
        </Link>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Route Metadata (Django Route Model) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <RouteIcon className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Route General Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Route Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Route Number / Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={routeNumber}
                onChange={(e) => setRouteNumber(e.target.value)}
                placeholder="e.g. Route 101 or R-15"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-bold"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Unique Identifier for this bus route (Django <code className="text-amber-600 dark:text-amber-400">route_number</code>).</p>
            </div>

            {/* Status Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Route Status</label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-full px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>Status: {isActive ? 'Active (Operational)' : 'Inactive (Draft/Suspended)'}</span>
                <span className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-500 shadow-sm' : 'bg-slate-400'}`} />
              </button>
            </div>

            {/* English Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Route Name (English)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Savar - Gabtoli - Motijheel"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-semibold"
              />
            </div>

            {/* Bangla Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Route Name (Bangla / বাংলা)</label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="যেমন: সাভার - গাবতলী - মতিঝিল"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-semibold"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Route Description & Service Details</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide overview of bus route service, operating hours, corridor stops, etc."
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: RouteStops Sequence Builder (Django RouteStop Model) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  2. RouteStops Sequence Builder
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Connect physical stops in order. Distance is measured cumulatively from start (0.0 km).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddStop}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/20 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stop</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-950/50">
                  <th className="p-3 w-16 text-center">Seq #</th>
                  <th className="p-3">Bus Stop Location</th>
                  <th className="p-3 w-32">Cum. Dist (km)</th>
                  <th className="p-3 w-28 text-center">Major Stop?</th>
                  <th className="p-3 w-28 text-center">Re-order</th>
                  <th className="p-3 w-16 text-center">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {stops.map((stopItem, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Sequence */}
                    <td className="p-3 text-center">
                      <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-extrabold flex items-center justify-center mx-auto text-xs border border-amber-300 dark:border-amber-500/30">
                        {stopItem.sequence}
                      </span>
                    </td>

                    {/* Stop Selector */}
                    <td className="p-3">
                      <select
                        value={stopItem.stop_id}
                        onChange={(e) => handleStopSelect(idx, e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-amber-500/50"
                      >
                        {DHAKA_STOPS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.en} ({s.bn}) — {s.area}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Distance from Start */}
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={stopItem.distance_from_start_km}
                          onChange={(e) => {
                            const updated = [...stops];
                            updated[idx].distance_from_start_km = parseFloat(e.target.value) || 0;
                            setStops(updated);
                          }}
                          className="w-20 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-amber-600 dark:text-amber-400 font-mono font-bold text-center"
                        />
                        <span className="text-slate-400 font-mono text-[11px]">km</span>
                      </div>
                    </td>

                    {/* Major Stop Toggle */}
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={stopItem.is_major_stop}
                        onChange={(e) => {
                          const updated = [...stops];
                          updated[idx].is_major_stop = e.target.checked;
                          setStops(updated);
                        }}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-amber-500 focus:ring-amber-500"
                      />
                    </td>

                    {/* Re-order Up/Down */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveStop(idx, 'up')}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 transition-colors"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === stops.length - 1}
                          onClick={() => handleMoveStop(idx, 'down')}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 transition-colors"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Remove */}
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(idx)}
                        className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/admin"
            className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-xl shadow-emerald-950/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Creating Route...' : 'Save & Build Route'}</span>
          </button>
        </div>
      </form>
    </main>
  );
}
