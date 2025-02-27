// import React from "react";
// import Select from 'react-select';

// interface Dispatch {
//   commission?: boolean;
//   liendin?: string;
//   liendout?: string;
//   lientype?: string;
//   lienfee?: number;
// }


// interface Option {
//   value: number;
//   label: string;
// }

// interface LienFeeSelectProps {
//     ref?: React.Ref<any>;
//     label?: string;
//     title?: string;
//     size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
//     value?: number;
//     onChange?: (value: number) => void;
//     onEnterPress?: () => void;
//     onKeyDown?:any;
//   }
  
//   const LienFeeSelect = React.forwardRef<any, LienFeeSelectProps>(({
//     label,
//     title,
//     size = 'lg',
//     value = 50,
//     onChange,
//     onEnterPress,
//     onKeyDown
//   }, ref) => {
//     const sizeClasses = {
//       xs: '5rem',
//       sm: '8rem',
//       md: '12rem',
//       lg: '30ch',
//       xl: '30rem',
//       full: '100%'
//     };
  
    // const options: Option[] = [
    //   { value: 50, label: '$50.00' },
    //   { value: 75, label: '$75.00' },
    //   { value: 100, label: '$100.00' }
    // ];
  
//     const selectedOption = options.find(option => option.value === value);
  
//     const handleChange = (option: Option | null) => {
//       if (option && onChange) {
//         onChange(option.value);
//         if (onEnterPress) {
//           setTimeout(onEnterPress, 0);
//         }
//       }
//     };
  
//     const handleKeyDown = (e: React.KeyboardEvent) => {
//       if (e.key === 'Enter' && !e.shiftKey && onEnterPress) {
//         e.preventDefault();
//         onEnterPress();
//         onKeyDown(e);
//       }
//     };
  
//     const customStyles = {
//       control: (provided: any) => ({
//         ...provided,
//         borderColor: '#D1D5DB',
//         '&:hover': {
//           borderColor: '#9CA3AF'
//         },
//         boxShadow: 'none',
//         minHeight: '38px'
//       }),
//       option: (provided: any, state: { isSelected: boolean; isFocused: boolean }) => ({
//         ...provided,
//         backgroundColor: state.isSelected ? '#E5E7EB' : state.isFocused ? '#F3F4F6' : 'white',
//         color: '#111827',
//         cursor: 'pointer',
//         '&:hover': {
//           backgroundColor: '#F3F4F6'
//         }
//       }),
//       menu: (provided: any) => ({
//         ...provided,
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
//         borderRadius: '0.375rem'
//       })
//     };


//      console.log(LienFeeSelect)
  
//     return (
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           {label}
//         </label>
//         <div style={{ width: sizeClasses[size] }}>
//           <Select
//             ref={ref}
//             value={selectedOption}
//             onChange={handleChange}
//             options={options}
//             styles={customStyles}
//             placeholder="Select lien fee"
//             onKeyDown={handleKeyDown}
//             isSearchable={false}
//             // title={title}
//             formatOptionLabel={({ label }) => (
//               <div className="font-mono">{label}</div>
//             )}
//           />
//         </div>
//       </div>
//     );
//   });
  
//   LienFeeSelect.displayName = 'LienFeeSelect';
//   export default LienFeeSelect;

import React, { forwardRef, useState } from 'react';
import Select from 'react-select';

interface Option {
  value: number;
  label: string;
}

interface LienFeeSelectProps {
  label: string;
  title?: string;
  value?: number;
  onChange: (value: number) => void;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  disabled?: boolean;
  onEnterPress?: () => void;
  onKeyDown?: any;
}

const LienFeeSelect = forwardRef<any, LienFeeSelectProps>(({
  label,
  title,
  value,
  onChange,
  className = '',
  size = 'sm',
  disabled = false,
  onEnterPress,
  onKeyDown
}, ref) => {
  const sizeClasses = {
    xs: '5rem',
    sm: '8rem',
    md: '12rem',
    lg: '30ch',
    xl: '30rem',
    full: '100%'
  };

  const options: Option[] = [
    { value: 50, label: '$50.00' },
    { value: 75, label: '$75.00' },
    { value: 100, label: '$100.00' }
  ];

  const selectedOption = options.find(option => option.value === value) || null;
const [menuIsOpen, setMenuIsOpen] = useState(false);
  const handleChange = (option: Option | null) => {
    if (option !== null) {
      onChange(option.value);
      if (onEnterPress) {
        setTimeout(onEnterPress, 0);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      const focusedOption = document.querySelector(
        ".react-select__option--is-focused"
      );
      console.log(focusedOption , "focused option");
      if (focusedOption) {
        e.preventDefault();
        const selectedOptionText = focusedOption.textContent;
        console.log(selectedOptionText, "selectedOptionText");
        const _selectedOption = options?.find(
          (opt: { label: string | null }) => opt.label === selectedOptionText
        );
  

        if (_selectedOption) {
          handleChange(_selectedOption);
          setMenuIsOpen(false);
        }
      }
    }
    onKeyDown(e)
    
  };

  const customStyles = {
    control: (provided: any, state: { isFocused: boolean }) => ({
      ...provided,
      borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB',
      '&:hover': {
        borderColor: state.isFocused ? '#3B82F6' : '#9CA3AF'
      },
      boxShadow: state.isFocused ? '0 0 0 1px #3B82F6' : 'none',
      minHeight: '38px',
      width: className ? 'auto' : sizeClasses[size],
      opacity: disabled ? 0.5 : 1,
      backgroundColor: disabled ? '#F3F4F6' : 'white',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }),
    option: (provided: any, state: { isSelected: boolean; isFocused: boolean }) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#E5E7EB' : state.isFocused ? '#F3F4F6' : 'white',
      color: '#111827',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#F3F4F6'
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      borderRadius: '0.375rem',
      zIndex: 50
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#111827',
      fontWeight: 500
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#6B7280'
    }),
    indicatorSeparator: () => ({
      display: 'none'
    })
  };
  const selectProps = {
    id: "select",
    name: "select",
    options: options,
    value: selectedOption,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    className: "react-select-container",
    classNamePrefix: "react-select",
    menuPortalTarget: document.body,
    blurInputOnSelect: true,
    menuIsOpen: menuIsOpen,
    onMenuOpen: () => setMenuIsOpen(true),
    onMenuClose: () => setMenuIsOpen(false),
    openMenuOnFocus: true,
  };
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Select<Option>
        {...selectProps}
        ref={ref}
        // value={selectedOption}
        // onChange={handleChange}
        // options={options}
        styles={customStyles}
        // isDisabled={disabled}
        // isSearchable={false}
        // onKeyDown={handleKeyDown}
        // title={title}
        aria-label={label}
        placeholder="Select..."
        menuPlacement="auto"
        blurInputOnSelect
        components={{
          IndicatorSeparator: null
        }}
      />
    </div>
  );
});

LienFeeSelect.displayName = 'LienFeeSelect';
export default LienFeeSelect;