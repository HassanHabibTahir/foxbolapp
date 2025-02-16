import React, { forwardRef } from 'react';
import FormSection from './common/FormSection';
import DriverCombobox from './common/DriverCombobox';
import StatusSection from './StatusSection';

interface Driver {
  driver?: string;
  driver2?: string;
  timerec?: string;
  timeinrt?: string;
  timearrive?: string;
  timeintow?: string;
  timeclear?: string;
}

interface DriverSectionProps {
  driver: Driver;
  onUpdateDriver: (data: Partial<Driver>) => void;
}

const DriverSection = forwardRef<HTMLDivElement, DriverSectionProps>(({ 
  driver, 
  onUpdateDriver,
}, ref) => {
  return (
    <FormSection title="Driver Information">
      <div ref={ref} className="flex flex-wrap items-center gap-x-1">
        <DriverCombobox 
          label="Driver 1" 
          title="master.driver"
          size="md"
          value={driver.driver || ''}
          onChange={(value) => onUpdateDriver({ driver: value })}
          tabIndex={0}
        />
        <DriverCombobox 
          label="Driver 2" 
          title="master.driver2"
          size="md"
          value={driver.driver2 || ''}
          onChange={(value) => onUpdateDriver({ driver2: value })}
          tabIndex={0}
        />
        <div className="flex-grow">
          <StatusSection 
            times={driver}
            onTimeChange={(field, value) => onUpdateDriver({ [field]: value })}
          />
        </div>
      </div>
    </FormSection>
  );
});

DriverSection.displayName = 'DriverSection';

export default DriverSection;