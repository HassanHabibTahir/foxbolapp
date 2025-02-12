import { useDeviceType } from '../hooks/useDeviceType';
import { useFormState } from '../hooks/useFormState';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DesktopLayout from './layouts/DesktopLayout';
import SaveButton from './SaveButton';
import NewButton from './NewButton';
import InvoiceSearch from './search/InvoiceSearch';
import Header from './invoice/Header';
import GeneralSection from './GeneralSection';
import DriverSection from './DriverSection';
import VehicleSection from './VehicleSection';
import VehicleDetailsSection from './VehicleDetailsSection';
import LocationSection from './LocationSection';
import NotesSection from './NotesSection';
import RegistrationSection from './RegistrationSection';
import InvoiceSection from './InvoiceSection';
import StorageSection from './StorageSection';
import LienSection from './LienSection';
import ChargesSection from './ChargesSection';
import { fetchTowData } from '../lib/saveHandlers';
import PrintButton from './invoices/PrintButton';
import { printInvoice } from '../utils/printInvoice';

const InvoiceForm = () => {
  const { formState, updateDispatch, updateInvoice, updateItems, resetForm, updateDriver } = useFormState();
  const location = useLocation();
  const { dispatchNum } = location.state;

  // Create refs for each section
  const driverSectionRef = useRef<HTMLDivElement>(null);
  const generalSectionRef = useRef<HTMLDivElement>(null);
  const vehicleDetailsSectionRef = useRef<HTMLDivElement>(null);
  const locationSectionRef = useRef<HTMLDivElement>(null);
  const notesSectionRef = useRef<HTMLDivElement>(null);
  const invoiceSectionRef = useRef<HTMLDivElement>(null);
  const registrationSectionRef = useRef<HTMLDivElement>(null);
  const storageSectionRef = useRef<HTMLDivElement>(null);
  const lienSectionRef = useRef<HTMLDivElement>(null);
  const chargesSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const foxtow_id = localStorage.getItem('foxtow_id') || '';
    const getDispatchNum = async () => {
      const { data, error } = await supabase
          .from('towmast')
          .select()
          .eq('dispnum', dispatchNum)
          .maybeSingle();

      if (!error && data) {
        handleInvoiceFound(data.dispnum, foxtow_id);
      }
    };
    getDispatchNum();
  }, []);

  const handleSave = () => {
    return {
      dispatch: formState.dispatch,
      invoice: formState.invoice,
      items: formState.items,
      driver: formState.driver
    };
  };

  const handleNew = (invoiceNumber: string) => {
    resetForm();
    updateDispatch({ dispnum: invoiceNumber });
  };

  const handleInvoiceFound = async (dispatchNumber: number, foxtow_id: string) => {
    resetForm();
    const { invoice, driver, dispatch, items } = await fetchTowData(dispatchNumber, foxtow_id);
    updateDispatch(dispatch);
    updateInvoice(invoice);
    updateDriver(driver);
    updateItems(items);
  };

  const handlePrint = () => {
    printInvoice({
      dispatch: formState.dispatch,
      invoice: formState.invoice,
      items: formState.items,
      driver: formState.driver
    });
  };

  // Helper function to focus the first input in a section
  const focusSection = (ref: React.RefObject<HTMLDivElement>) => {
    const focusableElement = ref.current?.querySelector('input, select, textarea, button') as HTMLElement;
    if (focusableElement) {
      focusableElement.focus();
    }
  };

  const sections = [
    // Top actions and header
    <div key="actions" className="flex flex-wrap gap-2">
      <InvoiceSearch 
        onInvoiceFound={handleInvoiceFound}
        className="flex-1 min-w-[200px]"
      />
      <NewButton onNew={handleNew} />
      <SaveButton onSave={handleSave} />
      <PrintButton onPrint={handlePrint} />
    </div>,
    <Header 
      key="header" 
      dispatchNumber={formState.dispatch.dispnum}
    />,
    
    // Driver info
    <div ref={driverSectionRef} key="driver-wrapper">
      <DriverSection 
        driver={formState.driver}
        onUpdateDriver={updateDriver}
        onEnterPress={() => focusSection(generalSectionRef)}
      /> 
    </div>,
    <div ref={generalSectionRef} key="general-wrapper">
      <GeneralSection 
        dispatch={formState.dispatch}
        onDispatchChange={updateDispatch}
        invoice={formState.invoice}
        onInvoiceChange={updateInvoice}
        onEnterPress={() => focusSection(vehicleDetailsSectionRef)}
      />
    </div>,
    <div ref={vehicleDetailsSectionRef} key="vehicle-details-wrapper">
      <VehicleDetailsSection 
        odometer={formState.dispatch.odometer}
        condition={formState.dispatch.condition}
        reason={formState.dispatch.reason}
        onChange={(field, value) => updateDispatch({ [field]: value })}
        onEnterPress={() => focusSection(locationSectionRef)}
      />
    </div>,
    <div ref={locationSectionRef} key="location-wrapper">
      <LocationSection
        dispatch={formState.dispatch}
        onDispatchChange={updateDispatch}
        onEnterPress={() => focusSection(notesSectionRef)}
      />
    </div>,
    <div ref={notesSectionRef} key="notes-wrapper">
      <NotesSection 
        value={formState.dispatch.callremark || ''}
        onChange={(notes) => updateDispatch({ 'callremark': notes })}
        onEnterPress={() => focusSection(invoiceSectionRef)}
      />
    </div>,
    <div ref={invoiceSectionRef} key="invoice-wrapper">
      <InvoiceSection 
        invoice={formState.invoice}
        onInvoiceChange={updateInvoice}
        onEnterPress={() => focusSection(registrationSectionRef)}
      />
    </div>,
    <div ref={registrationSectionRef} key="registration-wrapper">
      <RegistrationSection
        invoice={formState.invoice}
        onInvoiceChange={updateInvoice}
        dispatch={formState.dispatch}
        onDispatchChange={updateDispatch}
        onEnterPress={() => focusSection(storageSectionRef)}
      />
    </div>,
    <div ref={storageSectionRef} key="storage-wrapper">
      <StorageSection 
        dispatch={formState.dispatch}
        onDispatchChange={updateDispatch}
        onEnterPress={() => focusSection(lienSectionRef)}
      />
    </div>,
    <div ref={lienSectionRef} key="lien-wrapper">
      <LienSection
        dispatch={formState.dispatch}
        onDispatchChange={updateDispatch}
        onEnterPress={() => focusSection(chargesSectionRef)}
      />
    </div>,
    <div ref={chargesSectionRef} key="charges-wrapper">
      <ChargesSection 
        transactionItems={formState.items || []}
        onItemsChange={updateItems}
        invoice={formState.invoice}
        onInvoiceChange={updateInvoice}
      />
    </div>
  ];

  return <DesktopLayout sections={sections} />;
};

export default InvoiceForm;