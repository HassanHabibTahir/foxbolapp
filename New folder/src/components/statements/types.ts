export interface StatementSettings {
  disclaimer: string;
  preferredBillingMethod: 'Invoice' | 'Statement';
  initialStatementDueDate: string;
  deliveryPreferences: {
    print: boolean;
    email: boolean;
  };
  emailSettings: {
    subject: string;
    message: string;
  };
}