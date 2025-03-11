/*
  # Add tow relations and foxtow_id

  1. New Tables
    - `towdrives` - Main dispatch table
      - `id` (uuid, primary key)
      - `foxtow_id` (text, unique)
      - `dispatch_number` (text)
      - `driver_id` (uuid)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `towmasts` - Master record table
      - `id` (uuid, primary key)
      - `foxtow_id` (text)
      - `master_number` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes
    - Add `foxtow_id` to existing tables
    - Update foreign key relationships
    - Add indexes for performance

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create towdrives table
CREATE TABLE IF NOT EXISTS towdrives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  foxtow_id TEXT UNIQUE NOT NULL,
  dispatch_number TEXT,
  driver_id uuid REFERENCES drivers(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create towmasts table
CREATE TABLE IF NOT EXISTS towmasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  foxtow_id TEXT REFERENCES towdrives(foxtow_id),
  master_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add foxtow_id to dispatches
ALTER TABLE dispatches 
ADD COLUMN foxtow_id TEXT REFERENCES towdrives(foxtow_id);

-- Add foxtow_id to invoices
ALTER TABLE invoices 
ADD COLUMN foxtow_id TEXT REFERENCES towdrives(foxtow_id);

-- Create indexes
CREATE INDEX idx_towdrives_foxtow_id ON towdrives(foxtow_id);
CREATE INDEX idx_towmasts_foxtow_id ON towmasts(foxtow_id);
CREATE INDEX idx_dispatches_foxtow_id ON dispatches(foxtow_id);
CREATE INDEX idx_invoices_foxtow_id ON invoices(foxtow_id);

-- Enable RLS
ALTER TABLE towdrives ENABLE ROW LEVEL SECURITY;
ALTER TABLE towmasts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON towdrives
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON towmasts
  FOR SELECT TO authenticated USING (true);

-- Add trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_towdrives_updated_at
  BEFORE UPDATE ON towdrives
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_towmasts_updated_at
  BEFORE UPDATE ON towmasts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();