import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TopNav from './components/layouts/TopNav';
import Dashboard from './pages/Dashboard';
import Dispatch from './pages/Dispatch';
import Map from './pages/Map';
import Impound from './pages/Impound';
import Account from './pages/Account';
import Report from './pages/Report';
import Setting from './pages/Setting';
import Invoice from './pages/Invoice';
import QuickPage from './pages/QuickCall';
import ImpoundDeatil from './pages/ImpoundDetail';
import './i18n'
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Newimpound from './pages/Newimpound';
import { Toaster } from 'react-hot-toast';

function App() {
    const { i18n } = useTranslation();
    useEffect(() => {
      // Get the stored language from localStorage or default to 'en'
      const storedLanguage = localStorage.getItem('foxtow_language') || 'en';
      i18n.changeLanguage(storedLanguage);
    }, [i18n]);
  return (
    <>
    <Toaster
  position="top-right"
  reverseOrder={false}
/>
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <TopNav />
        <main className="w-full max-w-[1800px] mx-auto mt-6 px-4">

          <Routes>
            <Route path="/" element={<Navigate to="/impound" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dispatch" element={<Dispatch />} />
            <Route path="/map" element={<Map />} />
            <Route path="/impound" element={<Impound />} />
            <Route path="/new-impound" element={<Newimpound />} />
            <Route path="/impound/detail" element={<ImpoundDeatil />} />
            <Route path="/account" element={<Account />} />
            <Route path="/report" element={<Report />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/quick-call" element={<QuickPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
    </>
  );
}

export default App;
