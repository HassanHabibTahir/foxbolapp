/*
  # Add License Plate Lookup Tables
  
  1. New Tables
    - `license_records` - Stores historical license plate data
    - Indexes for fast lookups
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create license records table
CREATE TABLE IF NOT EXISTS license_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_plate TEXT NOT NULL,
  state TEXT NOT NULL,
  vin TEXT NOT NULL,
  year TEXT,
  make TEXT,
  model TEXT,
  color TEXT,
  owner_name TEXT,
  owner_address TEXT,
  owner_city TEXT,
  owner_state TEXT,
  owner_zip TEXT,
  registration_expiry DATE,
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(license_plate, state)
);

-- Enable RLS
ALTER TABLE license_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
  ON license_records FOR SELECT TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_license_plate_lookup 
  ON license_records(license_plate, state);
CREATE INDEX idx_license_vin 
  ON license_records(vin);