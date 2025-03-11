import { supabase } from './supabase';

export const getNextDispatchNumber = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
    .from('towmast')
    .select('dispnum')
    .order('dispnum', { ascending: false })
    .limit(1)
    .maybeSingle();

    if (error) throw error;
    const dispatch_number = data?.dispnum + 1
    return dispatch_number?.toString() ?? null;
  } catch (error) {
    console.error('Error getting next dispatch number:', error);
    return null;
  }
};

export const createNewDispatch = async () => {
  try {
    const nextNumber = await getNextDispatchNumber();
    if (!nextNumber) throw new Error('Could not get next dispatch number');
    
    return {
      success: true,
      dispatch_number: nextNumber
    };
  } catch (error) {
    console.error('Error creating new dispatch:', error);
    return {
      success: false,
      error
    };
  }
};