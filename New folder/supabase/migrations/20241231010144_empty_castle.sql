/*
  # Add Time Fields to Dispatches
  
  Adds time tracking fields from legacy towdrive table to dispatches table
*/

ALTER TABLE dispatches
ADD COLUMN time_received VARCHAR(5),
ADD COLUMN time_called VARCHAR(5), 
ADD COLUMN time_enroute VARCHAR(5),
ADD COLUMN time_arrived VARCHAR(5),
ADD COLUMN time_loaded VARCHAR(5),
ADD COLUMN time_at_destination VARCHAR(5),
ADD COLUMN time_cleared VARCHAR(5),
ADD COLUMN eta TIMESTAMPTZ;

-- Add indexes for time fields
CREATE INDEX idx_dispatches_time_received ON dispatches(time_received);
CREATE INDEX idx_dispatches_time_cleared ON dispatches(time_cleared);