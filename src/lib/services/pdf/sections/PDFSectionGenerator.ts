import { jsPDF } from 'jspdf';
import type { PrintSettings } from '../../../../types/print';
import type { InvoiceDetails } from '../../invoiceService';
import type { PDFGenerationOptions } from '../types';

export class PDFSectionGenerator {
  constructor(
    private doc: jsPDF,
    private options: PDFGenerationOptions
  ) {}

  async generateHeader(
    invoiceId: string,
    settings: PrintSettings,
    startY: number
  ): Promise<number> {
    if (!settings.showHeader) {
      return startY;
    }

    this.doc.setFontSize(20);
    this.doc.text('INVOICE', this.options.pageWidth / 2, startY, { align: 'center' });
    startY += 10;

    this.doc.setFontSize(10);
    this.doc.text(settings.companyName, this.options.pageWidth / 2, startY, { align: 'center' });
    startY += 5;
    this.doc.text(settings.companyAddress, this.options.pageWidth / 2, startY, { align: 'center' });
    startY += 5;
    this.doc.text(settings.companyPhone, this.options.pageWidth / 2, startY, { align: 'center' });
    startY += 10;

    return startY;
  }

  async generateVehicleInfo(
    invoice: InvoiceDetails,
    startY: number
  ): Promise<number> {
    this.doc.setFontSize(14);
    this.doc.text('Vehicle Information', this.options.margins.left, startY);
    startY += 10;

    this.doc.setFontSize(10);
    this.doc.text(
      `${invoice.yearcar} ${invoice.makecar} ${invoice.modelcar}`,
      this.options.margins.left,
      startY
    );
    startY += 5;
    this.doc.text(`Color: ${invoice.colorcar}`, this.options.margins.left, startY);
    startY += 10;

    return startY;
  }

  async generateBillingInfo(
    invoice: InvoiceDetails,
    startY: number
  ): Promise<number> {
    this.doc.setFontSize(14);
    this.doc.text('Billing Information', this.options.margins.left, startY);
    startY += 10;

    this.doc.setFontSize(10);
    this.doc.text(invoice.billtoname, this.options.margins.left, startY);
    startY += 5;
    this.doc.text(invoice.billtoaddr1, this.options.margins.left, startY);
    startY += 5;
    this.doc.text(
      `${invoice.billtocity}, ${invoice.billtost} ${invoice.billtozip}`,
      this.options.margins.left,
      startY
    );
    startY += 10;

    return startY;
  }

  async generateChargesTable(
    invoice: InvoiceDetails,
    startY: number
  ): Promise<number> {
    this.doc.autoTable({
      startY,
      head: [['Description', 'Quantity', 'Rate', 'Amount']],
      body: [
        ['Basic Tow', '1', '$125.00', '$125.00'],
        ['Storage (Daily)', '3', '$45.00', '$135.00'],
        ['Admin Fee', '1', '$25.00', '$25.00']
      ],
      foot: [
        ['', '', 'Subtotal', `$${invoice.total.toFixed(2)}`],
        ['', '', 'Tax', `$${invoice.salestax.toFixed(2)}`],
        ['', '', 'Total', `$${(invoice.total + invoice.salestax).toFixed(2)}`]
      ],
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
    });

    return (this.doc as any).lastAutoTable.finalY;
  }

  async generateFooter(settings: PrintSettings): Promise<void> {
    if (!settings.showFooter) {
      return;
    }

    const startY = this.options.pageHeight - this.options.margins.bottom - 10;
    
    this.doc.setFontSize(10);
    this.doc.text(
      settings.footerText,
      this.options.pageWidth / 2,
      startY,
      { align: 'center' }
    );
  }
}