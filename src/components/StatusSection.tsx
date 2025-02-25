import React, { forwardRef } from 'react';
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
  inputRefs: any;
  handleKeyDown:any
}

const StatusSection = forwardRef<HTMLDivElement, StatusSectionProps>(({ 
  times, 
  onTimeChange,
  onEnterPress,
  inputRefs,
  handleKeyDown
}: StatusSectionProps, ref) => {
  return (
    <div ref={ref} className="flex flex-wrap gap-2">
      <MilitaryTimeInput
        label="Received"
        title="drivetran.timerec"
        value={times.timerec || ''}
        onChange={(value) => onTimeChange('timerec', value)}
        // inputRef={inputRefs.receivedRef}
        onKeyDown={(e:any) => handleKeyDown(e, 2)}
      />
      <MilitaryTimeInput
        label="En route"
        title="drivetran.timeinrt"
        value={times.timeinrt || ''}
        onChange={(value) => onTimeChange('timeinrt', value)}
        // inputRef={inputRefs.enRouteRef}
        onKeyDown={(e:any)=>handleKeyDown(e,3)}
      />
      
      <MilitaryTimeInput
        label="Arrived"
        title="drivetran.timearrive"
        value={times.timearrive || ''}
        onChange={(value) => onTimeChange('timearrive', value)}
        // inputRef={inputRefs.arrivedRef}
        onKeyDown={(e:any)=>handleKeyDown(e,4)}

      />
      {/* <MilitaryTimeInput
        label="Loaded"
        title="drivetran.timeintow"
        value={times.timeintow || ''}
        onChange={(value) => onTimeChange('timeintow', value)}
        inputRef={inputRefs.loadedRef}
      />
      <MilitaryTimeInput
        label="Cleared"
        title="drivetran.timeclear"
        value={times.timeclear || ''}
        onChange={(value) => onTimeChange('timeclear', value)}
        onEnterPress={onEnterPress}
        inputRef={inputRefs.clearedRef}
      /> */}
    </div>
  );
});

export default StatusSection;
