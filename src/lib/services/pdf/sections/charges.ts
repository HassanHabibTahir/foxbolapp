```typescript
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { InvoiceDetails } from '../../invoiceService';
import type { PDFSection, PDFGenerationOptions, PDFTableOptions } from '../types';

export const drawChargesTable = (
  doc: jsPDF,
  invoice: InvoiceDetails,
  startY: number,
  options: PDFGenerationOptions
): PDFSection => {
  const tableOptions: PDFTableOptions = {
    startY,
    theme: 'striped',
    headerStyles: { fillColor: [66, 139, 202] },
    footerStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
  };

  autoTable(doc, {
    ...tableOptions,
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
    ]
  });

  const finalY = (doc as any).lastAutoTable.finalY;
  return {
    startY,
    height: finalY - startY
  };
};
```