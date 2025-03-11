import { supabase } from './supabase';

export interface LicensePlateDetails {
  vin: string;
  year?: string;
  make?: string;
  model?: string;
  color?: string;
  ownerName?: string;
  ownerAddress?: string;
  ownerCity?: string;
  ownerState?: string;
  ownerZip?: string;
  registrationExpiry?: string;
}

export const lookupLicensePlate = async (
  plate: string,
  state: string
): Promise<LicensePlateDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('license_records')
      .select(`
        vin,
        year,
        make,
        model,
        color,
        owner_name,
        owner_address,
        owner_city,
        owner_state,
        owner_zip,
        registration_expiry
      `)
      .eq('license_plate', plate.toUpperCase())
      .eq('state', state.toUpperCase())
      .single();

    if (error) throw error;
    
    return data ? {
      vin: data.vin,
      year: data.year,
      make: data.make,
      model: data.model,
      color: data.color,
      ownerName: data.owner_name,
      ownerAddress: data.owner_address,
      ownerCity: data.owner_city,
      ownerState: data.owner_state,
      ownerZip: data.owner_zip,
      registrationExpiry: data.registration_expiry
    } : null;
  } catch (error) {
    console.error('License plate lookup error:', error);
    return null;
  }
};