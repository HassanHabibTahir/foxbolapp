import React from 'react';
import { AdvancedOptions } from '../types';
import { Checkbox } from '../ui/Checkbox';

interface AdvancedOptionsSectionProps {
  options: AdvancedOptions;
  onChange: (options: AdvancedOptions) => void;
}

export function AdvancedOptionsSection({ options, onChange }: AdvancedOptionsSectionProps) {
  const handleChange = (key: keyof AdvancedOptions) => (checked: boolean) => {
    onChange({ ...options, [key]: checked });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Advanced Options</h3>
      
      <div className="space-y-3">
        <Checkbox
          id="setHighPriority"
          checked={options.setHighPriority}
          onChange={handleChange('setHighPriority')}
          label="Set all calls to High Priority"
        />

        <Checkbox
          id="alertManagers"
          checked={options.alertManagers}
          onChange={handleChange('alertManagers')}
          label="Alert (text) all managers when a call is created for this account"
        />

        <Checkbox
          id="hideCharges"
          checked={options.hideCharges}
          onChange={handleChange('hideCharges')}
          label="Always hide charges when printing or emailing the receipt"
        />

        <Checkbox
          id="hideDiscounts"
          checked={options.hideDiscounts}
          onChange={handleChange('hideDiscounts')}
          label="Always hide discounts when printing or emailing the receipt"
        />

        <Checkbox
          id="includeInvoiceCopies"
          checked={options.includeInvoiceCopies}
          onChange={handleChange('includeInvoiceCopies')}
          label="Include copies of invoices as a part of statements"
        />

        <Checkbox
          id="hidePhotos"
          checked={options.hidePhotos}
          onChange={handleChange('hidePhotos')}
          label="Always hide photos when printing or emailing the receipt"
        />

        <Checkbox
          id="allowViewFiles"
          checked={options.allowViewFiles}
          onChange={handleChange('allowViewFiles')}
          label="Allow users that login to this account to view files attached to calls"
        />
      </div>
    </div>
  );
}