import { BusStop, BusOperator } from '@/types';

export const DHAKA_STOPS: BusStop[] = [
  { id: 'uttara', en: 'Uttara House Building', bn: 'উত্তরা হাউস বিল্ডিং', area: 'Uttara' },
  { id: 'airport', en: 'Hazrat Shahjalal Airport', bn: 'হযরত শাহজালাল বিমানবন্দর', area: 'Airport' },
  { id: 'khilkhet', en: 'Khilkhet Bus Stop', bn: 'খিলক্ষেত বাস স্টপ', area: 'Khilkhet' },
  { id: 'kuril', en: 'Kuril Biswa Road', bn: 'কুড়িল বিশ্বরোড', area: 'Kuril' },
  { id: 'banani', en: 'Banani Kakoli', bn: 'বনানী কাকলী', area: 'Banani' },
  { id: 'mohakhali', en: 'Mohakhali Bus Terminal', bn: 'মহাখালী বাস টার্মিনাল', area: 'Mohakhali' },
  { id: 'farmgate', en: 'Farmgate Overbridge', bn: 'ফার্মগেট ওভারব্রীজ', area: 'Farmgate' },
  { id: 'karwan_bazar', en: 'Karwan Bazar', bn: 'কাওরান বাজার', area: 'Tejgaon' },
  { id: 'shahbagh', en: 'Shahbagh Square', bn: 'শাহবাগ মোড়', area: 'Shahbagh' },
  { id: 'press_club', en: 'National Press Club', bn: 'জাতীয় প্রেসক্লাব', area: 'Paltan' },
  { id: 'motijheel', en: 'Motijheel Shapla Chattar', bn: 'মতিঝিল শাপলা চত্বর', area: 'Motijheel' },
  { id: 'mirpur_10', en: 'Mirpur 10 Circle', bn: 'মিরপুর ১০ গোলচত্বর', area: 'Mirpur' },
  { id: 'dhanmondi_32', en: 'Dhanmondi 32', bn: 'ধানমন্ডি ৩২', area: 'Dhanmondi' }
];

export const MOCK_BUSES: BusOperator[] = [
  {
    id: 'b1',
    routeNo: 'Route 4',
    name: 'Bikolpo Auto Service',
    bnName: 'বিকল্প অটো সার্ভিস',
    type: 'Non-AC Metro',
    typeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    baseFare: 15,
    perKm: 2.45,
    distanceKm: 14.2,
    duration: '42 min',
    stops: [
      'Uttara House Building',
      'Airport',
      'Khilkhet',
      'Banani Kakoli',
      'Mohakhali',
      'Farmgate',
      'Shahbagh',
      'Motijheel'
    ]
  },
  {
    id: 'b2',
    routeNo: 'Route 11',
    name: 'Uttara Express (AC)',
    bnName: 'উত্তরা এক্সপ্রেস (এসি)',
    type: 'AC Premium',
    typeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    baseFare: 40,
    perKm: 4.5,
    distanceKm: 14.2,
    duration: '35 min',
    stops: [
      'Uttara House Building',
      'Airport',
      'Kuril Biswa Road',
      'Mohakhali',
      'Farmgate',
      'Karwan Bazar',
      'Shahbagh',
      'Motijheel'
    ]
  },
  {
    id: 'b3',
    routeNo: 'Route 7',
    name: 'Trans Silva Paribahan',
    bnName: 'ট্রান্স সিলা পরিবহন',
    type: 'Regular',
    typeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    baseFare: 10,
    perKm: 2.2,
    distanceKm: 11.5,
    duration: '38 min',
    stops: [
      'Mirpur 10 Circle',
      'Farmgate',
      'Karwan Bazar',
      'Dhanmondi 32',
      'Shahbagh',
      'Press Club',
      'Motijheel'
    ]
  }
];

export function calculateSegmentDistance(stops: string[], fromVal: string, toVal: string, defaultDist: number): number {
  if (!fromVal || !toVal) return defaultDist;
  const idxFrom = stops.findIndex(s => s.toLowerCase().includes((fromVal || '').toLowerCase().split(' ')[0]));
  const idxTo = stops.findIndex(s => s.toLowerCase().includes((toVal || '').toLowerCase().split(' ')[0]));

  if (idxFrom === -1 || idxTo === -1) return defaultDist;

  const stopDiff = Math.abs(idxTo - idxFrom);
  if (stopDiff === 0) return 2.0;
  return parseFloat((stopDiff * 2.3).toFixed(1));
}

export function calculateBusFare(bus: BusOperator, fromVal: string, toVal: string): number {
  if (!fromVal || !toVal) return bus.baseFare;
  const dist = calculateSegmentDistance(bus.stops, fromVal, toVal, bus.distanceKm);
  return Math.round(bus.baseFare + (dist * 0.8 * bus.perKm));
}
