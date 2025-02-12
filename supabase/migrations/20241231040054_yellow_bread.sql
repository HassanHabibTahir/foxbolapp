/*
  # Add vehicle photos support
  
  1. New Tables
    - `vehicle_photos`
      - `id` (uuid, primary key)
      - `dispatch_id` (uuid, references dispatches)
      - `photo_url` (text)
      - `thumbnail_url` (text)
      - `order` (integer)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on vehicle_photos table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS vehicle_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dispatch_id uuid REFERENCES dispatches(id) NOT NULL,
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vehicle_photos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for authenticated users"
  ON vehicle_photos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON vehicle_photos FOR INSERT TO authenticated WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_vehicle_photos_dispatch ON vehicle_photos(dispatch_id);