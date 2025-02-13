import React, { useRef } from 'react';
import FormSection from './common/FormSection';
import FormInput from './common/FormInput';
import PhoneInput from './common/PhoneInput';
import StateInput from './common/StateInput';
import ZipInput from './common/ZipInput';
import DateInput from './common/DateInput';

interface InvoiceSectionProps {
  invoice: any;
  onInvoiceChange: (updates: any) => void;
  onEnterPress?: () => void;
}

const InvoiceSection: React.FC<InvoiceSectionProps> = ({ 
  invoice, 
  onInvoiceChange,
  onEnterPress 
}) => {
  // Create refs for keyboard navigation
  const nameRef = useRef<HTMLInputElement>(null);
  const invDateRef = useRef<HTMLInputElement>(null);
  const itemGroupRef = useRef<HTMLInputElement>(null);
  const reasonRef = useRef<HTMLInputElement>(null);
  const poNumberRef = useRef<HTMLInputElement>(null);
  const addr1Ref = useRef<HTMLInputElement>(null);
  const releaseLicRef = useRef<HTMLInputElement>(null);
  const addr2Ref = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  return (
    <FormSection title="F - Invoice Information">
      <div className="space-y-4">
        {/* Top row with invoice details */}
        <div className="flex flex-wrap gap-4">
          <FormInput
            label="Inv #"
            title="master.invoicenum"
            value={invoice.invoicenum || ''}
            onChange={(e) => onInvoiceChange({ invoicenum: e.target.value })}
            onEnterPress={() => invDateRef.current?.focus()}
            placeholder="Invoice number"
            className='h-10  text-[14px]'
          />
          <DateInput 
            className='h-10  text-[14px]'
            ref={invDateRef}
            label="Date" 
            title="master.invdate" 
            size="md"
            value={invoice.invdate || ''}
            onChange={(value) => onInvoiceChange({ invdate: value })}
            onEnterPress={() => itemGroupRef.current?.focus()}
          />
          <FormInput
            ref={itemGroupRef}
            label="Group"
            title="master.group"
            value={invoice.itemgroup || ''}
            onChange={(e) => onInvoiceChange({ itemgroup: e.target.value })}
            onEnterPress={() => reasonRef.current?.focus()}
            placeholder="Item group"
            className='h-10  text-[14px]'
          />
          <FormInput
            ref={reasonRef}
            label="Reason"
            title="master.reason"
            value={invoice.reason || ''}
            onChange={(e) => onInvoiceChange({ reason: e.target.value })}
            onEnterPress={() => nameRef.current?.focus()}
            placeholder="Reason"
            className='h-10  text-[14px]'
          />
        </div>

        {/* Customer name and PO */}
        <div className="flex flex-wrap gap-6">
          <FormInput
            ref={nameRef}
            label="Name"
            
            title="master.billtoname"
            value={invoice.billtoname || ''}
            onChange={(e) => onInvoiceChange({ billtoname: e.target.value })}
            onEnterPress={() => poNumberRef.current?.focus()}
            className="flex-1 h-10  text-[14px]"
            placeholder="Customer name"
          />
          <FormInput
            ref={poNumberRef}
            label="PO#"
            title="master.ponumber"
            value={invoice.ponumber || ''}
            onChange={(e) => onInvoiceChange({ ponumber: e.target.value })}
            onEnterPress={() => addr1Ref.current?.focus()}
            className="flex-1 h-10 w-48  text-[14px]"
            placeholder="PO number"
            
          />
               <FormInput
            ref={addr1Ref}
            label="Address 1"
            title="master.billtoaddr1"
            size="full"
            value={invoice.billtoaddr1 || ''}
            onChange={(e) => onInvoiceChange({ billtoaddr1: e.target.value })}
            onEnterPress={() => releaseLicRef.current?.focus()}
            className="flex-1"
            placeholder="Street address"
          />
          <FormInput
            ref={releaseLicRef}
            label="RelLic#"
            title="master.releaselic"
            value={invoice.releaselic || ''}
            onChange={(e) => onInvoiceChange({ releaselic: e.target.value })}
            onEnterPress={() => addr2Ref.current?.focus()}
            className="w-48"
            placeholder="Release license"
          />
             <FormInput
            ref={addr2Ref}
            label="Address 2"
            title="master.billtoaddr2"
            size="full"
            value={invoice.billtoaddr2 || ''}
            onChange={(e) => onInvoiceChange({ billtoaddr2: e.target.value })}
            onEnterPress={() => phoneRef.current?.focus()}
            className="flex-1"
            placeholder="Apt, Suite, etc."
          />
          <PhoneInput
            ref={phoneRef}
            label="Phone"
            title="master.billtophone"
            size="md"
            value={invoice.billtophone || ''}
            onChange={(value) => onInvoiceChange({ billtophone: value })}
            onEnterPress={() => cityRef.current?.focus()}
          />
           <div className="flex gap-2">
            <FormInput
              ref={cityRef}
              label="City"
              title="master.billtocity"
              value={invoice.billtocity || ''}
              onChange={(e) => onInvoiceChange({ billtocity: e.target.value })}
              onEnterPress={() => stateRef.current?.focus()}
              className="flex-1"
              placeholder="City"
            />
            <StateInput
              ref={stateRef}
              label="State"
              title="master.billtost"
              value={invoice.billtost || ''}
              onChange={(value) => onInvoiceChange({ billtost: value })}
              onEnterPress={() => zipRef.current?.focus()}
            />
            <ZipInput
              ref={zipRef}
              label="Zip"
              title="master.billtozip"
              value={invoice.billtozip || ''}
              onChange={(value) => onInvoiceChange({ billtozip: value })}
              onEnterPress={() => contactRef.current?.focus()}
            />
          </div>
          <FormInput
            ref={contactRef}
            label="Contact"
            title="master.billtocont"
            value={invoice.billtocont || ''}
            onChange={(e) => onInvoiceChange({ billtocont: e.target.value })}
            onEnterPress={onEnterPress}
            className="w-64"
            placeholder="Contact name"
          />
        </div>

        {/* Address and license */}
        {/* <div className="flex gap-96">
     
        </div> */}

        {/* Address 2 and phone */}
        {/* <div className="flex gap-96">
       
        </div> */}

        {/* City, State, Zip and Contact */}
        {/* <div className="flex gap-40">
         
        </div> */}
      </div>
    </FormSection>
  );
};

export default InvoiceSection;