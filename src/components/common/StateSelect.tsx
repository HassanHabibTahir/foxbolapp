import React, { forwardRef, useState } from 'react';
import Select from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface StateSelectProps {
  label: string;
  title?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  disabled?: boolean;
  onEnterPress?: () => void;
  onKeyDown?: any;
}

const StateSelect = forwardRef<any, StateSelectProps>(({
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
    { label: "AL", value: "AL" },
  { label: "AK", value: "AK" },
  { label: "AZ", value: "AZ" },
  { label: "AR", value: "AR" },
  { label: "CA", value: "CA" },
  { label: "CO", value: "CO" },
  { label: "CT", value: "CT" },
  { label: "DE", value: "DE" },
  { label: "DC", value: "DC" },
  { label: "FL", value: "FL" },
  { label: "GA", value: "GA" },
  { label: "HI", value: "HI" },
  { label: "ID", value: "ID" },
  { label: "IL", value: "IL" },
  { label: "IN", value: "IN" },
  { label: "IA", value: "IA" },
  { label: "KS", value: "KS" },
  { label: "KY", value: "KY" },
  { label: "LA", value: "LA" },
  { label: "ME", value: "ME" },
  { label: "MD", value: "MD" },
  { label: "MA", value: "MA" },
  { label: "MI", value: "MI" },
  { label: "MN", value: "MN" },
  { label: "MS", value: "MS" },
  { label: "MO", value: "MO" },
  { label: "MT", value: "MT" },
  { label: "NE", value: "NE" },
  { label: "NV", value: "NV" },
  { label: "NH", value: "NH" },
  { label: "NJ", value: "NJ" },
  { label: "NM", value: "NM" },
  { label: "NY", value: "NY" },
  { label: "NC", value: "NC" },
  { label: "ND", value: "ND" },
  { label: "OH", value: "OH" },
  { label: "OK", value: "OK" },
  { label: "OR", value: "OR" },
  { label: "PA", value: "PA" },
  { label: "RI", value: "RI" },
  { label: "SC", value: "SC" },
  { label: "SD", value: "SD" },
  { label: "TN", value: "TN" },
  { label: "TX", value: "TX" },
  { label: "UT", value: "UT" },
  { label: "VT", value: "VT" },
  { label: "VA", value: "VA" },
  { label: "WA", value: "WA" },
  { label: "WV", value: "WV" },
  { label: "WI", value: "WI" },
  { label: "WY", value: "WY" }];

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
      minHeight: '35px',
      height:"34px",
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

StateSelect.displayName = 'StateSelect';
export default StateSelect;