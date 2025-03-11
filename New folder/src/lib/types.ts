// Scanner Types
export class ScannerError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ScannerError';
  }
}

export interface ScannerState {
  isScanning: boolean;
  error?: string;
}

export interface BarcodeResult {
  format: string;
  value: string;
}

// Document Types
export interface DocumentResult {
  id: string;
  url: string;
  name: string;
}

// Photo Types
export interface PhotoResult {
  id: string;
  url: string;
  thumbnailUrl?: string;
}