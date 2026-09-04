export interface BusStop {
  id: string;
  en: string;
  bn: string;
  area: string;
}

export interface BusOperator {
  id: string;
  routeNo: string;
  name: string;
  bnName: string;
  type: string;
  typeBg: string;
  baseFare: number;
  perKm: number;
  distanceKm: number;
  duration: string;
  stops: string[];
}

export interface CardSelectionState {
  from: string;
  to: string;
  lastSet: 'from' | 'to';
}

export interface FareCalculationResult {
  fare: number;
  distance: number;
}

export interface AdminRouteStop {
  id: string;
  route_id: string;
  stop_id: string;
  stop_name: string;
  stop_name_bn?: string;
  sequence: number;
  distance_from_start_km: number;
  is_major_stop: boolean;
}

export interface AdminRoute {
  id: string;
  route_number: string;
  name: string;
  name_bn: string;
  description: string;
  is_active: boolean;
  stops: AdminRouteStop[];
  created_at: string;
  updated_at: string;
}

export interface AdminFarePair {
  id: string;
  route_id: string;
  stop_a_id: string;
  stop_b_id: string;
  stop_a_name: string;
  stop_b_name: string;
  stop_a_seq: number;
  stop_b_seq: number;
  distance_km: number;
  amount: number; // Tk, minimum 10.0
}

