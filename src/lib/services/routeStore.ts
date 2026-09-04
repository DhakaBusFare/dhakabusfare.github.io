import { AdminRoute, AdminRouteStop, AdminFarePair } from '@/types';
import { DHAKA_STOPS, MOCK_BUSES } from '@/lib/data/mockData';
import { supabase } from '@/lib/supabaseClient';

const STORAGE_KEY_ROUTES = 'dhaka_bus_fare_admin_routes';
const STORAGE_KEY_FARES = 'dhaka_bus_fare_admin_fares';

// Helper to seed initial routes from mock data if local/fallback
function getInitialRoutes(): AdminRoute[] {
  return MOCK_BUSES.map((bus, idx) => {
    const routeId = `route-${bus.id}`;
    const dateStr = new Date(Date.now() - idx * 86400000).toISOString();
    
    const stops: AdminRouteStop[] = bus.stops.map((stopName, sIdx) => {
      const matchedStop = DHAKA_STOPS.find(
        (s) => s.en.toLowerCase() === stopName.toLowerCase() || s.bn === stopName
      );
      const stopId = matchedStop ? matchedStop.id : `stop-${sIdx}`;
      const dist = parseFloat((sIdx * (bus.distanceKm / Math.max(1, bus.stops.length - 1))).toFixed(1));
      return {
        id: `rs-${routeId}-${sIdx + 1}`,
        route_id: routeId,
        stop_id: stopId,
        stop_name: matchedStop ? matchedStop.en : stopName,
        stop_name_bn: matchedStop ? matchedStop.bn : '',
        sequence: sIdx + 1,
        distance_from_start_km: dist,
        is_major_stop: sIdx === 0 || sIdx === bus.stops.length - 1 || sIdx % 2 === 0,
      };
    });

    return {
      id: routeId,
      route_number: bus.routeNo,
      name: `${bus.name} (${bus.stops[0]} ↔ ${bus.stops[bus.stops.length - 1]})`,
      name_bn: bus.bnName,
      description: `Bus operator ${bus.name} operating on route ${bus.routeNo}. Base fare: ৳${bus.baseFare}, Per km: ৳${bus.perKm}.`,
      is_active: true,
      stops,
      created_at: dateStr,
      updated_at: dateStr,
    };
  });
}

// Calculate pairwise fares for N stops: N*(N-1)/2 combinations
export function generatePairwiseFares(route: AdminRoute, existingFares: AdminFarePair[] = []): AdminFarePair[] {
  const sortedStops = [...route.stops].sort((a, b) => a.sequence - b.sequence);
  const result: AdminFarePair[] = [];
  const fareMap = new Map<string, number>();

  existingFares.forEach((f) => {
    fareMap.set(`${f.stop_a_id}_${f.stop_b_id}`, f.amount);
    fareMap.set(`${f.stop_b_id}_${f.stop_a_id}`, f.amount);
  });

  for (let i = 0; i < sortedStops.length; i++) {
    for (let j = i + 1; j < sortedStops.length; j++) {
      const stopA = sortedStops[i];
      const stopB = sortedStops[j];
      const dist = Math.abs(stopB.distance_from_start_km - stopA.distance_from_start_km);
      const pairKey = `${stopA.stop_id || stopA.id}_${stopB.stop_id || stopB.id}`;

      let amount = fareMap.get(pairKey);
      if (amount === undefined) {
        amount = Math.max(10, Math.round(15 + dist * 2.45));
      }

      result.push({
        id: `fare-${route.id}-${stopA.id}-${stopB.id}`,
        route_id: route.id,
        stop_a_id: stopA.stop_id || stopA.id,
        stop_b_id: stopB.stop_id || stopB.id,
        stop_a_name: stopA.stop_name,
        stop_b_name: stopB.stop_name,
        stop_a_seq: stopA.sequence,
        stop_b_seq: stopB.sequence,
        distance_km: parseFloat(dist.toFixed(1)),
        amount,
      });
    }
  }

  return result;
}

export const routeStore = {
  // Local synchronous fallback method
  getRoutes(): AdminRoute[] {
    if (typeof window === 'undefined') return getInitialRoutes();
    try {
      const item = localStorage.getItem(STORAGE_KEY_ROUTES);
      if (!item) {
        const initial = getInitialRoutes();
        localStorage.setItem(STORAGE_KEY_ROUTES, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(item);
    } catch {
      return getInitialRoutes();
    }
  },

  // Async Supabase Data API method for fetching routes directly
  async fetchRoutesFromApi(query: string = ''): Promise<AdminRoute[]> {
    try {
      let req = supabase.from('routes').select('*, route_stops(*, stops(*))');
      if (query) {
        req = req.or(`name.ilike.%${query}%,route_number.ilike.%${query}%`);
      }
      const { data, error } = await req;
      if (!error && data && Array.isArray(data) && data.length > 0) {
        const formatted: AdminRoute[] = data.map((r: any) => ({
          id: r.id,
          route_number: r.route_number || r.routeNo,
          name: r.name,
          name_bn: r.name_bn,
          description: r.description,
          is_active: r.is_active ?? true,
          stops: (r.route_stops || []).map((rs: any) => ({
            id: rs.id,
            route_id: r.id,
            stop_id: rs.stop_id,
            stop_name: rs.stops?.name || rs.stop_name || 'Stoppage',
            stop_name_bn: rs.stops?.name_bn || rs.stop_name_bn || '',
            sequence: rs.sequence,
            distance_from_start_km: rs.distance_from_start_km || 0,
            is_major_stop: rs.is_major_stop ?? false,
          })),
          created_at: r.created_at,
          updated_at: r.updated_at,
        }));

        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_ROUTES, JSON.stringify(formatted));
        }
        return formatted;
      }
    } catch (e) {
      console.warn('Supabase routes query fallback:', e);
    }
    return this.getRoutes();
  },

  getRouteById(id: string): AdminRoute | null {
    const routes = this.getRoutes();
    return routes.find((r) => r.id === id) || null;
  },

  async fetchRouteByIdFromApi(id: string): Promise<{ route: AdminRoute; farePairs: AdminFarePair[] } | null> {
    try {
      const { data, error } = await supabase.from('routes').select('*, route_stops(*, stops(*))').eq('id', id).single();
      if (!error && data) {
        const formattedRoute: AdminRoute = {
          id: data.id,
          route_number: data.route_number,
          name: data.name,
          name_bn: data.name_bn,
          description: data.description,
          is_active: data.is_active ?? true,
          stops: (data.route_stops || []).map((rs: any) => ({
            id: rs.id,
            route_id: data.id,
            stop_id: rs.stop_id,
            stop_name: rs.stops?.name || rs.stop_name || 'Stoppage',
            stop_name_bn: rs.stops?.name_bn || rs.stop_name_bn || '',
            sequence: rs.sequence,
            distance_from_start_km: rs.distance_from_start_km || 0,
            is_major_stop: rs.is_major_stop ?? false,
          })),
          created_at: data.created_at,
          updated_at: data.updated_at,
        };

        const { data: faresData } = await supabase.from('fare_pairs').select('*').eq('route_id', id);
        const farePairs = (faresData && Array.isArray(faresData) && faresData.length > 0)
          ? faresData.map((f: any) => ({
              id: f.id,
              route_id: f.route_id,
              stop_a_id: f.stop_a_id,
              stop_b_id: f.stop_b_id,
              stop_a_name: f.stop_a_name,
              stop_b_name: f.stop_b_name,
              stop_a_seq: f.stop_a_seq,
              stop_b_seq: f.stop_b_seq,
              distance_km: f.distance_km,
              amount: f.amount,
            }))
          : generatePairwiseFares(formattedRoute);

        return { route: formattedRoute, farePairs };
      }
    } catch (e) {
      console.warn('Supabase fetchRouteById error fallback:', e);
    }

    const local = this.getRouteById(id);
    if (local) {
      return {
        route: local,
        farePairs: this.getPairwiseFares(id),
      };
    }
    return null;
  },

  async createRouteAsync(
    routeData: Omit<AdminRoute, 'id' | 'created_at' | 'updated_at'>
  ): Promise<AdminRoute> {
    try {
      const { data, error } = await supabase.from('routes').insert([{
        route_number: routeData.route_number,
        name: routeData.name,
        name_bn: routeData.name_bn,
        description: routeData.description,
        is_active: routeData.is_active,
      }]).select().single();

      if (!error && data) {
        return {
          ...routeData,
          id: data.id,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
      }
    } catch (e) {
      console.warn('Supabase createRouteAsync fallback:', e);
    }
    return this.createRoute(routeData);
  },

  createRoute(
    routeData: Omit<AdminRoute, 'id' | 'created_at' | 'updated_at'>
  ): AdminRoute {
    const routes = this.getRoutes();
    const newId = `route-${Date.now()}`;
    const now = new Date().toISOString();

    const stopsWithIds: AdminRouteStop[] = routeData.stops.map((s, idx) => ({
      ...s,
      id: s.id || `rs-${newId}-${idx + 1}`,
      route_id: newId,
      sequence: s.sequence || idx + 1,
    }));

    const newRoute: AdminRoute = {
      ...routeData,
      id: newId,
      stops: stopsWithIds,
      created_at: now,
      updated_at: now,
    };

    routes.unshift(newRoute);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ROUTES, JSON.stringify(routes));
    }
    return newRoute;
  },

  async updateRouteAsync(
    id: string,
    routeData: Partial<AdminRoute>,
    farePairs?: AdminFarePair[]
  ): Promise<{ route: AdminRoute; farePairs: AdminFarePair[] } | null> {
    try {
      const { data, error } = await supabase.from('routes').update({
        route_number: routeData.route_number,
        name: routeData.name,
        name_bn: routeData.name_bn,
        description: routeData.description,
        is_active: routeData.is_active,
      }).eq('id', id).select().single();

      if (!error && data) {
        const updated = this.updateRoute(id, routeData) || {
          ...data,
          stops: routeData.stops || [],
        };
        if (farePairs) this.savePairwiseFares(id, farePairs);
        return {
          route: updated,
          farePairs: farePairs || this.getPairwiseFares(id),
        };
      }
    } catch (e) {
      console.warn('Supabase updateRouteAsync fallback:', e);
    }

    const updated = this.updateRoute(id, routeData);
    if (updated) {
      if (farePairs) this.savePairwiseFares(id, farePairs);
      return {
        route: updated,
        farePairs: this.getPairwiseFares(id),
      };
    }
    return null;
  },

  updateRoute(
    id: string,
    routeData: Partial<AdminRoute>
  ): AdminRoute | null {
    const routes = this.getRoutes();
    const index = routes.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString();
    const existing = routes[index];

    let stops = existing.stops;
    if (routeData.stops) {
      stops = routeData.stops.map((s, idx) => ({
        ...s,
        id: s.id || `rs-${id}-${idx + 1}`,
        route_id: id,
        sequence: s.sequence || idx + 1,
      }));
    }

    const updatedRoute: AdminRoute = {
      ...existing,
      ...routeData,
      stops,
      updated_at: now,
    };

    routes[index] = updatedRoute;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ROUTES, JSON.stringify(routes));
    }
    return updatedRoute;
  },

  async deleteRouteAsync(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('routes').delete().eq('id', id);
      if (!error) {
        this.deleteRoute(id);
        return true;
      }
    } catch (e) {
      console.warn('Supabase deleteRouteAsync fallback:', e);
    }
    return this.deleteRoute(id);
  },

  deleteRoute(id: string): boolean {
    const routes = this.getRoutes();
    const filtered = routes.filter((r) => r.id !== id);
    if (filtered.length === routes.length) return false;

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ROUTES, JSON.stringify(filtered));
    }
    return true;
  },

  async toggleRouteStatusAsync(id: string): Promise<AdminRoute | null> {
    const route = this.getRouteById(id);
    if (!route) return null;
    const newStatus = !route.is_active;
    try {
      const { data, error } = await supabase.from('routes').update({ is_active: newStatus }).eq('id', id).select().single();
      if (!error && data) {
        return this.updateRoute(id, { is_active: newStatus });
      }
    } catch (e) {
      console.warn('Supabase toggleRouteStatusAsync fallback:', e);
    }
    return this.toggleRouteStatus(id);
  },

  toggleRouteStatus(id: string): AdminRoute | null {
    const route = this.getRouteById(id);
    if (!route) return null;
    return this.updateRoute(id, { is_active: !route.is_active });
  },

  getPairwiseFares(routeId: string): AdminFarePair[] {
    const route = this.getRouteById(routeId);
    if (!route) return [];

    let storedFares: AdminFarePair[] = [];
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(`${STORAGE_KEY_FARES}_${routeId}`);
        if (item) {
          storedFares = JSON.parse(item);
        }
      } catch {
        storedFares = [];
      }
    }

    return generatePairwiseFares(route, storedFares);
  },

  savePairwiseFares(routeId: string, fares: AdminFarePair[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${STORAGE_KEY_FARES}_${routeId}`, JSON.stringify(fares));
    } catch (e) {
      console.error('Failed to save fares', e);
    }
  },

  async fetchStopsFromApi(query: string = ''): Promise<Array<{ id: string; name: string; name_bn?: string; search_name?: string }>> {
    try {
      let req = supabase.from('stops').select('*');
      if (query) {
        req = req.or(`name.ilike.%${query}%,name_bn.ilike.%${query}%`);
      }
      const { data, error } = await req;
      if (!error && data && Array.isArray(data) && data.length > 0) {
        return data.map((s: any) => ({
          id: s.id,
          name: s.name,
          name_bn: s.name_bn,
          search_name: (s.name || '').toLowerCase(),
        }));
      }
    } catch (e) {
      console.warn('Supabase stops query fallback:', e);
    }
    return DHAKA_STOPS.map((s) => ({ id: s.id, name: s.en, name_bn: s.bn, search_name: s.en.toLowerCase() }));
  },

  async fetchOperatorsFromApi(): Promise<Array<{ id: string; name: string; name_bn?: string; logo_url?: string; routes_count?: number }>> {
    try {
      const { data, error } = await supabase.from('operators').select('*');
      if (!error && data && Array.isArray(data) && data.length > 0) {
        return data.map((op: any) => ({
          id: op.id,
          name: op.name,
          name_bn: op.name_bn,
          logo_url: op.logo_url,
          routes_count: op.routes_count || 1,
        }));
      }
    } catch (e) {
      console.warn('Supabase operators query fallback:', e);
    }
    return [];
  },

  async fetchOperatorByIdFromApi(id: string): Promise<{ operator: any; routes: AdminRoute[] } | null> {
    try {
      const { data: opData, error: opErr } = await supabase.from('operators').select('*').eq('id', id).single();
      if (!opErr && opData) {
        const routes = await this.fetchRoutesFromApi();
        return {
          operator: opData,
          routes: routes.filter((r) => r.name.toLowerCase().includes(opData.name.toLowerCase())),
        };
      }
    } catch (e) {
      console.warn('Supabase operator by ID query fallback:', e);
    }
    return null;
  },
};
