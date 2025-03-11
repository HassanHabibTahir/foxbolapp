import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

export interface SavePayload {
  dispatch: {
    dispnum: string;
    driver_id?: string;
    // ... other dispatch fields
  };
  driver?: object | any;
  invoice?: {
    invoice_number: string;
    total_amount: number;
    tax_amount: number;
    subtotal: number;
    paid_amount: number;
    // ... other invoice fields
  };
  items?: Array<{
    itemId?: string;
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
    const foxtow_id = localStorage.getItem("foxtow_id");

    const { data: dispatch, error: dispatchError } = await supabase
      .from("towmast")
      .upsert({
        ...payload.dispatch,
        foxtow_id,
      })
      .select()
      .single();

    if (dispatchError) throw dispatchError;

    const { data: towdrive, error: towdriveError } = await supabase
      .from("towdrive")
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
        .from("towinv")
        .upsert({
          ...payload.invoice,
          foxtow_id,
          dispnum: dispatch.dispnum,
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;
      if (payload.items && payload.items.length > 0) {
        // Process each item in the payload
        for (const item of payload.items) {
          const uid = uuidv4();
          if (item.description === "DISCOUNT" || item.description === "") {
            continue; // Skip discount or empty description items
          }
          const isNumber = typeof item.id === "number";
          const isUUID =
            typeof item.id === "string" && /^[0-9a-fA-F-]{36}$/.test(item.id);
          const itemId = isUUID ? item.id : isNumber ? uid : item.id;
          const { data: existingItem, error: fetchError } = await supabase
            .from("towtrans")
            .select("id")
            .eq("id", itemId)
            .eq("dispnumtrs", dispatch.dispnum)
            .eq("foxtow_id", foxtow_id)
            .single();
          console.log(existingItem, "ExistingIen");
          if (fetchError && fetchError.code !== "PGRST116") {
            // Error code for 'no rows returned'
            throw fetchError;
          }
          const itemData = {
            itemId: existingItem ? item?.itemId : item?.id,
            id: itemId,
            dispnumtrs: dispatch.dispnum,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            driver: towdrive.driver,
            trucknum: towdrive.trucknum,
            foxtow_id,
            invoicenum: invoice.invoicenum,
          };
          let upsertError;
          if (existingItem) {
            // Update existing item
            const { error } = await supabase
              .from("towtrans")
              .update(itemData)
              .eq("id", existingItem?.id);

            upsertError = error;
          } else {
            const { error } = await supabase.from("towtrans").insert(itemData);
            upsertError = error;
          }
          if (upsertError) throw upsertError;
        }
      }
    }

    return { success: true, foxtow_id };
  } catch (error) {
    console.error("Save error:", error);
    return { success: false, error };
  }
};

export const fetchTowData = async (
  dispatchNumber: number,
  foxtow_id: string
) => {
  try {
  
    // 1. Fetch towdrive record
    const { data: driver, error: towdriveError } = await supabase
      .from("towdrive")
      .select()
      .eq("dispnumdrv", dispatchNumber)
      .eq("foxtow_id", foxtow_id)
      .maybeSingle();

    if (towdriveError) throw towdriveError;
    // 2. Fetch dispatch record
    const { data: dispatch, error: dispatchError } = await supabase
      .from("towmast")
      .select()
      .eq("dispnum", dispatchNumber)
      .eq("foxtow_id", foxtow_id)
      .maybeSingle();
  
    if (dispatchError) throw dispatchError;

    // 3. Fetch invoice record
    const { data: invoice, error: invoiceError } = await supabase
      .from("towinv")
      .select()
      .eq("dispnum", dispatchNumber)
      .eq("foxtow_id", foxtow_id)
      .maybeSingle();

      console.log(invoiceError,invoice,"foxtow_id")
    if (invoiceError) throw invoiceError;

    // 4. Fetch invoice items
    const { data: items, error: itemsError } = await supabase
      .from("towtrans")
      .select()
      .eq("dispnumtrs", dispatchNumber)
      .eq("foxtow_id", foxtow_id);

    if (itemsError) throw itemsError;

    return {
      driver,
      dispatch,
      invoice,
      items,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return { error };
  }
};

// 4. If invoice items exist, create them
// if (payload.items && payload.items.length > 0) {
//   const result = payload.items.map(item => {
//       const id = uuidv4()
//       return {
//         itemId: item.id,
//         dispnumtrs: dispatch.dispnum,
//         description: item.description,
//         quantity: item.quantity,
//         price: item.price,
//         driver: towdrive.driver,
//         trucknum: towdrive.trucknum,
//         foxtow_id,
//         invoicenum: invoice.invoicenum,
//         id
//       }
//   })?.filter((item) => item?.description !== 'DISCOUNT' && item?.description !== '')
//   const { error: itemsError } = await supabase
//     .from('towtrans')
//     .upsert(result)
//     .select().single();

//   if (itemsError) throw itemsError;
