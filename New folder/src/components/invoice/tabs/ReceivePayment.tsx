import React from 'react';
import ReceivePaymentView from '../../payment/ReceivePayment';

interface ReceivePaymentTabProps {
  invoiceId: string;
}

const ReceivePaymentTab: React.FC<ReceivePaymentTabProps> = ({ invoiceId }) => {
  return <ReceivePaymentView invoiceId={invoiceId} />;
};

export default ReceivePaymentTab;