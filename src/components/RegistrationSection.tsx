import React, { useRef } from 'react';
import FormSection from './common/FormSection';
import FormInput from './common/FormInput';
import StateInput from './common/StateInput';
import ZipInput from './common/ZipInput';

interface Invoice {
  regname?: string;
  rtype?: string;
  regaddr1?: string;
  regcity?: string;
  regstate?: string;
  regzip?: string;
}

interface Dispatch {
  auct_num?: string;
}

interface RegistrationSectionProps {
  invoice: Invoice;
  onInvoiceChange: (updates: Partial<Invoice>) => void;
  dispatch: Dispatch;
  onDispatchChange: (updates: Partial<Dispatch>) => void;
  onEnterPress?: () => void;
}

const RegistrationSection: React.FC<RegistrationSectionProps> = ({ 
  dispatch, 
  invoice, 
  onDispatchChange, 
  onInvoiceChange,
  onEnterPress
}) => {
  // Create refs for keyboard navigation
  const rTypeRef = useRef<HTMLInputElement>(null);
  const auctionNumRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);

  return (
    <FormSection title="Registration Information">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <FormInput
            label="Registered Owner"
            title="master.regname"
            value={invoice.regname || ''}
            onChange={(e) => onInvoiceChange({ regname: e.target.value })}
            onEnterPress={() => rTypeRef.current?.focus()}
            className="flex-1"
            placeholder="Enter registered owner name"
          />
          <FormInput
            ref={rTypeRef}
            label="R-Type"
            title="master.rtype"
            value={invoice.rtype || ''}
            onChange={(e) => onInvoiceChange({ rtype: e.target.value })}
            onEnterPress={() => auctionNumRef.current?.focus()}
            className="w-32"
            placeholder="Type"
          />
          <FormInput
            ref={auctionNumRef}
            label="Auction #"
            title="master.auctionnum"
            value={dispatch.auct_num || ''}
            onChange={(e) => onDispatchChange({ auct_num: e.target.value })}
            onEnterPress={() => addressRef.current?.focus()}
            className="w-48"
            placeholder="Enter auction number"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <FormInput
            ref={addressRef}
            label="Address"
            title="master.regaddr1"
            value={invoice.regaddr1 || ''}
            onChange={(e) => onInvoiceChange({ regaddr1: e.target.value })}
            onEnterPress={() => cityRef.current?.focus()}
            className="flex-1"
            placeholder="Enter registration address"
          />
          <FormInput
            ref={cityRef}
            label="City"
            title="master.regcity"
            value={invoice.regcity || ''}
            onChange={(e) => onInvoiceChange({ regcity: e.target.value })}
            onEnterPress={() => stateRef.current?.focus()}
            className="w-48"
            placeholder="Enter city"
          />
          <StateInput
            ref={stateRef}
            label="State"
            title="master.regstate"
            value={invoice.regstate || ''}
            onChange={(value) => onInvoiceChange({ regstate: value })}
            onEnterPress={() => zipRef.current?.focus()}
          />
          <ZipInput
            ref={zipRef}
            label="Zip"
            title="master.regzip"
            value={invoice.regzip || ''}
            onChange={(value) => onInvoiceChange({ regzip: value })}
            onEnterPress={onEnterPress}
          />
        </div>
      </div>
    </FormSection>
  );
};

export default RegistrationSection;