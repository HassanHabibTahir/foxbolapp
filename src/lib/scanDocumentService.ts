import { ScannerError } from './types';

export const scanDocument = async (): Promise<File | null> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.multiple = false;
    
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
};

export const getDefaultScanner = async (): Promise<MediaDeviceInfo | null> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.find(device => device.kind === 'videoinput' && device.label.toLowerCase().includes('scanner')) || null;
  } catch (error) {
    console.error('Error getting scanner:', error);
    return null;
  }
};