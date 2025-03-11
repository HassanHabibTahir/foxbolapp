-- Create kits table
CREATE TABLE IF NOT EXISTS kits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_number TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create kit items table
CREATE TABLE IF NOT EXISTS kit_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id uuid REFERENCES kits(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  gl_account TEXT,
  gl_subaccount TEXT,
  item_number TEXT,
  item_group TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
  ON kits FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON kit_items FOR SELECT TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_kits_number ON kits(kit_number);
CREATE INDEX idx_kit_items_kit ON kit_items(kit_id);

-- Insert sample data
INSERT INTO kits (kit_number, description) VALUES
  ('TOW-BASIC', 'Basic Towing Kit'),
  ('TOW-HEAVY', 'Heavy Duty Towing Kit'),
  ('TOW-UNLOCK', 'Unlock Service Kit')
ON CONFLICT (kit_number) DO NOTHING;

-- Insert sample items for basic towing kit
WITH basic_kit AS (SELECT id FROM kits WHERE kit_number = 'TOW-BASIC')
INSERT INTO kit_items (kit_id, description, quantity, unit_price, gl_account, item_group)
SELECT basic_kit.id, description, quantity, price, gl_account, item_group
FROM basic_kit, (VALUES
  ('Basic Tow Service', 1, 75.00, '4000', 'TOW'),
  ('Mileage', 1, 3.50, '4010', 'MIL'),
  ('Fuel Surcharge', 1, 10.00, '4020', 'SUR')
) AS items(description, quantity, price, gl_account, item_group)
ON CONFLICT DO NOTHING;