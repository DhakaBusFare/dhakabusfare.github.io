'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { routeStore } from '@/lib/services/routeStore';
import { AdminRoute } from '@/types';
import {
  Key,
  Plus,
  Trash2,
  ArrowLeft,
  Search,
  Edit3,
  CheckCircle2,
  XCircle,
  MapPin,
  Route as RouteIcon,
  AlertTriangle,
  Layers,
  RefreshCw,
} from 'lucide-react';

export default function AdminConsolePage() {
  const [routes, setRoutes] = useState<AdminRoute[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminRoute | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setIsLoading(true);
    const data = await routeStore.fetchRoutesFromApi();
    setRoutes(data);
    setIsLoading(false);
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleStatus = async (route: AdminRoute) => {
    const updated = await routeStore.toggleRouteStatusAsync(route.id);
    if (updated) {
      setRoutes((prev) => prev.map((r) => (r.id === route.id ? updated : r)));
      showNotification(`Route ${route.route_number} status changed to ${updated.is_active ? 'Active' : 'Inactive'}.`);
    } else {
      showNotification('Failed to update route status.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const success = await routeStore.deleteRouteAsync(deleteTarget.id);
    if (success) {
      setRoutes((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      showNotification(`Route "${deleteTarget.route_number}" deleted successfully.`, 'error');
    } else {
      showNotification('Failed to delete route.', 'error');
    }
    setDeleteTarget(null);
  };

  // Filter routes based on search query
  const filteredRoutes = routes.filter((r) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      r.route_number.toLowerCase().includes(query) ||
      r.name.toLowerCase().includes(query) ||
      (r.name_bn && r.name_bn.toLowerCase().includes(query)) ||
      r.stops.some((s) => s.stop_name.toLowerCase().includes(query) || (s.stop_name_bn && s.stop_name_bn.toLowerCase().includes(query)))
    );
  });

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-6 space-y-8 pb-16 text-slate-900 dark:text-slate-100">
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

      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black shadow-inner">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <span>DhakaBusFare Admin Console</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-500/30 font-mono">
                Supabase Data API
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Powered by Supabase Data API & PostgreSQL tables.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 self-start sm:self-auto shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Back to Public App
        </Link>
      </div>

      {/* Action & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 inline-block">
            BRTA Authorized Bus Route Management
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Available Bus Routes</h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Create, edit, or configure routes, route stop sequences, and pair-wise fare matrix pricing models across all transit corridors in Dhaka city.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={loadRoutes}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            title="Refresh routes from Supabase Data API"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/routes/new"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Route</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by route number, name, or stop..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 self-end sm:self-auto">
          <span>Showing <strong className="text-slate-900 dark:text-white">{filteredRoutes.length}</strong> of <strong className="text-slate-900 dark:text-white">{routes.length}</strong> routes</span>
        </div>
      </div>

      {/* Routes Grid / List */}
      {isLoading ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fetching route data from Supabase Data API...</p>
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800">
          <RouteIcon className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Routes Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery ? `No routes match your search "${searchQuery}".` : 'No bus routes have been added yet.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Reset Search Filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => {
            const startStop = route.stops[0]?.stop_name || 'Start';
            const endStop = route.stops[route.stops.length - 1]?.stop_name || 'End';
            const totalDistance = route.stops[route.stops.length - 1]?.distance_from_start_km || 0;
            const combinationCount = (route.stops.length * (route.stops.length - 1)) / 2;

            return (
              <div
                key={route.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all p-6 flex flex-col justify-between shadow-md hover:shadow-xl group"
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 font-mono">
                      {route.route_number}
                    </span>

                    <button
                      onClick={() => handleToggleStatus(route)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${
                        route.is_active
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                      title="Click to toggle Active status"
                    >
                      {route.is_active ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-slate-400" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-1">
                    {route.name || route.route_number}
                  </h3>
                  {route.name_bn && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{route.name_bn}</p>
                  )}
                  {route.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {route.description}
                    </p>
                  )}

                  {/* Route Stop Quick Info */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{startStop} ➔ {endStop}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-500 dark:text-slate-400 font-mono">
                      <div className="bg-slate-50 dark:bg-slate-950/60 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-sans">Stops Count</span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs">{route.stops.length} Stops</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-950/60 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-sans">Distance</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 text-xs">{totalDistance} km</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-mono">
                    <Layers className="w-3 h-3 text-slate-400" />
                    {combinationCount} Fare Pairs
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/routes/${route.id}`}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all border border-amber-200 dark:border-amber-500/30 flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit & Details</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(route)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-colors"
                      title="Delete Route"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-500/10 border border-rose-300 dark:border-rose-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Delete Route?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 leading-relaxed">
              Are you sure you want to delete <strong className="text-amber-600 dark:text-amber-400">{deleteTarget.route_number}</strong> ({deleteTarget.name}) and all its associated route stops and pair-wise fare entries?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-950/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
