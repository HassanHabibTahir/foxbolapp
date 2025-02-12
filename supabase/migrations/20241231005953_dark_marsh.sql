/*
  # Add Registration Fields to Lien Records
  
  Adds registered owner address fields to lien_records table
*/

ALTER TABLE lien_records 
ADD COLUMN reg_address TEXT,
ADD COLUMN reg_city TEXT,
ADD COLUMN reg_state TEXT,
ADD COLUMN reg_zip TEXT,
ADD COLUMN reg_type TEXT,
ADD COLUMN auction_number TEXT;