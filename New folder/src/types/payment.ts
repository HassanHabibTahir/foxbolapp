export type PaymentType = 'CASH' | 'CHECK' | 'CREDIT' | 'DEBIT';

export interface Payment {
  id: string;
  invoicenum: string;
  amount: number;
  paytype: PaymentType;
  referencenum: string;
  datepaid: string;
  datetime: string;
  whopayed: string;
  paynote: string;
  voided: boolean;
  voideddt: string | null;
}

export interface PaymentState {
  invoiceTotal: number;
  amountPaid: number;
  balanceDue: number;
  payments: Payment[];
}