```typescript
export interface PDFSection {
  startY: number;
  height: number;
}

export interface PDFGenerationOptions {
  pageWidth: number;
  pageHeight: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface PDFTableOptions {
  startY: number;
  headerStyles?: any;
  bodyStyles?: any;
  footerStyles?: any;
  theme?: string;
}
```