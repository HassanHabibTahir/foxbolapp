import React, { useState, forwardRef, useRef } from 'react';
import { Search } from 'lucide-react';
import { lookupLicensePlate, LicensePlateDetails } from '../lib/licenseLookup';
import StateInput from './common/StateInput';
import FormInput from './common/FormInput';

interface Dispatch {
  licensenum?: string;
  licensest?: string;
  tagmonthyear?: string;
}

interface LicensePlateLookupProps {
  onPlateDetails: (details: LicensePlateDetails) => void;
  maxLength?: number;
  onDispatchChange: (updates: Partial<Dispatch>) => void;
  dispatch: Dispatch;
  onEnterPress?: () => void;
  stateRef?: React.RefObject<HTMLInputElement>;
}

const LicensePlateLookup = forwardRef<HTMLInputElement, LicensePlateLookupProps>(({ 
  onPlateDetails,
  maxLength = 7,
  onDispatchChange,
  dispatch,
  onEnterPress,
  stateRef
}, ref) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const expiresRef = useRef<HTMLInputElement>(null);

  const handleLookup = async () => {
    if (!dispatch.licensenum || !dispatch.licensest) {
      setError('Please enter both license plate and state');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const details = await lookupLicensePlate(dispatch.licensenum, dispatch.licensest);
      if (details) {
        onPlateDetails(details);
      } else {
        setError('License plate not found');
      }
    } catch (err) {
      setError('Error looking up license plate');
      console.error('License plate lookup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, maxLength);
    setError(null);
    onDispatchChange({ licensenum: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        handleLookup();
      } else {
        expiresRef.current?.focus();
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-end">
        <StateInput
          ref={stateRef}
              className="h-10 text-[14px]"
          label="State"
          title="master.licensest"
          size="xs" 
          value={dispatch.licensest || ''}
          onChange={(value) => onDispatchChange({ licensest: value })}
          onEnterPress={() => ref && 'current' in ref && ref.current?.focus()}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            License Plate
          </label>
          <input
            ref={ref}
            type="text"
            value={dispatch.licensenum || ''}
            onChange={handlePlateChange}
            onKeyDown={handleKeyDown}
            className="h-10 text-[14px] mt-1 w-[14ch] font-mono rounded-md border border-gray-300 p-2
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="ABC1234"
            maxLength={maxLength}
            title="Enter license plate number (Shift+Enter to lookup)"
          />
        </div>
        <FormInput
          ref={expiresRef}
          label="Expires"
          title="master.tagmonthyear"
          value={dispatch.tagmonthyear || ''}
          onChange={(e) => onDispatchChange({ tagmonthyear: e.target.value })}
          onEnterPress={onEnterPress}
          placeholder="MM/YY"
          className='h-10 text-[14px]'
        />
        <button
          onClick={handleLookup}
          disabled={loading || !dispatch.licensenum || !dispatch.licensest}
          className="h-10 text-[14px] px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
            disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none 
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title="Look up license plate information"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});

LicensePlateLookup.displayName = 'LicensePlateLookup';

export default LicensePlateLookup;