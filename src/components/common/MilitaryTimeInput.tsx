// import React, { useRef } from 'react';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// import { styled } from '@mui/material/styles';
// import dayjs from 'dayjs';

// interface MilitaryTimeInputProps {
//   label: string;
//   title: string;
//   value: string;
//   onChange: (value: string) => void;
//   onComplete?: () => void;
//   onEnterPress?: () => void;
//   onKeyDown:any,
//   inputRef?: React.RefObject<HTMLInputElement>;
// }

// const StyledTimePicker = styled(TimePicker)({
//   '& .MuiOutlinedInput-root': {
//     '& fieldset': {
//       borderColor: '#D1D5DB',
//     },
//     '&:hover fieldset': {
//       borderColor: '#9CA3AF',
//     },
//     '&.Mui-focused fieldset': {
//       borderColor: '#3B82F6',
//     },
//   },
//   '& .MuiInputBase-input': {
//     padding: '4px 8px',  // Reduced padding
//     width: '70px', // Smaller width
//     fontSize: '0.875rem', // Smaller text
//   },
// });


// const MilitaryTimeInput: React.FC<MilitaryTimeInputProps> = ({
//   label,
//   title,
//   value,
//   onChange,
//   // onComplete,
//   onKeyDown,
//   onEnterPress,
//   inputRef: externalInputRef
// }) => {
//   const internalInputRef = useRef<HTMLInputElement>(null);
//   const inputRef = externalInputRef || internalInputRef;
//   // const [isTimeComplete, setIsTimeComplete] = useState(false);

//   const handleTimeChange = (newValue: dayjs.Dayjs | null) => {
//     if (newValue && newValue.isValid()) {
//       const timeString = newValue.format('HHmm');
//       const hour = newValue.hour();
//       const minute = newValue.minute();

//       onChange(timeString);
//       // Check if both hours and minutes are filled
//       const timePattern = /^([01][0-9]|2[0-3])[0-5][0-9]$/;
      
//       if (timePattern.test(`${hour}${minute}`) && onEnterPress) {
//         // setIsTimeComplete(true);
//         onEnterPress()
//       } else {
//         // setIsTimeComplete(false);
//       }
//     } else {
//       onChange('');
//       // setIsTimeComplete(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
//     const input = e.target as HTMLInputElement;
//     const selectionStart = input.selectionStart || 0;
//     const inputValue = input.value;
    
//     // Handle Enter key only when time is complete
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       const timePattern = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
//       if (timePattern.test(inputValue) && onEnterPress) {
//         onEnterPress();
//       }
//       return;
//     }
    
//     // Handle colon input
//     if (e.key === ':' && selectionStart === 2) {
//       e.preventDefault();
//       input.setSelectionRange(3, 3);
//     }
    
//     // Auto-move to minutes after entering hours
//     if (selectionStart === 2 && !e.key.match(/Arrow|Backspace|Delete|Tab/)) {
//       setTimeout(() => {
//         input.setSelectionRange(3, 3);
//       }, 0);
//     }

//     // Handle backspace at colon position
//     if (e.key === 'Backspace' && selectionStart === 3) {
//       e.preventDefault();
//       input.setSelectionRange(2, 2);
//     }
//     onKeyDown(e)
//   };

//   const timeValue = value ? 
//     dayjs(`2024-01-01 ${value.slice(0, 2)}:${value.slice(2, 4)}`) : 
//     null;

//   return (
//     <div className="inline-block">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {label}
//       </label>
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <StyledTimePicker
//           value={timeValue}
//           onChange={handleTimeChange}
//           format="HH:mm"
//           ampm={false}
       
//           slotProps={{
//             textField: {
//               size: "small",
//               title: title,
//               inputRef: inputRef,
//               onKeyDown: handleKeyDown,
//               inputProps: {
//                 maxLength: 5
//               }
//             }
//           }}
//           views={['hours', 'minutes']}
//         />
//       </LocalizationProvider>
//     </div>
//   );
// };

// export default MilitaryTimeInput;

import React, { forwardRef, useRef } from 'react';

interface MilitaryTimeInputProps {
  label: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onComplete?: () => void;
  onEnterPress?: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const MilitaryTimeInput = forwardRef<HTMLInputElement, MilitaryTimeInputProps>(
  ({ label, title, value, onChange, onEnterPress, onKeyDown }, ref) => {
    const internalInputRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref || internalInputRef) as React.RefObject<HTMLInputElement>;
    
    // Format time string for display (HHMM to HH:MM)
    // const displayValue = value && value.length === 4 
    //   ? `${value.slice(0, 2)}:${value.slice(2, 4)}`
    //   : value;
    



      const formatTime = (value:any) => {
        // Get just the digits
        const digits = value.replace(/\D/g, "").substring(0, 4);
    
        // Handle cases based on input length
        switch (digits.length) {
          case 0:
            return "";
          case 1:
            return digits;
          case 2: // Check if hours > 23, adjust if needed
          {
            const hrs = parseInt(digits);
            return hrs > 23 ? "23" : digits;
          }
          case 3:
            // Format as H:MM
            return `${digits[0]}:${digits.substring(1)}`;
          case 4: // Format as HH:MM with validation
          {
            let hours = parseInt(digits.substring(0, 2));
            let mins = parseInt(digits.substring(2));
    
            // Validate hours and minutes
            if (hours > 23) hours = 23;
            if (mins > 59) mins = 59;
    
            return `${hours.toString().padStart(2, "0")}:${mins
              .toString()
              .padStart(2, "0")}`;
          }
          default:
            return "";
        }
      };
      const displayValue = formatTime(value)


      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const formattedValue = formatTime(newValue);
        
        if (formattedValue !== value) {
          onChange(formattedValue); // Only call if value has changed
        }
      };
      
    
    // const handleBlur = () => {
    //   // Format the time correctly on blur
    //   if (value && value.length === 4) {
    //     // Validate the time
    //     const hours = parseInt(value.slice(0, 2));
    //     const minutes = parseInt(value.slice(2, 4));
        
    //     if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
    //       // Valid time - keep it
    //       return;
    //     }
    //   }
      
    //   // Invalid time - clear the field
    //   if (value) {
    //     onChange('');
    //   }
    // };
    
    // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //   if (e.key === 'Enter') {
    //     e.preventDefault();
    //     if (onEnterPress) {
    //       onEnterPress();
    //     }
    //   }
    //   onKeyDown(e);
    // };
    
    return (
      <div className="inline-block">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleChange}
          // onBlur={handleBlur}
          onKeyDown={onKeyDown}
          title={title}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          style={{ width: '120px', fontSize: '0.875rem' }}
          placeholder="HH:MM"
          maxLength={5}
        />
      </div>
    );
  }
);

export default MilitaryTimeInput;