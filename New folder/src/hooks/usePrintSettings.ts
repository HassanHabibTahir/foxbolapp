import { useState, useEffect } from 'react';
import type { PrintSettings } from '../types/print';

const DEFAULT_SETTINGS: PrintSettings = {
  companyName: 'Your Company Name',
  companyAddress: '123 Main St, City, ST 12345',
  companyPhone: '(555) 555-5555',
  showHeader: true,
  showFooter: true,
  footerText: 'Thank you for your business!'
};

export const usePrintSettings = () => {
  const [settings, setSettings] = useState<PrintSettings>(() => {
    const saved = localStorage.getItem('printSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: PrintSettings) => {
    setSettings(newSettings);
    localStorage.setItem('printSettings', JSON.stringify(newSettings));
  };

  return { settings, updateSettings };
};