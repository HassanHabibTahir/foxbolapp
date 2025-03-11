import React, { useState } from 'react';

interface CallLogFormData {
  beginningDate: string;
  endingDate: string;
  callingAccount: string;
  driverId: string;
  truckId: string;
  detailType: 'detail1' | 'detail2' | 'storedOnly' | null;
}

export default function CallLogReport() {
  const [formData, setFormData] = useState<CallLogFormData>({
    beginningDate: '',
    endingDate: '',
    callingAccount: '',
    driverId: '',
    truckId: '',
    detailType: null,
  });

  const handleSubmit = (action: 'download' | 'send' | 'print' | 'cancel') => {
    console.log(`Action: ${action}`, formData);
    // Implement actual functionality based on the action
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-emerald-800 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Call Log Report</h2>
        
        <div className="space-y-6">
          <h3 className="text-xl text-white mb-4">Leave Field Blank for All</h3>
          
          {/* Date Fields */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4 text-white">
            <label>Beginning Date</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="w-16 px-2 py-1 text-black"
                placeholder="MM"
                maxLength={2}
              />
              <span>/</span>
              <input 
                type="text" 
                className="w-16 px-2 py-1 text-black"
                placeholder="DD"
                maxLength={2}
              />
              <span>/</span>
              <input 
                type="text" 
                className="w-16 px-2 py-1 text-black"
                placeholder="YYYY"
                maxLength={4}
              />
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-4 text-white">
            <label>Ending Date</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="w-16 px-2 py-1 text-black"
                placeholder="MM"
                maxLength={2}
              />
              <span>/</span>
              <input 
                type="text" 
                className="w-16 px-2 py-1 text-black"
                placeholder="DD"
                maxLength={2}
              />
              <span>/</span>
              <input 
                type="text" 
                className="w-16 px-2 py-1 text-black"
                placeholder="YYYY"
                maxLength={4}
              />
            </div>
          </div>

          {/* Other Fields */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4 text-white">
            <label>Calling Account #</label>
            <input 
              type="text" 
              className="w-full px-3 py-1 text-black"
            />
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-4 text-white">
            <label>Driver #</label>
            <input 
              type="text" 
              className="w-full px-3 py-1 text-black"
            />
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-4 text-white">
            <label>Truck #</label>
            <input 
              type="text" 
              className="w-full px-3 py-1 text-black"
            />
          </div>

          {/* Radio Buttons */}
          <div className="flex gap-8 text-white mt-6">
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="detail" 
                value="detail1"
                className="form-radio"
              />
              Detail (1)
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="detail" 
                value="detail2"
                className="form-radio"
              />
              Detail (2)
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="detail" 
                value="storedOnly"
                className="form-radio"
              />
              Stored Only
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => handleSubmit('download')}
              className="px-4 py-2 bg-transparent border border-white text-white hover:bg-white hover:text-emerald-800 transition-colors"
            >
              Download
            </button>
            <button
              onClick={() => handleSubmit('send')}
              className="px-4 py-2 bg-white text-emerald-800 hover:bg-gray-100 transition-colors"
            >
              Send
            </button>
            <button
              onClick={() => handleSubmit('print')}
              className="px-4 py-2 bg-amber-700 text-white hover:bg-amber-800 transition-colors"
            >
              Print
            </button>
            <button
              onClick={() => handleSubmit('cancel')}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}