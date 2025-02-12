import React, { useState, useEffect, forwardRef, KeyboardEvent } from 'react';
import Select, { components } from 'react-select';
import { supabase } from '../../lib/supabase';

interface Driver {
  driver_num: string;
  driver_fir: string;
  driver_las: string;
}

interface DriverOption {
  value: string;
  label: string;
  driver: Driver;
}

interface DriverComboboxProps {
  label: string;
  title: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  value?: string;
  onChange?: (value: string) => void;
  onDriverSelect?: (driver: Driver) => void;
  onEnterPress?: () => void;
}

const DriverCombobox = forwardRef<HTMLInputElement, DriverComboboxProps>(({
  label,
  title,
  size = 'xs',
  value = '',
  onChange,
  onDriverSelect,
  onEnterPress
}, ref) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedOption, setSelectedOption] = useState<DriverOption | null>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const sizeClasses = {
    xs: '5rem',
    sm: '8rem',
    md: '12rem',
    lg: '30ch',
    xl: '24rem',
    full: '100%'
  };

  useEffect(() => {
    const foxtow_id = localStorage.getItem('foxtow_id');
    const fetchDrivers = async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select()
        .eq('foxtow_id', foxtow_id);

      if (!error && data) {
        setDrivers(data);
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    if (value) {
      const fetchDriver = async () => {
        const { data, error } = await supabase
          .from('drivers')
          .select()
          .eq('driver_num', value)
          .single();

        if (!error && data) {
          setSelectedOption({
            value: data.driver_num,
            label: `${data.driver_fir} ${data.driver_las}`,
            driver: data
          });
        }
      };

      fetchDriver();
    } else {
      setSelectedOption(null);
    }
  }, [value]);

  const options: DriverOption[] = drivers.map(driver => ({
    value: driver.driver_num,
    label: `${driver.driver_fir} ${driver.driver_las}`,
    driver
  }));

  const handleChange = (option: DriverOption | null, actionMeta: any) => {
    setSelectedOption(option);
    if (option) {
      onChange?.(option.value);
      onDriverSelect?.(option.driver);
      if (actionMeta.action === 'select-option' && onEnterPress) {
        setTimeout(onEnterPress, 0);
      }
    } else {
      onChange?.('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && !menuIsOpen && onEnterPress) {
      e.preventDefault();
      onEnterPress();
    }
  };

  const customStyles = {
    control: (provided: any, state: { isFocused: boolean }) => ({
      ...provided,
      borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB',
      '&:hover': {
        borderColor: state.isFocused ? '#3B82F6' : '#9CA3AF'
      },
      boxShadow: state.isFocused ? '0 0 0 1px #3B82F6' : 'none',
      minHeight: '34px', // Reduce height
      height: '34px', 
      padding: '0px', 
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0px 8px',
      display: 'flex',
      alignItems: 'center', // Center the text vertically
      justifyContent: 'center', // Center the text horizontally
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0px',
      padding: '0px',
      fontSize: '14px', // Make text small
      textAlign: 'center', // Center text
    }),
    placeholder: (provided: any) => ({
      ...provided,
      fontSize: '14px', // Make placeholder text small
      textAlign: 'center', // Center placeholder
      color: '#9CA3AF', // Light gray color for placeholder
    }),
    singleValue: (provided: any) => ({
      ...provided,
      fontSize: '14px', // Make selected text small
      textAlign: 'center', // Center selected text
      color: '#111827', // Dark text color
    }),
  };
  

  return (
    <div>
      <label className="block text-sm font-small text-gray-700 mb-1">
        {label}
      </label>
      <div style={{ width: sizeClasses[size],  }}>
        <Select
          ref={ref as any}
          value={selectedOption}
          onChange={handleChange}
          options={options}
          styles={customStyles}
          placeholder="Select a driver"
          isClearable
          isSearchable
          onKeyDown={handleKeyDown}
          menuIsOpen={menuIsOpen}
          onMenuOpen={() => setMenuIsOpen(true)}
          onMenuClose={() => setMenuIsOpen(false)}
          backspaceRemovesValue={true}
          blurInputOnSelect={true}
          captureMenuScroll={true}
          closeMenuOnSelect={true}
          
          components={{
            Option: ({ children, ...props }) => (
              <components.Option {...props}>
                {children}
              </components.Option>
            )
          }}
         
          // title={title}
        />
      </div>
    </div>
  );
});

DriverCombobox.displayName = 'DriverCombobox';

export default DriverCombobox;