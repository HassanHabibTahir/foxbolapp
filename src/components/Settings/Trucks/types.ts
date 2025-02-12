export interface Truck {
  id: string;
  name: string;
  type: string;
  duty: 'Light' | 'Medium' | 'Heavy';
  plate: string;
  lastOdometer?: string;
  lastUpdated?: string;
  plateExpired?: string;
}

export interface TrucksFilters {
  showInactive: boolean;
  showDeleted: boolean;
}