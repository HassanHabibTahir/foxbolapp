import { supabase } from './supabase';

export interface PriceRecord {
  id: string;
  description: string;
  group: string;
  price: number;
}

export const lookupPrice = async (description: string, group: string): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('prices')
      .select('price, quantity')
      .eq('description', description)
      .eq('itemgroup', group)
      .maybeSingle();

    if (error) throw error;
    return data || { price: 0, quantity: 0 };
  } catch (error) {
    console.error('Price lookup error:', error);
    return null;
  }
};