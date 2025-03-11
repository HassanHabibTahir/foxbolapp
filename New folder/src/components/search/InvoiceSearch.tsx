import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';


interface InvoiceSearchProps {
  onInvoiceFound: (dispatchNumber: number, foxtow_id: string) => Promise<void>;
  className?: string;
}

const InvoiceSearch: React.FC<InvoiceSearchProps> = ({ onInvoiceFound, className = '' }) => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const foxtow_id = localStorage.getItem('foxtow_id') || '';

  const handleSearch = async () => {
    if (!searchValue) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('towdrive')
        .select(`
          *
        `)
        .eq('dispnumdrv', searchValue)
        .eq('foxtow_id', foxtow_id)
        .maybeSingle();
        
      if (data) {
        await onInvoiceFound(data.dispnumdrv, foxtow_id);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative w-96 ${className}`}>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search by Dispatch #"
        className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
      >
        <Search className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};

export default InvoiceSearch;