import React, { useState } from 'react';
import ReportsMenu from '../components/ReportsMenu';
import InvoiceRegister from '../components/reports/InvoiceRegister';
import DriverCommission from '../components/reports/DriverCommission';
import ItemReport from '../components/reports/ItemReport';
import CustomerReport from '../components/reports/CustomerReport';
import AutoClubCommission from '../components/reports/AutoClubCommission';
import LotInventory from '../components/reports/LotInventory';
import ARAgeing from '../components/reports/ARAgeing';
import PaymentsReceived from '../components/reports/PaymentsReceived';
import CallLog from '../components/reports/CallLog';
import Header from '../components/menu/Header';

const Report = () => {
  const [currentReport, setCurrentReport] = useState('invoice');

  const renderReport = () => {
    switch (currentReport) {
      case 'invoice':
        return <InvoiceRegister />;
      case 'driver':
        return <DriverCommission />;
      case 'item':
        return <ItemReport />;
      case 'customer':
        return <CustomerReport />;
      case 'autoclub':
        return <AutoClubCommission />;
      case 'lotinventory':
        return <LotInventory />;
      case 'arageing':
        return <ARAgeing />;
      case 'payments':
        return <PaymentsReceived />;
      case 'calllog':
        return <CallLog />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        currentReport={currentReport}
        onSelectReport={setCurrentReport}
      />
      <div className="">
        {renderReport()}
      </div>
    </div>
  );
};

export default Report;