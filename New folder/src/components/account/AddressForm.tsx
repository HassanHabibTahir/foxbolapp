import React from 'react';
import { MapPin } from 'lucide-react';

interface AddressFormProps {
  title: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  onChange: (field: string, value: string) => void;
  showPickupOption?: boolean;
  isPickupLocation?: boolean;
  onPickupLocationChange?: (value: boolean) => void;
  billingContactName?: string;
  billingContactEmail?: string;
  onBillingContactNameChange?: (value: string) => void;
  onBillingContactEmailChange?: (value: string) => void;
  isBillingAddress?: boolean;
}

export function AddressForm({
  title,
  street,
  city,
  state,
  zipCode,
  onChange,
  showPickupOption = false,
  isPickupLocation = false,
  onPickupLocationChange,
  billingContactName,
  billingContactEmail,
  onBillingContactNameChange,
  onBillingContactEmailChange,
  isBillingAddress = false
}: AddressFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      
      <div className="space-y-4">
        <div>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={street}
              onChange={(e) => onChange('street', e.target.value)}
              className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Street Address"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              value={city}
              onChange={(e) => onChange('city', e.target.value)}
              className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="City"
            />
          </div>
          <div>
            <input
              type="text"
              value={state}
              onChange={(e) => onChange('state', e.target.value)}
              className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="State"
              maxLength={2}
            />
          </div>
          <div>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => onChange('zipCode', e.target.value)}
              className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="ZIP Code"
            />
          </div>
        </div>

        {showPickupOption && onPickupLocationChange && (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isPickupLocation}
              onChange={(e) => onPickupLocationChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Use this address on calls as the Pickup Location
            </label>
          </div>
        )}

        {isBillingAddress && onBillingContactNameChange && onBillingContactEmailChange && (
          <div className="space-y-4 mt-4">
            <div>
              <input
                type="text"
                value={billingContactName}
                onChange={(e) => onBillingContactNameChange(e.target.value)}
                className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Billing Contact Name"
              />
            </div>
            <div>
              <input
                type="email"
                value={billingContactEmail}
                onChange={(e) => onBillingContactEmailChange(e.target.value)}
                className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Billing Contact Email"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}