import React from 'react';
import { SquareConfig } from './types';

interface PaymentLinkConfigProps {
  config: SquareConfig;
  onConfigChange: (config: Partial<SquareConfig>) => void;
}

const PaymentLinkConfig = ({ config, onConfigChange }: PaymentLinkConfigProps) => {
  return (
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
                onChange={(e) => onConfigChange({
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
                onChange={(e) => onConfigChange({
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
                onChange={(e) => onConfigChange({
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
                onChange={(e) => onConfigChange({
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
                onChange={(e) => onConfigChange({
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
                onChange={(e) => onConfigChange({
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
              onChange={(e) => onConfigChange({ tips: e.target.value as 'Enable' | 'Disable' })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Enable">Enable</option>
              <option value="Disable">Disable</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentLinkConfig;