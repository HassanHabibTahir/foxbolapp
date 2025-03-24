import type React from "react"
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react"

import { Upload, Save, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import { supabase } from "../lib/supabase";

export default function AddNewTrucks() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null])
  const [images, setImages] = useState<any[]>([
    { url: null, path: null },
    { url: null, path: null },
    { url: null, path: null },
  ])

  // Form fields
  const [truckNumber, setTruckNumber] = useState("")
  const [driverFirstName, setDriverFirstName] = useState("")
  const [driverLastName, setDriverLastName] = useState("")
  const [vin, setVin] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [truckType, setTruckType] = useState("")
  const [duty, setDuty] = useState("")
  const [expiration, setExpiration] = useState("")
  const [isActive, setIsActive] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const foxtow_id = typeof window !== "undefined" ? localStorage.getItem("foxtow_id") : null

  const uploadImages = async (): Promise<{ urls: string[] }> => {
    const uploadedUrls: string[] = []

    if (!imageFiles.some((file) => file !== null)) {
      return { urls: [] }
    }

    setIsUploading(true)

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        if (!file) {
          uploadedUrls.push("")
          continue
        }
        const fileExt = file.name.split(".").pop()
        const fileName = `truck-${'werqwe'}-${Date.now()}-${i}.${fileExt}`
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
        uploadedUrls[i] = urlData.publicUrl
      }

      return { urls: uploadedUrls.filter(Boolean) as string[] }
    } catch (error) {
      console.error("Error in uploadImages:", error)
      return { urls: [] }
    } finally {
      setIsUploading(false)
      setImageFiles([null, null, null])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length > 0) {
      const newImageFiles = [...imageFiles]
      const updatedImages = [...images]

      // Find empty slots or replace existing images
      for (let i = 0; i < Math.min(files.length, 3); i++) {
        const file = files[i]
        const imageUrl = URL.createObjectURL(file)

        // Find the first empty slot or use index 0 if all slots are filled
        let slotIndex = updatedImages.findIndex((img) => !img?.url)
        if (slotIndex === -1) slotIndex = i % 3

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

    // Revoke object URL if it was a blob URL
    if (updatedImages[index]?.url && updatedImages[index].url.startsWith("blob:")) {
      URL.revokeObjectURL(updatedImages[index].url)
    }

    updatedImages[index] = { url: null, path: null }
    updatedImageFiles[index] = null

    setImages(updatedImages)
    setImageFiles(updatedImageFiles)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // if (!truckNumber) {
    //   toast.error("Truck number is required")
    //   return
    // }

    // const loadingToast = toast.loading("Creating truck...")
    // setIsLoading(true)

    // try {
    //   const { urls: uploadedUrls } = await uploadImages()

    //   const { error } = await supabase.from("drivers").insert({
    //     // id: params.id,
    //     foxtow_id: foxtow_id,
    //     def_truckn: truckNumber,
    //     driver_fir: driverFirstName,
    //     driver_las: driverLastName,
    //     vin: vin,
    //     license_number: licenseNumber,
    //     truck_type: truckType,
    //     duty: duty,
    //     expiration_date: expiration,
    //     driver_ond: isActive,
    //     svg_urls: uploadedUrls,
    //     creationda: new Date().toISOString(),
    //   })

    //   if (error) throw error

    //   toast.dismiss(loadingToast)
    //   toast.success("Truck created successfully")
    //   navigate("/trucks")
    // } catch (error) {
    //   console.error("Error creating truck:", error)
    //   toast.dismiss(loadingToast)
    //   toast.error("Failed to create truck")
    // } finally {
    //   setIsLoading(false)
    // }
  }

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Truck Number*</label>
              <input
                type="text"
                value={truckNumber}
                onChange={(e) => setTruckNumber(e.target.value)}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Driver First Name</label>
              <input
                type="text"
                value={driverFirstName}
                onChange={(e) => setDriverFirstName(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Driver Last Name</label>
              <input
                type="text"
                value={driverLastName}
                onChange={(e) => setDriverLastName(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
              <input
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Truck Type</label>
              <select
                value={truckType}
                onChange={(e) => setTruckType(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="flatbed">Flatbed</option>
                <option value="wrecker">Wrecker</option>
                <option value="heavy_duty">Heavy Duty</option>
                <option value="medium_duty">Medium Duty</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duty</label>
              <select
                value={duty}
                onChange={(e) => setDuty(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Duty</option>
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
              <input
                type="date"
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 mr-2"
                />
                Active Driver
              </label>
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
                    ×
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
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
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
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
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

          {/* Upload button */}
          <div className="mt-6">
            <button
              type="button"
            //   onClick={(e) => handleUploadClick(e)}
            //   disabled={isUploading}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded flex items-center gap-2 disabled:bg-gray-400"
            >
              <Upload size={16} />
              {isUploading ? "Uploading..." : "Upload Images"}
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
            {isLoading ? "Creating..." : "Create Truck"}
          </button>
        </div>
      </form>
    </div>
  )
}

