-- Add insert policy for towdrives
CREATE POLICY "Enable insert for authenticated users"
  ON towdrives FOR INSERT TO authenticated
  WITH CHECK (true);

-- Add update policy for authenticated users
CREATE POLICY "Enable update for authenticated users"
  ON towdrives FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);