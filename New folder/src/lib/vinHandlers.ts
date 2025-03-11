import { supabase } from './supabase';

export const searchByVin = async (vin: string) => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        id,
        vin,
        year,
        make,
        model,
        color,
        body_type,
        license_plate,
        license_state,
        dispatches (
          id,
          dispatch_number,
          status
        )
      `)
      .eq('vin', vin)
      .single();

    if (error) throw error;
    return { success: true, vehicle: data };
  } catch (error) {
    console.error('VIN search error:', error);
    return { success: false, error };
  }
};