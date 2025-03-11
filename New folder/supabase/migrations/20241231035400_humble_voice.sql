/*
  # Create towkeys table for dispatch number tracking
  
  1. New Tables
    - `towkeys`
      - `id` (uuid, primary key)
      - `key_name` (text, unique)
      - `current_value` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `towkeys` table
    - Add policy for authenticated users to read/update
*/

CREATE TABLE IF NOT EXISTS towkeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name TEXT UNIQUE NOT NULL,
  current_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE towkeys ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for authenticated users"
  ON towkeys FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable update for authenticated users"
  ON towkeys FOR UPDATE TO authenticated USING (true);

-- Insert initial values
INSERT INTO towkeys (key_name, current_value)
VALUES 
  ('dispatch_number', 200000)
ON CONFLICT (key_name) DO NOTHING;

-- Create function to get next dispatch number
CREATE OR REPLACE FUNCTION get_next_dispatch_number()
RETURNS INTEGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  UPDATE towkeys 
  SET current_value = current_value + 1,
      updated_at = now()
  WHERE key_name = 'dispatch_number'
  RETURNING current_value INTO next_number;
  
  RETURN next_number;
END;
$$ LANGUAGE plpgsql;