import React, { useRef } from 'react';
import FormSection from './common/FormSection';
import FormInput from './common/FormInput';
import AddressAutocomplete from './common/AddressAutocomplete';

interface Dispatch {
  towedfrom?: string;
  towedto?: string;
  retowto?: string;
  lotsection?: string;
  calltype?: string;
  keysinfo?: string;
  holdnote?: string;
}

interface LocationSectionProps {
  dispatch: Dispatch;
  onDispatchChange: (updates: Partial<Dispatch>) => void;
  onEnterPress?: () => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({ 
  dispatch, 
  onDispatchChange,
  onEnterPress 
}) => {
  // Create refs for keyboard navigation
  const towedToRef = useRef<HTMLInputElement>(null);
  const retowToRef = useRef<HTMLInputElement>(null);
  const lotSectionRef = useRef<HTMLInputElement>(null);
  const callTypeRef = useRef<HTMLInputElement>(null);
  const keysInfoRef = useRef<HTMLInputElement>(null);
  const holdNoteRef = useRef<HTMLInputElement>(null);

  const handleAddressChange = (field: keyof Dispatch) => (
    value: string,
    place?: google.maps.places.PlaceResult
  ) => {
    onDispatchChange({ [field]: value });

    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      console.log(`${field} coordinates:`, { lat, lng });
    }
  };

  return (
    <FormSection title="Location Information">
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <AddressAutocomplete
            label="Towed From"
            value={dispatch.towedfrom || ''}
            onChange={handleAddressChange('towedfrom')}
            onEnterPress={() => towedToRef.current?.focus()}
            className="w-full"
          />
          <AddressAutocomplete
            ref={towedToRef}
            label="Towed To"
            value={dispatch.towedto || ''}
            onChange={handleAddressChange('towedto')}
            onEnterPress={() => retowToRef.current?.focus()}
            className="w-full"
          />
          <AddressAutocomplete
            ref={retowToRef}
            label="Retow To"
            value={dispatch.retowto || ''}
            onChange={handleAddressChange('retowto')}
            onEnterPress={() => lotSectionRef.current?.focus()}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <FormInput
            ref={lotSectionRef}
            label="Lot Section"
            title="master.lotsection"
            value={dispatch.lotsection || ''}
            onChange={(e) => onDispatchChange({ lotsection: e.target.value })}
            onEnterPress={() => callTypeRef.current?.focus()}
            placeholder="Enter lot section"
          />
          <FormInput
            ref={callTypeRef}
            label="Call Type"
            title="master.calltype"
            value={dispatch.calltype || ''}
            onChange={(e) => onDispatchChange({ calltype: e.target.value })}
            onEnterPress={() => keysInfoRef.current?.focus()}
            placeholder="Enter call type"
          />
          <FormInput
            ref={keysInfoRef}
            label="Have Key?"
            title="master.keyinfo"
            value={dispatch.keysinfo || ''}
            onChange={(e) => onDispatchChange({ keysinfo: e.target.value })}
            onEnterPress={() => holdNoteRef.current?.focus()}
            placeholder="Key information"
          />
          <FormInput
            ref={holdNoteRef}
            label="Hold Note"
            title="master.holdnote"
            value={dispatch.holdnote || ''}
            onChange={(e) => onDispatchChange({ holdnote: e.target.value })}
            onEnterPress={onEnterPress}
            placeholder="Enter hold note"
          />
        </div>
      </div>
    </FormSection>
  );
};

export default LocationSection;