import React from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';

interface SelectBoxProps {
  label: string;
  name: string;
  value: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

const SelectBox: React.FC<SelectBoxProps> = (props) => {
  return <MultiSelectDropdown {...props} />;
};

export default SelectBox;
