'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { routeStore } from '@/lib/services/routeStore';
import { DHAKA_STOPS } from '@/lib/data/mockData';
import { AdminRoute, AdminRouteStop, AdminFarePair } from '@/types';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  MoveUp,
  MoveDown,
  MapPin,
  Route as RouteIcon,
  Search,
  DollarSign,
  Info,
  X,
  FileText,
  ShieldCheck,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export default function RouteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const routeId = params.id as string;

  const [route, setRoute] = useState<AdminRoute | null>(null);
  const [routeNumber, setRouteNumber] = useState('');
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Route Stops State
  const [stops, setStops] = useState<AdminRouteStop[]>([]);

  // Pair-wise Fares State
  const [farePairs, setFarePairs] = useState<AdminFarePair[]>([]);
  const [pairFilter, setPairFilter] = useState('');

  // UI state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [validationError, setValidationError] = useState('');
  const [isAddStopModalOpen, setIsAddStopModalOpen] = useState(false);
  const [selectedNewStopId, setSelectedNewStopId] = useState(DHAKA_STOPS[0]?.id || '');
  const [newStopDistance, setNewStopDistance] = useState(0);

  useEffect(() => {
    if (routeId) {
      loadRouteData();
    }
  }, [routeId]);

  const loadRouteData = async () => {
    const result = await routeStore.fetchRouteByIdFromApi(routeId);
    if (!result) {
      setValidationError('Route not found.');
      return;
    }
    const { route: data, farePairs: fares } = result;
    setRoute(data);
    setRouteNumber(data.route_number);
    setName(data.name);
    setNameBn(data.name_bn);
    setDescription(data.description);
    setIsActive(data.is_active);
    setStops(data.stops || []);
    setFarePairs(fares);
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Re-generate pairwise fares whenever stops change
  const handleStopsChange = (updatedStops: AdminRouteStop[]) => {
    setStops(updatedStops);
    if (route) {
      const dummyRoute: AdminRoute = { ...route, stops: updatedStops };
      const recomputedFares = routeStore.getPairwiseFares(routeId);
      setFarePairs(recomputedFares);
    }
  };

  // Open Add Stop Modal
  const handleOpenAddStopModal = () => {
    const unadded = DHAKA_STOPS.find((ds) => !stops.some((s) => s.stop_id === ds.id)) || DHAKA_STOPS[0];
    setSelectedNewStopId(unadded ? unadded.id : DHAKA_STOPS[0].id);
    const lastDist = stops.length > 0 ? stops[stops.length - 1].distance_from_start_km : 0;
    setNewStopDistance(parseFloat((lastDist + 2.5).toFixed(1)));
    setIsAddStopModalOpen(true);
  };

  // Confirm Add Stop from Modal
  const handleConfirmAddStop = () => {
    const matched = DHAKA_STOPS.find((s) => s.id === selectedNewStopId);
    if (!matched) return;

    const nextSeq = stops.length + 1;
    const newStop: AdminRouteStop = {
      id: `rs-${routeId}-${Date.now()}`,
      route_id: routeId,
      stop_id: matched.id,
      stop_name: matched.en,
      stop_name_bn: matched.bn,
      sequence: nextSeq,
      distance_from_start_km: Number(newStopDistance) || 0,
      is_major_stop: false,
    };

    handleStopsChange([...stops, newStop]);
    setIsAddStopModalOpen(false);
  };

  // Remove stop row
  const handleRemoveStop = (index: number) => {
    if (stops.length <= 2) {
      showNotification('A route must maintain at least 2 stops.', 'error');
      return;
    }
    const updated = stops
      .filter((_, i) => i !== index)
      .map((s, idx) => ({ ...s, sequence: idx + 1 }));
    handleStopsChange(updated);
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

    const reordered = updated.map((s, idx) => ({ ...s, sequence: idx + 1 }));
    handleStopsChange(reordered);
  };

  // Fare pair input change
  const handleFareAmountChange = (pairId: string, newAmountStr: string) => {
    const amountNum = parseFloat(newAmountStr) || 0;
    setFarePairs((prev) =>
      prev.map((f) => (f.id === pairId ? { ...f, amount: amountNum } : f))
    );
  };

  // Save All Changes (Route info + stops + pairwise fare matrix)
  const handleSaveAll = async () => {
    setValidationError('');

    if (!routeNumber.trim()) {
      setValidationError('Route Number cannot be empty.');
      return;
    }

    if (stops.length < 2) {
      setValidationError('A route must have at least 2 stops.');
      return;
    }

    // Check minimum fare validation (Django constraint: amount >= 10.0)
    const invalidFarePair = farePairs.find((f) => f.amount < 10);
    if (invalidFarePair) {
      showNotification(
        `Fare pair (${invalidFarePair.stop_a_name} ➔ ${invalidFarePair.stop_b_name}) is ৳${invalidFarePair.amount}. Minimum fare allowed is ৳10.00 tk.`,
        'error'
      );
      return;
    }

    // Save updated route info & stops & pairwise matrix
    const result = await routeStore.updateRouteAsync(
      routeId,
      {
        route_number: routeNumber.trim(),
        name: name.trim(),
        name_bn: nameBn.trim(),
        description: description.trim(),
        is_active: isActive,
        stops,
      },
      farePairs
    );

    if (result) {
      setRoute(result.route);
      setFarePairs(result.farePairs);
      showNotification(`Route "${result.route.route_number}" and Pair-wise Fare Matrix saved successfully!`);
    } else {
      showNotification('Failed to update route.', 'error');
    }
  };

  if (!route && !validationError) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500 dark:text-slate-400">
        Loading route details...
      </main>
    );
  }

  if (validationError && !route) {
    return (
      <main className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Route Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">The requested route ID "{routeId}" does not exist.</p>
        <Link
          href="/admin"
          className="inline-block px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
        >
          Return to Admin Routes List
        </Link>
      </main>
    );
  }

  // Filter fare pairs for UI display
  const filteredFarePairs = farePairs.filter((pair) => {
    const q = pairFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      pair.stop_a_name.toLowerCase().includes(q) ||
      pair.stop_b_name.toLowerCase().includes(q)
    );
  });

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-6 space-y-8 pb-20 text-slate-900 dark:text-slate-100">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/90 border-rose-300 dark:border-rose-500/40 text-rose-900 dark:text-rose-300'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black">
            <RouteIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <span>Route Details & Matrix Editor</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-500/30 font-mono">
                {routeNumber}
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure route parameters, stop sequence, and full pair-wise fare matrix.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/admin"
            className="text-xs px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Back to Routes List
          </Link>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* SECTION 1: Route General Info Editing (Full Width) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-5">
        <h2 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <RouteIcon className="w-4 h-4" />
          <span>1. Route Parameters (Django Route Model)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Route Number</label>
            <input
              type="text"
              value={routeNumber}
              onChange={(e) => setRouteNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Active Status</label>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-full px-3.5 py-2.5 rounded-xl border font-bold transition-all text-left flex items-center justify-between ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>{isActive ? 'Active' : 'Inactive'}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </button>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">English Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Bangla Name</label>
            <input
              type="text"
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* SECTION: Official PDF Route Document Viewer */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-4">
        {/* Notice Above PDF Frame */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 text-amber-900 dark:text-amber-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Official Bus Route Document</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Please refer to the route number : <strong className="text-amber-600 dark:text-amber-400 font-mono text-sm font-bold">{routeNumber}</strong> for more detail.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-slate-900 text-amber-400 border border-amber-500/30 font-mono shrink-0 hidden sm:inline-block">
            Protected View
          </span>
        </div>

        {/* Protected PDF Viewer Container */}
        <div
          id="next-pdf-viewer-container"
          className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex flex-col h-[520px] transition-all"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="bg-slate-900 text-white px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 text-xs select-none">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-200 text-xs">Route Specification Document Viewer</span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <button
                type="button"
                onClick={() => {
                  const container = document.getElementById('next-pdf-viewer-container');
                  if (container) {
                    if (!document.fullscreenElement) container.requestFullscreen();
                    else document.exitFullscreen();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                title="View in Full Screen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full Screen</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden bg-slate-950 flex flex-col items-center justify-center relative select-none p-4">
            <iframe
              src="/static/docs/official_route_document.pdf#toolbar=0&navpanes=0&scrollbar=0"
              className="w-full h-full rounded border-0 pointer-events-auto"
              title={`Route ${routeNumber} Document`}
            />
            <div 
              className="absolute inset-0 bg-transparent pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: RouteStops Sequence & Distance Manager (Full Width with Plain Text Stop Names) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>2. RouteStops Sequence ({stops.length} Stops)</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Modifying stop sequence or distance automatically updates all pairwise fare combinations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddStopModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/10"
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
                <th className="p-3 w-36">Cum. Distance (km)</th>
                <th className="p-3 w-28 text-center">Major Stop?</th>
                <th className="p-3 w-28 text-center">Re-order</th>
                <th className="p-3 w-20 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {stops.map((stopItem, idx) => (
                <tr key={stopItem.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Seq */}
                  <td className="p-3 text-center">
                    <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-extrabold flex items-center justify-center mx-auto text-xs border border-amber-300 dark:border-amber-500/30 font-mono">
                      {stopItem.sequence}
                    </span>
                  </td>

                  {/* Plain Text Bus Stop Location */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{stopItem.stop_name}</span>
                      {stopItem.stop_name_bn && (
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">({stopItem.stop_name_bn})</span>
                      )}
                    </div>
                  </td>

                  {/* Cumulative Distance */}
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
                          handleStopsChange(updated);
                        }}
                        className="w-24 px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-amber-600 dark:text-amber-400 font-mono font-bold text-center"
                      />
                      <span className="text-slate-400 font-mono text-[11px]">km</span>
                    </div>
                  </td>

                  {/* Major Stop Flag */}
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={stopItem.is_major_stop}
                      onChange={(e) => {
                        const updated = [...stops];
                        updated[idx].is_major_stop = e.target.checked;
                        handleStopsChange(updated);
                      }}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-amber-500"
                    />
                  </td>

                  {/* Move controls */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveStop(idx, 'up')}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 transition-colors"
                        title="Move Up"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === stops.length - 1}
                        onClick={() => handleMoveStop(idx, 'down')}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 transition-colors"
                        title="Move Down"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                  {/* Delete */}
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
                      title="Remove Stop"
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

      {/* SECTION 3: Pair-wise Combinations & Fare Matrix Editor (Full Width Container) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <span>3. Full Pair-wise Fare Matrix ({farePairs.length} Combinations)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Full width pricing matrix across all stop combination pairs ($seq_A &lt; seq_B$). Modify fare amounts as needed.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search filter combination input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={pairFilter}
                onChange={(e) => setPairFilter(e.target.value)}
                placeholder="Filter stop pair combinations..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
        </div>

        {/* Minimum Fare Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Django model validation enforces a minimum fare of <strong>৳10.00 BDT</strong> per combination pair. Default calculated rates are ~৳2.45/km.</span>
        </div>

        {/* Spacious Full Width Pair Fares Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredFarePairs.length === 0 ? (
            <div className="col-span-full text-center py-10 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              No combination pairs matching search filter "{pairFilter}".
            </div>
          ) : (
            filteredFarePairs.map((pair) => (
              <div
                key={pair.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/70 hover:border-amber-300 dark:hover:border-amber-500/40 transition-all flex items-center justify-between gap-4 shadow-sm hover:shadow-md"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-extrabold border border-amber-300 dark:border-amber-500/30">
                      #{pair.stop_a_seq}
                    </span>
                    <span className="truncate text-slate-900 dark:text-white font-black">{pair.stop_a_name}</span>
                    <span className="text-amber-500 font-black text-sm">➔</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-extrabold border border-amber-300 dark:border-amber-500/30">
                      #{pair.stop_b_seq}
                    </span>
                    <span className="truncate text-slate-900 dark:text-white font-black">{pair.stop_b_name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2 pt-0.5">
                    <span>Distance: <strong className="text-slate-800 dark:text-slate-200">{pair.distance_km} km</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 font-bold text-sm">৳</span>
                  <input
                    type="number"
                    min="10"
                    value={pair.amount}
                    onChange={(e) => handleFareAmountChange(pair.id, e.target.value)}
                    className={`w-24 px-3 py-1.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-950 text-amber-600 dark:text-amber-300 font-mono font-bold text-center focus:ring-2 ${
                      pair.amount < 10
                        ? 'border-rose-500 ring-rose-500 text-rose-600'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-amber-500/50'
                    }`}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Save Action Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Clicking save updates Route parameters, stop sequences, and fare amounts.
          </div>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 hover:from-amber-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-xl transition-all active:scale-98"
          >
            Save Route & Pair Fares Matrix
          </button>
        </div>
      </div>

      {/* Add Stop Modal */}
      {isAddStopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Add Stop to Route Sequence</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddStopModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Select Physical Stop Location</label>
              <select
                value={selectedNewStopId}
                onChange={(e) => setSelectedNewStopId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-amber-500/50"
              >
                {DHAKA_STOPS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.en} ({s.bn}) — {s.area}
                  </option>
                ))}
              </select>

              <label className="font-bold text-slate-700 dark:text-slate-300 block pt-2">Cumulative Distance from Start (km)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={newStopDistance}
                onChange={(e) => setNewStopDistance(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-amber-600 dark:text-amber-400 font-mono font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsAddStopModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAddStop}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/20"
              >
                Confirm Add Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
