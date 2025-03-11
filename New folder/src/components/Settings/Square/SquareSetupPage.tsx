import React, { useState } from 'react';
import { SquareConfig } from './types';

const SquareSetupPage = () => {
  const [config, setConfig] = useState<SquareConfig>({
    location: 'Off-site sales',
    emailOptions: {
      includePaymentLinkOnReceipts: true,
      includePaymentLinkOnStatements: false,
      sendTransactionEmails: false
    },
    printOptions: {
      excludeDispatchingReceipts: false,
      excludeImpoundReceipts: false,
      excludeStatements: false
    },
    tips: 'Disable'
  });

  const handleConfigChange = (updates: Partial<SquareConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-2">Square integration</h1>
        <p className="text-gray-600">Configure your Square account to work in Towbook</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Connection Status</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">
              Connection with Square is <span className="text-green-600 font-medium">active</span>.
            </p>
            <p className="text-sm text-gray-500">
              The connection was established on 12/26/2024 8:22:46 PM.
            </p>
          </div>
          <button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
            Disconnect from Square
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Payments Configuration</h2>
        <p className="text-sm text-gray-600 mb-4">
          Select a Square Location to be used for payments processing through Payment web links, Android and iOS devices.
        </p>
        <div className="w-64">
          <select
            value={config.location}
            onChange={(e) => handleConfigChange({ location: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Off-site sales">Off-site sales</option>
          </select>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Payment Link Configuration</h2>
        <p className="text-sm text-gray-600 mb-4">
          Select the desired options for payment links for your invoices and statements.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Emailing options</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.emailOptions.includePaymentLinkOnReceipts}
                  onChange={(e) => handleConfigChange({
                    emailOptions: {
                      ...config.emailOptions,
                      includePaymentLinkOnReceipts: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Include a square payment link on receipts emailed to customers.
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.emailOptions.includePaymentLinkOnStatements}
                  onChange={(e) => handleConfigChange({
                    emailOptions: {
                      ...config.emailOptions,
                      includePaymentLinkOnStatements: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Include a square payment link on statements emailed to customers.
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.emailOptions.sendTransactionEmails}
                  onChange={(e) => handleConfigChange({
                    emailOptions: {
                      ...config.emailOptions,
                      sendTransactionEmails: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Send an email with successful transaction details when a Square payment is paid or a refund is refunded.
                </span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Print options</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.printOptions.excludeDispatchingReceipts}
                  onChange={(e) => handleConfigChange({
                    printOptions: {
                      ...config.printOptions,
                      excludeDispatchingReceipts: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Exclude square payment links on printed Dispatching receipts.
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.printOptions.excludeImpoundReceipts}
                  onChange={(e) => handleConfigChange({
                    printOptions: {
                      ...config.printOptions,
                      excludeImpoundReceipts: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Exclude square payment links on printed Impound receipts.
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.printOptions.excludeStatements}
                  onChange={(e) => handleConfigChange({
                    printOptions: {
                      ...config.printOptions,
                      excludeStatements: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Exclude square payment links on printed statements.
                </span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Tips</h3>
            <div className="w-64">
              <select
                value={config.tips}
                onChange={(e) => handleConfigChange({ tips: e.target.value as 'Enable' | 'Disable' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Disable">Disable</option>
                <option value="Enable">Enable</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
        Update Configuration
      </button>
    </div>
  );
};

export default SquareSetupPage;