export interface InvoiceSettings {
  disclaimer: string;
  emailSettings: {
    subject: string;
    message: string;
  };
}