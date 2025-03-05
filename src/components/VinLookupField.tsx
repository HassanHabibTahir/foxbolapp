import React, { useState, forwardRef } from 'react';
import { Search } from 'lucide-react';
import { lookupVinDetails, VinDetails } from '../lib/vinLookup';

interface VinLookupFieldProps {
  value: string;
  onChange: (value: string) => void;
  onVinDetails?: (details: VinDetails) => void;
  onEnterPress?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const VinLookupField = forwardRef<HTMLInputElement, VinLookupFieldProps>(({
  value,
  onChange,
  onVinDetails,
  onEnterPress,
  onKeyDown
}, ref) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!value || value.length !== 17) {
      setError('Please enter a valid 17-character VIN');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const details = await lookupVinDetails(value);
      if (details) {
        onVinDetails?.(details);
      } else {
        setError('VIN not found in database');
      }
    } catch (err) {
      setError('Error looking up VIN');
      console.error('VIN lookup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upper = e.target.value.toUpperCase();
    const cleaned = upper.replace(/[^A-Z0-9]/g, '').slice(0, 17);
    onChange(cleaned);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e,"e-->")
    // if (e.key === 'Enter') {
    //   e.preventDefault();
    //   if (e.shiftKey) {
    //     handleLookup();
    //   } else if (onEnterPress) {
    //     onEnterPress();
    //   }
    // }
    if(onKeyDown){
      onKeyDown(e)
    }
  };


  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setError(null);
    }, 5000);
  
    return () => clearTimeout(timeout); 
  }, [error]); 
  
  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            VIN
            <span className="text-xs text-gray-500 ml-2">
              (Shift+Enter to lookup)
            </span>
          </label>
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="mt-1 w-[34ch] h-9 font-mono rounded-md border border-gray-300 p-2
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="17 characters"
            maxLength={17}
            title="Enter 17-character VIN (Shift+Enter to lookup)"
            aria-label="Vehicle Identification Number"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleLookup}
          disabled={loading || !value || value.length !== 17}
          className="mt-4 px-3 py-2 bg-blue-600 text-white rounded-md 
            hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title="Look up VIN information"
          aria-label="Look up VIN"
        >
          <Search className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

VinLookupField.displayName = 'VinLookupField';

export default VinLookupField;