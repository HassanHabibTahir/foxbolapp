```typescript
import { jsPDF } from 'jspdf';
import type { InvoiceDetails } from '../../invoiceService';
import type { PDFSection, PDFGenerationOptions } from '../types';

export const drawBillingInfo = (
  doc: jsPDF,
  invoice: InvoiceDetails,
  startY: number,
  options: PDFGenerationOptions
): PDFSection => {
  let currentY = startY;

  // Section title
  doc.setFontSize(14);
  doc.text('Billing Information', options.margins.left, currentY);
  currentY += 10;

  // Billing details
  doc.setFontSize(10);
  doc.text(invoice.billtoname, options.margins.left, currentY);
  currentY += 5;
  doc.text(invoice.billtoaddr1, options.margins.left, currentY);
  currentY += 5;
  doc.text(
    `${invoice.billtocity}, ${invoice.billtost} ${invoice.billtozip}`,
    options.margins.left,
    currentY
  );
  currentY += 10;

  return {
    startY,
    height: currentY - startY
  };
};
```