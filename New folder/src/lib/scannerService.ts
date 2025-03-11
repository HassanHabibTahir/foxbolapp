import { ScannerError } from './types';

interface ScannerDevice {
  id: string;
  name: string;
}

export const getAvailableScanners = async (): Promise<ScannerDevice[]> => {
  try {
    // First try native file system access
    if ('showOpenFilePicker' in window) {
      return [{ id: 'file-system', name: 'File System' }];
    }
    
    // Fallback to basic file input
    return [{ id: 'file-input', name: 'File Upload' }];
  } catch (error) {
    console.error('Error getting scanners:', error);
    return [];
  }
};

export const startScanner = async (deviceId?: string): Promise<File> => {
  try {
    // Try modern file system access API first
    if ('showOpenFilePicker' in window) {
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Documents',
            accept: {
              'application/pdf': ['.pdf'],
              'image/*': ['.png', '.jpg', '.jpeg', '.tiff']
            }
          }
        ],
        multiple: false
      });
      
      return await handle.getFile();
    }
    
    // Fallback to traditional file input
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,application/pdf';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          resolve(file);
        } else {
          reject(new ScannerError('No file selected', 'NO_FILE'));
        }
      };

      input.click();
    });
  } catch (error) {
    console.error('Scanner error:', error);
    throw new ScannerError('Failed to get document', 'SCAN_FAILED');
  }
};