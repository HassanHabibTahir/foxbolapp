import React from 'react';

interface TimeInputProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ title, value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (input.length <= 4) {
      const formatted = input.padEnd(4, '_');
      const display = `${formatted.slice(0, 2)}:${formatted.slice(2)}`;
      onChange(display);
    }
  };

  return (
    <input
      type="text"
      className="mt-1 block w-20 rounded-md border border-gray-300 p-2 text-center"
      placeholder="__:__"
      value={value}
      onChange={handleChange}
      title={title}
      maxLength={5}
    />
  );
};

export default TimeInput;