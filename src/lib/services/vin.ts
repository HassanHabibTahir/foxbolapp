const API_BASE_URL = import.meta.env.VITE_VIN_API_URL || "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/";
async function getVehicleInfoByVIN(vin: any) {
  const apiUrl = `${API_BASE_URL}${vin}?format=json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();

    const results = data.Results;

    return {
      year: results.find((item: { Variable: string; }) => item.Variable === "Model Year")?.Value || "N/A",
      make: results.find((item: { Variable: string; }) => item.Variable === "Make")?.Value || "N/A",
      model: results.find((item: { Variable: string; }) => item.Variable === "Model")?.Value || "N/A",
      bodyType: results.find((item: { Variable: string; }) => item.Variable === "Body Class")?.Value || "N/A",
      odometer: results.find((item: { Variable: string; }) => item.Variable === "Odometer")?.Value || "N/A",
    };
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    return null;
  }
}


export default getVehicleInfoByVIN