import React, { useRef } from 'react';
import MilitaryTimeInput from './common/MilitaryTimeInput';

interface StatusSectionProps {
  times: {
    timerec?: string;
    timeinrt?: string;
    timearrive?: string;
    timeintow?: string;
    timeclear?: string;
  };
  onTimeChange: (field: string, value: string) => void;
  onEnterPress?: () => void;
}

const StatusSection: React.FC<StatusSectionProps> = ({ 
  times, 
  onTimeChange,
  onEnterPress 
}) => {
  // Create refs for each input
  const receivedRef = useRef<HTMLInputElement>(null);
  const enRouteRef = useRef<HTMLInputElement>(null);
  const arrivedRef = useRef<HTMLInputElement>(null);
  const loadedRef = useRef<HTMLInputElement>(null);
  const clearedRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-2">
      <MilitaryTimeInput
        label="Received"
        title="drivetran.timerec"
        value={times.timerec || ''}
        onChange={(value) => onTimeChange('timerec', value)}
        onEnterPress={() => enRouteRef.current?.focus()}
        inputRef={receivedRef}
      />
      <MilitaryTimeInput
        label="En route"
        title="drivetran.timeinrt"
        value={times.timeinrt || ''}
        onChange={(value) => onTimeChange('timeinrt', value)}
        onEnterPress={() => arrivedRef.current?.focus()}
        inputRef={enRouteRef}
      />
      <MilitaryTimeInput
        label="Arrived"
        title="drivetran.timearrive"
        value={times.timearrive || ''}
        onChange={(value) => onTimeChange('timearrive', value)}
        onEnterPress={() => loadedRef.current?.focus()}
        inputRef={arrivedRef}
      />
      <MilitaryTimeInput
        label="Loaded"
        title="drivetran.timeintow"
        value={times.timeintow || ''}
        onChange={(value) => onTimeChange('timeintow', value)}
        onEnterPress={() => clearedRef.current?.focus()}
        inputRef={loadedRef}
      />
      <MilitaryTimeInput
        label="Cleared"
        title="drivetran.timeclear"
        value={times.timeclear || ''}
        onChange={(value) => onTimeChange('timeclear', value)}
        onEnterPress={onEnterPress}
        inputRef={clearedRef}
      />
    </div>
  );
};

export default StatusSection;