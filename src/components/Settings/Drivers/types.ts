export interface Driver {
  id: string;
  name: string;
  created: string;
}

export interface DriversFilters {
  showInactive: boolean;
  showDeleted: boolean;
}