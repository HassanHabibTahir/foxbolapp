import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { supabase } from '../../lib/supabase';

interface Option {
  value: string;
  label: string;
}

interface CarMakeModelsProps {
  label?: string;
  title?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  disabled?: boolean;
  onEnterPress?: () => void;
  onKeyDown?: any;
  carMakeId?:any;
}

const CarMakeModels = forwardRef<any, CarMakeModelsProps>(({
  label,
  title,
  value,
  onChange,
  className = '',
  size = 'sm',
  disabled = false,
  onEnterPress,
  onKeyDown,
  carMakeId
}, ref) => {
  const sizeClasses = {
    xs: '5rem',
    sm: '8rem',
    md: '12rem',
    lg: '30ch',
    xl: '30rem',
    full: '100%'
  };
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const selectedOption = useMemo(() => {
    return options.find(option => option.value === value) || null;
  }, [options, value]);
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



  const init = useCallback(async () => {
    setLoading(true);
    try {
      if (carMakeId) {
        const { data, error } = await supabase
          .from("carmodels")
          .select("*")
          .eq("makeid", carMakeId);
  
        if (error) {
          console.error("Supabase error:", error);
          return;
        }
  
        if (data && data.length > 0) {
          const formatText = (text: string) => {
            if (!text) return '';
            return text
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
          };
  
          setOptions(
            data.map((carmake: { makeid: string; name: string }) => ({
              value: formatText(carmake.name),
              label: formatText(carmake.name),
            }))
          );
        }
      }
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [carMakeId, value, onChange]);

  useEffect(() => {
    init();
  }, [init]);

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
        placeholder={loading?"Loading...":"Select..."}
        menuPlacement="auto"
        blurInputOnSelect
        components={{
          IndicatorSeparator: null
        }}
      />
   
    </div>
  );
});

CarMakeModels.displayName = 'CarMake';
export default CarMakeModels;