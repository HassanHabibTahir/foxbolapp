import type React from "react"

import { useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { Upload, Save, ArrowLeft, X } from "lucide-react"
import toast from "react-hot-toast"
import { supabase } from "../lib/supabase"

export default function AddNewTrucks() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null])
  const [images, setImages] = useState<{ url: string | null; path: string | null }[]>([
    { url: null, path: null },
    { url: null, path: null },
    { url: null, path: null },
  ])

  // Image library state
  const [selectedFolder, setSelectedFolder] = useState<string>("flat_bed_icons")
  const [subfolders, setSubfolders] = useState<string[]>([
    "blue_flat_bed",
    "flat_bed_icons",
    "heavy_duty_wrecker",
    "medium_truck",
    "others",
    "wrecker_truck",
  ])
  const [imagesByFolder, setImagesByFolder] = useState<Record<string, string[]>>({})
  const [showImageLibrary, setShowImageLibrary] = useState(false)

  // Form fields
  const [truckNumber, setTruckNumber] = useState("");
  const [driverNum,setDriverNum]=useState("");
  const [truckName, setTruckName] = useState("")
  const [driverName, setDriverName] = useState("")
  const [manufacturer, setManufacturer] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [vin, setVin] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [truckType, setTruckType] = useState("")
  const [duty, setDuty] = useState("")
  const [expiration, setExpiration] = useState("")
  const [isActive, setIsActive] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const foxtow_id = typeof window !== "undefined" ? localStorage.getItem("foxtow_id") : null

  // Fetch images from library when component mounts
  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    const folderImages: Record<string, string[]> = {}
    for (const folder of subfolders) {
      const { data, error } = await supabase.storage.from("trucksvgs").list(`alltrucks/${folder}`, { limit: 100 })
      if (error) {
        console.error(`Error fetching images from ${folder}:`, error)
        continue
      }
      const svgFiles = data.filter((file) => file.name.endsWith(".svg"))
      const urls = svgFiles.map(
        (file) => supabase.storage.from("trucksvgs").getPublicUrl(`alltrucks/${folder}/${file.name}`).data.publicUrl,
      )
      folderImages[folder] = urls
    }
    setImagesByFolder(folderImages)
  }

  const toggleImageLibrary = () => {
    setShowImageLibrary((prev) => !prev)
  }

  const selectImageFromLibrary = (imageUrl: string) => {
    // Find the first empty slot
    const emptySlotIndex = images.findIndex((img) => !img?.url)

    // If an empty slot exists, use it
    if (emptySlotIndex !== -1) {
      const updatedImages = [...images]
      updatedImages[emptySlotIndex] = {
        url: imageUrl,
        path: imageUrl.split("trucksvgs/")[1] || "",
      }
      setImages(updatedImages)
      toast.success("Image added to empty slot")
    } else {
      // If no empty slots, show a message
      toast.error("No empty slots available. Delete an image first.")
    }

    setShowImageLibrary(false)
  }

  const uploadImages = async (): Promise<{ urls: string[] }> => {
    const uploadedUrls: string[] = []

    // Collect all images - both uploaded files and library selections
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      const file = imageFiles[i]
      if (!image?.url) {
        uploadedUrls.push("")
        continue
      }
      if (image.path && !file) {
        uploadedUrls.push(image.url)
        continue
      }
      if (file) {
        setIsUploading(true)
        try {
          const fileExt = file.name.split(".").pop()
          const fileName = `truck-${Math.random().toString(36).substring(2)}-${Date.now()}-${i}.${fileExt}`
          const filePath = `truck-images/${fileName}`
          const { data, error } = await supabase.storage.from("trucksvgs").upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          })
          if (error) {
            console.error(`Error uploading file ${i}:`, error)
            uploadedUrls.push("")
            continue
          }
          const { data: urlData } = supabase.storage.from("trucksvgs").getPublicUrl(filePath)
          uploadedUrls.push(urlData.publicUrl)
        } catch (error) {
          console.error(`Error uploading file ${i}:`, error)
          uploadedUrls.push("")
        }
      }
    }

    setIsUploading(false)
    return { urls: uploadedUrls.filter(Boolean) as string[] }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length > 0) {
      const newImageFiles = [...imageFiles]
      const updatedImages = [...images]
      for (let i = 0; i < Math.min(files.length, 3); i++) {
        const file = files[i]
        const imageUrl = URL.createObjectURL(file)
        let slotIndex = newImageFiles.findIndex((img) => img === null)
        if (slotIndex === -1) slotIndex = i % 3
        if (updatedImages[slotIndex]?.url && updatedImages[slotIndex].url?.startsWith("blob:")) {
          URL.revokeObjectURL(updatedImages[slotIndex].url as string)
        }
        updatedImages[slotIndex] = { url: imageUrl, path: null }
        newImageFiles[slotIndex] = file
      }
      setImages(updatedImages)
      setImageFiles(newImageFiles)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault()
    fileInputRef.current?.click()
  }

  const clearImage = (index: number) => {
    const updatedImages = [...images]
    const updatedImageFiles = [...imageFiles]
    if (updatedImages[index]?.url && updatedImages[index].url?.startsWith("blob:")) {
      URL.revokeObjectURL(updatedImages[index].url as string)
    }
    updatedImages[index] = { url: null, path: null }
    updatedImageFiles[index] = null
    setImages(updatedImages)
    setImageFiles(updatedImageFiles)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!truckNumber) {
      toast.error("Truck number is required")
      return
    }

    const loadingToast = toast.loading("Creating truck...")
    setIsLoading(true)

    try {
      const { urls: uploadedUrls } = await uploadImages()
     
      const { error } = await supabase.from("drivers").insert({
        driver_num:driverNum,
        def_truckn: truckNumber,
        foxtow_id: foxtow_id,
        truck_name: truckName,
        truck_type: truckType,
        duty: duty,
        driver_nam:driverName,
        driver_fir:driverName,
        vin: vin,
        driver_lic: licenseNumber,
        t_make: manufacturer,
        t_model: model,
        m_year: year,
        expiration_date: expiration||null,
        svg_urls: uploadedUrls,
        driver_ond: isActive, 
        creationda: new Date().toISOString(),
      })
      // const { error:trucksError } = await supabase.from("trucks").insert({
      //   trucknum:truckNumber,
      //   created_at: new Date().toISOString(),
      //   foxtow_id: foxtow_id,
      // })
 
      if (error) throw error
      // if (trucksError) throw trucksError

      toast.dismiss(loadingToast)
      toast.success("Truck created successfully")
      navigate("/trucks")
    } catch (error:any) {
      console.error("Error creating truck:", error)
      toast.dismiss(loadingToast)
      toast.error(error?.data?.message||error?.details ||error ?.message||"Failed to save truck information");
    } finally {
      setIsLoading(false)
    }
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img?.url && img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url)
        }
      })
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate("/trucks")} className="mr-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Add New Truck</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow overflow-hidden rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Truck Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* driver_num */}

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver # <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={driverNum}
                onChange={(e) => setDriverNum(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Truck # <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={truckNumber}
                onChange={(e) => setTruckNumber(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Duty</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={truckName}
                onChange={(e) => setTruckName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
              <input
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate #</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 hover:shadow-lg"
              >
                <option value="">Select Year</option>
                {Array.from(
                  { length: new Date().getFullYear() - 2000 + 1 },
                  (_, i) => new Date().getFullYear() - i,
                ).map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
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
              <span className="text-sm font-medium text-gray-700">Active Driver</span>
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
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <p>Main image</p>
                </div>
              )}
            </div>

            <div className="flex flex-row md:flex-col gap-4">
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
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 text-xs">
                    <p>Image 2</p>
                  </div>
                )}
              </div>

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
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      <X className="w-2 h-2" />
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
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            multiple
          />

          {/* Upload buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={isUploading}
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
            disabled={isLoading || isUploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isLoading ? "Saving..." : "Save Truck"}
          </button>
        </div>
      </form>

      {/* Image Library Modal */}
      {showImageLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select Image from Library</h2>
              <button onClick={() => setShowImageLibrary(false)} className="text-gray-500 hover:text-gray-700">
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
                      selectedFolder === folder ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {folder?.replace(/_/g, " ").charAt(0).toUpperCase() + folder.replace(/_/g, " ").slice(1)}
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
                  <div className="col-span-full text-center py-8 text-gray-500">No images found in this folder</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

