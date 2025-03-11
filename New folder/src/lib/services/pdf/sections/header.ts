```typescript
import { jsPDF } from 'jspdf';
import type { PrintSettings } from '../../../../types/print';
import type { PDFSection, PDFGenerationOptions } from '../types';

export const drawHeader = (
  doc: jsPDF,
  invoiceId: string,
  settings: PrintSettings,
  options: PDFGenerationOptions
): PDFSection => {
  const startY = options.margins.top;
  let currentY = startY;

  if (settings.showHeader) {
    // Company header
    doc.setFontSize(20);
    doc.text('INVOICE', options.pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    doc.setFontSize(10);
    doc.text(settings.companyName, options.pageWidth / 2, currentY, { align: 'center' });
    currentY += 5;
    doc.text(settings.companyAddress, options.pageWidth / 2, currentY, { align: 'center' });
    currentY += 5;
    doc.text(settings.companyPhone, options.pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
  }

  // Invoice details
  doc.setFontSize(12);
  doc.text(`Invoice #: ${invoiceId}`, options.margins.left, currentY);
  doc.text(
    `Date: ${new Date().toLocaleDateString()}`,
    options.pageWidth - options.margins.right,
    currentY,
    { align: 'right' }
  );
  currentY += 10;

  return {
    startY,
    height: currentY - startY
  };
};
```