export const VEHICLE_TYPES = [
  { id: 'any', label: 'Any' },
  { id: 'light', label: 'Light' },
  { id: 'medium', label: 'Medium' },
  { id: 'heavy', label: 'Heavy' },
  { id: 'motorcycle', label: 'Motorcycle' },
  { id: 'trailer', label: 'Trailer' },
  { id: 'tractor', label: 'Tractor' },
  { id: 'other', label: 'Other' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'container', label: 'Container' },
  { id: 'material', label: 'Material' }
];

export const DEFAULT_RATES = [
  {
    id: 'after-hours',
    name: 'After Hour Release Fee',
    rates: Object.fromEntries(VEHICLE_TYPES.map(type => [type.id, { amount: 92.50, isCustom: false }]))
  },
  {
    id: 'impound',
    name: 'Impounds/Storage: Daily Impound Rate',
    rates: Object.fromEntries(VEHICLE_TYPES.map(type => [type.id, { amount: 85.00, isCustom: false }]))
  },
  {
    id: 'absorbent',
    name: 'Absorbent',
    rates: Object.fromEntries(VEHICLE_TYPES.map(type => [type.id, { amount: 50.00, isCustom: false }]))
  }
];