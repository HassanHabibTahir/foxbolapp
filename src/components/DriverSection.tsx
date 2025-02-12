import React, { useRef } from 'react';
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
  onEnterPress?: () => void;
}

const DriverSection: React.FC<DriverSectionProps> = ({ 
  driver, 
  onUpdateDriver,
  onEnterPress 
}) => {
  // Create refs for components
  const driver2Ref = useRef<HTMLInputElement>(null);
  const statusSectionRef = useRef<HTMLDivElement>(null);

  // Helper to focus the first input in status section
  const focusStatusSection = () => {
    const firstInput = statusSectionRef.current?.querySelector('input') as HTMLElement;
    if (firstInput) {
      firstInput.focus();
    }
  };

  return (
    <FormSection title='Driver Information'>
      <div className="flex flex-wrap gap-4">
        <DriverCombobox 
          label="Driver 1" 
          title="master.driver"
          size="lg"
          value={driver.driver || ''}
          onChange={(value) => onUpdateDriver({ driver: value })}
          onEnterPress={() => driver2Ref.current?.focus()}
        />
        <DriverCombobox 
          ref={driver2Ref}
          label="Driver 2" 
          title="master.driver2"
          size="lg"
          value={driver.driver2 || ''}
          onChange={(value) => onUpdateDriver({ driver2: value })}
          onEnterPress={focusStatusSection}
        />
        <div ref={statusSectionRef}>
          <StatusSection 
            times={driver}
            onTimeChange={(field, value) => onUpdateDriver({ [field]: value })}
            onEnterPress={onEnterPress}
          />
        </div>
      </div>
    </FormSection>
  );
};

export default DriverSection;