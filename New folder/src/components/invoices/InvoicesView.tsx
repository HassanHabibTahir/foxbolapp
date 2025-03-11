import React from 'react';
import { DisclaimerEditor } from './DisclaimerEditor';
import { EmailSettings } from './EmailSettings';
import { useAccountSettings } from '../../hooks/useAccountSettings';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../common/Toast';
import type { InvoiceSettings } from './types';

const DEFAULT_SETTINGS: InvoiceSettings = {
  disclaimer: '',
  emailSettings: {
    subject: '',
    message: ''
  }
};

export function InvoicesView() {
  const accountId = '123'; // TODO: Get from context/props
  const { settings, setSettings, saveSettings, loading, error } = 
    useAccountSettings<InvoiceSettings>(
      accountId,
      'invoice_settings',
      DEFAULT_SETTINGS
    );
  const { toast, showToast } = useToast();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error.message}</div>;
  }

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      showToast('Invoice settings saved successfully', 'success');
    } catch (error) {
      showToast('Error saving invoice settings', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <DisclaimerEditor
        disclaimer={settings.disclaimer}
        onChange={(disclaimer) => setSettings({ ...settings, disclaimer })}
      />

      <EmailSettings
        settings={settings.emailSettings}
        onChange={(emailSettings) =>
          setSettings({ ...settings, emailSettings })}
      />

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}