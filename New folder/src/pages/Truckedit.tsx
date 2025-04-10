import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { X, Upload, Save, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function TruckEditPage() {
  const [truck, setTruck] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingIndexes, setDeletingIndexes] = useState<number[]>([]);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const [images, setImages] = useState<any[]>([]);
  const { id } = useParams();
  const [selectedFolder, setSelectedFolder] =
    useState<string>("flat_bed_icons");
  const [subfolders, setSubfolders] = useState<string[]>([
    "blue_flat_bed",
    "flat_bed_icons",
    "heavy_duty_wrecker",
    "medium_truck",
    "others",
    "wrecker_truck",
  ]);
  const [imagesByFolder, setImagesByFolder] = useState<
    Record<string, string[]>
  >({});
  const [showImageLibrary, setShowImageLibrary] = useState(false);

  // Form fields
  const [truckName, setTruckName] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [vin, setVin] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [truckType, setTruckType] = useState("");
  const [duty, setDuty] = useState("");
  const [expiration, setExpiration] = useState("");
  const [year, setYear] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const foxtow_id =
    typeof window !== "undefined" ? localStorage.getItem("foxtow_id") : null;

  useEffect(() => {
    if (id && foxtow_id) {
      fetchTruckDetails(id);
    }
  }, [id, foxtow_id]);

  const fetchTruckDetails = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("id", id)
        .eq("foxtow_id", foxtow_id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setTruck(data);

        // Set form fields
        setTruckName(data.truck_name || "");
        setTruckNumber(data.def_truckn || "");
        setDriverName(
          data?.driver_nam
            ? data?.driver_nam
            : `  ${data.driver_fir || ""} ${data.driver_las || ""}`
        );
        setVin(data.vin || "");
        setLicenseNumber(data.driver_lic || "");
        setTruckType(data.truck_type || "");
        setDuty(data.duty || "");
        setExpiration(data.expiration_date || "");
        setIsActive(data.driver_ond || false);
        setModel(data.t_model || "");
        setManufacturer(data.t_make || "");
        setYear(data.m_year || "");
        // Set images
        if (data.svg_urls && Array.isArray(data.svg_urls)) {
          const formattedImages = data.svg_urls.map((url: string) => ({
            url,
            path: url.split("trucksvgs/")[1] || "",
          }));
          const paddedImages = [...formattedImages];
          while (paddedImages.length < 3) {
            paddedImages.push({ url: null, path: null });
          }

          setImages(paddedImages.slice(0, 3));
        } else {
          setImages([
            { url: null, path: null },
            { url: null, path: null },
            { url: null, path: null },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching truck details:", error);
      toast.error("Failed to load truck details");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImages = async (): Promise<{ urls: string[] }> => {
    const uploadedUrls: string[] = [];

    if (!imageFiles.some((file) => file !== null)) {
      return { urls: [] };
    }

    setIsUploading(true);

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (!file) {
          uploadedUrls.push("");
          continue;
        }
        const fileExt = file.name.split(".").pop();
        const fileName = `truck-${
          truck?.id || "unknown"
        }-${Date.now()}-${i}.${fileExt}`;
        const filePath = `truck-images/${fileName}`;

        const { data, error } = await supabase.storage
          .from("trucksvgs")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          });
        if (error) {
          console.error(`Error uploading file ${i}:`, error);
          uploadedUrls.push("");
          continue;
        }
        const { data: urlData } = supabase.storage
          .from("trucksvgs")
          .getPublicUrl(filePath);
        uploadedUrls[i] = urlData.publicUrl;
      }

      return { urls: uploadedUrls.filter(Boolean) as string[] };
    } catch (error) {
      console.error("Error in uploadImages:", error);
      return { urls: [] };
    } finally {
      setIsUploading(false);
      setImageFiles([null, null, null]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emptySlotIndex = images.findIndex((img) => !img?.url);
    if (emptySlotIndex !== -1) {
      const files = Array.from(e.target.files || []);

      if (files.length > 0) {
        const newImageFiles = [...imageFiles];
        const updatedImages = [...images];

        // Find empty slots or replace existing images
        for (let i = 0; i < Math.min(files.length, 3); i++) {
          const file = files[i];
          const imageUrl = URL.createObjectURL(file);

          // Find the first empty slot or use index 0 if all slots are filled
          let slotIndex = updatedImages.findIndex((img) => !img?.url);
          if (slotIndex === -1) slotIndex = i % 3;

          updatedImages[slotIndex] = { url: imageUrl, path: null };
          newImageFiles[slotIndex] = file;
        }

        setImages(updatedImages);
        setImageFiles(newImageFiles);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      toast.error("No empty slots available. Delete an image first.");
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const deleteImageFromStorage = async (path: string): Promise<boolean> => {
    if (!path) return false;

    try {
      const { error } = await supabase.storage.from("trucksvgs").remove([path]);

      if (error) {
        console.error("Error deleting file from storage:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteImageFromStorage:", error);
      return false;
    }
  };

  const clearImage = async (index: number) => {
    // Add this index to the deleting indices
    setDeletingIndexes((prev) => [...prev, index]);

    try {
      const imageToDelete = images[index];
      if (imageToDelete?.path) {
        await deleteImageFromStorage(imageToDelete.path);
      }

      const updatedImages = [...images];
      updatedImages[index] = { url: null, path: null };

      const updatedImageFiles = [...imageFiles];
      updatedImageFiles[index] = null;

      if (truck?.id) {
        const currentUrls = truck.svg_urls || [];
        const updatedUrls = currentUrls.filter(
          (url: any) => url !== imageToDelete?.url
        );

        const { error } = await supabase
          .from("drivers")
          .update({ svg_urls: updatedUrls })
          .eq("id", truck.id)
          .eq("foxtow_id", foxtow_id);
        if (error) {
          console.error("Error updating database after image deletion:", error);
          toast.error("Failed to update database after deleting image");
          setDeletingIndexes((prev) => prev.filter((i) => i !== index));
          return;
        }
      }

      // Revoke object URL if it was a blob URL (newly uploaded image)
      if (imageToDelete?.url && imageToDelete.url.startsWith("blob:")) {
        URL.revokeObjectURL(imageToDelete.url);
      }

      // Update state
      setImages(updatedImages);
      setImageFiles(updatedImageFiles);
      toast.success("Image removed successfully");

      // Refresh truck data
      if (truck?.id) {
        fetchTruckDetails(truck.id);
      }
    } catch (error) {
      console.error("Error in clearImage:", error);
      toast.error("Failed to remove image");
    } finally {
      // Remove this index from deleting indices
      setDeletingIndexes((prev) => prev.filter((i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!truck) return;

    const loadingToast = toast.loading("Saving truck information...");
    setIsSaving(true);

    try {
      const { urls: uploadedUrls } = await uploadImages();

      const existingImageUrls = images
        .filter((img) => img?.url)
        .map((img) => img.url)
        .filter((url) => url && !url.startsWith("blob:"));

      const finalUrls = [...existingImageUrls];

      if (uploadedUrls.length > 0) {
        finalUrls.push(...uploadedUrls);
      }

      // Extract first and last name from driver name
      const nameParts = driverName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const { error } = await supabase
        .from("drivers")
        .update({
          truck_name: truckName,
          def_truckn: truckNumber,
          driver_fir: firstName,
          driver_las: lastName,
          driver_nam: firstName + " " + lastName,
          vin: vin,
          driver_lic: licenseNumber,
          truck_type: truckType,
          duty: duty,
          t_model: model,
          m_year: year,
          t_make: manufacturer,
          expiration_date: expiration || null,
          driver_ond: isActive,
          svg_urls: finalUrls,
        })
        .eq("id", truck.id)
        .eq("foxtow_id", foxtow_id);

      const { error: trucksError } = await supabase
        .from("trucks")
        .update({
          trucknum: truckNumber,
          created_at: new Date().toISOString(),
        })
        .eq("id", truck.id)
        .eq("foxtow_id", foxtow_id);

      toast.dismiss(loadingToast);
      if (error) throw error;
      // console.log(error,"error");
      toast.success("Truck information saved successfully");
      navigate("/trucks");
    } catch (error: any) {
      console.error("Error updating truck:", error);
      toast.dismiss(loadingToast);
      toast.error(error?.data?.message||error?.details ||error ?.message||"Failed to save truck information");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img?.url && img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, []);

  const toggleImageLibrary = () => {
    setShowImageLibrary((prev) => !prev);
  };

  const selectImageFromLibrary = (imageUrl: string) => {
    // Find the first empty slot
    const emptySlotIndex = images.findIndex((img) => !img?.url);

    // If an empty slot exists, use it
    if (emptySlotIndex !== -1) {
      const updatedImages = [...images];
      updatedImages[emptySlotIndex] = {
        url: imageUrl,
        path: imageUrl.split("trucksvgs/")[1] || "",
      };
      setImages(updatedImages);
      toast.success("Image added to empty slot");
    } else {
      // If no empty slots, show a message
      toast.error("No empty slots available. Delete an image first.");
    }

    setShowImageLibrary(false);
  };

  const fetchImages = async () => {
    const folderImages: Record<string, string[]> = {};
    for (const folder of subfolders) {
      const { data, error } = await supabase.storage
        .from("trucksvgs")
        .list(`alltrucks/${folder}`, { limit: 100 });
      if (error) {
        console.error(`Error fetching images from ${folder}:`, error);
        continue;
      }
      // Filter only SVG files
      const svgFiles = data.filter((file) => file.name.endsWith(".svg"));
      // Get public URLs
      const urls = svgFiles.map(
        (file) =>
          supabase.storage
            .from("trucksvgs")
            .getPublicUrl(`alltrucks/${folder}/${file.name}`).data.publicUrl
      );
      folderImages[folder] = urls;
    }
    setImagesByFolder(folderImages);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className=" px-8">
        <div className="w-full overflow-x-auto">
          <div className="flex space-x-1">
            {[
              { key: "general", label: "General" },
              { key: "insurance", label: "Insurance" },
              { key: "expenses", label: "Expenses" },
              { key: "odometer", label: "Odometer" },
              { key: "files", label: "Files" },
              { key: "notes", label: "Notes" },
              { key: "maintenance-schedule", label: "Schedule" },
              { key: "maintenance-history", label: "History" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-all duration-300
            ${
              activeTab === tab.key
                ? "bg-blue-500 text-white shadow-md"
                : " text-gray-700 hover:bg-blue-200 hover:text-blue-800"
            }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={activeTab === "general" ? "block" : "hidden"}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate("/trucks")}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Edit Truck</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white shadow overflow-hidden rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Truck Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={truckName}
                    onChange={(e) => setTruckName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={truckType}
                    onChange={(e) => setTruckType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
                  >
                    <option value="">Select Type</option>
                    <option value="truck">Unspecified</option>
                    <option value="wrecker">Wrecker</option>
                    <option value="flatbed">Flatbed</option>
                    <option value="other">Other</option>
                    <option value="servicevehicle">ServiceVehicle</option>
                    <option value="rotater">Rotater</option>
                    <option value="tractor">Tractor</option>
                    <option value="trailer">Trailer</option>
                    <option value="container">Container</option>
                    <option value="hazmat">Hazmat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duty
                  </label>
                  <select
                    value={duty}
                    onChange={(e) => setDuty(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
                  >
                    <option value="">Select Duty</option>
                    <option value="unspecified">Unspecified</option>
                    <option value="medium">Medium</option>
                    <option value="heavy">Heavy</option>
                    <option value="other">Other</option>
                    <option value="light">Light</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Truck #
                  </label>
                  <input
                    type="text"
                    value={truckNumber}
                    onChange={(e) => setTruckNumber(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VIN
                  </label>
                  <input
                    type="text"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Plate #
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
                  >
                    <option value="">Select Year</option>
                    {Array.from(
                      { length: new Date().getFullYear() - 2000 + 1 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={expiration}
                    onChange={(e) => setExpiration(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all relative before:absolute before:left-1 before:top-1 before:h-3 before:w-3 before:rounded-full before:bg-white before:transition-all peer-checked:before:translate-x-5"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-700">
                    Active Driver
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Truck Images</h2>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Larger box on the left */}
                <div className="border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center h-48 w-48 aspect-square">
                  {images[0]?.url ? (
                    <div className="relative w-full h-full">
                      <img
                        src={images[0].url || "/placeholder.svg"}
                        alt="First truck image"
                        className="object-contain w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => clearImage(0)}
                        disabled={deletingIndexes.includes(0)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        {deletingIndexes.includes(0) ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "×"
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <p>Main image</p>
                    </div>
                  )}
                </div>

                {/* Two smaller boxes on the right, stacked vertically */}
                <div className="flex flex-row md:flex-col gap-4">
                  {/* Top small box */}
                  <div className="border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center h-24 w-24 aspect-square">
                    {images[1]?.url ? (
                      <div className="relative w-full h-full">
                        <img
                          src={images[1].url || "/placeholder.svg"}
                          alt="Second truck image"
                          className="object-contain w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() => clearImage(1)}
                          disabled={deletingIndexes.includes(1)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          {deletingIndexes.includes(1) ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "×"
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 text-xs">
                        <p>Image 2</p>
                      </div>
                    )}
                  </div>

                  {/* Bottom small box */}
                  <div className="border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center h-24 w-24 aspect-square">
                    {images[2]?.url ? (
                      <div className="relative w-full h-full">
                        <img
                          src={images[2].url || "/placeholder.svg"}
                          alt="Third truck image"
                          className="object-contain w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() => clearImage(2)}
                          disabled={deletingIndexes.includes(2)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          {deletingIndexes.includes(2) ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "×"
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 text-xs">
                        <p>Image 3</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e)}
                className="hidden"
                accept="image/*"
                multiple
              />

              {/* Upload buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={(e) => handleUploadClick(e)}
                  disabled={isUploading || deletingIndexes.length > 0}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded flex items-center gap-2 disabled:bg-gray-400"
                >
                  <Upload size={16} />
                  {isUploading ? "Uploading..." : "Upload Images"}
                </button>
                <button
                  type="button"
                  onClick={toggleImageLibrary}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded flex items-center gap-2"
                >
                  Select from Library
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => navigate("/trucks")}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploading || deletingIndexes.length > 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          {/* Image Library Modal */}
          {showImageLibrary && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Select Image from Library
                  </h2>
                  <button
                    onClick={() => setShowImageLibrary(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {subfolders?.map((folder) => (
                      <button
                        key={folder}
                        onClick={() => setSelectedFolder(folder)}
                        className={`px-3 py-1 text-sm rounded ${
                          selectedFolder === folder
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {folder?.replace(/_/g, " ").charAt(0).toUpperCase() +
                          folder.replace(/_/g, " ").slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {imagesByFolder[selectedFolder]?.map((imageUrl, idx) => (
                      <div
                        key={idx}
                        className="border rounded p-2 cursor-pointer hover:border-blue-500"
                        onClick={() => selectImageFromLibrary(imageUrl)}
                      >
                        <img
                          src={imageUrl || "/placeholder.svg"}
                          alt={`Library image ${idx}`}
                          className="w-full h-24 object-contain"
                        />
                      </div>
                    ))}
                    {!imagesByFolder[selectedFolder]?.length && (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        No images found in this folder
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={activeTab === "insurance" ? "block" : "hidden"}>
        <div className="bg-white shadow overflow-hidden rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Insurance Information</h2>
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">
              Insurance information will be added here
            </p>
          </div>
        </div>
      </div>

      {/* Expenses Tab Content */}
      <div className={activeTab === "expenses" ? "block" : "hidden"}>
        <div className="bg-white shadow overflow-hidden rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Expenses</h2>
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Expense tracking will be added here</p>
          </div>
        </div>
      </div>

      {/* Odometer Log Tab Content */}
      <div className={activeTab === "odometer" ? "block" : "hidden"}>
        <div className="bg-white shadow overflow-hidden rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Odometer Log</h2>
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Odometer log will be added here</p>
          </div>
        </div>
      </div>

      {/* Files Tab Content */}
      <div className={activeTab === "files" ? "block" : "hidden"}>
        <div className="bg-white shadow overflow-hidden rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Files</h2>
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">File management will be added here</p>
          </div>
        </div>
      </div>

      {/* Notes Tab Content */}
      <div className={activeTab === "notes" ? "block" : "hidden"}>
        <div className="bg-white shadow overflow-hidden rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Notes</h2>
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Notes will be added here</p>
          </div>
        </div>
      </div>

      {/* Maintenance Schedule Tab Content */}
      <div
        className={activeTab === "maintenance-schedule" ? "block" : "hidden"}
      >
        <div className="bg-white shadow overflow-hidden rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Maintenance Schedule</h2>
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">
              Maintenance schedule will be added here
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance History Tab Content */}
      <div className={activeTab === "maintenance-history" ? "block" : "hidden"}>
        <div className="bg-white shadow overflow-hidden rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Maintenance History</h2>
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">
              Maintenance history will be added here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
