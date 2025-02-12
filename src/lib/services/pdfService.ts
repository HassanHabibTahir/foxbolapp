import { getInvoiceDetails } from './invoiceService';
import type { PrintSettings } from '../../types/print';
import { PDFGenerator } from './pdf/generator';

export const generatePDF = async (
  invoiceId: string, 
  settings: PrintSettings
): Promise<Blob> => {
  try {
    // Get invoice data
    const invoiceData = await getInvoiceDetails(invoiceId);
    if (!invoiceData) {
      throw new Error('Invoice not found');
    }

    // Generate PDF using the generator class
    const generator = new PDFGenerator();
    return await generator.generate(invoiceId, invoiceData, settings);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};