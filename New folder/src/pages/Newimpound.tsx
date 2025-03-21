import DesktopLayout from "../components/layouts/DesktopLayout";
// import NewButton from "../components/NewButton";
// import SaveButton from "../components/SaveButton";
import { Save } from 'lucide-react';
const Newimpound = () => {


    const handleSave = () => {
        // Implement save functionality here
        console.log("Saving impound data...")
      }

      const fields = [
        "Stock",
        "Dispatch",
        "Invoice",
        "Account",
        "Vehicle",
        "Plate",
        "VIN",
        "Impound Date",
        "Days Held",
        "Total",
        "Balance Due",
        "Storage Lot",
      ]

  const sections = [
    <>
    <div key="header" className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">New Impound</h1>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> Save
        </button>
      </div>
      <div key="fields" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field, index) => (
          <div key={index} className="space-y-2">
              <div>
              <label htmlFor={field.toLowerCase().replace(" ", "-")} className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
                  <input
                    type="text"
                    name="storageLot"
                    // value={formData.storageLot}
                    // onChange={handleInputChange}
                    id={field.toLowerCase().replace(" ", "-")} placeholder={`Enter ${field}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
            {/* <label htmlFor={field.toLowerCase().replace(" ", "-")}>{field}</label>
            <input id={field.toLowerCase().replace(" ", "-")} placeholder={`Enter ${field}`} /> */}
            </div>
          </div>
        ))}
      </div>
    </>,
  ];

  return <DesktopLayout sections={sections} />;
};

export default Newimpound;

