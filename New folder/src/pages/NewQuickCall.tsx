import React, { useState, useEffect, useRef } from "react";
import { MapPin, Book } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "@googlemaps/js-api-loader";
import Select from "react-select";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import AccountName from "../components/common/AccountName";
import SelectAccountName from "../components/common/accountNameSelect";
import ColorSelect from "../components/common/ColorSelect";
import CarMake from "../components/common/CarMake";
import CarMakeModels from "../components/common/CarModels";

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
  driver: any;
  truckAssigned: string;
  makecar: any;
}

interface Driver {
  id: string;
  driver_fir: string;
  def_truckn: string;
  driver_num: string;
}

function NewQuickPage() {
  const foxtow_id = localStorage.getItem("foxtow_id");
  const location = useLocation();
  const navigate = useNavigate();
  const recordData = location.state?.record;
  const states = location.state?.drivers;
  console.log(recordData, "states,recordData");
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [pickupMarker, setPickupMarker] = useState<google.maps.Marker | null>(
    null
  );
  const [destinationMarker, setDestinationMarker] =
    useState<google.maps.Marker | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [loader, setLoader] = useState<Loader | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trucks, setTrucks] = useState<any>([]);
  const [carMakeId, setCarMakeId] = useState<any>("");
  const [formData, setFormData] = useState<FormData>({
    truck: "",
    callType: "",
    size: "",
    callname: "",
    pickupFrom: "",
    destination: "",
    licensePlate: "",
    state: "",
    year: "",
    make: "",
    model: "",
    color: "",
    driver: "",
    truckAssigned: "",
    makecar: {},
  });

  // Load record data if editing
  useEffect(() => {
    if (recordData) {
      setFormData((prev) => ({
        ...prev,
        callname: recordData.towmast.callname || "",
        pickupFrom: recordData.towmast.location || "",
        destination: recordData.towmast.destination || "",
        licensePlate: recordData.towmast.licensenum || "",
        state: recordData.towmast.state || "",
        year: recordData.towmast.yearcar || "",
        make: recordData.towmast.makecar || "",
        model: recordData.towmast.modelcar || "",
        color: recordData.towmast.colorcar || "",
        driver: recordData.driver || "",
        truckAssigned: recordData.trucknum || "",
        truck: recordData.towmast.truck_type || "",
        callType: recordData.towmast.calltype || "",
        size: recordData.towmast.size || "",
      }));
    }
  }, [recordData]);

  // Initialize loader once
  useEffect(() => {
    const newLoader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places", "geometry"],
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
        const pickupInput = document.getElementById(
          "pickupFrom"
        ) as HTMLInputElement;
        const destinationInput = document.getElementById(
          "destination"
        ) as HTMLInputElement;

        if (pickupInput && destinationInput) {
          const pickupAutocomplete = new google.maps.places.Autocomplete(
            pickupInput
          );
          const destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput
          );

          pickupAutocomplete.addListener("place_changed", () => {
            const place = pickupAutocomplete.getPlace();
            if (place.geometry?.location) {
              setFormData((prev) => ({
                ...prev,
                pickupFrom: place.formatted_address || "",
              }));
              updatePickupMarker(place.geometry.location);
            }
          });

          destinationAutocomplete.addListener("place_changed", () => {
            const place = destinationAutocomplete.getPlace();
            if (place.geometry?.location) {
              setFormData((prev) => ({
                ...prev,
                destination: place.formatted_address || "",
              }));
              updateDestinationMarker(place.geometry.location);
            }
          });
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
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
      title: "Pickup Location",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
      },
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
      title: "Destination",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      },
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If changing location fields, update markers
    if (name === "pickupFrom" && geocoder) {
      geocoder.geocode({ address: value }, (results, status) => {
        if (status === "OK" && results?.[0].geometry.location) {
          updatePickupMarker(results[0].geometry.location);
        }
      });
    } else if (name === "destination" && geocoder) {
      geocoder.geocode({ address: value }, (results, status) => {
        if (status === "OK" && results?.[0].geometry.location) {
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
        label: year.toString(),
      };
    });
  };

  const handleYearSelectChange = (selectedOption: any) => {
    setFormData((prev) => ({
      ...prev,
      year: selectedOption?.value || "",
    }));
  };

  const handleButtonGroupChange = (
    group: "truck" | "callType" | "size",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [group]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent,
    dispatch: boolean = false
  ) => {
    e.preventDefault();
    if (isSubmitting) return;

    const loadingToast = toast.loading("Saving call details...");
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("towmast")
        .select("dispnum")
        .order("dispnum", { ascending: false }) // Sabse bara dispnum milega
        .limit(1); // Sirf ek record chahiye
      if (error) {
        console.error("Error fetching last dispnum:", error);
      } else {
        const lastDispnum =
          data.length > 0 ? parseInt(data[0].dispnum) : 100000; // Agar empty ho to default
        const newDispnum = lastDispnum + 1; // Next number generate karo
        const dispatchNumber = recordData?.towmast?.dispnum;

        console.log("Last Dispnum:", lastDispnum);
        console.log("Next Dispnum:", newDispnum);
        const { data: towMastData, error: towMastError } = await supabase
          .from("towmast")
          .insert([
            {
              foxtow_id: foxtow_id ?? "",
              dispnum: dispatchNumber ? dispatchNumber : newDispnum ?? "",
              callname: formData?.callname ?? "",
              makecar: formData?.makecar ?? "",
              yearcar: formData?.year ?? "",
              modelcar: formData?.model ?? "",
              colorcar: formData?.color ?? "",
              licensenum: formData?.licensePlate ?? "",
              updated_at: new Date(),
            },
          ])
          .select("dispnum")
          .single();

        const { data: towDriveData, error: towDriveError } = await supabase
          .from("towdrive")
          .insert([
            {
              trucknum: formData?.truckAssigned,
              driver: formData?.driver?.value,
              foxtow_id: foxtow_id,
              dispnumdrv: dispatchNumber
                ? dispatchNumber
                : towMastData?.dispnum,
            },
          ]);

        if (towDriveError) throw towDriveError;
        console.log("Data inserted successfully!");
      }

      toast.dismiss(loadingToast);
      toast.success("Call saved successfully");
      navigate("/dispatch");
    } catch (error) {
      console.error("Error saving record:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to save call details");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ButtonGroup = ({
    options,
    value,
    onChange,
  }: {
    name: "truck" | "callType" | "size";
    options: string[];
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="flex space-x-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`px-4 py-2 text-sm font-medium rounded-sm ${
            value === option
              ? "bg-blue-600 text-white"
              : "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  const [drivers, setDrivers] = useState<any[]>([]);
  useEffect(() => {
    const foxtow_id = localStorage.getItem("foxtow_id");
    const fetchDrivers = async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select()
        .eq("foxtow_id", foxtow_id);
      if (!error && data) {
        const drivers = data?.map((driver: any) => ({
          value: driver.driver_num,
          label: driver.driver_fir,
          truck: driver.def_truckn,
        }));
        console.log(drivers, "driver");
        setDrivers(drivers);
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    const foxtow_id = localStorage.getItem("foxtow_id");
    const fetchTrucks = async () => {
      const { data, error } = await supabase
        .from("trucks")
        .select()
        .eq("foxtow_id", foxtow_id);

      if (!error && data) {
        const trucks = data.map((truck: any) => ({
          value: truck.trucknum,
          label: truck.trucknum,
        }));
        setTrucks(trucks);
      }
    };

    fetchTrucks();
  }, []);

  const getStateOptions = () => {
    return [
      { value: "CA", label: "California" },
      { value: "AZ", label: "Arizona" },
      { value: "NV", label: "Nevada" },
      { value: "OR", label: "Oregon" },
      { value: "WA", label: "Washington" },
    ];
  };

  const handleDriverSelectChange = (selectedOption: any) => {
    setFormData((prev) => ({
      ...prev,
      driver: selectedOption || "",
      truckAssigned: selectedOption?.truck || prev.truckAssigned,
    }));
  };

  const handleTruckSelectChange = (selectedOption: any) => {
    setFormData((prev) => ({
      ...prev,
      truckAssigned: selectedOption?.value || "",
    }));
  };

  const handleStateSelectChange = (selectedOption: any) => {
    setFormData((prev) => ({
      ...prev,
      state: selectedOption?.value || "",
    }));
  };

  const colorChangeHandler = (color: any) => {
    setFormData((prev) => ({
      ...prev,
      color: color,
    }));
  };

  const carMakeHandler = (make: any) => {
    console.log(make, "make==>");
    setFormData((prev) => ({
      ...prev,
      makecar: make,
    }));
  };
  const carMakeModel = (model: any) => {
    setFormData((prev) => ({
      ...prev,
      model: model,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {recordData ? "Edit Call" : "Quick New Call"}
      </h1>

      <div className="bg-white rounded-sm shadow-md p-6">
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">
                *Truck
              </label>
              <ButtonGroup
                name="truck"
                options={["Flatbed", "Toggle", "Wheel-lift"]}
                value={formData.truck}
                onChange={(value) => handleButtonGroupChange("truck", value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">
                *Call Type
              </label>
              <ButtonGroup
                name="callType"
                options={["Police Call", "Private Property", "Tow & Hook"]}
                value={formData.callType}
                onChange={(value) => handleButtonGroupChange("callType", value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">
                *Size
              </label>
              <ButtonGroup
                name="size"
                options={["Light Duty", "Medium Duty", "Heavy Duty"]}
                value={formData.size}
                onChange={(value) => handleButtonGroupChange("size", value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-700">
                  Account *
                </label>
                <SelectAccountName
                  className="w-[100%]  "
                  label="Account Name"
                  title="master.account"
                  size="full"
                />
              </div>

              <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-700">
                  Pick up from *
                </label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="pickupFrom"
                    name="pickupFrom"
                    value={formData.pickupFrom}
                    onChange={handleInputChange}
                    className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-xs"
                    // required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => {
                      /* Add location lookup */
                    }}
                  >
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-24 text-sm font-medium text-gray-700">
                  Destination
                </label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-xs"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => {
                      /* Add location lookup */
                    }}
                  >
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Vehicle Information</h2>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    License Plate
                  </label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <Select
                    value={
                      formData.state
                        ? {
                            value: formData.state,
                            label: getStateOptions().find(
                              (option) => option.value === formData.state
                            )?.label,
                          }
                        : null
                    }
                    onChange={handleStateSelectChange}
                    options={getStateOptions()}
                    isClearable
                    className="mt-0 h-6"
                    classNamePrefix="react-select"
                    placeholder="Select State..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <Select
                    value={
                      formData.year
                        ? {
                            value: formData.year,
                            label: formData.year,
                          }
                        : null
                    }
                    onChange={handleYearSelectChange}
                    options={getYearOptions()}
                    isClearable
                    className="mt-1"
                    classNamePrefix="react-select"
                    placeholder="Select Year..."
                  />
                </div>
                <div>
                  <CarMake
                    className="h-15 w-full min-w-[170px] text-[14px]"
                    label="Make"
                    placeholder="Select ..."
                    title="master.makecar"
                    value={formData.makecar || ""}
                    onChange={(value) => carMakeHandler(value)}
                    // onChange={(value) => carMakeHandler( value )}
                    size="full"
                    // onKeyDown={(e: any) => handleKeyDown(e, "makecar")}
                    // ref={inputRefs.makecar}
                    setCarMakeId={setCarMakeId}
                  />
                </div>
                <CarMakeModels
                  className="h-15 w-full min-w-[170px]  text-[14px]"
                  label="Model"
                  title="master.modelcar"
                  carMakeId={carMakeId}
                  value={formData.model}
                  onChange={(value) => carMakeModel(value)}
                  size="full"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <ColorSelect
                    value={formData.color || ""}
                    onChange={(value) => colorChangeHandler(value)}
                    size="full"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Driver
                </label>
                <Select
                  onChange={handleDriverSelectChange}
                  options={drivers}
                  isClearable
                  className="mt-1"
                  classNamePrefix="react-select"
                  placeholder="Select Driver..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Truck
                </label>
                <Select
                  value={
                    formData.truckAssigned
                      ? {
                          value: formData.truckAssigned,
                          label: formData.truckAssigned,
                        }
                      : null
                  }
                  onChange={handleTruckSelectChange}
                  options={trucks}
                  isClearable
                  className="mt-1"
                  classNamePrefix="react-select"
                  placeholder="Select Truck..."
                />
              </div>
            </div>
          </div>

          <div
            ref={mapRef}
            className="w-full h-[400px] rounded-sm overflow-hidden"
          />

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              //   onClick={() => navigate("/dispatch")}
              className="bg-[#002B7F] text-white px-4 py-2 rounded-md hover:bg-[#002B7F] transition"
              disabled={isSubmitting}
            >
              {recordData ? "Update Call" : "Create Call"}
            </button>
            <button className="bg-[#002B7F] text-white px-4 py-2 rounded-md hover:bg-[#002B7F] transition">
              Save and Dispatch Call
            </button>
            <button
              type="button"
              onClick={() => navigate("/dispatch")}
              className="px-6 py-2 bg-gray-500 text-white rounded-md text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewQuickPage;
