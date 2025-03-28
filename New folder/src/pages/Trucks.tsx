import { useState, useEffect } from "react";
import { Edit, Plus, Truck, Trash } from "lucide-react";
import { supabase } from "../lib/supabase";
// import TruckEditModal from "../components/trucks/truck-edit-modal"
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ImageLoader = ({ src, name }: { src: string; name: string }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative h-10 w-full max-w-[100px] flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-gray-400"></div>
        </div>
      )}
      <img
        src={src || "/placeholder.svg"}
        alt={name}
        className={`h-10 w-auto max-w-full object-contain transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </div>
  );
};

export default function TrucksPage() {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTruck, setSelectedTruck] = useState<any | null>(null);
  const foxtow_id =
    typeof window !== "undefined" ? localStorage.getItem("foxtow_id") : null;
  const navigate = useNavigate();
  useEffect(() => {
    if (foxtow_id) {
      fetchTrucks();
    }
  }, [foxtow_id]);

  const fetchTrucks = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .eq("foxtow_id", foxtow_id)
      .order("def_truckn", { ascending: true });

    if (error) {
      console.error("Error fetching trucks:", error);
    } else {
      setTrucks(data || []);
    }
    setIsLoading(false);
  };

  const handleEditTruck = (truck: any) => {
    setSelectedTruck(truck);
    // setIsModalOpen(true);
  };

  const handleAddTruck = () => {
    navigate("/add-new-trucks");
  };

  const deleteHandler = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("drivers")
        .delete()
        .eq("id", id);
      if (error) {
        console.log(error, "error");
        // console.error("Error deleting truck:", error);
      } else {
        console.log(data);
        toast.success("Truck deleted successfully");
        fetchTrucks();
      }
    } catch (e) {
      console.log(e);
    }
  };
  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedTruck(null);
  // };

  const getStatusColor = (status?: boolean) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className=" mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Trucks</h1>
        <button
          onClick={handleAddTruck}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add a New Truck
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : trucks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Truck className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No trucks found
          </h3>
          <p className="mt-2 text-gray-500">
            Get started by adding your first truck.
          </p>
          <button
            onClick={handleAddTruck}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add Truck
          </button>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Truck#
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    VIN
                  </th>
                  <th
                    scope="col"
                    className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    License#
                  </th>
                  <th
                    scope="col"
                    className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Duty
                  </th>
                  <th
                    scope="col"
                    className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Expiration
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Pictures
                  </th>
                  <th
                    scope="col"
                    className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                  {/* <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Delete
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trucks.map((truck) => (
                  <tr key={truck.id}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {truck?.def_truckn}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                      {/* driver_nam */}
                        {truck?.driver_nam?truck?.driver_nam: truck?.driver_fir ? truck?.driver_fir +  truck?.driver_las ? truck?.driver_las : "" : ""}{" "}
                       
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {truck?.vin ? truck?.vin : ""}
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {truck?.driver_lic ? truck?.driver_lic : ""}
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {truck?.truck_type ? truck?.truck_type : ""}
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {truck?.duty ? truck?.duty : ""}
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {truck?.expiration_date ? truck?.expiration_date : ""}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 overflow-x-auto max-w-[120px] sm:max-w-xs md:max-w-md lg:max-w-lg scrollbar-hide">
                        {truck?.svg_urls &&
                          truck.svg_urls.map((item: string, index: number) => (
                            <div
                              key={index}
                              className="flex-shrink-0 rounded border border-gray-200 p-1 bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                              <ImageLoader
                                src={item || "/placeholder.svg"}
                                name={
                                  truck?.driver_name || `Truck ${index + 1}`
                                }
                              />
                            </div>
                          ))}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          truck.driver_ond
                        )}`}
                      >
                        {truck.driver_ond ? "active driver" : "inactive driver"}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {truck.creationda
                        ? new Date(truck.creationda).toLocaleDateString()
                        : "Unknown"}
                    </td>
                    <td className="flex px-4 sm:px-6 py-10 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditTruck(truck)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Link to={`/setting-trucks/${truck?.id}`}>
                          <Edit className="w-4 h-4  " />
                        </Link>
                      </button>
                      <button
                        className=" px-2 items-center"
                        onClick={() => deleteHandler(truck?.id)}
                      >
                        <Trash className="w-4 h-4 text-red-800 " />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile view for each truck (visible on xs screens) */}
      {/* <div className="sm:hidden mt-6 space-y-4">
        {!isLoading && trucks.length > 0 && (
          <div className="text-sm text-gray-500 mb-2">
            Swipe horizontally to see all data
          </div>
        )}
        {trucks.map((truck) => (
          <div
            key={`mobile-${truck.id}`}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-lg font-semibold">
                  Truck #{truck?.def_truckn}
                </div>
                <div className="text-sm text-gray-600">
                  {truck?.driver_fir ? truck?.driver_fir : ""}{" "}
                  {truck?.driver_las ? truck?.driver_las : ""}
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                  truck.driver_ond
                )}`}
              >
                {truck.driver_ond ? "active" : "inactive"}
              </span>
            </div>

            <div className="mb-3">
              <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                Pictures
              </div>
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {truck?.svg_urls &&
                  truck.svg_urls.map((item: string, index: number) => (
                    <div
                      key={index}
                      className="flex-shrink-0 rounded border border-gray-200 p-1 bg-white shadow-sm"
                    >
                      <ImageLoader
                        src={item || "/placeholder.svg"}
                        name={truck?.driver_name || `Truck ${index + 1}`}
                      />
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">
                {truck.creationda
                  ? new Date(truck.creationda).toLocaleDateString()
                  : "Unknown"}
              </div>
              <button
                onClick={() => handleEditTruck(truck)}
                className="text-blue-600 hover:text-blue-900 flex items-center text-sm"
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </button>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}
