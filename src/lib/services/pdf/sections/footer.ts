```typescript
import { jsPDF } from 'jspdf';
import type { PrintSettings } from '../../../../types/print';
import type { PDFSection, PDFGenerationOptions } from '../types';

export const drawFooter = (
  doc: jsPDF,
  settings: PrintSettings,
  options: PDFGenerationOptions
): PDFSection => {
  if (!settings.showFooter) {
    return { startY: options.pageHeight, height: 0 };
  }

  const startY = options.pageHeight - options.margins.bottom - 10;
  
  doc.setFontSize(10);
  doc.text(
    settings.footerText,
    options.pageWidth / 2,
    startY,
    { align: 'center' }
  );

  return {
    startY,
    height: 10
  };
};
```