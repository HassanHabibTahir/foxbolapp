import React, { useState, useEffect, forwardRef } from 'react';
import AsyncSelect from 'react-select/async';
import { supabase } from '../../lib/supabase';

interface Item {
  description: string;
  shortcut1: string;
  shortcut2: string;
}

interface ItemOption {
  value: string;
  label: string;
  item: Item;
}

interface ItemDescriptionComboboxProps {
  value: string;
  onChange: (value: string) => void;
  onItemSelect?: (item: Item) => void;
  onEnterPress?: () => void;
  className?: string;
}

const ItemDescriptionCombobox = forwardRef<any, ItemDescriptionComboboxProps>(({
  value,
  onChange,
  onItemSelect,
  onEnterPress,
  className = ''
}, ref) => {
  const [selectedOption, setSelectedOption] = useState<ItemOption | null>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  useEffect(() => {
    const initializeSelectedOption = async () => {
      if (value) {
        const { data, error } = await supabase
          .from('items')
          .select('description, shortcut1, shortcut2')
          .eq('description', value)
          .limit(1)
          .single();

        if (!error && data) {
          setSelectedOption({
            value: data.description,
            label: formatLabel(data),
            item: data
          });
        } else {
          setSelectedOption(null);
        }
      } else {
        setSelectedOption(null);
      }
    };

    initializeSelectedOption();
  }, [value]);

  const formatLabel = (item: Item): string => {
    return `${item.description} ${item.shortcut1 ? `(${item.shortcut1})` : ''} ${item.shortcut2 ? `(${item.shortcut2})` : ''}`.trim();
  };

  const loadOptions = async (inputValue: string) => {
    if (!inputValue) return [];

    const { data, error } = await supabase
      .from('items')
      .select('description, shortcut1, shortcut2')
      .or(`description.ilike.%${inputValue}%, shortcut1.ilike.%${inputValue}%, shortcut2.ilike.%${inputValue}%`)
      .limit(10);

    if (error) {
      console.error('Error fetching items:', error);
      return [];
    }

    const uniqueItems = data.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.description === item.description &&
        t.shortcut1 === item.shortcut1 &&
        t.shortcut2 === item.shortcut2
      ))
    );

    return uniqueItems.map(item => ({
      value: item.description,
      label: formatLabel(item),
      item
    }));
  };

  const handleChange = (option: ItemOption | null) => {
    setSelectedOption(option);
    if (option) {
      onChange(option.value);
      onItemSelect?.(option.item);
      if (onEnterPress) {
        setTimeout(onEnterPress, 0);
      }
    } else {
      onChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !menuIsOpen && onEnterPress) {
      e.preventDefault();
      onEnterPress();
    }
  };

  const customStyles = {
    control: (provided: any, state: { isFocused: boolean }) => ({
      ...provided,
      borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB',
      boxShadow: state.isFocused ? '0 0 0 1px #3B82F6' : 'none',
      '&:hover': {
        borderColor: '#9CA3AF'
      },
      minHeight: '38px'
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
    input: (provided: any) => ({
      ...provided,
      color: '#111827'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#111827'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#6B7280'
    }),
    noOptionsMessage: (provided: any) => ({
      ...provided,
      color: '#6B7280'
    })
  };

  return (
    <div className={`flex-1 ${className}`}>
      <AsyncSelect<ItemOption>
        ref={ref}
        value={selectedOption}
        onChange={handleChange}
        loadOptions={loadOptions}
        defaultOptions
        isClearable
        isSearchable
        placeholder="Type to search items..."
        styles={customStyles}
        className="text-sm"
        classNamePrefix="react-select"
        cacheOptions
        menuIsOpen={menuIsOpen}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        onKeyDown={handleKeyDown}
        blurInputOnSelect
        loadingMessage={() => "Loading items..."}
        noOptionsMessage={({ inputValue }) => 
          inputValue ? "No items found" : "Type to search items"
        }
      />
    </div>
  );
});

ItemDescriptionCombobox.displayName = 'ItemDescriptionCombobox';

export default ItemDescriptionCombobox;