import React, { useState, useEffect, forwardRef, KeyboardEvent } from 'react';
import Select from 'react-select';
import { supabase } from '../../lib/supabase';

interface Truck {
  trucknum: string;
  description: string;
}

interface TruckOption {
  value: string;
  label: string;
}

interface TruckComboboxProps {
  label: string;
  title: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  value?: string;
  onChange?: (value: string) => void;
  onEnterPress?: () => void;
      onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  
}

const TruckCombobox = forwardRef<HTMLInputElement, TruckComboboxProps>(({
  label,
  title,
  size = 'lg',
  value = '',
  onChange,
  onEnterPress,
  onKeyDown
}, ref) => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [selectedOption, setSelectedOption] = useState<TruckOption | null>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

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
    const fetchTrucks = async () => {
      const { data, error } = await supabase
        .from('trucks')
        .select()
        .eq('foxtow_id', foxtow_id);

      if (!error && data) {
        setTrucks(data);
      }
    };

    fetchTrucks();
  }, []);

  useEffect(() => {
    if (value) {
      const fetchTruck = async () => {
        const { data, error } = await supabase
          .from('trucks')
          .select()
          .eq('trucknum', value)
          .single();

        if (!error && data) {
          setSelectedOption({
            value: data.trucknum,
            label: data.description
          });
        }
      };

      fetchTruck();
    } else {
      setSelectedOption(null);
    }
  }, [value]);

  const options: TruckOption[] = trucks.map(truck => ({
    value: truck.trucknum,
    label: truck.description
  }));

  const handleChange = (option: TruckOption | null) => {
    setSelectedOption(option);
    if (option) {
      onChange?.(option.value);
      if (onEnterPress) {
        setTimeout(onEnterPress, 0);
      }
    } else {
      onChange?.('');
    }
  };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) {
        onKeyDown(e)
      }
    }
  // const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
  //   if (!menuIsOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
  //     e.preventDefault();
  //     setMenuIsOpen(true);
  //     setHighlightedIndex(e.key === 'ArrowDown' ? 0 : options.length - 1);
  //     return;
  //   }

  //   if (menuIsOpen) {
  //     switch (e.key) {
  //       case 'ArrowDown':
  //         e.preventDefault();
  //         setHighlightedIndex(prev => 
  //           prev < options.length - 1 ? prev + 1 : 0
  //         );
  //         break;
  //       case 'ArrowUp':
  //         e.preventDefault();
  //         setHighlightedIndex(prev => 
  //           prev > 0 ? prev - 1 : options.length - 1
  //         );
  //         break;
  //       case 'Enter':
  //         e.preventDefault();
  //         if (highlightedIndex >= 0) {
  //           handleChange(options[highlightedIndex]);
  //           setMenuIsOpen(false);
  //         } else if (onEnterPress) {
  //           onEnterPress();
  //         }
  //         break;
  //       case 'Escape':
  //         setMenuIsOpen(false);
  //         setHighlightedIndex(-1);
  //         break;
  //     }
  //   } else if (e.key === 'Enter' && onEnterPress) {
  //     e.preventDefault();
  //     onEnterPress();
  //   }
  // };
  // const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
  //   if (!menuIsOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
  //     e.preventDefault()
  //     setMenuIsOpen(true)
  //     setHighlightedIndex(e.key === "ArrowDown" ? 0 : options.length - 1)
  //     return
  //   }

  //   if (menuIsOpen) {
  //     switch (e.key) {
  //       case "ArrowDown":
  //         e.preventDefault()
  //         setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0))
  //         break
  //       case "ArrowUp":
  //         e.preventDefault()
  //         setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1))
  //         break
  //       case "Enter":
  //         e.preventDefault()
  //         if (highlightedIndex >= 0) {
  //           handleChange(options[highlightedIndex])
  //           setMenuIsOpen(false)
  //         } else if (onEnterPress) {
  //           onEnterPress()
  //         }
  //         break
  //       case "Escape":
  //         setMenuIsOpen(false)
  //         setHighlightedIndex(-1)
  //         break
  //     }
  //   } else if (e.key === "Enter" && onEnterPress) {
  //     e.preventDefault()
  //     onEnterPress()
  //   }
  // }
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderColor: '#D1D5DB',
      fontSize: '12px',
      '&:hover': {
        borderColor: '#9CA3AF'
      },
      boxShadow: 'none',
      minHeight: '38px'
    }),
    option: (provided: any, state: { isSelected: boolean; isFocused: boolean }) => ({
      ...provided,
      fontSize: '12px',
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
      borderRadius: '0.375rem'
    })
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div style={{ width: sizeClasses[size] }}>
        <Select
          ref={ref as any}
          value={selectedOption}
          onChange={handleChange}
          options={options}
          styles={customStyles}
          placeholder="Select a truck"
          isClearable
          isSearchable
          // title={title}
          onKeyDown={handleKeyDown}
          menuIsOpen={menuIsOpen}
          onMenuOpen={() => {
            setMenuIsOpen(true);
            setHighlightedIndex(0);
          }}
          onMenuClose={() => {
            setMenuIsOpen(false);
            setHighlightedIndex(-1);
          }}
        />
      </div>
    </div>
  );
});

TruckCombobox.displayName = 'TruckCombobox';

export default TruckCombobox;