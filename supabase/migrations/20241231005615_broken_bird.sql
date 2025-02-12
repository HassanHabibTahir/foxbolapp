/*
  # Initial Towing Dispatch System Schema

  1. Base Tables (no foreign key dependencies)
  2. Tables with Dependencies
  3. Security Policies
  4. Indexes
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create base tables first (no foreign key dependencies)

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  cross_street TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vin TEXT,
  year TEXT,
  make TEXT,
  model TEXT,
  color TEXT,
  body_type TEXT,
  license_plate TEXT,
  license_state TEXT,
  odometer TEXT,
  condition_notes TEXT,
  keys_present BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_number TEXT UNIQUE,
  type TEXT,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  license_plate TEXT,
  vin TEXT,
  year TEXT,
  make TEXT,
  model TEXT,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  email TEXT,
  license_number TEXT,
  license_state TEXT,
  license_expiry DATE,
  status TEXT DEFAULT 'active',
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Rates table
CREATE TABLE IF NOT EXISTS rates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_type TEXT,
  description TEXT,
  base_rate DECIMAL(10,2),
  mileage_rate DECIMAL(10,2),
  minimum_charge DECIMAL(10,2),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Customers table (depends on locations)
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  type TEXT,
  account_number TEXT,
  phone TEXT,
  email TEXT,
  billing_address_id uuid REFERENCES locations(id),
  credit_limit DECIMAL(10,2),
  tax_exempt BOOLEAN DEFAULT false,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Companies table (depends on locations)
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  address_id uuid REFERENCES locations(id),
  phone TEXT,
  fax TEXT,
  email TEXT,
  website TEXT,
  tax_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Dispatches table (multiple dependencies)
CREATE TABLE IF NOT EXISTS dispatches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispatch_number TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'new',
  priority INTEGER,
  call_type TEXT,
  customer_id uuid REFERENCES customers(id),
  vehicle_id uuid REFERENCES vehicles(id),
  driver_id uuid REFERENCES drivers(id),
  equipment_id uuid REFERENCES equipment(id),
  pickup_location_id uuid REFERENCES locations(id),
  dropoff_location_id uuid REFERENCES locations(id),
  
  received_time TIMESTAMPTZ,
  enroute_time TIMESTAMPTZ,
  arrived_time TIMESTAMPTZ,
  completed_time TIMESTAMPTZ,
  
  po_number TEXT,
  reference_number TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Invoices table (depends on dispatches and customers)
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE,
  dispatch_id uuid REFERENCES dispatches(id),
  customer_id uuid REFERENCES customers(id),
  status TEXT DEFAULT 'draft',
  
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  
  payment_type TEXT,
  payment_reference TEXT,
  payment_date TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Invoice items table (depends on invoices)
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id uuid REFERENCES invoices(id),
  description TEXT,
  quantity DECIMAL(10,2),
  unit_price DECIMAL(10,2),
  amount DECIMAL(10,2),
  taxable BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Storage records table (depends on vehicles and locations)
CREATE TABLE IF NOT EXISTS storage_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id uuid REFERENCES vehicles(id),
  location_id uuid REFERENCES locations(id),
  status TEXT DEFAULT 'active',
  
  date_in TIMESTAMPTZ,
  date_out TIMESTAMPTZ,
  daily_rate DECIMAL(10,2),
  total_days INTEGER,
  total_amount DECIMAL(10,2),
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lien records table (depends on vehicles and storage_records)
CREATE TABLE IF NOT EXISTS lien_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id uuid REFERENCES vehicles(id),
  storage_record_id uuid REFERENCES storage_records(id),
  status TEXT DEFAULT 'pending',
  
  lien_date DATE,
  lien_amount DECIMAL(10,2),
  fees_amount DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  
  registered_owner TEXT,
  legal_owner TEXT,
  lien_holder TEXT,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE lien_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON vehicles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON equipment FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON drivers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON rates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON companies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON dispatches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON invoice_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON storage_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON lien_records FOR SELECT TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_dispatches_status ON dispatches(status);
CREATE INDEX idx_vehicles_vin ON vehicles(vin);
CREATE INDEX idx_vehicles_license ON vehicles(license_plate, license_state);
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_storage_records_status ON storage_records(status);
CREATE INDEX idx_lien_records_status ON lien_records(status);
CREATE INDEX idx_equipment_unit ON equipment(unit_number);