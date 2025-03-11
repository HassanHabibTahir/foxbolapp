import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Select from 'react-select';
import toast from 'react-hot-toast';

interface Driver {
  id: string;
  driver_fir: string;
  driver_las: string;
  def_truckn: string;
  color?: string;
  driver_num: string;
  creationda: string;
  driver_ond: boolean;
}

interface Truck {
  id: string;
  trucknum: string;
}

interface TruckOption {
  value: string;
  label: string;
}

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDriverUpdate: () => void;
}

export default function DriverModal({ isOpen, onClose, onDriverUpdate }: DriverModalProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const foxtow_id = localStorage.getItem('foxtow_id');

  useEffect(() => {
    if (isOpen) {
      fetchDrivers();
      fetchTrucks();
    }
  }, [isOpen]);

  const fetchDrivers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('drivers')
      .select('id, driver_fir, driver_las, def_truckn, driver_num, creationda, driver_ond')
      .eq('foxtow_id', foxtow_id)
      .order('driver_fir', { ascending: true });

    if (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Failed to fetch drivers');
    } else {
      setDrivers(data || []);
      if (data && data.length > 0) {
        setCurrentDriver(data[0]);
      }
    }
    setIsLoading(false);
  };

  const fetchTrucks = async () => {
    const { data, error } = await supabase
      .from('trucks')
      .select('id, trucknum')
      .eq('foxtow_id', foxtow_id);

    if (error) {
      console.error('Error fetching trucks:', error);
      toast.error('Failed to fetch trucks');
    } else {
      setTrucks(data || []);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDriver) return;

    const loadingToast = toast.loading('Saving driver details...');

    try {
      const { error } = await supabase
        .from('drivers')
        .upsert({
          id: currentDriver.id,
          driver_fir: currentDriver.driver_fir,
          driver_las: currentDriver.driver_las,
          driver_num: currentDriver.driver_num,
          creationda: currentDriver.creationda,
          driver_ond: currentDriver.driver_ond,
          def_truckn: currentDriver.def_truckn,
        });

      if (error) throw error;

      toast.dismiss(loadingToast);
      toast.success('Driver details saved successfully');
      onDriverUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating driver:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to save driver details');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentDriver) return;
    const { name, value, type, checked } = e.target;
    setCurrentDriver(prev => ({
      ...prev!,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTruckChange = (selectedOption: TruckOption | null) => {
    if (!currentDriver) return;
    setCurrentDriver(prev => ({
      ...prev!,
      def_truckn: selectedOption?.value || ''
    }));
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const currentIndex = drivers.findIndex(d => d.id === currentDriver?.id);
    let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0) newIndex = drivers.length - 1;
    if (newIndex >= drivers.length) newIndex = 0;
    
    setCurrentDriver(drivers[newIndex]);
  };

  const getTruckOptions = (): TruckOption[] => {
    // Create a Set of existing truck numbers
    const existingTruckNums = new Set(trucks.map(truck => truck.trucknum));
    
    // Get all options from the trucks table
    const options = trucks.map(truck => ({
      value: truck.trucknum,
      label: truck.trucknum
    }));

    // If current driver has a truck and it's not in the list, add it
    if (currentDriver?.def_truckn && !existingTruckNums.has(currentDriver.def_truckn)) {
      options.push({
        value: currentDriver.def_truckn,
        label: `${currentDriver.def_truckn} (Current)`
      });
    }

    // Sort options alphabetically
    return options.sort((a, b) => a.value.localeCompare(b.value));
  };

  const getCurrentTruckValue = (): TruckOption | null => {
    if (!currentDriver?.def_truckn) return null;
    
    // Check if the current truck exists in the trucks list
    const existingTruckNums = new Set(trucks.map(truck => truck.trucknum));
    
    return {
      value: currentDriver.def_truckn,
      label: existingTruckNums.has(currentDriver.def_truckn) 
        ? currentDriver.def_truckn 
        : `${currentDriver.def_truckn} (Current)`
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Driver Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="driver_fir"
                  value={currentDriver?.driver_fir || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="driver_las"
                  value={currentDriver?.driver_las || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Driver Number</label>
                <input
                  type="text"
                  name="driver_num"
                  value={currentDriver?.driver_num || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Creation Date</label>
                <input
                  type="date"
                  name="creationda"
                  value={currentDriver?.creationda || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Truck Number</label>
                <Select
                  value={getCurrentTruckValue()}
                  onChange={handleTruckChange}
                  options={getTruckOptions()}
                  isClearable
                  className="mt-1"
                  classNamePrefix="react-select"
                  placeholder="Select a truck..."
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="driver_ond"
                  checked={currentDriver?.driver_ond || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">On Duty</label>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => handleNavigate('prev')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('next')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Next
                </button>
              </div>
              <div className="space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}