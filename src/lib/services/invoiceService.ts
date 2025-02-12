import { supabase } from '../supabase';

export interface InvoiceDetails {
  // Towmast fields
  dispnum: number;
  towdate: string;
  yearcar: string;
  makecar: string;
  modelcar: string;
  colorcar: string;
  calltype: string;
  whocalled: string;
  callphone: string;
  towedfrom: string;
  towedto: string;
  condition: string;
  
  // Towinv fields
  invoicenum: string;
  invdate: string;
  billtoname: string;
  billtoaddr1: string;
  billtocity: string;
  billtost: string;
  billtozip: string;
  billtophone: string;
  total: number;
  totalpaid: number;
  curbalance: number;
  salestax: number;
  
  // Towdrive fields
  driver: string;
  towtagnum: string;
  trucknum: string;
  timerec: string;
  timearrive: string;
  timeclear: string;
}

export const getInvoiceDetails = async (invoiceNum: string): Promise<InvoiceDetails | null> => {
  try {
    // First get the invoice record
    const { data: invData, error: invError } = await supabase
      .from('towinv')
      .select('*')
      .eq('invoicenum', invoiceNum)
      .limit(1);

    if (invError) throw invError;
    if (!invData?.length) return null;

    const invoice = invData[0];

    // Get the related towmast record
    const { data: mastData, error: mastError } = await supabase
      .from('towmast')
      .select('*')
      .eq('dispnum', invoice.dispnum)
      .limit(1);

    if (mastError) throw mastError;
    if (!mastData?.length) return null;

    const master = mastData[0];

    // Get the related towdrive record
    const { data: driveData, error: driveError } = await supabase
      .from('towdrive')
      .select('*')
      .eq('dispnumdrv', invoice.dispnum)
      .limit(1);

    if (driveError) throw driveError;
    if (!driveData?.length) return null;

    const drive = driveData[0];

    // Combine the data
    return {
      // Towmast fields
      dispnum: master.dispnum,
      towdate: master.towdate,
      yearcar: master.yearcar,
      makecar: master.makecar,
      modelcar: master.modelcar,
      colorcar: master.colorcar,
      calltype: master.calltype,
      whocalled: master.whocalled,
      callphone: master.callphone,
      towedfrom: master.towedfrom,
      towedto: master.towedto,
      condition: master.condition,

      // Towinv fields
      invoicenum: invoice.invoicenum,
      invdate: invoice.invdate,
      billtoname: invoice.billtoname,
      billtoaddr1: invoice.billtoaddr1,
      billtocity: invoice.billtocity,
      billtost: invoice.billtost,
      billtozip: invoice.billtozip,
      billtophone: invoice.billtophone,
      total: invoice.total,
      totalpaid: invoice.totalpaid,
      curbalance: invoice.curbalance,
      salestax: invoice.salestax,

      // Towdrive fields  
      driver: drive.driver,
      towtagnum: drive.towtagnum,
      trucknum: drive.trucknum,
      timerec: drive.timerec,
      timearrive: drive.timearrive,
      timeclear: drive.timeclear
    };
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    return null;
  }
};