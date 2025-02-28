import React, { useEffect, useRef, forwardRef, KeyboardEvent } from 'react';

interface AddressAutocompleteProps {
  label?: string;
  value?: string;
  onChange?: ((value: any, placeDetails?: google.maps.places.PlaceResult) => void) | any;
  onEnterPress?: () => void;
  placeholder?: string;
  className?: string;
  onKeyDown?:any;
}

const AddressAutocomplete = forwardRef<HTMLInputElement, AddressAutocompleteProps>(({
  label,
  value,
  onChange,
  onEnterPress,
  placeholder = 'Enter address',
  className = '',
  onKeyDown
}, ref) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (!ref || !('current' in ref) || !ref.current || !window.google) return;

    setIsLoading(true);
    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(ref.current, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address', 'geometry'],
        types: ['address']
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        onChange(place?.formatted_address || value, place) ;
      });
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
    } finally {
      setIsLoading(false);
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [ref]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown(e)
    // Prevent form submission on Enter if the autocomplete dropdown is open
    // if (e.key === 'Enter') {
    //   const pacContainer = document.querySelector('.pac-container');
    //   if (pacContainer && (pacContainer as HTMLElement).style.display !== 'none') {
    //     e.preventDefault();
    //     return;
    //   }

    //   if (!e.shiftKey && onEnterPress) {
    //     e.preventDefault();
    //     onEnterPress();
    //   }
    // }
  };

  return (
    <div className="flex flex-col relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full rounded-md border border-gray-300 p-2
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
});

AddressAutocomplete.displayName = 'AddressAutocomplete';

export default AddressAutocomplete;