import React, { useRef } from 'react';
import FormSection from './common/FormSection';
import DateInput from './common/DateInput';

interface Dispatch {
  datein?: string;
  dateout?: string;
}

interface StorageSectionProps {
  dispatch: Dispatch;
  onDispatchChange: (updates: Partial<Dispatch>) => void;
  onEnterPress?: () => void;
}

const StorageSection: React.FC<StorageSectionProps> = ({ 
  dispatch,
  onDispatchChange,
  onEnterPress
}) => {
  // Create refs for keyboard navigation
  const storageOutRef = useRef<HTMLInputElement>(null);

  return (
    <FormSection title="H - Storage Information">
      <div className="flex flex-wrap gap-4">
        <DateInput 
          label="Storage In" 
          title="master.storagein"
          size="md"
          className='h-10  text-[14px]'
          value={dispatch.datein || ''}
          onChange={(value) => onDispatchChange({ datein: value })}
          onEnterPress={() => storageOutRef.current?.focus()}
        />
        <DateInput 
          ref={storageOutRef}
          label="Storage Out" 
          title="master.storageout"
          size="md"
          className='h-10  text-[14px]'
          value={dispatch.dateout || ''}
          onChange={(value) => onDispatchChange({ dateout: value })}
          onEnterPress={onEnterPress}
        />
      </div>
    </FormSection>
  );
};

export default StorageSection;