import React from 'react';
import { useDeviceType } from '../hooks/useDeviceType';
import { useFormState } from '../hooks/useFormState';
import MobileLayout from './layouts/MobileLayout';
import TabletLayout from './layouts/TabletLayout';
import DesktopLayout from './layouts/DesktopLayout';
import SaveButton from './SaveButton';
import NewButton from './NewButton';
import DispatchSearch from './search/DispatchSearch';
import Header from './dispatch/Header';
import StatusSection from './StatusSection';
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

const DispatchForm = () => {
  const deviceType = useDeviceType();
  const { formState, updateDispatch, updateInvoice, updateItems, resetForm } = useFormState();

  const handleSave = () => {
    return {
      dispatch: formState.dispatch,
      invoice: formState.invoice,
      items: formState.items
    };
  };

  const handleNew = (dispatchNumber: string) => {
    resetForm();
    updateDispatch({ dispnum: dispatchNumber });
  };

  const handleDispatchFound = (dispatch: any) => {
    resetForm();
    updateDispatch(dispatch);
  };

  const sections = [
    <div key="actions" className="flex flex-wrap gap-2">
      <DispatchSearch 
        onDispatchFound={handleDispatchFound}
        className="flex-1 min-w-[200px]"
      />
      <NewButton onNewDispatch={handleNew} />
      <SaveButton onSave={handleSave} />
    </div>,
    <Header 
      key="header" 
      dispatchNumber={formState.dispatch.dispnum}
      onDispatchNumberChange={(value) => updateDispatch({ dispnum: value })}
    />,
    <StatusSection 
      key="status"
      times={formState.dispatch}
      onTimeChange={(field, value) => updateDispatch({ [field]: value })}
    />,
    <GeneralSection 
      key="general"
      dispatch={formState.dispatch}
      onDispatchChange={updateDispatch}
    />,
    <DriverSection 
      key="driver"
      driver={formState.dispatch.driver}
      onDriverChange={(driver) => updateDispatch({ driver })}
    />,
    <VehicleSection key="vehicle" />,
    <VehicleDetailsSection 
      key="vehicle-details"
      odometer={formState.dispatch.odometer}
      condition={formState.dispatch.condition}
      reason={formState.dispatch.reason}
      onChange={(field, value) => updateDispatch({ [field]: value })}
    />,
    <LocationSection key="location" />,
    <NotesSection 
      key="notes"
      value={formState.dispatch.notes || ''}
      onChange={(notes) => updateDispatch({ notes })}
    />,
    <RegistrationSection key="registration" />,
    <InvoiceSection 
      key="invoice"
      invoice={formState.invoice}
      onInvoiceChange={updateInvoice}
    />,
    <StorageSection 
      key="storage"
      dates={formState.dispatch}
      onDateChange={(field, value) => updateDispatch({ [field]: value })}
    />,
    <LienSection key="lien" />,
    <ChargesSection 
      key="charges"
      items={formState.items}
      onItemsChange={updateItems}
      invoice={formState.invoice}
      onInvoiceChange={updateInvoice}
    />
  ];

  switch (deviceType) {
    case 'mobile':
      return <MobileLayout sections={sections} />;
    case 'tablet':
      return <TabletLayout sections={sections} />;
    default:
      return <DesktopLayout sections={sections} />;
  }
};

export default DispatchForm;