/*
  # Add billto fields to match legacy system

  1. Changes
    - Add billto fields to invoices table to match legacy field names
    - Keep existing billing_* fields for backward compatibility
    - Add indexes for commonly searched fields

  2. Details
    - Fields match exactly with legacy system field names
    - All fields are TEXT type to match legacy system
*/

-- Add billto fields to invoices table
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS billtoname TEXT,
ADD COLUMN IF NOT EXISTS billtoaddr TEXT,
ADD COLUMN IF NOT EXISTS billtoadd2 TEXT,
ADD COLUMN IF NOT EXISTS billtocity TEXT,
ADD COLUMN IF NOT EXISTS billtost TEXT,
ADD COLUMN IF NOT EXISTS billtozip TEXT,
ADD COLUMN IF NOT EXISTS billtophon TEXT,
ADD COLUMN IF NOT EXISTS billtocont TEXT;

-- Create indexes for commonly searched fields
CREATE INDEX IF NOT EXISTS idx_invoices_billtoname ON invoices(billtoname);
CREATE INDEX IF NOT EXISTS idx_invoices_billtophon ON invoices(billtophon);