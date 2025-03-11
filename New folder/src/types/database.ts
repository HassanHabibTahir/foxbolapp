export interface TowDrive {
  id: string;
  foxtow_id: string;
  dispatch_number: string | null;
  driver_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TowMast {
  id: string;
  foxtow_id: string;
  master_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Dispatch {
  id: string;
  foxtow_id: string | null;
  dispatch_number: string;
  status: string;
  priority: number | null;
  call_type: string | null;
  customer_id: string | null;
  vehicle_id: string | null;
  driver_id: string | null;
  equipment_id: string | null;
  pickup_location_id: string | null;
  dropoff_location_id: string | null;
  received_time: string | null;
  enroute_time: string | null;
  arrived_time: string | null;
  completed_time: string | null;
  po_number: string | null;
  reference_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  foxtow_id: string | null;
  invoice_number: string;
  dispatch_id: string;
  customer_id: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  payment_type: string | null;
  payment_reference: string | null;
  payment_date: string | null;
  created_at: string;
  updated_at: string;
  radloc_number: string | null;
  radloc_city: string | null;
  radloc_state: string | null;
  radloc_zip: string | null;
}