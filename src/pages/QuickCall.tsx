import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Book } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface FormData {
  truck: string;
  callType: string;
  size: string;
  callname: string;
  pickupFrom: string;
  destination: string;
  licensePlate: string;
  state: string;
  year: string;
  make: string;
  model: string;
  color: string;
  driver: string;
  truckAssigned: string;
}

interface Driver {
  id: string;
  driver_fir: string;
  def_truckn: string;
  driver_num: string;
}

function QuickPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const recordData = location.state?.record;
  const drivers = location.state?.drivers;
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [pickupMarker, setPickupMarker] = useState<google.maps.Marker | null>(null);
  const [destinationMarker, setDestinationMarker] = useState<google.maps.Marker | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [loader, setLoader] = useState<Loader | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    truck: 'Flatbed',
    callType: 'Private Property',
    size: 'Medium Duty',
    callname: '',
    pickupFrom: '',
    destination: '',
    licensePlate: '',
    state: '',
    year: '',
    make: '',
    model: '',
    color: '',
    driver: '',
    truckAssigned: ''
  });

  // Load record data if editing
  useEffect(() => {
    if (recordData) {
      setFormData(prev => ({
        ...prev,
        callname: recordData.towmast.callname || '',
        pickupFrom: recordData.towmast.location || '',
        destination: recordData.towmast.destination || '',
        licensePlate: recordData.towmast.licensenum || '',
        state: recordData.towmast.state || '',
        year: recordData.towmast.yearcar || '',
        make: recordData.towmast.makecar || '',
        model: recordData.towmast.modelcar || '',
        color: recordData.towmast.colorcar || '',
        driver: recordData.driver || '',
        truckAssigned: recordData.trucknum || '',
        truck: recordData.towmast.truck_type || 'Flatbed',
        callType: recordData.towmast.calltype || 'Private Property',
        size: recordData.towmast.size || 'Medium Duty'
      }));
    }
  }, [recordData]);

  // Initialize loader once
  useEffect(() => {
    const newLoader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });
    setLoader(newLoader);
  }, []);

  // Initialize map after loader is set
  useEffect(() => {
    if (!loader || !mapRef.current) return;

    const initMap = async () => {
      try {
        const google = await loader.load();
        const newMap = new google.maps.Map(mapRef.current!, {
          center: { lat: 34.0522, lng: -118.2437 },
          zoom: 14,
        });
        setMap(newMap);
        setGeocoder(new google.maps.Geocoder());

        // Initialize autocomplete for pickup and destination
        const pickupInput = document.getElementById('pickupFrom') as HTMLInputElement;
        const destinationInput = document.getElementById('destination') as HTMLInputElement;

        if (pickupInput && destinationInput) {
          const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput);
          const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);

          pickupAutocomplete.addListener('place_changed', () => {
            const place = pickupAutocomplete.getPlace();
            if (place.geometry?.location) {
              setFormData(prev => ({ ...prev, pickupFrom: place.formatted_address || '' }));
              updatePickupMarker(place.geometry.location);
            }
          });

          destinationAutocomplete.addListener('place_changed', () => {
            const place = destinationAutocomplete.getPlace();
            if (place.geometry?.location) {
              setFormData(prev => ({ ...prev, destination: place.formatted_address || '' }));
              updateDestinationMarker(place.geometry.location);
            }
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [loader]);

  const updatePickupMarker = (location: google.maps.LatLng) => {
    if (!map) return;

    if (pickupMarker) {
      pickupMarker.setMap(null);
    }

    const newMarker = new google.maps.Marker({
      position: location,
      map,
      title: 'Pickup Location',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      }
    });

    setPickupMarker(newMarker);
    map.panTo(location);
    map.setZoom(15);
  };

  const updateDestinationMarker = (location: google.maps.LatLng) => {
    if (!map) return;

    if (destinationMarker) {
      destinationMarker.setMap(null);
    }

    const newMarker = new google.maps.Marker({
      position: location,
      map,
      title: 'Destination',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      }
    });

    setDestinationMarker(newMarker);
    
    // If both markers exist, fit bounds to show both
    if (pickupMarker) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(pickupMarker.getPosition()!);
      bounds.extend(location);
      map.fitBounds(bounds);
    } else {
      map.panTo(location);
      map.setZoom(15);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If changing location fields, update markers
    if (name === 'pickupFrom' && geocoder) {
      geocoder.geocode({ address: value }, (results, status) => {
        if (status === 'OK' && results?.[0].geometry.location) {
          updatePickupMarker(results[0].geometry.location);
        }
      });
    } else if (name === 'destination' && geocoder) {
      geocoder.geocode({ address: value }, (results, status) => {
        if (status === 'OK' && results?.[0].geometry.location) {
          updateDestinationMarker(results[0].geometry.location);
        }
      });
    }
  };

  const getYearOptions = () => {
    return Array.from({ length: 30 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return {
        value: year.toString(),
        label: year.toString()
      };
    });
  };

  const handleYearSelectChange = (selectedOption: any) => {
    setFormData(prev => ({
      ...prev,
      year: selectedOption?.value || ''
    }));
  };

  const handleButtonGroupChange = (group: 'truck' | 'callType' | 'size', value: string) => {
    setFormData(prev => ({
      ...prev,
      [group]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent, dispatch: boolean = false) => {
    e.preventDefault();
    if (isSubmitting) return;

    const loadingToast = toast.loading('Saving call details...');
    setIsSubmitting(true);

    try {
      const towmastData = {
        callname: formData.callname,
        location: formData.pickupFrom,
        destination: formData.destination,
        licensenum: formData.licensePlate,
        state: formData.state,
        yearcar: formData.year,
        makecar: formData.make,
        model: formData.model,
        colorcar: formData.color,
        truck_type: formData.truck,
        calltype: formData.callType,
        size: formData.size,
        dispatched: dispatch
      };

      let dispnum: number;
      
      if (recordData) {
        // Update existing record
        const { error: towmastError } = await supabase
          .from('towmast')
          .update(towmastData)
          .eq('dispnum', recordData.towmast.dispnum);

        if (towmastError) throw towmastError;
        dispnum = recordData.towmast.dispnum;

      } else {
        // Create new record
        const { data: newTowmast, error: towmastError } = await supabase
          .from('towmast')
          .insert([towmastData])
          .select()
          .single();

        if (towmastError) throw towmastError;
        dispnum = newTowmast.dispnum;
      }

      // Handle towdrive record
      const towdriveData = {
        dispnum,
        trucknum: formData.truckAssigned,
        driver_no: formData.driver
      };

      if (recordData) {
        const { error: towdriveError } = await supabase
          .from('towdrive')
          .update(towdriveData)
          .eq('dispnum', dispnum);

        if (towdriveError) throw towdriveError;
      } else {
        const { error: towdriveError } = await supabase
          .from('towdrive')
          .insert([towdriveData]);

        if (towdriveError) throw towdriveError;
      }

      toast.dismiss(loadingToast);
      toast.success('Call saved successfully');
      navigate('/');
    } catch (error) {
      console.error('Error saving record:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to save call details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ButtonGroup = ({ 
    name, 
    options, 
    value, 
    onChange 
  }: { 
    name: 'truck' | 'callType' | 'size';
    options: string[];
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="flex space-x-2">
      {options.map(option => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`px-4 py-2 text-sm font-medium rounded ${
            value === option
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  const getDriverOptions = () => {
    return drivers.map((driver: Driver) => ({
      value: driver.driver_num,
      label: driver.driver_fir,
      truck: driver.def_truckn
    }));
  };

  const getStateOptions = () => {
    return [
      { value: 'CA', label: 'California' },
      { value: 'AZ', label: 'Arizona' },
      { value: 'NV', label: 'Nevada' },
      { value: 'OR', label: 'Oregon' },
      { value: 'WA', label: 'Washington' }
    ];
  };

  const getTruckOptions = (): { value: string; label: string }[] => {
    const uniqueTrucks = new Set(drivers.map((driver: Driver) => driver.def_truckn).filter(Boolean));
    return Array.from(uniqueTrucks).map(truck => ({
      value: truck as string,
      label: truck as string
    }));
  };

  const handleDriverSelectChange = (selectedOption: any) => {
    setFormData(prev => ({
      ...prev,
      driver: selectedOption?.value || '',
      truckAssigned: selectedOption?.truck || prev.truckAssigned
    }));
  };

  const handleTruckSelectChange = (selectedOption: any) => {
    setFormData(prev => ({
      ...prev,
      truckAssigned: selectedOption?.value || ''
    }));
  };

  const handleStateSelectChange = (selectedOption: any) => {
    setFormData(prev => ({
      ...prev,
      state: selectedOption?.value || ''
    }));
  };


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {recordData ? 'Edit Call' : 'Quick New Call'}
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">*Truck</label>
              <ButtonGroup
                name="truck"
                options={['Flatbed', 'Toggle', 'Wheel-lift']}
                value={formData.truck}
                onChange={(value) => handleButtonGroupChange('truck', value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">*Call Type</label>
              <ButtonGroup
                name="callType"
                options={['Police Call', 'Private Property', 'Tow & Hook']}
                value={formData.callType}
                onChange={(value) => handleButtonGroupChange('callType', value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">*Size</label>
              <ButtonGroup
                name="size"
                options={['Light Duty', 'Medium Duty', 'Heavy Duty']}
                value={formData.size}
                onChange={(value) => handleButtonGroupChange('size', value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-700">Account *</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    name="account"
                    value={formData.callname}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => {/* Add account lookup */}}
                  >
                    <Book className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-700">Pick up from *</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="pickupFrom"
                    name="pickupFrom"
                    value={formData.pickupFrom}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => {/* Add location lookup */}}
                  >
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-700">Destination</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => {/* Add location lookup */}}
                  >
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Vehicle Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">License Plate</label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <Select
                  value={formData.state ? {
                    value: formData.state,
                    label: getStateOptions().find(option => option.value === formData.state)?.label
                  } : null}
                  onChange={handleStateSelectChange}
                  options={getStateOptions()}
                  isClearable
                  className="mt-1"
                  classNamePrefix="react-select"
                  placeholder="Select State..."
                />
              </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <Select
                  value={formData.year ? {
                    value: formData.year,
                    label: formData.year
                  } : null}
                  onChange={handleYearSelectChange}
                  options={getYearOptions()}
                  isClearable
                  className="mt-1"
                  classNamePrefix="react-select"
                  placeholder="Select Year..."
                />
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Make</label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Driver</label>
                <Select
                  value={formData.driver ? {
                    value: formData.driver,
                    label: drivers.find((d:any) => d.driver_num === formData.driver)?.driver_fir || formData.driver
                  } : null}
                  onChange={handleDriverSelectChange}
                  options={getDriverOptions()}
                  isClearable
                  className="mt-1"
                  classNamePrefix="react-select"
                  placeholder="Select Driver..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Truck</label>
                <Select
                  value={formData.truckAssigned ? {
                    value: formData.truckAssigned,
                    label: formData.truckAssigned
                  } : null}
                  onChange={handleTruckSelectChange}
                  options={getTruckOptions()}
                  isClearable
                  className="mt-1"
                  classNamePrefix="react-select"
                  placeholder="Select Truck..."
                />
              </div>
            </div>
          </div>

          <div ref={mapRef} className="w-full h-[400px] rounded-lg overflow-hidden" />

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dispatch')}
              className="px-6 py-2 bg-gray-500 text-white rounded-md text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {recordData ? 'Save' : 'Save and Dispatch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuickPage;