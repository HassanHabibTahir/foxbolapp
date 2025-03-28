import { useState } from 'react';
import OverviewPage from '../components/Settings/Overview/OverviewPage';
import CompanyProfilePage from '../components/Settings/CompanyProfile/CompanyProfilePage';
import NotificationsPage from '../components/Settings/Notifications/NotificationsPage';
import GPSIntegrationPage from '../components/Settings/GPS/GPSIntegrationPage';
import PricingPage from '../components/Settings/Pricing/PricingPage';
import UsersPage from '../components/Settings/Users/UsersPage';
import DriversPage from '../components/Settings/Drivers/DriversPage';
import TrucksPage from '../components/Settings/Trucks/TrucksPage';
import DispatchingPage from '../components/Settings/Dispatching/DispatchingPage';
import ImpoundLotsPage from '../components/Settings/Impounds/ImpoundLotsPage';
import AddressBookPage from '../components/Settings/AddressBook/AddressBookPage';
import QuickBooksSetupPage from '../components/Settings/QuickBooks/QuickBooksSetupPage';
import SquareSetupPage from '../components/Settings/Square/SquareSetupPage';
import StatementsPage from '../components/Settings/Statements/StatementsPage';
import SettingsSidebar from '../components/Settings/SettingsSidebar';
// import Header from '../components/layouts/Header';
import KitsManager from "../components/Settings/Kits/KitsManager";
import ItemsPage from '../components/Settings/Items/ItemsPage';

const Setting = () => {
  const [currentPage, setCurrentPage] = useState('overview');

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage />;
      case 'company-profile':
        return <CompanyProfilePage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'gps':
        return <GPSIntegrationPage />;
      case 'pricing':
        return <PricingPage />;
      case 'users':
        return <UsersPage />;
      case 'drivers':
        return <DriversPage />;
      case 'trucks':
        return <TrucksPage />;
      case 'dispatching':
        return <DispatchingPage />;
      case 'impounds':
        return <ImpoundLotsPage />;
      case 'address-book':
        return <AddressBookPage />;
      case 'quickbooks':
        return <QuickBooksSetupPage />;
      case 'square-setup':
        return <SquareSetupPage />;
      case 'statements':
        return <StatementsPage />;
        case 'kits':
          return <KitsManager />;
        case 'items':
          return <ItemsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
       {/*<Header/>*/}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-3 md:gap-6">
          <div className="md:w-64">
            <SettingsSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>

          <div className="flex-1">
            {renderPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
