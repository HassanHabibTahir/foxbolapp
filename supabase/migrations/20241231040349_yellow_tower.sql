/*
  # Add dispatch documents support
  
  1. New Tables
    - `dispatch_documents`
      - `id` (uuid, primary key)
      - `dispatch_id` (uuid, references dispatches)
      - `file_url` (text)
      - `file_name` (text)
      - `file_type` (text)
      - `file_size` (bigint)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on dispatch_documents table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS dispatch_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dispatch_id uuid REFERENCES dispatches(id) NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE dispatch_documents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for authenticated users"
  ON dispatch_documents FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON dispatch_documents FOR INSERT TO authenticated WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_dispatch_documents_dispatch ON dispatch_documents(dispatch_id);