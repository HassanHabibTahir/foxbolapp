import { supabase } from "../../lib/supabase";

interface SearchParams {
  formData: {
    sl_dispnum: string;
    sl_licensest: string;
    sl_licensenum: string;
    sl_vin: string;
    sl_towdate: string;
    sl_towtagnum: string;
    sl_refnumber: string;
    sl_invoicenum: string;
    sl_yearcar: string;
    sl_makecar: string;
    sl_modelcar: string;
    sl_colorcar: string;
    sl_ponumber: string;
    sl_driver: string;
    sl_stocknum: string;
    sl_auctnum: string;
    sl_releaselic: string;
    sl_towedfrom: string;
    powersearch_cb: string;
    powersearch_txt: string;
  };
  filterValue: string;
}

export const performSearch = async ({ formData, filterValue }: SearchParams) => {
  try {
    // 1. Get foxtow_id from localStorage
    const foxtowId = localStorage.getItem('foxtow_id') || '';
    if (!foxtowId) {
      console.warn('No foxtow_id found in localStorage - results will not be filtered by company');
    }

    // 2. Validate search criteria
    const isSearchEmpty = Object.entries(formData).every(
      ([key, val]) => (val === '' || val === 'CA') &&
      key !== 'powersearch_cb' && 
      key !== 'sl_licensest'
    );

    if (isSearchEmpty && !filterValue) {
      alert('Please enter at least one search criteria');
      return [];
    }

    // 3. Determine base table (towmast or hmaster)
    const baseTable = filterValue === 'checkHistory' ? 'hmaster' : 'towmast';

    // 4. Define the select fields with foxtow_id included
    const fullSelect = `
      dispnum, 
      towdate,
      datein,
      dateout,
      licensest, 
      licensenum, 
      vin, 
      yearcar,
      makecar, 
      modelcar, 
      colorcar, 
      towedfrom, 
      towedto,
      releaselic,
      stocknum,
      is_transport:transport,
      callactnum,
      condition,
      keysinfo,
      holdnote,
      calltype,
      bodytype,
      lienfee,
      membernum,
      whocalled,
      callremark,
      billtoname:regnametow,
      foxtow_id,
      towdrive (
        driver,
        dispnumdrv,
        towtagnum,
        invoicenum,
        trucknum,
        timeinrt,
        timearrive
      )
    `;

    // 5. Initialize query with foxtow_id filter
    let query = supabase.from(baseTable)
      .select(fullSelect)
      .eq('foxtow_id', foxtowId);

    // 6. Helper function for related table searches with foxtow_id
    const searchRelatedTable = async (table: string, field: string, value: string) => {
      const { data } = await supabase
        .from(table)
        .select('dispnum')
        .ilike(field, `%${value}%`)
        .eq('foxtow_id', foxtowId)
        .limit(500);
      return data?.map((d: { dispnum: any; }) => d.dispnum) || [];
    };

    // 7. Apply all search filters
    // Dispatch Number
    if (formData.sl_dispnum.trim()) {
      query = query.eq('dispnum', parseInt(formData.sl_dispnum.trim()) || 0);
    }

    // License Number
    if (formData.sl_licensenum.trim()) {
      query = query.ilike('licensenum', `%${formData.sl_licensenum.trim()}%`);
    }

    // VIN
    if (formData.sl_vin.trim()) {
      query = query.ilike('vin', `%${formData.sl_vin.trim()}%`);
    }

    // Tow Date
    if (formData.sl_towdate.trim() && formData.sl_towdate.includes('/')) {
      const [month, day, year] = formData.sl_towdate.split('/');
      if (month && day && year) {
        const fullDate = `20${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        query = query.eq('towdate', fullDate);
      }
    }

    // Tow Tag Number
    if (formData.sl_towtagnum.trim()) {
      const { data: towdriveData } = await supabase
        .from('towdrive')
        .select('dispnumdrv')
        .ilike('towtagnum', `%${formData.sl_towtagnum.trim()}%`)
        .eq('foxtow_id', foxtowId)
        .limit(500);
      
      if (towdriveData?.length) {
        query = query.in('dispnum', towdriveData.map((d: { dispnumdrv: any; }) => d.dispnumdrv));
      } else {
        return [];
      }
    }

    // Invoice Number
    if (formData.sl_invoicenum.trim()) {
      const invoiceNum = formData.sl_invoicenum.trim();
      const [mainDispnums, invDispnums] = await Promise.all([
        searchRelatedTable(baseTable, 'invoicenum', invoiceNum),
        searchRelatedTable('towinv', 'invoicenum', invoiceNum)
      ]);
      
      const allDispnums = [...new Set([...mainDispnums, ...invDispnums])];
      query = allDispnums.length ? query.in('dispnum', allDispnums) : query.eq('dispnum', -1);
    }

    // PO Number
    if (formData.sl_ponumber.trim()) {
      const poNumber = formData.sl_ponumber.trim();
      const [mainDispnums, invDispnums] = await Promise.all([
        searchRelatedTable(baseTable, 'ponumber', poNumber),
        searchRelatedTable('towinv', 'ponumber', poNumber)
      ]);
      
      const allDispnums = [...new Set([...mainDispnums, ...invDispnums])];
      query = allDispnums.length ? query.in('dispnum', allDispnums) : query.eq('dispnum', -1);
    }

    // Reference Number
    if (formData.sl_refnumber.trim()) {
      query = query.ilike('refnumber', `%${formData.sl_refnumber.trim()}%`);
    }

    // Driver
    if (formData.sl_driver.trim()) {
      const { data: towdriveData } = await supabase
        .from('towdrive')
        .select('dispnumdrv')
        .ilike('driver', `%${formData.sl_driver.trim()}%`)
        .eq('foxtow_id', foxtowId)
        .limit(1000);
      
      if (towdriveData?.length) {
        query = query.in('dispnum', towdriveData.map((d: { dispnumdrv: any; }) => d.dispnumdrv));
      } else {
        return [];
      }
    }

    // Stock Number
    if (formData.sl_stocknum.trim()) {
      query = query.eq('stocknum', parseInt(formData.sl_stocknum.trim()) || 0);
    }

    // Release License
    if (formData.sl_releaselic.trim()) {
      query = query.ilike('releaselic', `%${formData.sl_releaselic.trim()}%`);
    }

    // Towed From
    if (formData.sl_towedfrom.trim()) {
      query = query.ilike('towedfrom', `%${formData.sl_towedfrom.trim()}%`);
    }

    // Vehicle Year
    if (formData.sl_yearcar.trim()) {
      query = query.ilike('yearcar', `%${formData.sl_yearcar.trim()}%`);
    }

    // Vehicle Make
    if (formData.sl_makecar.trim()) {
      query = query.ilike('makecar', `%${formData.sl_makecar.trim()}%`);
    }

    // Vehicle Model
    if (formData.sl_modelcar.trim()) {
      query = query.ilike('modelcar', `%${formData.sl_modelcar.trim()}%`);
    }

    // Vehicle Color
    if (formData.sl_colorcar.trim()) {
      query = query.ilike('colorcar', `%${formData.sl_colorcar.trim()}%`);
    }

    // Auction Number
    if (formData.sl_auctnum.trim()) {
      query = query.eq('auct_name', parseInt(formData.sl_auctnum.trim()) || 0);
    }

    // 8. Apply additional filters
    if (filterValue === 'transportOnly') {
      query = query.eq('transport', true);
    } else if (filterValue === 'storedCarsOnly') {
      query = query.not('dateout', 'is', null);
    }

    // 9. Handle power search
    if (formData.powersearch_txt.trim()) {
      const fieldMap: Record<string, string> = {
        'Billing Screen Name': 'regnametow',
        'Notes': 'callremark',
        'Who Called': 'whocalled',
        'License': 'licensenum',
        'Vin': 'vin',
        'Member#': 'membernum',
        'Towedfrom': 'towedfrom',
        'Towedto': 'towedto'
      };

      const searchField = fieldMap[formData.powersearch_cb];
      if (searchField) {
        query = query.ilike(searchField, `%${formData.powersearch_txt.trim()}%`);
      }
    }

    // 10. Execute main query
    const { data, error } = await query
      .limit(500)
      .order('towdate', { ascending: false });

    if (error) throw error;
    if (!data?.length) return [];

    // 11. Fetch related data in batches
    const batchSize = 50;
    const processedResults = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(async (result: any) => {
        const [invoices, transactions] = await Promise.all([
          supabase.from('towinv')
            .select('*')
            .eq('dispnum', result.dispnum)
            .eq('foxtow_id', foxtowId)
            .order('invdate', { ascending: false }),
            
          supabase.from('towtrans')
            .select('*')
            .eq('dispnumtrs', result.dispnum)
            .eq('foxtow_id', foxtowId)
            .order('licensenum', { ascending: false })
        ]);

        return {
          ...result,
          invoices: invoices.data || [],
          transactions: transactions.data || []
        };
      }));
      
      processedResults.push(...batchResults);
    }

    return processedResults;

  } catch (error) {
    console.error('Search error:', error);
    alert('Search failed. Please check your search criteria and try again.');
    return [];
  }
};