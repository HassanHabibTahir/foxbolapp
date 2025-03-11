```typescript
import { jsPDF } from 'jspdf';
import type { InvoiceDetails } from '../../invoiceService';
import type { PDFSection, PDFGenerationOptions } from '../types';

export const drawVehicleInfo = (
  doc: jsPDF,
  invoice: InvoiceDetails,
  startY: number,
  options: PDFGenerationOptions
): PDFSection => {
  let currentY = startY;

  // Section title
  doc.setFontSize(14);
  doc.text('Vehicle Information', options.margins.left, currentY);
  currentY += 10;

  // Vehicle details
  doc.setFontSize(10);
  doc.text(
    `${invoice.yearcar} ${invoice.makecar} ${invoice.modelcar}`,
    options.margins.left,
    currentY
  );
  currentY += 5;
  doc.text(`Color: ${invoice.colorcar}`, options.margins.left, currentY);
  currentY += 10;

  return {
    startY,
    height: currentY - startY
  };
};
```