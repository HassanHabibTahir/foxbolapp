import { useState, useEffect } from "react"
import { Edit, Plus, Truck } from "lucide-react"
import { supabase } from "../lib/supabase"
import TruckEditModal from "../components/trucks/truck-edit-modal"

export default function TrucksPage() {
  const [trucks, setTrucks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTruck, setSelectedTruck] = useState<any | null>(null)
  const foxtow_id = typeof window !== "undefined" ? localStorage.getItem("foxtow_id") : null

  useEffect(() => {
    if (foxtow_id) {
      fetchTrucks()
    }
  }, [foxtow_id])

  const fetchTrucks = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("truck_svgs").select("*").eq("foxtow_id", foxtow_id)

    console.log(data, "data")
    if (error) {
      console.error("Error fetching trucks:", error)
    } else {
      setTrucks(data || [])
    }
    setIsLoading(false)
  }

  const handleEditTruck = (truck: any) => {
    setSelectedTruck(truck)
    setIsModalOpen(true)
  }

  const handleAddTruck = () => {
    // Create a new empty truck object
    const newTruck: any = {
      id: crypto.randomUUID(),
      trucknum: "",
    }
    setSelectedTruck(newTruck)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTruck(null)
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trucks</h1>
        <button
          onClick={handleAddTruck}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Truck
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : trucks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Truck className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No trucks found</h3>
          <p className="mt-2 text-gray-500">Get started by adding your first truck.</p>
          <button
            onClick={handleAddTruck}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add Truck
          </button>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Truck Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Driver Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trucks
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trucks.map((truck) => (
                <tr key={truck.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{truck?.truck_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{truck?.driver_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 overflow-x-auto max-w-xs md:max-w-md lg:max-w-lg scrollbar-hide">
                      {truck?.svg_urls &&
                        truck.svg_urls.map((item: string, index: number) => (
                          <div
                            key={index}
                            className="flex-shrink-0 rounded border border-gray-200 p-1 bg-white shadow-sm hover:shadow-md transition-shadow"
                          >
                            <img
                              src={item || "/placeholder.svg"}
                              alt={`${truck?.driver_name || "Truck"} ${index + 1}`}
                              className="h-10 w-auto object-contain"
                            />
                          </div>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {truck.created_at ? new Date(truck.created_at).toLocaleDateString() : "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditTruck(truck)}
                      className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedTruck && (
        <TruckEditModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onTruckUpdate={fetchTrucks}
          initialTruck={selectedTruck}
        />
      )}
    </div>
  )
}

