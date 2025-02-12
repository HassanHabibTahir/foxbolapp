/*
  # Add missing registered owner and billing fields

  1. Changes
    - Add registered owner fields to vehicles table
    - Add billing fields to invoices table
    - Add auction fields to vehicles table

  2. Details
    - Registered owner information needs to be separate from billing
    - Billing information needs additional fields for complete address
*/

-- Add registered owner fields to vehicles table
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS registered_owner TEXT,
ADD COLUMN IF NOT EXISTS reg_address TEXT,
ADD COLUMN IF NOT EXISTS reg_city TEXT,
ADD COLUMN IF NOT EXISTS reg_state TEXT,
ADD COLUMN IF NOT EXISTS reg_zip TEXT,
ADD COLUMN IF NOT EXISTS reg_type TEXT,
ADD COLUMN IF NOT EXISTS auction_number TEXT;

-- Add billing fields to invoices table
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS billing_name TEXT,
ADD COLUMN IF NOT EXISTS billing_address1 TEXT,
ADD COLUMN IF NOT EXISTS billing_address2 TEXT,
ADD COLUMN IF NOT EXISTS billing_city TEXT,
ADD COLUMN IF NOT EXISTS billing_state TEXT,
ADD COLUMN IF NOT EXISTS billing_zip TEXT,
ADD COLUMN IF NOT EXISTS billing_phone TEXT,
ADD COLUMN IF NOT EXISTS billing_contact TEXT,
ADD COLUMN IF NOT EXISTS nrls_number TEXT;