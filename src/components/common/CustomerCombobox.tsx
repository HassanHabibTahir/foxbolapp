import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Customer {
  id: string;
  name: string;
  account_number: string;
}

interface CustomerComboboxProps {
  label: string;
  title: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  value?: string;
  onChange?: (value: string) => void;
  onCustomerSelect?: (customer: Customer) => void;
}

const CustomerCombobox: React.FC<CustomerComboboxProps> = ({
  label,
  title,
  size = 'xl',
  value = '',
  onChange,
  onCustomerSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState(value);
  const [loading, setLoading] = useState(false);

  const sizeClasses = {
    xs: 'w-20',
    sm: 'w-32',
    md: 'w-48',
    lg: 'w-64',
    xl: 'w-96',
    full: 'w-full'
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      if (searchTerm.length < 2) {
        setCustomers([]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, account_number')
        .ilike('name', `%${searchTerm}%`)
        .limit(10);

      if (!error && data) {
        setCustomers(data);
      }
      setLoading(false);
    };

    const debounce = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleSelect = (customer: Customer) => {
    setSearchTerm(customer.name);
    onChange?.(customer.name);
    onCustomerSelect?.(customer);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className={`relative ${sizeClasses[size]}`}>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 pr-10"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onChange?.(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Start typing to search..."
          title={title}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>

      {isOpen && customers.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(customer)}
            >
              <div className="font-medium">{customer.name}</div>
              {customer.account_number && (
                <div className="text-sm text-gray-500">
                  Account: {customer.account_number}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerCombobox;