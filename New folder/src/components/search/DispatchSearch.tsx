import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DispatchSearchProps {
  onDispatchFound: (dispatch: any) => void;
  className?: string;
}

const DispatchSearch: React.FC<DispatchSearchProps> = ({ onDispatchFound, className = '' }) => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchValue) return;
    
    setLoading(true);
    try {
      // First try exact dispatch number match
      let { data: dispatchData } = await supabase
        .from('dispatches')
        .select(`
          *,
          customer:customers(*),
          vehicle:vehicles(*),
          driver:drivers(*),
          equipment:equipment(*)
        `)
        .eq('dispatch_number', searchValue)
        .single();

      if (!dispatchData) {
        // Then try VIN search (both exact and partial)
        const { data: vinData } = await supabase
          .from('dispatches')
          .select(`
            *,
            customer:customers(*),
            vehicle:vehicles(*),
            driver:drivers(*),
            equipment:equipment(*)
          `)
          .eq('vehicle.vin', searchValue)
          .or(`vehicle.vin.ilike.%${searchValue}%`)
          .order('created_at', { ascending: false })
          .limit(1);

        if (vinData?.length > 0) {
          dispatchData = vinData[0];
        } else {
          // Finally try license plate search (exact match)
          const { data: plateData } = await supabase
            .from('dispatches')
            .select(`
              *,
              customer:customers(*),
              vehicle:vehicles(*),
              driver:drivers(*),
              equipment:equipment(*)
            `)
            .eq('vehicle.license_plate', searchValue)
            .order('created_at', { ascending: false })
            .limit(1);

          if (plateData?.length > 0) {
            dispatchData = plateData[0];
          }
        }
      }

      if (dispatchData) {
        onDispatchFound(dispatchData);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search by Dispatch #, VIN, or License Plate"
          title="Search by Dispatch number, VIN (full/partial), or License Plate"
          className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="absolute right-2 p-1 text-gray-400 hover:text-gray-600"
          title="Search"
        >
          <Search className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default DispatchSearch;