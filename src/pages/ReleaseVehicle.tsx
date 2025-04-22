import React, { useState } from "react";

const ReleaseVehicle = () => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState(1);

  // Function to handle tab click
  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  return (
    <div>
      <div className="p-6 bg-white rounded shadow container mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Release Vehicle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="mb-2 font-medium">How was this vehicle released?</p>
            <div className="space-y-2 text-sm">
              <label className="block">
                <input type="radio" name="release" className="mr-2" /> Released
                - with Payment
              </label>
              <label className="block">
                <input type="radio" name="release" className="mr-2" /> Released
                - to New Owner
              </label>
              <label className="block">
                <input type="radio" name="release" className="mr-2" /> Released
                - Title Obtained
              </label>
              <label className="block">
                <input type="radio" name="release" className="mr-2" /> Released
                - Title Surrendered
              </label>
              <label className="block">
                <input type="radio" name="release" className="mr-2" /> Release - to Insurance
              </label>
              <label className="block">
                <input type="radio" name="release" className="mr-2" /> Vehicle was scrapped
              </label>
              <label className="block">
                <input type="radio" name="release" className="mr-2" /> Other (please explain)
              </label>
              <label className="block">
                <input type="radio" name="release" className="mr-2" /> Released - Promise to Pay
              </label>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Release Date</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                />
                <input type="time" className="border rounded px-2 py-1 w-1/2" />
              </div>
            </div>
            <div>
              <p className="font-bold text-lg">Total Amount Due</p>
              <p className="text-red-600 text-2xl font-semibold">$000.00</p>
              <p className="text-sm text-gray-600">(0 days of storage)</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-4 border-b flex text-sm font-medium space-x-4">
          <button
            className={`pb-2 ${activeTab === 1 ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => handleTabClick(1)}
          >
            1. Release Details
          </button>
          <button
            className={`pb-2 ${activeTab === 2 ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => handleTabClick(2)}
          >
            2. Payment Information
          </button>
          <button
            className={`pb-2 ${activeTab === 3 ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => handleTabClick(3)}
          >
            Notes (optional)
          </button>
        </div>

        {/* Tabs Content */}
        {activeTab === 1 && (
      <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="License #"
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Birth Date"
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="License Expiration Date"
          className="border px-3 py-2 rounded"
        />
      </div>

      <input
        type="text"
        placeholder="License Type (CA Driver's License, etc)"
        className="border w-full px-3 py-2 rounded mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Full Name"
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Phone"
          className="border px-3 py-2 rounded"
        />
      </div>

      <input
        type="text"
        placeholder="Address"
        className="border w-full px-3 py-2 rounded mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="City"
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="State"
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Zip"
          className="border px-3 py-2 rounded"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Release and Print
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Release
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
        )}

        {activeTab === 2 && (
          <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">2. Payment Information</h2>
        
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">Payment Method</label>
            <div className="flex gap-6">
              <label className="flex items-center space-x-2">
                <input type="radio" name="payment" checked />
                <span>Single Payment</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="payment" />
                <span>Multiple Payments</span>
              </label>
            </div>
          </div>
        
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">Payment #1 Type</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="paymentType" checked />
                <span>Not yet paid</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="paymentType" />
                <span>Cash</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="paymentType" />
                <span>Check</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="paymentType" />
                <span>Visa</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="paymentType" />
                <span>MasterCard</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="paymentType" />
                <span>Discover</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="paymentType" />
                <span>AMEX</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="paymentType" />
                <span>Debit Card</span>
              </label>
            </div>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Payment #1 Amount</label>
              <input type="text" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" value="415" />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Reference Number (optional)</label>
              <input type="text" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
        </div>
        )}

        {activeTab === 3 && (
          <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Notes (optional)</h2>
            <textarea className="w-full border px-3 py-2 rounded-md" rows={5} placeholder="Add any notes here..."></textarea>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReleaseVehicle;








// import React from "react";

// const ReleaseVehicle = () => {
//   return (
//     <div>
//       <div className="p-6 bg-white rounded shadow container mx-auto">
//         <h2 className="text-2xl font-semibold mb-4">Release Vehicle</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <p className="mb-2 font-medium">How was this vehicle released?</p>
//             <div className="space-y-2 text-sm">
//               <label className="block">
//                 <input type="radio" name="release" className="mr-2" /> Released
//                 - with Payment
//               </label>
//               <label className="block">
//                 <input type="radio" name="release" className="mr-2" /> Released
//                 - to New Owner
//               </label>
//               <label className="block">
//                 <input type="radio" name="release" className="mr-2" /> Released
//                 - Title Obtained
//               </label>
//               <label className="block">
//                 <input type="radio" name="release" className="mr-2" /> Released
//                 - Title Surrendered
//               </label>
//               <label className="block">
//                 <input type="radio" name="release" className="mr-2" /> Release -
//                 to Insurance
//               </label>
//               <label className="block">
//                 <input type="radio" name="release" className="mr-2" /> Vehicle
//                 was scrapped
//               </label>
//               <label className="block">
//                 <input type="radio" name="release" className="mr-2" /> Other
//                 (please explain)
//               </label>
//               <label className="block">
//                 <input type="radio" name="release" className="mr-2" /> Released
//                 - Promise to Pay
//               </label>
//             </div>
//           </div>

//           <div>
//             <div className="mb-4">
//               <label className="block font-medium mb-1">Release Date</label>
//               <div className="flex gap-2">
//                 <input
//                   type="date"
//                   className="border rounded px-2 py-1 w-full"
//                 />
//                 <input type="time" className="border rounded px-2 py-1 w-1/2" />
//               </div>
//             </div>
//             <div>
//               <p className="font-bold text-lg">Total Amount Due</p>
//               <p className="text-red-600 text-2xl font-semibold">$000.00</p>
//               <p className="text-sm text-gray-600">(0 days of storage)</p>
//             </div>
//           </div>
//         </div>
//         <div className="mb-4 border-b flex text-sm font-medium space-x-4">
//           <button className="border-b-2 border-blue-600 text-blue-600 pb-2">
//             1. Release Details
//           </button>
//           <button className="text-gray-500 pb-2">2. Payment Information</button>
//           <button className="text-gray-500 pb-2">Notes (optional)</button>
//         </div>

// {/* {tabs 1} */}
{/* <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="License #"
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Birth Date"
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="License Expiration Date"
              className="border px-3 py-2 rounded"
            />
          </div>

          <input
            type="text"
            placeholder="License Type (CA Driver's License, etc)"
            className="border w-full px-3 py-2 rounded mb-4"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Phone"
              className="border px-3 py-2 rounded"
            />
          </div>

          <input
            type="text"
            placeholder="Address"
            className="border w-full px-3 py-2 rounded mb-4"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="City"
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="State"
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Zip"
              className="border px-3 py-2 rounded"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Release and Print
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Release
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </div> */}


//         {/*  tabs 2 */}
//         <div className="p-6 bg-white rounded-xl shadow-md">
//   <h2 className="text-xl font-semibold mb-4 text-blue-700">2. Payment Information</h2>

//   <div className="mb-4">
//     <label className="block font-medium text-gray-700 mb-1">Payment Method</label>
//     <div className="flex gap-6">
//       <label className="flex items-center space-x-2">
//         <input type="radio" name="payment" checked />
//         <span>Single Payment</span>
//       </label>
//       <label className="flex items-center space-x-2">
//         <input type="radio" name="payment" />
//         <span>Multiple Payments</span>
//       </label>
//     </div>
//   </div>

//   <div className="mb-4">
//     <label className="block font-medium text-gray-700 mb-1">Payment #1 Type</label>
//     <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
//       <label className="flex items-center space-x-2">
//         <input type="radio" name="paymentType" checked />
//         <span>Not yet paid</span>
//       </label>
//       <label className="flex items-center space-x-2">
//         <input type="radio" name="paymentType" />
//         <span>Cash</span>
//       </label>
//       <label className="flex items-center space-x-2">
//         <input type="radio" name="paymentType" />
//         <span>Check</span>
//       </label>
//       <label className="flex items-center space-x-2">
//         <input type="radio" name="paymentType" />
//         <span>Visa</span>
//       </label>
//       <label className="flex items-center space-x-2">
//         <input type="radio" name="paymentType" />
//         <span>MasterCard</span>
//       </label>
//       <label className="flex items-center space-x-2">
//         <input type="radio" name="paymentType" />
//         <span>Discover</span>
//       </label>
//       <label className="flex items-center space-x-2">
//         <input type="radio" name="paymentType" />
//         <span>AMEX</span>
//       </label>
//       <label className="flex items-center space-x-2">
//         <input type="radio" name="paymentType" />
//         <span>Debit Card</span>
//       </label>
//     </div>
//   </div>

//   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//     <div>
//       <label className="block font-medium text-gray-700 mb-1">Payment #1 Amount</label>
//       <input type="text" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" value="415" />
//     </div>
//     <div>
//       <label className="block font-medium text-gray-700 mb-1">Reference Number (optional)</label>
//       <input type="text" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
//     </div>
//   </div>
// </div>

        
//       </div>
//     </div>
//   );
// };

// export default ReleaseVehicle;
