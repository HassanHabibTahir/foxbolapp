export interface SquareConnectionStatus {
  isActive: boolean;
  establishedDate?: string;
}

export interface SquareConfig {
  location: string;
  emailOptions: {
    includePaymentLinkOnReceipts: boolean;
    includePaymentLinkOnStatements: boolean;
    sendTransactionEmails: boolean;
  };
  printOptions: {
    excludeDispatchingReceipts: boolean;
    excludeImpoundReceipts: boolean;
    excludeStatements: boolean;
  };
  tips: 'Enable' | 'Disable';
}