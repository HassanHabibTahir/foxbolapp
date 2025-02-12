/*
  # Add VIN lookup tables
  
  1. New Tables
    - vinmake: Stores vehicle manufacturers
    - vinmodel: Stores vehicle models for each make
    - vinstyle: Stores detailed style/trim information
  
  2. Changes
    - Add foreign key relationships between tables
    - Add indexes for faster lookups
    
  3. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create vinmake table
CREATE TABLE IF NOT EXISTS vinmake (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make_code TEXT NOT NULL,
  make_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(make_code)
);

-- Create vinmodel table
CREATE TABLE IF NOT EXISTS vinmodel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make_id uuid REFERENCES vinmake(id),
  model_code TEXT NOT NULL,
  model_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(make_id, model_code)
);

-- Create vinstyle table
CREATE TABLE IF NOT EXISTS vinstyle (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid REFERENCES vinmodel(id),
  style_code TEXT NOT NULL,
  style_name TEXT NOT NULL,
  body_type TEXT,
  engine TEXT,
  transmission TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(model_id, style_code)
);

-- Enable RLS
ALTER TABLE vinmake ENABLE ROW LEVEL SECURITY;
ALTER TABLE vinmodel ENABLE ROW LEVEL SECURITY;
ALTER TABLE vinstyle ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON vinmake
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON vinmodel
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON vinstyle
  FOR SELECT TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_vinmake_code ON vinmake(make_code);
CREATE INDEX idx_vinmodel_make ON vinmodel(make_id);
CREATE INDEX idx_vinmodel_code ON vinmodel(model_code);
CREATE INDEX idx_vinstyle_model ON vinstyle(model_id);
CREATE INDEX idx_vinstyle_code ON vinstyle(style_code);