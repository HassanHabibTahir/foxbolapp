"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { MapPin, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "@googlemaps/js-api-loader";
import Select from "react-select";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import SelectAccountName from "../components/common/accountNameSelect";
import CarMake from "../components/common/CarMake";
import CarMakeModels from "../components/common/CarModels";
import StateSelect from "../components/common/StateSelect";
import ColorSelect from "../components/common/ColorSelect";
import getVehicleInfoByVIN from "../lib/services/vin";
import PrioritySelect from "../components/common/prioritySelect";
import YearSlects from "../components/common/YearSelect";

interface FormData {
  callname: string;
  truck: string;
  // callType: string
  size: string;
  pickupFrom: string;
  destination: string;
  licensePlate: string;
  state: string;
  year: string;
  model: string;
  // color: string;
  driver: any;
  truckAssigned: string;
  makecar: any;
  account?: any;
  callphone?: any;
  reason?: any;
  priority?: any;
  vin?: any;
  callremark?: any;
  whocalled?: any;
  towedto?: string;
  towedfrom?: string;
  colorcar?: string;
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
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    callname: "",
    whocalled: "",
    // --
    callphone: "",
    reason: "",
    priority: 1,
    truck: "",
    colorcar: "",
    vin: "",
    callremark: "",
    size: "",
    pickupFrom: "",
    destination: "",
    licensePlate: "",
    state: "",
    year: "",
    model: "",
    // color: "",
    driver: "",
    truckAssigned: "",
    makecar: "",
    towedto: "",
    towedfrom: "",
  });

  const FIELD_INDEXES: any = {
    callname: 0,
    whocalled: 1,
    callphone: 2,
    reason: 3,
    priority: 4,
    towedfrom: 5,
    towedto: 6,
    callremark: 7,
    licensePlate: 8,
    colorcar: 9,
    vin: 10,
    year: 11,
    makecar: 12,
    model: 13,
    state: 14,
  };
  const fieldOrder = Object.keys(FIELD_INDEXES);
  const callnameRef = useRef(null);
  const whocalledRef = useRef(null);
  const callphoneRef = useRef(null);
  const reasonRef = useRef(null);
  const priorityRef = useRef(null);
  const towedfromRef = useRef(null);
  const towedtoRef = useRef(null);
  const callremarkRef = useRef(null);
  const licensePlateRef = useRef(null);
  const colorcarRef = useRef(null);
  const vinRef = useRef(null);
  const yearRef = useRef(null);
  const makecarRef = useRef(null);
  const modelRef = useRef(null);
  const stateRef = useRef(null);
  const inputRefs: any = {
    callname: callnameRef,
    whocalled: whocalledRef,
    callphone: callphoneRef,
    reason: reasonRef,
    priority: priorityRef,
    towedfrom: towedfromRef,
    towedto: towedtoRef,
    callremark: callremarkRef,
    licensePlate: licensePlateRef,
    colorcar: colorcarRef,
    vin: vinRef,
    year: yearRef,
    makecar: makecarRef,
    model: modelRef,
    state: stateRef,
  };
  // Load record data if editing
  useEffect(() => {
    if (recordData) {
      setFormData((prev) => ({
        ...prev,
        callname: recordData.towmast.callname || "",
        pickupFrom: recordData.towmast.location || "",
        destination: recordData.towmast.destination || "",
        licensePlate: recordData.towmast.licensenum || "",
        state: recordData.towmast.regstate || "",
        year: recordData.towmast.yearcar || "",
        makecar: recordData.towmast.makecar || "",
        model: recordData.towmast.modelcar || "",
        colorcar: recordData.towmast.colorcar || "",
        driver: recordData.driver || "",
        truckAssigned: recordData.trucknum || "",
        truck: recordData.towmast.truck_type || "",
        callphone: recordData?.towmast?.callphone || "",
        reason: recordData?.towmast?.reason || "",
        priority: recordData?.towmast?.priority || "",
        callremark: recordData?.towmast?.callremark || "",
        vin: recordData?.towmast?.vin || "",
        whocalled: recordData?.towmast?.whocalled || "",
        towedto: recordData?.towmast?.towedto || "",
        towedfrom: recordData?.towmast?.towedfrom || "",

        // callType: recordData.towmast.calltype || "",
        // size: recordData.towmast.size || "",
      }));
    }
  }, [recordData]);

  console.log(recordData, "recordData");
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
        if (!mapRef.current) return;

        const newMap = new google.maps.Map(mapRef.current, {
          center: { lat: 34.0522, lng: -118.2437 },
          zoom: 14,
        });
        setMap(newMap);
        setGeocoder(new google.maps.Geocoder());

        // Initialize autocomplete for pickup and destination
        // const pickupInput = document.getElementById("pickupFrom") as HTMLInputElement
        // const destinationInput = document.getElementById("destination") as HTMLInputElement

        // if (pickupInput && destinationInput) {
        //   const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput)
        //   const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput)

        //   pickupAutocomplete.addListener("place_changed", () => {
        //     const place = pickupAutocomplete.getPlace()
        //     if (place.geometry?.location) {
        //       setFormData((prev) => ({
        //         ...prev,
        //         pickupFrom: place.formatted_address || "",
        //       }))
        //       updatePickupMarker(place.geometry.location)
        //     }
        //   })

        //   destinationAutocomplete.addListener("place_changed", () => {
        //     const place = destinationAutocomplete.getPlace()
        //     if (place.geometry?.location) {
        //       setFormData((prev) => ({
        //         ...prev,
        //         destination: place.formatted_address || "",
        //       }))
        //       updateDestinationMarker(place.geometry.location)
        //     }
        //   })
        // }
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
  const priortyOptions = () => {
    return Array.from({ length: 17 }, (_, i) => {
      return {
        value: i + 1,
        label: i + 1,
      };
    });
  };
  console.log(priortyOptions(), "priortyOptions");

  const handleYearSelectChange = (selectedOption: any) => {
    setFormData((prev) => ({
      ...prev,
      year: selectedOption || "",
    }));
  };
  const handlePrioritySelectChange = (selectedOption: any) => {
    console.log(selectedOption, "selected Option");
    setFormData((prev) => ({
      ...prev,
      priority: selectedOption?.value || "",
    }));
  };
  // const handleButtonGroupChange = (group: "truck" | "callType" | "size", value: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [group]: value,
  //   }))
  // }

  const handleSubmit = async (e: React.FormEvent, dispatch = false) => {
    e.preventDefault();
    if (!formData?.priority) {
      return toast.error(
        "Kindly ensure the first priority is set before continuing."
      );
    }

    if (isSubmitting) return;

    const loadingToast = toast.loading("Saving call details...");
    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();
      const nowDate = new Date(now);
      const timeInRoute = `${nowDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${nowDate.getMinutes().toString().padStart(2, "0")}`;
      console.log(timeInRoute, "timeInRoute");
      // // Fetch the last dispatch number
      const { data: lastDispNumData, error: lastDispNumError } = await supabase
        .from("towmast")
        .select("dispnum")
        .order("dispnum", { ascending: false })
        .limit(1)
        .single();

      if (lastDispNumError && lastDispNumError.code !== "PGRST116") {
        throw lastDispNumError;
      }
      // Determine the next dispatch number
      const lastDispnum = lastDispNumData
        ? Number.parseInt(lastDispNumData.dispnum)
        : 100000;
      const newDispnum = lastDispnum + 1;

      // // Prepare common data for insertion/update
      const commonTowMastData = {
        foxtow_id: foxtow_id ?? "",
        callname: formData?.callname ?? "",
        makecar: formData?.makecar ?? "",
        yearcar: formData?.year ?? "",
        modelcar: formData?.model ?? "",
        colorcar: formData?.colorcar ?? "",
        licensenum: formData?.licensePlate ?? "",
        regstate: formData?.state ?? "",
        callremark: formData?.callremark ?? "",
        callphone: formData?.callphone ?? "",
        reason: formData?.reason ?? "",
        dispatched: false,
        priority: formData?.priority ?? "",
        towedto: formData?.towedto ?? "",
        towedfrom: formData?.towedfrom ?? "",
        whocalled: formData?.whocalled ?? "",
        vin: formData?.vin ?? "",
        zone: 0,
        shown: true,
        // truck_type:formData?.truck??"",
        updated_at: new Date(),
      };

      let dispatchNumber: string;

      if (recordData?.towmast?.dispnum) {
        // Update existing record
        dispatchNumber = recordData.towmast.dispnum;

        const { error: updateError } = await supabase
          .from("towmast")
          .update({
            ...commonTowMastData,
            dispnum: dispatchNumber,
          })
          .eq("dispnum", dispatchNumber)
          .eq("foxtow_id", foxtow_id);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { data: towMastData, error: insertError } = await supabase
          .from("towmast")
          .insert({
            ...commonTowMastData,
            dispnum: newDispnum.toString(),
          })
          .select("dispnum")
          .single();

        if (insertError) throw insertError;

        dispatchNumber = towMastData.dispnum;
      }

      // Check if a record with this dispnumdrv already exists
      const { data: existingTowDrive, error: checkError } = await supabase
        .from("towdrive")
        .select("*")
        .eq("dispnumdrv", dispatchNumber)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      // Insert or update towdrive record
      if (existingTowDrive) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("towdrive")
          .update({
            trucknum: formData?.truckAssigned,
            driver: formData?.driver,
            foxtow_id: foxtow_id,
          })
          .eq("dispnumdrv", dispatchNumber);

        if (updateError) throw updateError;
      } else {
        console.log(timeInRoute, "timeInRoute");
        // Insert new record
        const { error: insertError } = await supabase.from("towdrive").insert({
          trucknum: formData?.truckAssigned,
          driver: formData?.driver,
          foxtow_id: foxtow_id,
          dispnumdrv: dispatchNumber,
          timerec: timeInRoute,
          shown: true,
        });

        if (insertError) throw insertError;
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

  const colorChangeHandler = (color: any) => {
    setFormData((prev) => ({
      ...prev,
      colorcar: color,
    }));
  };

  const carMakeHandler = (make: any) => {
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

  const handleCallName = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      callname: value,
    }));
  };

  const updateStateHandler = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      state: value,
    }));
  };

  const handleLookup = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formData?.vin || formData?.vin >= 17) {
      toast.error("Please enter a valid 17-character VIN");
      return;
    }

    try {
      setLoading(true);
      const vinDetails = await getVehicleInfoByVIN(formData?.vin);
      console.log(vinDetails, "vinDetails");
      const formatText = (text: string) => {
        if (!text) return "";
        return text
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");
      };
      setFormData((prev) => ({
        ...prev,
        year: vinDetails?.year || "",
        makecar: formatText(vinDetails?.make) || "",
        model: formatText(vinDetails?.model) || "",
      }));
    } catch (err) {
      setLoading(false);
      toast.error("Error looking up VIN");
      console.error("VIN lookup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: any, fieldName: string) => {
    const currentIndex = FIELD_INDEXES[fieldName];
    console.log(currentIndex, "currentIndex");
    //  e.key === "ArrowDown"
    if (fieldName === "callremark" && e.key === "Enter") {
      return; // Let textarea handle the Enter key normally (new line)
    }
    if (currentIndex === 7) {
      if (e.key === "Enter") {
        console.log("hassan ");
        e.preventDefault();
        return;
      } else if (e.key === "ArrowRight") {
        const nextIndex = currentIndex + 1;
        if (nextIndex < fieldOrder.length) {
          const nextField = fieldOrder[nextIndex];
          inputRefs[nextField]?.current?.focus();
        }
      }
    }
    if (e.key === "Enter" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = currentIndex + 1;
      if (nextIndex < fieldOrder.length) {
        const nextField = fieldOrder[nextIndex];
        inputRefs[nextField]?.current?.focus();
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        const prevField = fieldOrder[prevIndex];
        inputRefs[prevField]?.current?.focus();
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6">
        {recordData ? (
          <>
            Edit Call -{" "}
            <span className="text-sm">
              {" "}
              (dispatch {recordData.towmast.dispnum ?? ""})
            </span>
          </>
        ) : (
          <>
            Quick Dispatch - <span className="text-sm">(dispatch #)</span>
          </>
        )}
      </h1>

      <div className="bg-white rounded-sm shadow-md p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center pb-4 gap-2">
          <span>This is ... </span>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center border-2 border-black text-black px-3 py-1.5 rounded-md bg-transparent hover:bg-blue-100">
              <span className="mr-2 text-xl">✔</span> New Call
            </button>
            <button className="border-2 border-black text-black px-3 py-1.5 rounded-md bg-transparent hover:bg-green-100">
              Appointment
            </button>
          </div>
        </div>

        <form
          onSubmit={(e) => handleSubmit(e, false)}
          className="space-y-6"
          autoComplete="off"
        >
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="w-24 text-sm font-medium text-gray-700">
                  Account *
                </label>
                <div className="w-full">
                  <SelectAccountName
                    className="w-full"
                    label="Account Name"
                    title="Callname"
                    onChange={(value) => handleCallName(value)}
                    size="full"
                    value={formData?.callname}
                    onKeyDown={(e) => handleKeyDown(e, "callname")}
                    ref={inputRefs.callname}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="w-24 text-sm font-medium text-gray-700">
                  Contact Info
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="text"
                    value={formData?.whocalled}
                    name="whocalled"
                    onChange={handleInputChange}
                    className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-xs"
                    onKeyDown={(e) => handleKeyDown(e, "whocalled")}
                    ref={inputRefs.whocalled}
                  />
                  <input
                    type="text"
                    name="callphone"
                    value={formData?.callphone}
                    placeholder="phone number"
                    onChange={handleInputChange}
                    className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-xs"
                    ref={inputRefs.callphone}
                    onKeyDown={(e) => handleKeyDown(e, "callphone")}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
                  <label className="w-24 text-sm font-medium text-gray-700">
                    Reason
                  </label>
                  <input
                    type="text"
                    name="reason"
                    placeholder="Reason"
                    value={formData?.reason}
                    onChange={handleInputChange}
                    className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-xs"
                    ref={inputRefs.reason}
                    onKeyDown={(e) => handleKeyDown(e, "reason")}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <label className="w-20 text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <PrioritySelect
                    className="w-full md:w-[150px]"
                    // title="master.colorcar"

                    value={formData.priority || ""}
                    onChange={(value) => handlePrioritySelectChange(value)}
                    ref={priorityRef}
                    onKeyDown={(e: any) => handleKeyDown(e, "priority")}
                    size="md"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="w-24 text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    id="pickupFrom"
                    name="towedfrom"
                    value={formData.towedfrom}
                    onChange={handleInputChange}
                    className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-xs"
                    ref={inputRefs.towedfrom}
                    onKeyDown={(e) => handleKeyDown(e, "towedfrom")}
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

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="w-24 text-sm font-medium text-gray-700">
                  Destination
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    id="destination"
                    name="towedto"
                    value={formData.towedto}
                    onChange={handleInputChange}
                    className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-xs"
                    ref={inputRefs.towedto}
                    onKeyDown={(e) => handleKeyDown(e, "towedto")}
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

              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <label className="w-24 text-sm font-medium text-gray-700 pt-2">
                  Notes
                </label>
                <textarea
                  value={formData?.callremark}
                  name="callremark"
                  onChange={(e: any) => handleInputChange(e)}
                  className="h-10 text-[14px] w-full rounded-md border border-gray-300 p-2 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  resize-y min-h-[8rem]"
                  placeholder="Enter notes here..."
                  title="Right-click or Ctrl+Enter to insert current date/time"
                  ref={inputRefs.callremark}
                  onKeyDown={(e) => handleKeyDown(e, "callremark")}
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4 mt-6">Vehicle Details</h2>
              <div className="flex flex-col md:flex-row gap-4">
                {/* First Input - Full Width */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
                  <label className="w-24 text-sm font-medium text-gray-700 whitespace-nowrap">
                    License Plate
                  </label>
                  <input
                    type="text"
                    placeholder="License Plate"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    className="w-full rounded-sm border border-gray-300 bg-white px-4 py-[5px] text-gray-700 shadow-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-xs"
                    ref={licensePlateRef}
                    onKeyDown={(e) => handleKeyDown(e, "licensePlate")}
                  />
                </div>
                <ColorSelect
                  // label="Color"
                  className="w-full md:w-[150px]"
                  // title="master.colorcar"
                  placeholder="Color"
                  value={formData.colorcar || ""}
                  onChange={(value) => colorChangeHandler(value)}
                  ref={colorcarRef}
                  onKeyDown={(e: any) => handleKeyDown(e, "colorcar")}
                  size="md"
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
                  <label className="w-20 text-sm font-medium text-gray-700">
                    VIN
                  </label>
                  <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleInputChange}
                    className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-xs"
                    ref={vinRef}
                    onKeyDown={(e) => handleKeyDown(e, "vin")}
                  />
                  <button
                    type="button"
                    onClick={(e) => handleLookup(e)}
                    // disabled={loading || !formData?.vin || formData?.vin.length >= 17}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md 
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    title="Look up VIN information"
                    aria-label="Look up VIN"
                  >
                    <Search
                      className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full">
                  <div className="w-full lg:w-72 text-sm text-gray-800 whitespace-nowrap">
                    Vehicle
                  </div>
                  <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                    <div className="w-[90%]">
                      <YearSlects
                        //  label="Year"
                        placeholder="Year"
                        className="h-9 text-[14px]"
                        title="master.yearcar"
                        value={formData.year || ""}
                        onChange={handleYearSelectChange}
                        ref={yearRef}
                        onKeyDown={(e: any) => handleKeyDown(e, "year")}
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="w-full">
                      <CarMake
                        className="w-full text-[14px]"
                        placeholder="Select Make"
                        title="master.makecar"
                        value={formData.makecar || ""}
                        onChange={(value) => carMakeHandler(value)}
                        size="full"
                        onKeyDown={(e: any) => handleKeyDown(e, "makecar")}
                        setCarMakeId={setCarMakeId}
                        ref={makecarRef}
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="w-full">
                      <CarMakeModels
                        className="w-full text-[14px]"
                        title="master.model"
                        placeholder="Select Model"
                        carMakeId={carMakeId}
                        value={formData.model}
                        onChange={(value) => carMakeModel(value)}
                        onKeyDown={(e: any) => handleKeyDown(e, "model")}
                        size="full"
                        ref={modelRef}
                      />
                    </div>
                  </div>

                  <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="w-full">
                      <StateSelect
                        className="w-full text-[14px]"
                        title="master.licensest"
                        size="md"
                        value={formData.state || ""}
                        onChange={(value) => updateStateHandler(value)}
                        ref={stateRef}
                        onKeyDown={(e: any) => handleKeyDown(e, "state")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={mapRef}
            className="w-full h-[300px] md:h-[400px] rounded-sm overflow-hidden mt-6"
          />

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              type="submit"
              className="bg-[#002B7F] text-white px-4 py-2 rounded-md hover:bg-[#001f5c] transition"
              disabled={isSubmitting}
            >
              {recordData ? "Update Call" : "Create Call"}
            </button>
            <button
              type="button"
              className="bg-[#002B7F] text-white px-4 py-2 rounded-md hover:bg-[#001f5c] transition"
            >
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
