// import type React from "react"
// import { useEffect, useRef, useState } from "react"
// import { X, Upload, Save, Loader2 } from "lucide-react"
// import toast from "react-hot-toast"
// import { supabase } from "../../lib/supabase"

// export default function TruckEditModal({ isOpen, onClose, onTruckUpdate, initialTruck }: any) {
//   const [isLoading, setIsLoading] = useState(false)
//   const [isUploading, setIsUploading] = useState(false)
//   const [deletingIndexes, setDeletingIndexes] = useState<number[]>([])
//   const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null])
//   const [images, setImages] = useState<any[]>([]);
  
//   const [selectedFolder, setSelectedFolder] = useState<string>("flat_bed_icons") 
//   const [subfolders, setSubfolders] = useState<string[]>(["blue_flat_bed", "flat_bed_icons","heavy_duty_wrecker","medium_truck","others","wrecker_truck"])
//   const [imagesByFolder, setImagesByFolder] = useState<Record<string, string[]>>({})
//   const [showImageLibrary, setShowImageLibrary] = useState(false)


//   useEffect(() => {
//     if (isOpen && initialTruck?.svg_urls && Array.isArray(initialTruck.svg_urls)) {
//       const formattedImages = initialTruck.svg_urls.map((url: string) => ({
//         url,
//         path: url.split("trucksvgs/")[1] || "",
//       }))
//       const paddedImages = [...formattedImages]
//       while (paddedImages.length < 3) {
//         paddedImages.push({ url: null, path: null })
//       }

//       setImages(paddedImages.slice(0, 3))
//     } else {
//       setImages([null,null,null])
//     }
//   }, [isOpen, initialTruck])

//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const foxtow_id = typeof window !== "undefined" ? localStorage.getItem("foxtow_id") : null

//   const uploadImages = async (): Promise<{ urls: string[] }> => {
//     const uploadedUrls: string[] = []

//     if (!imageFiles.some((file) => file !== null)) {
//       return { urls: [] }
//     }

//     setIsUploading(true)

//     try {
//       for (let i = 0; i < imageFiles.length; i++) {
//         const file = imageFiles[i]
//         if (!file) {
//           uploadedUrls.push("")
//           continue
//         }
//         const fileExt = file.name.split(".").pop()
//         const fileName = `truck-${initialTruck?.id || "unknown"}-${Date.now()}-${i}.${fileExt}`
//         const filePath = `truck-images/${fileName}`

//         const { data, error } = await supabase.storage.from("trucksvgs").upload(filePath, file, {
//           cacheControl: "3600",
//           upsert: true,
//         })
//         if (error) {
//           console.error(`Error uploading file ${i}:`, error)
//           uploadedUrls.push("")
//           continue
//         }
//         const { data: urlData } = supabase.storage.from("trucksvgs").getPublicUrl(filePath)
//         uploadedUrls[i] = urlData.publicUrl
//       }

//       return { urls: uploadedUrls.filter(Boolean) as string[] }
//     } catch (error) {
//       console.error("Error in uploadImages:", error)
//       return { urls: [] }
//     } finally {
//       setIsUploading(false)
//       setImageFiles([null, null, null])
//     }
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

//     const emptySlotIndex = images.findIndex((img) => !img.url)
//     if (emptySlotIndex !== -1) {

//     const files = Array.from(e.target.files || [])

//     if (files.length > 0) {
//       const newImageFiles = [...imageFiles]
//       const updatedImages = [...images]

//       // Find empty slots or replace existing images
//       for (let i = 0; i < Math.min(files.length, 3); i++) {
//         const file = files[i]
//         const imageUrl = URL.createObjectURL(file)

//         // Find the first empty slot or use index 0 if all slots are filled
//         let slotIndex = updatedImages.findIndex((img) => !img.url)
//         if (slotIndex === -1) slotIndex = i % 3

//         updatedImages[slotIndex] = { url: imageUrl, path: null }
//         newImageFiles[slotIndex] = file
//       }

//       setImages(updatedImages)
//       setImageFiles(newImageFiles)
//     }

//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
// }
// else {
//     toast.error("No empty slots available. Delete an image first.")
//   }
//   }

//   const handleUploadClick = (e: React.MouseEvent) => {
//     e.preventDefault()
//     fileInputRef.current?.click()
//   }

//   const deleteImageFromStorage = async (path: string): Promise<boolean> => {
//     if (!path) return false

//     try {
//       const { error } = await supabase.storage.from("trucksvgs").remove([path])

//       if (error) {
//         console.error("Error deleting file from storage:", error)
//         return false
//       }

//       return true
//     } catch (error) {
//       console.error("Error in deleteImageFromStorage:", error)
//       return false
//     }
//   }

//   const clearImage = async (index: number) => {
//     // Add this index to the deleting indices
//     setDeletingIndexes(prev => [...prev, index])
    
//     try {
//       const imageToDelete = images[index]
//             if (imageToDelete.path) {
//         await deleteImageFromStorage(imageToDelete.path)
//       }
//             const updatedImages = [...images]
//       updatedImages[index] = { url: null, path: null }
//             const updatedImageFiles = [...imageFiles]
//       updatedImageFiles[index] = null
//             if (initialTruck?.id) {
//         const currentUrls = initialTruck.svg_urls || []
//         const updatedUrls = currentUrls.filter((url: any) => url !== imageToDelete.url)
        
//         const { error } = await supabase
//           .from("drivers")
//           .update({ svg_urls: updatedUrls })
//           .eq("id", initialTruck.id)
//           .eq("foxtow_id",foxtow_id)
//         if (error) {
//           console.error("Error updating database after image deletion:", error)
//           toast.error("Failed to update database after deleting image")
//           setDeletingIndexes(prev => prev.filter(i => i !== index))
//           return
//         }
//       }
      
//       // Revoke object URL if it was a blob URL (newly uploaded image)
//       if (imageToDelete.url && imageToDelete.url.startsWith('blob:')) {
//         URL.revokeObjectURL(imageToDelete.url)
//       }
      
//       // Update state
//       setImages(updatedImages)
//       setImageFiles(updatedImageFiles)
//       toast.success("Image removed successfully")
      
//       // Call the update callback
//       await onTruckUpdate()
//     } catch (error) {
//       console.error("Error in clearImage:", error)
//       toast.error("Failed to remove image")
//     } finally {
//       // Remove this index from deleting indices
//       setDeletingIndexes(prev => prev.filter(i => i !== index))
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!initialTruck) return

//     const loadingToast = toast.loading("Saving truck images...")
//     setIsLoading(true)

//     try {
//       const { urls: uploadedUrls } = await uploadImages()
//             const existingImageUrls = images
//         .map(img => img.url)
//         .filter(url => url && !url.startsWith('blob:'))
      
//       const finalUrls = [...existingImageUrls]
//             if (uploadedUrls.length > 0) {
//         finalUrls.push(...uploadedUrls)
//       }
      
//       const { error } = await supabase
//         .from("drivers")
//         .update({
//           svg_urls: finalUrls,
//         })
//         .eq("id", initialTruck.id)
//         .eq("foxtow_id",foxtow_id)
//       if (error) throw error

//       toast.dismiss(loadingToast)
//       toast.success("Truck images saved successfully")
//       onTruckUpdate()
//       onClose()
//     } catch (error) {
//       console.error("Error updating truck images:", error)
//       toast.dismiss(loadingToast)
//       toast.error("Failed to save truck images")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     return () => {
//       images.forEach(img => {
//         if (img.url && img.url.startsWith('blob:')) {
//           URL.revokeObjectURL(img.url)
//         }
//       })
//     }
//   }, [])


//   const toggleImageLibrary = (index: number) => {
//     setShowImageLibrary((prev) => !prev)
//   }


//   const selectImageFromLibrary = (imageUrl: string) => {
//     // Find the first empty slot
//     const emptySlotIndex = images.findIndex((img) => !img.url)

//     // If an empty slot exists, use it
//     if (emptySlotIndex !== -1) {
//       const updatedImages = [...images]
//       updatedImages[emptySlotIndex] = {
//         url: imageUrl,
//         path: imageUrl.split("trucksvgs/")[1] || "",
//       }
//       setImages(updatedImages)
//       toast.success("Image added to empty slot")
//     } else {
//       // If no empty slots, show a message
//       toast.error("No empty slots available. Delete an image first.")
//     }

//     setShowImageLibrary(false)
//   }
//   const fetchImages = async () => {
//     const folderImages: Record<string, string[]> = {}
//     for (const folder of subfolders) {
//       const { data, error } = await supabase.storage.from("trucksvgs").list(`alltrucks/${folder}`, { limit: 100 })
//       if (error) {
//         console.error(`Error fetching images from ${folder}:`, error)
//         continue
//       }
//       // Filter only SVG files
//       const svgFiles = data.filter((file) => file.name.endsWith(".svg"))
//       // Get public URLs
//       const urls = svgFiles.map(
//         (file) => supabase.storage.from("trucksvgs").getPublicUrl(`alltrucks/${folder}/${file.name}`).data.publicUrl,
//       )
//       folderImages[folder] = urls
//     }
//     setImagesByFolder(folderImages)
//   }

//   useEffect(() => {
//     if (isOpen) {
//       fetchImages()
//     }
//   }, [isOpen])

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Update Truck Images</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X size={24} />
//           </button>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Truck Number</label>
//                 <input
//                   type="text"
//                   readOnly={true}
//                   value={initialTruck?.def_truckn || ""}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Driver Name</label>
//                 <input
//                   type="text"
//                   readOnly={true}
//                   value={`${initialTruck?.driver_fir || ""} ${initialTruck?.driver_las || ""}`}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div className="p-4 bg-white rounded-lg mx-auto">
//               <h3 className="text-lg font-medium mb-3">Truck Images</h3>
//               <div className="flex flex-col md:flex-row gap-4">
//                 {/* Larger box on the left */}
//                 <div className="border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center h-42 w-44 aspect-square">
//                   {images[0]?.url ? (
//                     <div className="relative w-full h-full">
//                       <img
//                         src={images[0].url || "/placeholder.svg"}
//                         alt="First truck image"
//                         className="object-contain w-full h-full"
//                       />
//                       <button
//                         onClick={() => clearImage(0)}
//                         disabled={deletingIndexes.includes(0)}
//                         className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
//                       >
//                         {deletingIndexes.includes(0) ? <Loader2 className="w-3 h-3 animate-spin" /> : "×"}
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="text-center text-gray-400">
//                       <p>Main image</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Two smaller boxes on the right, stacked vertically */}
//                 <div className="flex flex-col gap-3">
//                   {/* Top small box */}
//                   <div className="border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center h-20 w-20 aspect-square">
//                     {images[1]?.url ? (
//                       <div className="relative w-full h-full">
//                         <img
//                           src={images[1].url || "/placeholder.svg"}
//                           alt="Second truck image"
//                           className="object-contain w-full h-full"
//                         />
//                         <button
//                           onClick={() => clearImage(1)}
//                           disabled={deletingIndexes.includes(1)}
//                           className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
//                         >
//                           {deletingIndexes.includes(1) ? <Loader2 className="w-3 h-3 animate-spin" /> : "×"}
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="text-center text-gray-400 text-xs">
//                         <p>Image 2</p>
//                       </div>
//                     )}
//                   </div>

//                   {/* Bottom small box */}
//                   <div className="border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center h-20 w-20 aspect-square">
//                     {images[2]?.url ? (
//                       <div className="relative w-full h-full">
//                         <img
//                           src={images[2].url || "/placeholder.svg"}
//                           alt="Third truck image"
//                           className="object-contain w-full h-full"
//                         />
//                         <button
//                           onClick={() => clearImage(2)}
//                           disabled={deletingIndexes.includes(2)}
//                           className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
//                         >
//                           {deletingIndexes.includes(2) ? <Loader2 className="w-3 h-3 animate-spin" /> : "×"}
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="text-center text-gray-400 text-xs">
//                         <p>Image 3</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
            
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={(e) => handleFileChange(e)}
//                 className="hidden"
//                 accept="image/*"
//                 multiple
//               />

//               {/* Upload button */}
//               <div className="mt-4 flex gap-3 justify-start">
//                 <button
//                   onClick={(e) => handleUploadClick(e)}
//                   disabled={isUploading || deletingIndexes.length > 0}
//                   className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-3 py-1.5 rounded flex items-center gap-1.5 text-xs disabled:bg-gray-400"
//                 >
//                   <Upload size={14} />
//                   {isUploading ? "Uploading..." : "Upload images"}
//                 </button>
//                 <button
//               onClick={(e) => {
//                 e.preventDefault()
//                 toggleImageLibrary(0)
//               }}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded flex items-center gap-1.5 text-xs"
//             >
//               Select from library
//             </button>
//               </div>
            
//             </div>

//             <div className="pt-4">
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="submit"
//                   disabled={isLoading || isUploading || deletingIndexes.length > 0}
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
//                 >
//                   <Save className="w-4 h-4 mr-1" />
//                   {isLoading ? "Saving..." : "Save Changes"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </form>
//         )}

//     {/* Image Library Modal */}
//     {showImageLibrary && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-auto">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-semibold">Select Image from Library</h2>
//                   <button onClick={() => setShowImageLibrary(false)} className="text-gray-500 hover:text-gray-700">
//                     <X size={24} />
//                   </button>
//                 </div>

//                 <div className="mb-4">
//                   <div className="flex space-x-2 mb-4">
//                     {subfolders?.map((folder) => (
//                       <button
//                         key={folder}
//                         onClick={() => setSelectedFolder(folder)}
//                         className={`px-3 py-1 text-xs rounded ${selectedFolder === folder ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//                       >
//                         {folder?.replace(/_/g, " ").charAt(0).toUpperCase() + folder.replace(/_/g, " ").slice(1)}

//                         {/* {folder.charAt(0).toUpperCase() + folder.slice(1)} */}
//                       </button>
//                     ))}
//                   </div>

//                   <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                     {imagesByFolder[selectedFolder]?.map((imageUrl, idx) => (
//                       <div
//                         key={idx}
//                         className="border rounded p-2 cursor-pointer hover:border-blue-500"
//                         onClick={() => selectImageFromLibrary(imageUrl)}
//                       >
//                         <img
//                           src={imageUrl || "/placeholder.svg"}
//                           alt={`Library image ${idx}`}
//                           className="w-full h-24 object-contain"
//                         />
//                       </div>
//                     ))}
//                     {!imagesByFolder[selectedFolder]?.length && (
//                       <div className="col-span-full text-center py-8 text-gray-500">No images found in this folder</div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//       </div>
//     </div>
//   )
// }