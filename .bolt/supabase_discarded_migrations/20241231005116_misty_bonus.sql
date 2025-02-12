/*
  # Initial Towing Dispatch System Schema

  1. New Tables
    - `dispatches`
      - Core dispatch information
      - Tracks tow requests and status
    - `vehicles`
      - Vehicle information
      - Linked to dispatches
    - `locations`
      - Pickup and dropoff locations
      - Connected to dispatches
    - `drivers`
      - Driver information and status
    - `customers`
      - Customer/client information
    
  2. Security
    - RLS enabled on all tables
    - Policies for authenticated access
*/

-- Dispatches table
CREATE TABLE IF NOT EXISTS dispatches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dispatch_number TEXT UNIQUE,
  driver_id uuid,
  vehicle_id uuid,
  status TEXT,
  received_time TIMESTAMPTZ,
  enroute_time TIMESTAMPTZ,
  arrived_time TIMESTAMPTZ,
  intow_time TIMESTAMPTZ,
  completed_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT,
  make TEXT,
  model TEXT,
  color TEXT,
  vin TEXT,
  license_plate TEXT,
  license_state TEXT,
  body_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dispatch_id uuid REFERENCES dispatches(id),
  type TEXT, -- 'pickup' or 'dropoff'
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  driver_number TEXT UNIQUE,
  phone TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated read access" ON dispatches
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON vehicles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON locations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON drivers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON customers
  FOR SELECT TO authenticated USING (true);