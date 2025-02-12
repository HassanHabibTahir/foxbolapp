import React from 'react';

interface PaymentOptionsProps {
  emailOptions: {
    includeReceiptLinks: boolean;
    includeStatementLinks: boolean;
    sendTransactionEmails: boolean;
  };
  printOptions: {
    excludeDispatchingReceipts: boolean;
    excludeImpoundReceipts: boolean;
    excludeStatements: boolean;
  };
  onEmailOptionChange: (key: string, value: boolean) => void;
  onPrintOptionChange: (key: string, value: boolean) => void;
}

const PaymentOptions = ({
  emailOptions,
  printOptions,
  onEmailOptionChange,
  onPrintOptionChange
}: PaymentOptionsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm text-gray-600 mb-2">Emailing options</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={emailOptions.includeReceiptLinks}
              onChange={(e) => onEmailOptionChange('includeReceiptLinks', e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-600">
              Include a square payment link on receipts emailed to customers.
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={emailOptions.includeStatementLinks}
              onChange={(e) => onEmailOptionChange('includeStatementLinks', e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-600">
              Include a square payment link on statements emailed to customers.
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={emailOptions.sendTransactionEmails}
              onChange={(e) => onEmailOptionChange('sendTransactionEmails', e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-600">
              Send an email with successful transaction details when a Square payment is paid or a refund is refunded.
            </span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-sm text-gray-600 mb-2">Print options</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={printOptions.excludeDispatchingReceipts}
              onChange={(e) => onPrintOptionChange('excludeDispatchingReceipts', e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-600">
              Exclude square payment links on printed Dispatching receipts.
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={printOptions.excludeImpoundReceipts}
              onChange={(e) => onPrintOptionChange('excludeImpoundReceipts', e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-600">
              Exclude square payment links on printed Impound receipts.
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={printOptions.excludeStatements}
              onChange={(e) => onPrintOptionChange('excludeStatements', e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-600">
              Exclude square payment links on printed statements.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;