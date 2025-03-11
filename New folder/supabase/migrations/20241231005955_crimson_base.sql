/*
  # Add Additional Lien Fields
  
  Adds commission and lien clearance fields
*/

ALTER TABLE lien_records
ADD COLUMN commission_amount DECIMAL(10,2),
ADD COLUMN lien_clear_date DATE,
ADD COLUMN lien_type TEXT;

-- Rename existing lien_amount to lien_fee to match frontend
ALTER TABLE lien_records
RENAME COLUMN lien_amount TO lien_fee;