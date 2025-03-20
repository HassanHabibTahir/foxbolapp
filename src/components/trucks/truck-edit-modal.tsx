
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { X, Upload, Save, ChevronLeft, ChevronRight } from "lucide-react"

import toast from "react-hot-toast"
import { supabase } from "../../lib/supabase"

interface Truck {
  id: string
  trucknum: string
  foxtow_id?: string
  created_at?: string
  status?: string
}

interface TruckImage {
  url: string | null
  path: string | null
}

interface TruckEditModalProps {
  isOpen: boolean
  onClose: () => void
  onTruckUpdate: () => void
  initialTruck?: Truck | null
}

export default function TruckEditModal({ isOpen, onClose, onTruckUpdate, initialTruck }: TruckEditModalProps) {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [currentTruck, setCurrentTruck] = useState<Truck | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null])
  const [images, setImages] = useState<TruckImage[]>([
    { url: null, path: null },
    { url: null, path: null },
    { url: null, path: null },
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const foxtow_id = typeof window !== "undefined" ? localStorage.getItem("foxtow_id") : null

  useEffect(() => {
    if (isOpen) {
      fetchTrucks()
    }
  }, [isOpen])

  useEffect(() => {
    // If an initial truck is provided, set it as the current truck
    if (initialTruck) {
      setCurrentTruck(initialTruck)
      fetchTruckImages(initialTruck.id)
    }
  }, [initialTruck])

  const fetchTrucks = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("trucks")
      .select("id, trucknum, created_at, status")
      .eq("foxtow_id", foxtow_id)
      .order("trucknum", { ascending: true })

    if (error) {
      console.error("Error fetching trucks:", error)
    //   toast.error("Failed to fetch trucks")
    } else {
      setTrucks(data || [])
      // Only set the current truck if one isn't already set (from initialTruck)
      if (data && data.length > 0 && !currentTruck) {
        setCurrentTruck(data[0])
        fetchTruckImages(data[0]?.id)
      }
    }
    setIsLoading(false)
  }

  const fetchTruckImages = async (truckId: string) => {
    // Reset images when changing trucks
    setImages([
      { url: null, path: null },
      { url: null, path: null },
      { url: null, path: null },
    ])
    setImageFiles([null, null, null])

    const { data, error } = await supabase
      .from("truck_images")
      .select("image_urls, image_paths")
      .eq("truck_id", truckId)
      .single()

    if (error) {
      if (error.code !== "PGRST116") {
        console.error("Error fetching truck images:", error)
      }
      return
    }

    if (data && data.image_urls && data.image_urls.length > 0) {
      const imageUrls = data.image_urls
      const imagePaths = data.image_paths || Array(imageUrls.length).fill(null)

      const newImages = [
        { url: null, path: null },
        { url: null, path: null },
        { url: null, path: null },
      ]

      for (let i = 0; i < Math.min(imageUrls.length, 3); i++) {
        newImages[i] = {
          url: imageUrls[i],
          path: imagePaths[i] || extractPathFromUrl(imageUrls[i]),
        }
      }

      setImages(newImages)
    }
  }

  const extractPathFromUrl = (url: string): string | null => {
    if (!url) return null

    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split("/")

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentTruck) return
    const { name, value } = e.target
    setCurrentTruck((prev) => ({
      ...prev!,
      [name]: value,
    }))
  }

  const handleNavigate = (direction: "prev" | "next") => {
    const currentIndex = trucks.findIndex((t) => t.id === currentTruck?.id)
    let newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0) newIndex = trucks.length - 1
    if (newIndex >= trucks.length) newIndex = 0

    setCurrentTruck(trucks[newIndex])
    fetchTruckImages(trucks[newIndex]?.id)
  }

  const uploadImages = async (): Promise<{ urls: string[]; paths: string[] }> => {
    const uploadedUrls: string[] = []
    const uploadedPaths: string[] = []

    if (!imageFiles.some((file) => file !== null)) {
      return { urls: [], paths: [] }
    }

    setIsUploading(true)

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        if (!file) {
          uploadedUrls.push("")
          uploadedPaths.push("")
          continue
        }
        const fileExt = file.name.split(".").pop()
        const fileName = `truck-${currentTruck?.id || "unknown"}-${Date.now()}-${i}.${fileExt}`
        const filePath = `truck-images/${fileName}`

        const { data, error } = await supabase.storage
          .from("trucksvgs") // Using the same bucket for consistency
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          })

        if (error) {
          console.error(`Error uploading file ${i}:`, error)
          uploadedUrls.push("")
          uploadedPaths.push("")
          continue
        }

        const { data: urlData } = supabase.storage.from("trucksvgs").getPublicUrl(filePath)

        uploadedUrls[i] = urlData.publicUrl
        uploadedPaths[i] = filePath
      }

      return {
        urls: uploadedUrls.filter(Boolean) as string[],
        paths: uploadedPaths.filter((path, index) => Boolean(uploadedUrls[index])) as string[],
      }
    } catch (error) {
      console.error("Error in uploadImages:", error)
      return { urls: [], paths: [] }
    } finally {
      setIsUploading(false)
      setImageFiles([null, null, null])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length > 0) {
      const newImageUrls = files.map((file) => URL.createObjectURL(file))
      const newImageFiles = [...imageFiles]
      const updatedImages = [...images]

      let newImageIndex = 0
      for (let i = 0; i < updatedImages.length && newImageIndex < newImageUrls.length; i++) {
        if (!updatedImages[i].url) {
          updatedImages[i] = { url: newImageUrls[newImageIndex], path: null }
          newImageFiles[i] = files[newImageIndex]
          newImageIndex++
        }
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
    const imagePath = images[index].path

    if (imagePath) {
      setIsDeleting(true)
      const deleted = await deleteImageFromStorage(imagePath)

      if (deleted) {
        if (currentTruck) {
          const currentUrls = images.map((img) => img.url).filter(Boolean)
          const currentPaths = images.map((img) => img.path).filter(Boolean)

          const updatedUrls = [...currentUrls]
          const updatedPaths = [...currentPaths]

          const filteredIndex = currentUrls.findIndex((url) => url === images[index].url)
          if (filteredIndex !== -1) {
            updatedUrls.splice(filteredIndex, 1)
            updatedPaths.splice(filteredIndex, 1)

            const { error } = await supabase.from("truck_images").upsert({
              truck_id: currentTruck.id,
              foxtow_id: foxtow_id,
              image_urls: updatedUrls,
              image_paths: updatedPaths,
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

    const updatedImages = [...images]
    const updatedImageFiles = [...imageFiles]
    updatedImages[index] = { url: null, path: null }
    updatedImageFiles[index] = null
    setImages(updatedImages)
    setImageFiles(updatedImageFiles)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentTruck) return

    const loadingToast = toast.loading("Saving truck details...")
    setIsLoading(true)

    try {
      // First upload any new images
      const { urls: uploadedUrls, paths: uploadedPaths } = await uploadImages()

      // Update truck details
      const { error } = await supabase.from("trucks").upsert({
        id: currentTruck.id,
        trucknum: currentTruck.trucknum,
        foxtow_id: foxtow_id,
        status: currentTruck.status || "active",
      })

      if (error) throw error

      // Save image URLs and paths to truck_images table
      if (uploadedUrls.length > 0 || images.some((img) => img.url !== null)) {
        // Combine existing URLs with newly uploaded ones
        const finalUrls = images
          .map((img, index) => {
            if (uploadedUrls[index]) return uploadedUrls[index]
            return img.url
          })
          .filter(Boolean) as string[]

        // Combine existing paths with newly uploaded ones
        const finalPaths = images
          .map((img, index) => {
            if (uploadedPaths[index]) return uploadedPaths[index]
            return img.path
          })
          .filter(Boolean) as string[]

        const { error: imageError } = await supabase.from("truck_images").upsert({
          truck_id: currentTruck.id,
          foxtow_id: foxtow_id,
          image_urls: finalUrls,
          image_paths: finalPaths,
        })

        if (imageError) throw imageError
      }

      // Also update any driver records that use this truck to show the updated images
      await updateDriverTruckImages(currentTruck.trucknum, images)

      toast.dismiss(loadingToast)
      toast.success("Truck details saved successfully")
      onTruckUpdate()
      onClose()
    } catch (error) {
      console.error("Error updating truck:", error)
      toast.dismiss(loadingToast)
      toast.error("Failed to save truck details")
    } finally {
      setIsLoading(false)
    }
  }

  // Update truck images in driver records
  const updateDriverTruckImages = async (truckNum: string, truckImages: TruckImage[]) => {
    try {
      // Get all drivers using this truck
      const { data: drivers, error } = await supabase
        .from("drivers")
        .select("id, driver_fir, driver_num")
        .eq("def_truckn", truckNum)
        .eq("foxtow_id", foxtow_id)

      if (error) {
        console.error("Error fetching drivers with this truck:", error)
        return
      }

      if (!drivers || drivers.length === 0) return

      // For each driver, update their truck_svgs record
      for (const driver of drivers) {
        const finalUrls = truckImages.map((img) => img.url).filter(Boolean) as string[]

        const finalPaths = truckImages.map((img) => img.path).filter(Boolean) as string[]

        const { error: svgError } = await supabase.from("truck_svgs").upsert({
          id: driver.id,
          driver_name: driver.driver_fir,
          truck_number: truckNum,
          foxtow_id: foxtow_id,
          driver_num: driver.driver_num,
          svg_urls: finalUrls,
          svg_paths: finalPaths,
        })

        if (svgError) {
          console.error(`Error updating truck images for driver ${driver.id}:`, svgError)
        }
      }
    } catch (error) {
      console.error("Error in updateDriverTruckImages:", error)
    }
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Truck Details</h2>
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
                <label className="block text-sm font-medium text-gray-700">Truck Number</label>
                <input
                  type="text"
                  name="trucknum"
                  value={currentTruck?.trucknum || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={currentTruck?.status || "active"}
                  onChange={(e) => {
                    if (!currentTruck) return
                    setCurrentTruck({ ...currentTruck, status: e.target.value })
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg mx-auto">
              <h3 className="text-lg font-medium mb-3">Truck Images</h3>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Larger box on the left */}
                <div className="border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center h-42 w-44 aspect-square">
                  {images[0].url ? (
                    <div className="relative w-full h-full">
                      <img
                        src={images[0].url || "/placeholder.svg"}
                        alt="First truck image"
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
                          alt="Second truck image"
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
                          alt="Third truck image"
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

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e)}
                className="hidden"
                accept="image/*"
                multiple
              />

              {/* Buttons */}
              <div className="mt-4 flex gap-3 justify-start">
                <button
                  onClick={(e) => handleUploadClick(e)}
                  disabled={isUploading || isDeleting}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-3 py-1.5 rounded flex items-center gap-1.5 text-xs disabled:bg-gray-400"
                >
                  <Upload size={14} />
                  {isUploading ? "Uploading..." : "Upload images"}
                </button>
              </div>
            </div>

            <div className="pt-4">
              {/* <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => handleNavigate("prev")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("next")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div> */}
              <div className=" flex  justify-end space-x-2">
                <button
                  type="submit"
                  disabled={isLoading || isUploading || isDeleting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
                >
                  <Save className="w-4 h-4 mr-1" />
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

