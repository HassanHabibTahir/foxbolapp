// import { useDeviceType } from '../hooks/useDeviceType';
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
// import VehicleSection from './VehicleSection';
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
import { useFocusNavigation } from '../hooks/useFocusNavigation';

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


  const sectionRefs = [
    driverSectionRef,
    generalSectionRef,
    vehicleDetailsSectionRef,
    locationSectionRef,
    notesSectionRef,
    invoiceSectionRef,
    registrationSectionRef,
    storageSectionRef,
    lienSectionRef,
    chargesSectionRef
  ];
  useFocusNavigation(sectionRefs);

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

  // // Helper function to focus the first input in a section
  // const focusSection = (ref: React.RefObject<HTMLDivElement>) => {
  //   const focusableElement = ref.current?.querySelector('input, select, textarea, button') as HTMLElement;
  //   if (focusableElement) {
  //     focusableElement.focus();
  //   }
  // };

  // const inputRefs = {
  //   driver1: useRef<HTMLInputElement>(null),
  //   driver2: useRef<HTMLInputElement>(null),
  //   receivedRef: useRef<HTMLInputElement>(null),
  //   enRouteRef: useRef<HTMLInputElement>(null),
  //   arrivedRef: useRef<HTMLInputElement>(null),
  //   loadedRef: useRef<HTMLInputElement>(null),
  //   clearedRef: useRef<HTMLInputElement>(null),
  //   date: useRef<HTMLInputElement>(null),
  //   tag: useRef<HTMLInputElement>(null),
  //   truck: useRef<HTMLInputElement>(null),
  //   dispatcher: useRef<HTMLInputElement>(null),
  //   kit: useRef<HTMLInputElement>(null),
  //   memberNum: useRef<HTMLInputElement>(null),
  //   memberExp: useRef<HTMLInputElement>(null),
  //   value: useRef<HTMLInputElement>(null),
  //   dateStored: useRef<HTMLInputElement>(null),
  //   account: useRef<HTMLInputElement>(null),
  //   whoCalled: useRef<HTMLInputElement>(null),
  //   phone: useRef<HTMLInputElement>(null),
  //   refNum: useRef<HTMLInputElement>(null),
  //   vehicleSection: useRef<HTMLDivElement>(null),
  // }
  // const inputOrder = [
  //   // "driver1",
  //   // "driver2",
  //   // "receivedRef",
  //   // "enRouteRef",
  //   // "arrivedRef",
  //   // "loadedRef",
  //   // "clearedRef",
  //   "date",
  //   "tag",
  //   "truck",
  //   "dispatcher",
  //   "kit",
  //   "memberNum",
  //   "memberExp",
  //   "value",
  //   "dateStored",
  //   "account",
  //   "whoCalled",
  //   "phone",
  //   "refNum",
  //   "vehicleSection",
  // ]
  //     const focusNextInput = (currentIndex: number) => {
  //       const nextIndex = (currentIndex + 1) % inputOrder.length
  //       const nextRef = inputRefs[inputOrder[nextIndex] as keyof typeof inputRefs]
  //       if (nextRef.current) {
  //         nextRef.current.focus()
  //       }
  //     }
  
  //     const focusPreviousInput = (currentIndex: number) => {
  //       const previousIndex = (currentIndex - 1 + inputOrder.length) % inputOrder.length
  //       const previousRef = inputRefs[inputOrder[previousIndex] as keyof typeof inputRefs]
  //       if (previousRef.current) {
  //         previousRef.current.focus()
  //       }
  //     }
  

  //   const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, index: number) => {
  //       console.log("Current index before timeout:", index);
  //       if (e.key === "Enter") {
  //         e.preventDefault();
  //         setTimeout(() => {
  //           console.log("Index after timeout:", index);
  //           focusNextInput(index);
  //         }, 0);
  //       } else if (e.key === "ArrowUp") {
  //         e.preventDefault();
  //         setTimeout(() => {
  //           focusPreviousInput(index);
  //         }, 0);
  //       }
  //     };

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
    
    // // Driver info
    // <div ref={driverSectionRef} key="driver-wrapper">
    //   <DriverSection 
    //     key="driver"
    //     driver={formState.driver}
    //     onUpdateDriver={updateDriver}
    //     ref={driverSectionRef}
    //     handleKeyDown={handleKeyDown}
    //     inputRefs={inputRefs}
    //     // onEnterPress={() => focusSection(generalSectionRef)} 
    //   /> 
    //  </div>,
    <div key="general-wrapper">
      <GeneralSection 
         key="general"
        dispatch={formState.dispatch}
        onDispatchChange={updateDispatch}
        invoice={formState.invoice}
        onInvoiceChange={updateInvoice}
        ref={generalSectionRef}
        // handleKeyDown={handleKeyDown}
        // inputRefs={inputRefs}
        // onEnterPress={() => focusSection(vehicleDetailsSectionRef)}
      />
    </div>,
    // <div ref={vehicleDetailsSectionRef} key="vehicle-details-wrapper">
    //   <VehicleDetailsSection 
    //   key="vehicle-details"
    //   // ref={vehicleDetailsSectionRef}
    //     odometer={formState.dispatch.odometer}
    //     condition={formState.dispatch.condition}
    //     reason={formState.dispatch.reason}
    //     onChange={(field, value) => updateDispatch({ [field]: value })}
    //     // onEnterPress={() => focusSection(locationSectionRef)}
    //   />
    // </div>,
    // <div ref={locationSectionRef} key="location-wrapper">
    //   <LocationSection
    //      key="location"
    //     dispatch={formState.dispatch}
    //     onDispatchChange={updateDispatch}
    //     // ref={locationSectionRef}
    //     // onEnterPress={() => focusSection(notesSectionRef)}
    //   />
    // </div>,
    // <div ref={notesSectionRef} key="notes-wrapper">
    //   <NotesSection 
    //   key="notes"
    //   // ref={notesSectionRef}
    //     value={formState.dispatch.callremark || ''}
    //     onChange={(notes) => updateDispatch({ 'callremark': notes })}
    //     // onEnterPress={() => focusSection(invoiceSectionRef)}
    //   />
    // </div>,
    // <div ref={invoiceSectionRef} key="invoice-wrapper">
    //   <InvoiceSection 
    //   key="invoice"
    //   // ref={invoiceSectionRef}
    //     invoice={formState.invoice}
    //     onInvoiceChange={updateInvoice}
    //     // onEnterPress={() => focusSection(registrationSectionRef)}
    //   />
    // </div>,
    // <div ref={registrationSectionRef} key="registration-wrapper">
    //   <RegistrationSection
    //   key="registration"
    //   // ref={registrationSectionRef}
    //     invoice={formState.invoice}
    //     onInvoiceChange={updateInvoice}
    //     dispatch={formState.dispatch}
    //     onDispatchChange={updateDispatch}
    //     // onEnterPress={() => focusSection(storageSectionRef)}
    //   />
    // </div>,
    // <div ref={storageSectionRef} key="storage-wrapper">
    //   <StorageSection 
    //   key="storage"
    //   // ref={storageSectionRef}
    //     dispatch={formState.dispatch}
    //     onDispatchChange={updateDispatch}
    //     // onEnterPress={() => focusSection(lienSectionRef)}
    //   />
    // </div>,
    // <div ref={lienSectionRef} key="lien-wrapper">
    //   <LienSection
    //   key="lien"
    //   // ref={lienSectionRef}
    //     dispatch={formState.dispatch}
    //     onDispatchChange={updateDispatch}
    //     onEnterPress={() => focusSection(chargesSectionRef)}
    //   />
    // </div>,
    // <div ref={chargesSectionRef} key="charges-wrapper">
    //   <ChargesSection 
    //   key="charges"
    //   // ref={chargesSectionRef}
    //     transactionItems={formState.items || []}
    //     onItemsChange={updateItems}
    //     invoice={formState.invoice}
    //     onInvoiceChange={updateInvoice}
    //   />
    // </div>
  ];

  return <DesktopLayout sections={sections} />;
};

export default InvoiceForm;