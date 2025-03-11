import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { supabase } from '../lib/supabase';

interface TowCall {
  id: string;
  dispnum: number;  // Changed from string to number
  account: string;
  location: string;
  created_at: string;
  status: string;
  lat?: number;
  lng?: number;
}

function MappingPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [calls, setCalls] = useState<TowCall[]>([]);
  const [selectedCall, setSelectedCall] = useState<TowCall | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [loader, setLoader] = useState<Loader | null>(null);

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
          zoom: 10,
        });
        setMap(newMap);
        setGeocoder(new google.maps.Geocoder());
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [loader]);

  useEffect(() => {
    const fetchCalls = async () => {
      const { data, error } = await supabase
        .from('towmast')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching calls:', error);
      } else if (data) {
        setCalls(data);
        geocodeLocations(data);
      }
    };

    fetchCalls();

    // Set up real-time subscription
    const subscription = supabase
      .channel('towmast_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'towmast' 
      }, payload => {
        if (payload.eventType === 'INSERT') {
          setCalls(prev => [payload.new as TowCall, ...prev]);
          geocodeLocations([payload.new as TowCall]);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const geocodeLocations = async (callsToGeocode: TowCall[]) => {
    if (!geocoder || !map) return;

    callsToGeocode.forEach(async call => {
      if (call.location) {
        try {
          const result = await geocoder.geocode({ address: call.location });
          if (result.results[0]?.geometry?.location) {
            const position = result.results[0].geometry.location;
            
            const marker = new google.maps.Marker({
              position,
              map,
              title: `Call #${call.dispnum}`,
              icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
              }
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div class="p-2">
                  <h3 class="font-bold">Call #${call.dispnum}</h3>
                  <p>${call.account}</p>
                  <p>${call.location}</p>
                  <p>Created: ${new Date(call.created_at).toLocaleString()}</p>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
              setSelectedCall(call);
            });

            setMarkers(prev => [...prev, marker]);
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        }
      }
    });
  };

  const filteredCalls = calls.filter(call => 
    String(call.dispnum).includes(searchTerm.toLowerCase()) ||
    call.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCallClick = (call: TowCall) => {
    setSelectedCall(call);
    const marker = markers.find(m => m.getTitle() === `Call #${call.dispnum}`);
    if (marker && map) {
      map.panTo(marker.getPosition()!);
      map.setZoom(15);
      google.maps.event.trigger(marker, 'click');
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="w-1/4 bg-white p-4 overflow-y-auto">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search calls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          {filteredCalls.map(call => (
            <div
              key={call.id}
              onClick={() => handleCallClick(call)}
              className={`p-3 rounded cursor-pointer transition-colors ${
                selectedCall?.id === call.id
                  ? 'bg-blue-100 border-blue-300'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="font-semibold">Call #{call.dispnum}</div>
              <div className="text-sm text-gray-600">{call.account}</div>
              <div className="text-xs text-gray-500">
                {new Date(call.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div ref={mapRef} className="flex-1" />
    </div>
  );
}

export default MappingPage;