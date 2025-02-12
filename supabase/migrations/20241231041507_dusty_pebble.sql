-- Create storage buckets for photos and documents
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('vehicle-photos', 'vehicle-photos', true),
  ('dispatch-documents', 'dispatch-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on buckets
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for vehicle photos
CREATE POLICY "Allow public read access for vehicle photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle-photos');

CREATE POLICY "Allow authenticated users to upload vehicle photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'vehicle-photos');

-- Create policies for dispatch documents
CREATE POLICY "Allow public read access for dispatch documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'dispatch-documents');

CREATE POLICY "Allow authenticated users to upload dispatch documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'dispatch-documents');