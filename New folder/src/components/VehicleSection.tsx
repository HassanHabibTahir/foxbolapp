import React, { useState, useRef } from 'react';
import FormSection from './common/FormSection';
import FormInput from './common/FormInput';
import VinLookupField from './VinLookupField';
import LicensePlateLookup from './LicensePlateLookup';
import type { VinDetails } from '../lib/vinLookup';
import type { LicensePlateDetails } from '../lib/licenseLookup';

interface VehicleSectionProps {
  dispatch: any;
  onDispatchChange: (updates: any) => void;
  onEnterPress?: () => void;
}

const VehicleSection: React.FC<VehicleSectionProps> = ({ 
  dispatch, 
  onDispatchChange,
  onEnterPress 
}) => {
  const [vehicle, setVehicle] = useState({
    vin: '',
    type: '',
    year: '',
    make: '',
    model: '',
    style: '',
    color: '',
    bodyType: '',
    expires: ''
  });

  // Create refs for keyboard navigation
  const typeRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const makeRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const plateRef = useRef<HTMLInputElement>(null);
  const vinRef = useRef<HTMLInputElement>(null);

  const handleVinDetails = (details: VinDetails) => {
    setVehicle(prev => ({
      ...prev,
      year: details.year || prev.year,
      make: details.make || prev.make,
      model: details.model || prev.model,
      style: details.style || prev.style,
      bodyType: details.bodyType || prev.bodyType
    }));

    // Update dispatch with VIN details
    onDispatchChange({
      yearcar: details.year,
      makecar: details.make,
      modelcar: details.model,
      bodytype: details.bodyType
    });
  };

  const handlePlateDetails = (details: LicensePlateDetails) => {
    setVehicle(prev => ({
      ...prev,
      vin: details.vin,
      year: details.year || prev.year,
      make: details.make || prev.make,
      model: details.model || prev.model,
      color: details.color || prev.color
    }));

    // Update dispatch with plate details
    onDispatchChange({
      vin: details.vin,
      yearcar: details.year,
      makecar: details.make,
      modelcar: details.model,
      colorcar: details.color
    });
  };

  return (
    <FormSection title="B - Vehicle Information" className='mt-4'>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <FormInput
            ref={typeRef}
            
            label="Type"
            title="master.type"
            value={dispatch.type || ''}
            onChange={(e) => onDispatchChange({ type: e.target.value })}
            onEnterPress={() => yearRef.current?.focus()}
            className="uppercase w-[7ch] h-10 text-[14px]"
            placeholder="Type"
          />
          <FormInput
            ref={yearRef}
            label="Year"
            className="h-10 text-[14px]"
            title="master.yearcar"
            value={dispatch.yearcar || ''}
            onChange={(e) => onDispatchChange({ yearcar: e.target.value })}
            onEnterPress={() => makeRef.current?.focus()}
            placeholder="YYYY"
          />
          <FormInput
            ref={makeRef}
              className="h-10 text-[14px]"
            label="Make"
            title="master.makecar"
            value={dispatch.makecar || ''}
            onChange={(e) => onDispatchChange({ makecar: e.target.value })}
            onEnterPress={() => modelRef.current?.focus()}
            placeholder="Make"
          />
          <FormInput
            ref={modelRef}
            className="h-10 text-[14px]"
            label="Model"
            title="master.modelcar"
            value={dispatch.modelcar || ''}
            onChange={(e) => onDispatchChange({ modelcar: e.target.value })}
            onEnterPress={() => colorRef.current?.focus()}
            placeholder="Model"
          />
          <FormInput
            ref={colorRef}
            label="Color"
            title="master.colorcar"
            className="h-10 text-[14px]"
            value={dispatch.colorcar || ''}
            onChange={(e) => onDispatchChange({ colorcar: e.target.value })}
            onEnterPress={() => bodyRef.current?.focus()}
            placeholder="Color"
          />
          <FormInput
            ref={bodyRef}
            label="Body"
            title="master.bodytype"
            className="h-10 text-[14px]"
            value={dispatch.bodytype || ''}
            onChange={(e) => onDispatchChange({ bodytype: e.target.value })}
            onEnterPress={() => stateRef.current?.focus()}
            placeholder="Body type"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <LicensePlateLookup
            ref={plateRef}
            stateRef={stateRef}
            onPlateDetails={handlePlateDetails}
            maxLength={7}
            onDispatchChange={onDispatchChange}
            dispatch={dispatch}
            onEnterPress={() => vinRef.current?.focus()}
          />
          <VinLookupField
            ref={vinRef}
            value={dispatch.vin || ''}
            onChange={(value) => onDispatchChange({ vin: value })}
            onVinDetails={handleVinDetails}
            onEnterPress={onEnterPress}
          />
        </div>
      </div>
    </FormSection>
  );
};

export default VehicleSection;