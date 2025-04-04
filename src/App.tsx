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
import TrucksPage from './pages/Trucks';
import EditTrucks from './pages/Truckedit';
import AddNewTrucks from './pages/createTruck';
import NewQuickPage from './pages/NewQuickCall';
import { supabase } from './lib/supabase';

function App() {
    const { i18n } = useTranslation();
    useEffect(() => {
      // Get the stored language from localStorage or default to 'en'
      const storedLanguage = localStorage.getItem('foxtow_language') || 'en';
      i18n.changeLanguage(storedLanguage);
    }, [i18n]);


  
    // dispatcher Clear.
    useEffect(() => {
      const checkAutoClear = async () => {
        try {
          const foxtow_id = localStorage.getItem("foxtow_id");
          const now = new Date();
          
          // Get all pending clear records
          const { data: pendingRecords } = await supabase
            .from('towdrive')
            .select('*, towmast!inner(dispnum, dispcleared)')
            .eq('dispcleared', false)
            .eq('towmast.dispatched', true)
            .eq('foxtow_id', foxtow_id);
    
          if (!pendingRecords) return;
    
          for (const record of pendingRecords) {
            const timeclear = record.timeclear?.replace(":", "");
            if (!timeclear) continue;
            if (!timeclear || timeclear.length !== 4 || isNaN(Number(timeclear))) {
              console.error('Invalid timeclear format:', timeclear);
              continue;
            }
           
            // // if (!timeclear) continue;
            
            // console.log(timeclear,"pendingRecords")
          //   // Parse stored military time (HHMM)
            const hours = parseInt(timeclear.slice(0, 2), 10);
            const minutes = parseInt(timeclear.slice(2, 4), 10);
   
            const enteredDate = new Date(now);
            enteredDate.setHours(hours, minutes, 0, 0);
           
            // // console.log(enteredDate,"pendingRecords")
            const timeDiff = enteredDate.getTime() - now.getTime();
            let shouldClear = false;
    
            if (timeDiff <= 0) {  
              shouldClear = true;
            } else if (timeDiff > 3600000) { // More than 1 hour ahead
              const enteredDatePrevDay = new Date(enteredDate);
              enteredDatePrevDay.setDate(enteredDatePrevDay.getDate() - 1);
              shouldClear = enteredDatePrevDay <= now;
            } else {
              shouldClear = false;
            }
            console.log(enteredDate,shouldClear,record.id,"shouldClear",record.towmast.dispnum)
            if (shouldClear) {
              await supabase
                .from('towdrive')
                .update({ dispcleared: true })
                .eq('id', record.id);
    
              await supabase
                .from('towmast')
                .update({ dispcleared: true })
                .eq('dispnum', record.towmast.dispnum);
            }
           }
        } catch (error) {
          console.error('Auto-clear error:', error);
        }
      };
    
      // Check every minute and on mount
      checkAutoClear();
      const interval = setInterval(checkAutoClear, 10000);
      return () => clearInterval(interval);
    }, []);
    
  


















  return (
    <>
    <Toaster
  position="top-right"
  reverseOrder={false}
/>
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <TopNav />
        <main className="w-full max-w-[1800px] mx-auto mt-2 px-4">

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
             <Route path="/trucks" element={<TrucksPage/>}/>
             <Route path="/setting-trucks/:id" element={<EditTrucks />} />
             <Route path="/add-new-trucks" element={<AddNewTrucks />}/>
             <Route path="/quick-call" element={<QuickPage />} />
             <Route path="/quickcall" element={<NewQuickPage/>}  />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
    </>
  );
}

export default App;
