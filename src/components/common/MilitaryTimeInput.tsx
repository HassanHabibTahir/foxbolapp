import React, { useRef, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

interface MilitaryTimeInputProps {
  label: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onComplete?: () => void;
  onEnterPress?: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const StyledTimePicker = styled(TimePicker)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#D1D5DB',
    },
    '&:hover fieldset': {
      borderColor: '#9CA3AF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3B82F6',
    },
  },
  '& .MuiInputBase-input': {
    padding: '4px 8px',  // Reduced padding
    width: '70px', // Smaller width
    fontSize: '0.875rem', // Smaller text
  },
});


const MilitaryTimeInput: React.FC<MilitaryTimeInputProps> = ({
  label,
  title,
  value,
  onChange,
  onComplete,
  onEnterPress,
  inputRef: externalInputRef
}) => {
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || internalInputRef;
  const [isTimeComplete, setIsTimeComplete] = useState(false);

  const handleTimeChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue && newValue.isValid()) {
      const timeString = newValue.format('HHmm');
      const hour = newValue.hour();
      const minute = newValue.minute();

      onChange(timeString);
      // Check if both hours and minutes are filled
      const timePattern = /^([01][0-9]|2[0-3])[0-5][0-9]$/;
      
      if (timePattern.test(`${hour}${minute}`) && onEnterPress) {
        setIsTimeComplete(true);
        onEnterPress()
      } else {
        setIsTimeComplete(false);
      }
    } else {
      onChange('');
      setIsTimeComplete(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = e.target as HTMLInputElement;
    const selectionStart = input.selectionStart || 0;
    const inputValue = input.value;
    
    // Handle Enter key only when time is complete
    if (e.key === 'Enter') {
      e.preventDefault();
      const timePattern = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
      if (timePattern.test(inputValue) && onEnterPress) {
        onEnterPress();
      }
      return;
    }
    
    // Handle colon input
    if (e.key === ':' && selectionStart === 2) {
      e.preventDefault();
      input.setSelectionRange(3, 3);
    }
    
    // Auto-move to minutes after entering hours
    if (selectionStart === 2 && !e.key.match(/Arrow|Backspace|Delete|Tab/)) {
      setTimeout(() => {
        input.setSelectionRange(3, 3);
      }, 0);
    }

    // Handle backspace at colon position
    if (e.key === 'Backspace' && selectionStart === 3) {
      e.preventDefault();
      input.setSelectionRange(2, 2);
    }

  };

  const timeValue = value ? 
    dayjs(`2024-01-01 ${value.slice(0, 2)}:${value.slice(2, 4)}`) : 
    null;

  return (
    <div className="inline-block">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StyledTimePicker
          value={timeValue}
          onChange={handleTimeChange}
          format="HH:mm"
          ampm={false}
       
          slotProps={{
            textField: {
              size: "small",
              title: title,
              inputRef: inputRef,
              onKeyDown: handleKeyDown,
              inputProps: {
                maxLength: 5
              }
            }
          }}
          views={['hours', 'minutes']}
        />
      </LocalizationProvider>
    </div>
  );
};

export default MilitaryTimeInput;