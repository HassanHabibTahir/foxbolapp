import { supabase } from '../supabase';
import { Kit } from '../../components/Settings/Kits/types';

const TABLE_NAME = 'kits';

// Define field length constraints to match database schema
const FIELD_MAX_LENGTHS = {
  kit: 10,
  cus: 10,
  class: 10,
  description: 255,
  itemGroup: 20,
  reason: 20,
  from: 50,
  to: 50,
  glaccount: 20,
  lotSec: 20,
  transaction: 20,
  customer: 50
};

/**
 * Sanitize data before sending to database
 * This ensures all string fields are truncated to their maximum allowed length
 */
const sanitizeKitData = (kitData: Partial<Kit>): Partial<Kit> => {
  const sanitized: Partial<Kit> = { ...kitData };
  
  // Truncate all string fields to their maximum allowed length
  Object.entries(FIELD_MAX_LENGTHS).forEach(([field, maxLength]) => {
    const value = sanitized[field as keyof Kit];
    if (typeof value === 'string' && value.length > maxLength) {
      console.warn(`Truncating field ${field} from ${value.length} to ${maxLength} characters`);
      sanitized[field as keyof Kit] = value.substring(0, maxLength) as any;
    }
  });
  
  return sanitized;
};

/**
 * Fetch the database schema to debug column names
 */
export const fetchDatabaseSchema = async () => {
  try {
    // This will get the first row to examine the actual column names
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error fetching schema:', error);
      return null;
    }

    if (data && data.length > 0) {
      console.log('Actual database schema:', Object.keys(data[0]));
      return Object.keys(data[0]);
    }
    
    return null;
  } catch (err) {
    console.error('Error in fetchDatabaseSchema:', err);
    return null;
  }
};

/**
 * Fetch all kits from the database
 */
export const fetchKits = async (): Promise<Kit[]> => {
  try {
    // First, fetch the schema to debug
    await fetchDatabaseSchema();
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching kits:', error);
      throw new Error(error.message);
    }

    // Log the first item to see the actual structure
    if (data && data.length > 0) {
      console.log('Sample data from database:', data[0]);
    }

    return data || [];
  } catch (err) {
    console.error('Error in fetchKits:', err);
    throw err;
  }
};

/**
 * Fetch a single kit by ID
 */
export const fetchKitById = async (id: string): Promise<Kit | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching kit with ID ${id}:`, error);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error(`Error in fetchKitById for ID ${id}:`, err);
    throw err;
  }
};

/**
 * Create a new kit
 */
export const createKit = async (kit: Kit): Promise<Kit> => {
  try {
    // Remove any undefined id to let Supabase generate one
    const { id, ...kitData } = kit;
    
    // Sanitize data to ensure it meets database constraints
    const sanitizedData = sanitizeKitData(kitData);
    
    // Log the data being sent to Supabase
    console.log('Sending to Supabase:', { ...sanitizedData, created_at: new Date().toISOString() });
    
    // First, check if the table exists and has the expected schema
    const schemaColumns = await fetchDatabaseSchema();
    console.log('Available columns in database:', schemaColumns);
    
    // Create a new object with only the fields that exist in the database
    const finalData: Record<string, any> = {};
    if (schemaColumns) {
      Object.entries(sanitizedData).forEach(([key, value]) => {
        if (schemaColumns.includes(key)) {
          finalData[key] = value;
        } else {
          console.warn(`Column '${key}' does not exist in the database schema and will be ignored`);
        }
      });
    } else {
      // If we couldn't fetch the schema, use the sanitized data
      Object.assign(finalData, sanitizedData);
    }
    
    console.log('Final data for insert:', finalData);
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([{ ...finalData, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) {
      console.error('Error creating kit:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from create operation');
    }
    
    console.log('Successfully created kit:', data);
    return data;
  } catch (err) {
    console.error('Error in createKit:', err);
    throw err;
  }
};

/**
 * Update an existing kit
 */
export const updateKit = async (id: string, kit: Kit): Promise<Kit> => {
  try {
    if (!id) {
      throw new Error('ID is required for updating a kit');
    }
    
    // Remove id from the kit object to avoid updating the primary key
    const { id: kitId, ...kitData } = kit;
    
    // Sanitize data to ensure it meets database constraints
    const sanitizedData = sanitizeKitData(kitData);
    
    // Log the data being sent to Supabase
    console.log('Updating in Supabase - ID:', id);
    console.log('Update data:', { ...sanitizedData, updated_at: new Date().toISOString() });
    
    // Fetch schema to sanitize data
    const schemaColumns = await fetchDatabaseSchema();
    console.log('Available columns for update:', schemaColumns);
    
    // Create a new object with only the fields that exist in the database
    const finalData: Record<string, any> = {};
    if (schemaColumns) {
      Object.entries(sanitizedData).forEach(([key, value]) => {
        if (schemaColumns.includes(key)) {
          finalData[key] = value;
        } else {
          console.warn(`Column '${key}' does not exist in the database schema and will be ignored during update`);
        }
      });
    } else {
      // If we couldn't fetch the schema, use the sanitized data
      Object.assign(finalData, sanitizedData);
    }
    
    console.log('Final data for update:', finalData);
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ ...finalData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating kit with ID ${id}:`, error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error(`Kit with ID ${id} not found or not updated`);
    }
    
    console.log('Successfully updated kit:', data);
    return data;
  } catch (err) {
    console.error(`Error in updateKit for ID ${id}:`, err);
    throw err;
  }
};

/**
 * Delete a kit by ID
 */
export const deleteKit = async (id: string): Promise<void> => {
  try {
    if (!id) {
      throw new Error('Kit ID is required for deletion');
    }
    
    console.log('Deleting from Supabase:', id);
    
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting kit with ID ${id}:`, error);
      throw new Error(error.message);
    }
    
    console.log('Successfully deleted kit with ID:', id);
  } catch (err) {
    console.error(`Error in deleteKit for ID ${id}:`, err);
    throw err;
  }
};
