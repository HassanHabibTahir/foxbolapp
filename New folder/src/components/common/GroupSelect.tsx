import React from 'react';

interface GroupSelectProps {
  label: string;
  title: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const GroupSelect: React.FC<GroupSelectProps> = ({ label, title, className = '', size = 'xs' }) => {
  const groups = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  
  const sizeClasses = {
    xs: 'w-20',
    sm: 'w-32',
    md: 'w-48',
    lg: 'w-64',
    xl: 'w-96',
    full: 'w-full'
  };

  return (
    <div className={size === 'full' ? 'w-full' : 'inline-block'}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        className={`mt-1 block rounded-md border border-gray-300 p-2 ${sizeClasses[size]} ${className}`}
        title={title}
      >
        <option value="">Select</option>
        {groups.map(group => (
          <option key={group} value={group}>{group}</option>
        ))}
      </select>
    </div>
  );
};

export default GroupSelect;