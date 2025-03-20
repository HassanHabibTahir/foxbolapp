"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { supabase } from "../../lib/supabase"
import Select from "react-select"
import toast from "react-hot-toast"

interface Driver {
  id: string
  driver_fir: string
  driver_las: string
  def_truckn: string
  color?: string
  driver_num: string
  creationda: string
  driver_ond: boolean
}

interface Truck {
  id: string
  trucknum: string
}

interface TruckOption {
  value: string
  label: string
}

interface DriverModalProps {
  isOpen: boolean
  onClose: () => void
  onDriverUpdate: () => void
  fetchActiveDrivers?: any
}

export default function DriverModal({ isOpen, onClose, onDriverUpdate, fetchActiveDrivers }: DriverModalProps) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  // Track both the URL and the file path for each image
  const [images, setImages] = useState<{ url: string | null; path: string | null }[]>([
    { url: null, path: null },
    { url: null, path: null },
    { url: null, path: null },
  ])

  const [isLoading, setIsLoading] = useState(false)
  const foxtow_id = localStorage.getItem("foxtow_id")

  const [activeTab, setActiveTab] = useState("current")
  const [selectedCategory, setSelectedCategory] = useState<any>("")
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      fetchDrivers()
      fetchTrucks()
    }
  }, [isOpen])

  const fetchDrivers = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("drivers")
      .select("id, driver_fir, driver_las, def_truckn, driver_num, creationda, driver_ond")
      .eq("foxtow_id", foxtow_id)
      .order("driver_fir", { ascending: true })

    if (error) {
      console.error("Error fetching drivers:", error)
      toast.error("Failed to fetch drivers")
    } else {
      setDrivers(data || [])
      if (data && data.length > 0) {
        setCurrentDriver(data[0])
        fetchExistingSvgs(data[0]?.id)
      }
    }
    setIsLoading(false)
  }

  const fetchExistingSvgs = async (driverId: string) => {
    // Always reset images when changing drivers
    setImages([
      { url: null, path: null },
      { url: null, path: null },
      { url: null, path: null },
      { url: null, path: null },
    ])

    const { data, error } = await supabase.from("truck_svgs").select("svg_urls, svg_paths").eq("id", driverId).single()

    console.log("Fetched SVGs for driver:", driverId, data)

    if (error) {
      if (error.code !== "PGRST116") {
        console.error("Error fetching SVGs:", error)
      }
      return
    }

    if (data && data.svg_urls && data.svg_urls.length > 0) {
      const svgUrls = data.svg_urls
      const svgPaths = data.svg_paths || Array(svgUrls.length).fill(null)

      const newImages = [
        { url: null, path: null },
        { url: null, path: null },
        { url: null, path: null },
        { url: null, path: null },
      ]

      for (let i = 0; i < Math.min(svgUrls.length, 3); i++) {
        newImages[i] = {
          url: svgUrls[i],
          path: svgPaths[i] || extractPathFromUrl(svgUrls[i]),
        }
      }

      setImages(newImages)
    }
  }

  // Helper function to extract path from URL if path is not stored
  const extractPathFromUrl = (url: string): string | null => {
    if (!url) return null

    try {
      // Extract the path portion from the URL
      // Example: https://example.supabase.co/storage/v1/object/public/trucksvgs/truck-svgs/abc-123.png
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split("/")

      // Find the bucket name and everything after it
      const bucketIndex = pathParts.findIndex((part) => part === "trucksvgs")
      if (bucketIndex !== -1) {
        return pathParts.slice(bucketIndex + 1).join("/")
      }

      return null
    } catch (e) {
      console.error("Error extracting path from URL:", e)
      return null
    }
  }

  const fetchTrucks = async () => {
    const { data, error } = await supabase.from("trucks").select("id, trucknum").eq("foxtow_id", foxtow_id)

    if (error) {
      console.error("Error fetching trucks:", error)
      toast.error("Failed to fetch trucks")
    } else {
      setTrucks(data || [])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentDriver) return
    const { name, value, type, checked } = e.target
    setCurrentDriver((prev) => ({
      ...prev!,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleTruckChange = (selectedOption: TruckOption | null) => {
    if (!currentDriver) return
    setCurrentDriver((prev) => ({
      ...prev!,
      def_truckn: selectedOption?.value || "",
    }))
  }

  const handleNavigate = (direction: "prev" | "next") => {
    const currentIndex = drivers.findIndex((d) => d.id === currentDriver?.id)
    let newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0) newIndex = drivers.length - 1
    if (newIndex >= drivers.length) newIndex = 0

    setCurrentDriver(drivers[newIndex])
    fetchExistingSvgs(drivers[newIndex]?.id)
  }

  const getTruckOptions = (): TruckOption[] => {
    // Create a Set of existing truck numbers
    const existingTruckNums = new Set(trucks.map((truck) => truck.trucknum))

    // Get all options from the trucks table
    const options = trucks.map((truck) => ({
      value: truck.trucknum,
      label: truck.trucknum,
    }))

    // If current driver has a truck and it's not in the list, add it
    if (currentDriver?.def_truckn && !existingTruckNums.has(currentDriver.def_truckn)) {
      options.push({
        value: currentDriver.def_truckn,
        label: `${currentDriver.def_truckn} (Current)`,
      })
    }

    // Sort options alphabetically
    return options.sort((a, b) => a.value.localeCompare(b.value))
  }

  const getCurrentTruckValue = (): TruckOption | null => {
    if (!currentDriver?.def_truckn) return null

    // Check if the current truck exists in the trucks list
    const existingTruckNums = new Set(trucks.map((truck) => truck.trucknum))

    return {
      value: currentDriver.def_truckn,
      label: existingTruckNums.has(currentDriver.def_truckn)
        ? currentDriver.def_truckn
        : `${currentDriver.def_truckn} (Current)`,
    }
  }

  const deleteImageFromStorage = async (path: string): Promise<boolean> => {
    if (!path) return false

    try {
      const { error } = await supabase.storage.from("trucksvgs").remove([path])

      if (error) {
        console.error("Error deleting file from storage:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error in deleteImageFromStorage:", error)
      return false
    }
  }

  const clearImage = async (index: number) => {
    // If there's a stored image (with a path), delete it from storage
    const imagePath = images[index].path

    if (imagePath) {
      setIsDeleting(true)
      const deleted = await deleteImageFromStorage(imagePath)

      if (deleted) {
        // Update the database to remove this image
        if (currentDriver) {
          // Get current URLs and paths
          const currentUrls = images.map((img) => img.url).filter(Boolean)
          const currentPaths = images.map((img) => img.path).filter(Boolean)

          // Remove the deleted image
          const updatedUrls = [...currentUrls]
          const updatedPaths = [...currentPaths]

          // Find the index in the filtered arrays
          const filteredIndex = currentUrls.findIndex((url) => url === images[index].url)
          if (filteredIndex !== -1) {
            updatedUrls.splice(filteredIndex, 1)
            updatedPaths.splice(filteredIndex, 1)

            // Update the database
            const { error } = await supabase.from("truck_svgs").upsert({
              id: currentDriver.id,
              driver_name: currentDriver.driver_fir,
              truck_number: currentDriver.def_truckn,
              foxtow_id: foxtow_id,
              driver_num: currentDriver.driver_num,
              svg_urls: updatedUrls,
              svg_paths: updatedPaths,
            })

            if (error) {
              console.error("Error updating database after image deletion:", error)
              toast.error("Failed to update database after deleting image")
            } else {
              toast.success("Image deleted successfully")
            }
          }
        }
      } else {
        toast.error("Failed to delete image from storage")
      }
      setIsDeleting(false)
    }

    // Update the UI
    const updatedImages = [...images]
    updatedImages[index] = { url: null, path: null }
    setImages(updatedImages)
  }

  const handleImageSelect = (url: string) => {
    setSelectedImages((prev) => {
      // If already selected, remove it
      if (prev.includes(url)) {
        return prev.filter((item) => item !== url)
      }

      // If we already have 3 images selected, replace the last one
      if (prev.length >= 3) {
        const newSelection = [...prev]
        newSelection[prev.length - 1] = url
        return newSelection
      }

      // Otherwise add it to selection
      return [...prev, url]
    })
  }

  const applySelectedImages = () => {
    if (selectedImages.length === 0) return

    // Create new images array with selected images
    const newImages = [...images]

    // Clear existing images first if we have selections
    if (selectedImages.length > 0) {
      for (let i = 0; i < Math.min(3, selectedImages.length); i++) {
        newImages[i] = { url: null, path: null }
      }
    }

    // Add selected images
    selectedImages.forEach((url, index) => {
      if (index < 3) {
        newImages[index] = {
          url,
          path: extractPathFromUrl(url),
        }
      }
    })

    setImages(newImages)
    toast.success(`${selectedImages.length} image${selectedImages.length > 1 ? "s" : ""} applied`)
    setActiveTab("current")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentDriver) return

    const loadingToast = toast.loading("Saving driver details...")
    setIsLoading(true)

    try {
      // Update driver details
      const { error } = await supabase.from("drivers").upsert({
        id: currentDriver.id,
        driver_fir: currentDriver.driver_fir,
        driver_las: currentDriver.driver_las,
        driver_num: currentDriver.driver_num,
        creationda: currentDriver.creationda,
        driver_ond: currentDriver.driver_ond,
        def_truckn: currentDriver.def_truckn,
      })

      if (error) throw error

      // Save image URLs and paths to truck_svgs table
      if (images.some((img) => img.url !== null)) {
        // Get all non-null image URLs and paths
        const finalUrls = images.map((img) => img.url).filter(Boolean) as string[]

        const finalPaths = images.map((img) => img.path).filter(Boolean) as string[]

        const { error: svgError } = await supabase.from("truck_svgs").upsert({
          id: currentDriver.id,
          driver_name: currentDriver.driver_fir,
          truck_number: currentDriver.def_truckn,
          foxtow_id: foxtow_id,
          driver_num: currentDriver.driver_num,
          svg_urls: finalUrls,
          svg_paths: finalPaths,
        })

        if (svgError) throw svgError
      }

      await fetchActiveDrivers()
      toast.dismiss(loadingToast)
      toast.success("Driver details saved successfully")
      onDriverUpdate()
      onClose()
    } catch (error) {
      console.error("Error updating driver:", error)
      toast.dismiss(loadingToast)
      toast.error("Failed to save driver details")
    } finally {
      setIsLoading(false)
    }
  }

  const [imagesByFolder, setImagesByFolder] = useState<any>({})
  const subfolders = ["blue_flat_bed", "flat_bed_icons","heavy_duty_wrecker","medium_truck","others","wrecker_truck"]

  useEffect(() => {
    const fetchImages = async () => {
      const folderImages: any = {}

      for (const folder of subfolders) {
        const { data, error } = await supabase.storage.from("trucksvgs").list(`alltrucks/${folder}`, { limit: 100 })

        if (error) {
          console.error(`Error fetching images from ${folder}:`, error)
          continue
        }

        // Filter only SVG files
        const svgFiles = data.filter((file) => file.name.endsWith(".svg"))

        // Get public URLs
        const urls = svgFiles.map(
          (file) => supabase.storage.from("trucksvgs").getPublicUrl(`alltrucks/${folder}/${file.name}`).data.publicUrl,
        )

        folderImages[folder] = urls
      }

      setImagesByFolder(folderImages)
    }

    fetchImages()
  }, [])

  console.log(imagesByFolder, "imageUrls")

  if (!isOpen) return null
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
                  value={currentDriver?.driver_fir || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="driver_las"
                  value={currentDriver?.driver_las || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Driver Number</label>
                <input
                  type="text"
                  name="driver_num"
                  value={currentDriver?.driver_num || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Creation Date</label>
                <input
                  type="date"
                  name="creationda"
                  value={currentDriver?.creationda || ""}
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
              
                  className="mt-1 relative z-50"
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
            <div className="p-4 bg-white rounded-lg mx-auto">
              {/* Tabs for Current/Select */}
              <div className="flex border-b mb-4">
                <button
                  type="button"
                  className={`px-4 py-2 ${activeTab === "current" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"}`}
                  onClick={() => setActiveTab("current")}
                >
                  Current Images
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 ${activeTab === "select" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"}`}
                  onClick={() => setActiveTab("select")}
                >
                  Select From Library
                </button>
              </div>

              {/* Current Images Tab */}
              {activeTab === "current" && (
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Larger box on the left */}
                  <div className="border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center h-42 w-44 aspect-square">
                    {images[0].url ? (
                      <div className="relative w-full h-full">
                        <img
                          src={images[0].url || "/placeholder.svg"}
                          alt="First uploaded image"
                          className="object-contain w-full h-full"
                        />
                        <button
                          onClick={() => clearImage(0)}
                          disabled={isDeleting}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          {isDeleting ? "..." : "×"}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <p>Main image</p>
                      </div>
                    )}
                  </div>

                  {/* Two smaller boxes on the right, stacked vertically */}
                  <div className="flex flex-col gap-3">
                    {/* Top small box */}
                    <div className="border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center h-20 w-20 aspect-square">
                      {images[1].url ? (
                        <div className="relative w-full h-full">
                          <img
                            src={images[1].url || "/placeholder.svg"}
                            alt="Second uploaded image"
                            className="object-contain w-full h-full"
                          />
                          <button
                            onClick={() => clearImage(1)}
                            disabled={isDeleting}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                          >
                            {isDeleting ? "." : "×"}
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 text-xs">
                          <p>Image 2</p>
                        </div>
                      )}
                    </div>

                    {/* Bottom small box */}
                    <div className="border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center h-20 w-20 aspect-square">
                      {images[2].url ? (
                        <div className="relative w-full h-full">
                          <img
                            src={images[2].url || "/placeholder.svg"}
                            alt="Third uploaded image"
                            className="object-contain w-full h-full"
                          />
                          <button
                            onClick={() => clearImage(2)}
                            disabled={isDeleting}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                          >
                            {isDeleting ? "." : "×"}
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
              )}

              {/* Select From Library Tab */}
              {activeTab === "select" && (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Image Category</label>
                    <Select
                      value={
                        selectedCategory
                          ? { value: selectedCategory, label: selectedCategory.replace(/_/g, " ") }
                          : null
                      }
                      onChange={(option) => {
                        setSelectedCategory(option?.value || "")
                        setSelectedImages([])
                      }}
                      options={subfolders.map((folder) => ({ value: folder, label: folder.replace(/_/g, " ") }))}
                      className="basic-single"
                      classNamePrefix="select"
                      placeholder="Select a category..."
                    />
                  </div>

                  {selectedCategory && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-700">
                          Select Images ({selectedImages.length} selected)
                        </h3>
                        {selectedImages.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedImages([])}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Clear Selection
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-60 overflow-y-auto p-2 border rounded-md">
                        {imagesByFolder[selectedCategory]?.map((url:any, index:any) => (
                          <div
                            key={index}
                            className={`relative border-2 rounded-md p-1 cursor-pointer transition-all ${
                              selectedImages.includes(url)
                                ? "border-blue-500 ring-2 ring-blue-300 bg-blue-50 scale-105 z-10"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                            onClick={() => handleImageSelect(url)}
                          >
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Library image ${index}`}
                              className="w-full h-16 object-contain"
                            />
                            {selectedImages.includes(url) && (
                              <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {selectedImages.indexOf(url) + 1}
                              </div>
                            )}
                          </div>
                        ))}
                        {(!imagesByFolder[selectedCategory] || imagesByFolder[selectedCategory].length === 0) && (
                          <p className="text-sm text-gray-500 col-span-full p-4 text-center">
                            No images found in this category
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex justify-between">
                        <div>
                          <span className="text-sm text-gray-500">
                            {selectedImages.length > 0
                              ? `${selectedImages.length} image${selectedImages.length > 1 ? "s" : ""} selected`
                              : "No images selected"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={applySelectedImages}
                          disabled={selectedImages.length === 0}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded text-sm disabled:bg-blue-400"
                        >
                          Apply Selected Images
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center pt-4">
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => handleNavigate("prev")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("next")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Next
                </button>
              </div>
              <div className="space-x-2">
                <button
                  type="submit"
                  disabled={isLoading || isDeleting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
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
  )
}

