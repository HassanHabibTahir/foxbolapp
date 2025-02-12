import { supabase } from './supabase';

export const checkTowmasts = async () => {
  const { data, error, count } = await supabase
    .from('towmasts')
    .select('*', { count: 'exact' });
    
  if (error) {
    console.error('Error checking towmasts:', error);
    return null;
  }
  
  return { data, count };
};