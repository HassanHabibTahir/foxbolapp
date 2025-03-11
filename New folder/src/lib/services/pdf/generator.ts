import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { PrintSettings } from '../../../types/print';
import type { InvoiceDetails } from '../invoiceService';
import type { PDFGenerationOptions } from './types';
import { PDFSectionGenerator } from './sections/PDFSectionGenerator';

export class PDFGenerator {
  private doc: jsPDF;
  private options: PDFGenerationOptions;
  private sectionGenerator: PDFSectionGenerator;

  constructor() {
    this.doc = new jsPDF();
    this.options = {
      pageWidth: this.doc.internal.pageSize.width,
      pageHeight: this.doc.internal.pageSize.height,
      margins: {
        top: 20,
        right: 15,
        bottom: 20,
        left: 15
      }
    };
    this.sectionGenerator = new PDFSectionGenerator(this.doc, this.options);
  }

  async generate(
    invoiceId: string,
    invoice: InvoiceDetails,
    settings: PrintSettings
  ): Promise<Blob> {
    try {
      let currentY = this.options.margins.top;

      // Generate each section
      currentY = await this.sectionGenerator.generateHeader(invoiceId, settings, currentY);
      currentY = await this.sectionGenerator.generateVehicleInfo(invoice, currentY);
      currentY = await this.sectionGenerator.generateBillingInfo(invoice, currentY);
      currentY = await this.sectionGenerator.generateChargesTable(invoice, currentY);
      await this.sectionGenerator.generateFooter(settings);

      return this.doc.output('blob');
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF');
    }
  }
}