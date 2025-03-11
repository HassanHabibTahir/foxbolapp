/*
  # Add RadLoc fields to invoices table

  1. Changes
    - Add RadLoc related fields to invoices table:
      - radloc_number (text)
      - radloc_city (text)
      - radloc_state (text)
      - radloc_zip (text)

  2. Security
    - Inherits existing RLS policies from invoices table
*/

ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS radloc_number TEXT,
ADD COLUMN IF NOT EXISTS radloc_city TEXT,
ADD COLUMN IF NOT EXISTS radloc_state TEXT,
ADD COLUMN IF NOT EXISTS radloc_zip TEXT;