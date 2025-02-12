import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export interface SavePayload {
  dispatch: {
    dispnum: string;
    driver_id?: string;
    // ... other dispatch fields
  };
  driver: {

  },
  invoice?: {
    invoice_number: string;
    total_amount: number;
    tax_amount: number;
    subtotal: number;
    paid_amount: number;
    // ... other invoice fields
  };
  items?: Array<{
    id?: any;
    description: string;
    quantity: number;
    price: number;
    amount: number;
    // ... other item fields
  }>;
}

export const saveDispatch = async (payload: SavePayload) => {
  try {
    const foxtow_id = localStorage.getItem('foxtow_id'); // Generate a unique ID for the towdrive record

    // 1. Create towdrive record first
    // 2. Create dispatch record with foxtow_id reference
    const { data: dispatch, error: dispatchError } = await supabase
      .from('towmast')
      .upsert({
        ...payload.dispatch,
        foxtow_id
      })
      .select()
      .single();

    if (dispatchError) throw dispatchError;

    const { data: towdrive, error: towdriveError } = await supabase
      .from('towdrive')
      .upsert({
        ...payload.driver,
        foxtow_id,
        dispnumdrv: payload.dispatch.dispnum,
      })
      .select()
      .single();

    if (towdriveError) throw towdriveError;

    // 3. If invoice data exists, create invoice record
    if (payload.invoice) {
      const { data: invoice, error: invoiceError } = await supabase
        .from('towinv')
        .upsert({
          ...payload.invoice,
          foxtow_id,
          dispnum: dispatch.dispnum
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // 4. If invoice items exist, create them
      if (payload.items && payload.items.length > 0) {
        const result = payload.items.map(item => {
          if(item.id === 4) {
            const id = uuidv4()
            return {
              dispnumtrs: dispatch.dispnum,
              description: item.description,
              quantity: item.quantity,
              price: item.price,
              driver: towdrive.driver,
              trucknum: towdrive.trucknum,
              foxtow_id,
              invoicenum: invoice.invoicenum,
              id
            }
          }
          return item
        }).filter((item) => item?.description !== 'DISCOUNT' && item?.description !== '')
        console.log(result)
        const { error: itemsError } = await supabase
          .from('towtrans')
          .upsert(result)
          .select();

        if (itemsError) throw itemsError;
      }
    }

    return { success: true, foxtow_id };
  } catch (error) {
    console.error('Save error:', error);
    return { success: false, error };
  }
};


export const fetchTowData = async (dispatchNumber: number, foxtow_id: string) => {
  try {
    // 1. Fetch towdrive record
    const { data: driver, error: towdriveError } = await supabase
      .from('towdrive')
      .select()
      .eq('dispnumdrv', dispatchNumber)
      .eq('foxtow_id', foxtow_id)
      .maybeSingle();

    if (towdriveError) throw towdriveError;

    // 2. Fetch dispatch record
    const { data: dispatch, error: dispatchError } = await supabase
      .from('towmast')
      .select()
      .eq('dispnum', dispatchNumber)
      .eq('foxtow_id', foxtow_id)
      .maybeSingle();

    if (dispatchError) throw dispatchError;

    // 3. Fetch invoice record
    const { data: invoice, error: invoiceError } = await supabase
      .from('towinv')
      .select()
      .eq('dispnum', dispatchNumber)
      .eq('foxtow_id', foxtow_id)
      .maybeSingle();

    if (invoiceError) throw invoiceError;

    // 4. Fetch invoice items
    const { data: items, error: itemsError } = await supabase
      .from('towtrans')
      .select()
      .eq('dispnumtrs', dispatchNumber)
      .eq('foxtow_id', foxtow_id);

    if (itemsError) throw itemsError;

    return {
      driver,
      dispatch,
      invoice,
      items
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return { error };
  }
}