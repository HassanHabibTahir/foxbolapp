export interface StatementSettings {
  showHideDetails: {
    showInvoiceItems: boolean;
    showReason: boolean;
    showToFromAddress: boolean;
    showDriver: boolean;
    showOdometer: boolean;
    showVIN: boolean;
    showInvoiceNumber: boolean;
    formatVinAsLastEight: boolean;
    includePaymentsAfterStatementDate: boolean;
    showCallNumber: boolean;
    includeLinksToSeeInvoice: boolean;
    showAccountContact: boolean;
    useCompletionDate: boolean;
    showPlateNumber: boolean;
    showUnitNumber: boolean;
    showTruck: boolean;
    showBillingNotes: boolean;
  };
  otherOptions: {
    defaultDueDate: string;
    disclaimer: string;
  };
}

export interface StatementEmailOptions {
  subject: string;
  body: string;
  includeStatementAsPDF: boolean;
  includeInvoicesAsPDF: boolean;
}