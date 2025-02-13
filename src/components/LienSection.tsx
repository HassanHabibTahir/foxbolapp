import React, { useRef } from 'react';
import FormSection from './common/FormSection';
import DateInput from './common/DateInput';
import LienTypeInput from './common/LienTypeInput';
import BooleanSelect from './common/BooleanSelector';
import Select from 'react-select';

interface Dispatch {
  commission?: boolean;
  liendin?: string;
  liendout?: string;
  lientype?: string;
  lienfee?: number;
}

interface LienSectionProps {
  dispatch: Dispatch;
  onDispatchChange: (updates: Partial<Dispatch>) => void;
  onEnterPress?: () => void;
}

interface Option {
  value: number;
  label: string;
}

interface LienFeeSelectProps {
  ref?: React.Ref<any>;
  label?: string;
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  value?: number;
  onChange?: (value: number) => void;
  onEnterPress?: () => void;
}

const LienFeeSelect = React.forwardRef<any, LienFeeSelectProps>(({
  label,
  title,
  size = 'lg',
  value = 50,
  onChange,
  onEnterPress
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

  const selectedOption = options.find(option => option.value === value);

  const handleChange = (option: Option | null) => {
    if (option && onChange) {
      onChange(option.value);
      if (onEnterPress) {
        setTimeout(onEnterPress, 0);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && onEnterPress) {
      e.preventDefault();
      onEnterPress();
    }
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderColor: '#D1D5DB',
      '&:hover': {
        borderColor: '#9CA3AF'
      },
      boxShadow: 'none',
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
          ref={ref}
          value={selectedOption}
          onChange={handleChange}
          options={options}
          styles={customStyles}
          placeholder="Select lien fee"
          onKeyDown={handleKeyDown}
          isSearchable={false}
          // title={title}
          formatOptionLabel={({ label }) => (
            <div className="font-mono">{label}</div>
          )}
        />
      </div>
    </div>
  );
});

LienFeeSelect.displayName = 'LienFeeSelect';

const LienSection: React.FC<LienSectionProps> = ({ 
  dispatch,
  onDispatchChange,
  onEnterPress
}) => {
  // Create refs for keyboard navigation
  const lienStartRef = useRef<HTMLInputElement>(null);
  const lienClearRef = useRef<HTMLInputElement>(null);
  const lienTypeRef = useRef<HTMLInputElement>(null);
  const lienFeeRef = useRef<any>(null);

  return (
    <FormSection title="I - Lien Information">
      <div className="flex flex-wrap gap-4">
        <BooleanSelect
        className='h-10  text-[14px]'
          label="Commission"
          value={dispatch.commission || false}
          onChange={(value) => onDispatchChange({ commission: value })}
          size="lg"
          onEnterPress={() => lienStartRef.current?.focus()}
        />
        <DateInput 
          ref={lienStartRef}
          className='h-10  text-[14px]'
          label="Lien Start" 
          title="master.liendin"
          size="md"
          value={dispatch.liendin || ''}
          onChange={(value) => onDispatchChange({ liendin: value })}
          onEnterPress={() => lienClearRef.current?.focus()}
        />
        <DateInput 
          ref={lienClearRef}
          label="Lien Clear" 
          title="master.liendout"
          size="md"
          className='h-10  text-[14px]'
          value={dispatch.liendout || ''}
          onChange={(value) => onDispatchChange({ liendout: value })}
          onEnterPress={() => lienTypeRef.current?.focus()}
        />
        <LienTypeInput 
          ref={lienTypeRef}
          label="Lien Type" 
          className=''
          title="master.lientype"
          value={dispatch.lientype || ''}
          onChange={(value) => onDispatchChange({ lientype: value })}
          onEnterPress={() => lienFeeRef.current?.focus()}
        />
        <LienFeeSelect
          ref={lienFeeRef}
          label="Lien Fee"
          title="master.lienfee"
          value={dispatch.lienfee || 50}
          onChange={(value) => onDispatchChange({ lienfee: value })}
          onEnterPress={onEnterPress}
        />
      </div>
    </FormSection>
  );
};

export default LienSection;