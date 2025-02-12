import React from 'react';
import { DisclaimerEditor } from './DisclaimerEditor';
import { BillingOptions } from './BillingOptions';
import { DeliveryPreferences } from './DeliveryPreferences';
import { EmailSettings } from './EmailSettings';
import { useAccountSettings } from '../../hooks/useAccountSettings';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../common/Toast';
import type { StatementSettings } from './types';

const DEFAULT_SETTINGS: StatementSettings = {
  disclaimer: '',
  preferredBillingMethod: 'Invoice',
  initialStatementDueDate: 'Net 30',
  deliveryPreferences: {
    print: true,
    email: false
  },
  emailSettings: {
    subject: '',
    message: ''
  }
};

export function StatementsView() {
  const accountId = '123'; // TODO: Get from context/props
  const { settings, setSettings, saveSettings, loading, error } = 
    useAccountSettings<StatementSettings>(
      accountId,
      'statement_settings',
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
      showToast('Statement settings saved successfully', 'success');
    } catch (error) {
      showToast('Error saving statement settings', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <DisclaimerEditor
        disclaimer={settings.disclaimer}
        onChange={(disclaimer) => setSettings({ ...settings, disclaimer })}
      />

      <BillingOptions
        preferredMethod={settings.preferredBillingMethod}
        dueDate={settings.initialStatementDueDate}
        onMethodChange={(preferredBillingMethod) => 
          setSettings({ ...settings, preferredBillingMethod })}
        onDueDateChange={(initialStatementDueDate) =>
          setSettings({ ...settings, initialStatementDueDate })}
      />

      <DeliveryPreferences
        preferences={settings.deliveryPreferences}
        onChange={(deliveryPreferences) =>
          setSettings({ ...settings, deliveryPreferences })}
      />

      {settings.deliveryPreferences.email && (
        <EmailSettings
          settings={settings.emailSettings}
          onChange={(emailSettings) =>
            setSettings({ ...settings, emailSettings })}
        />
      )}

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