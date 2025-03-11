export interface InvoiceData {
  id: string;
  invoice_number: string;
  dispatch_id: string;
  customer_id: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  created_at: string;
  
  // Related data
  dispatch?: {
    dispatch_number: string;
    vehicle_id: string;
    driver_id: string;
  };
  customer?: {
    name: string;
    account_number: string;
  };
  items?: Array<{
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
  }>;
}