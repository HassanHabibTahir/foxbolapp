"use client";

import { useState } from "react";

const ReleaseVehicle = ({ isOpen, onClose }: any) => {
  const [activeTab, setActiveTab] = useState(1);

  if (!isOpen) return null;

  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-2 rounded-lg shadow-lg w-[50%] max-h-[80vh] flex flex-col">
        <div className="overflow-y-auto flex-1">
          <div className="p-3 bg-white rounded  container mx-auto">
            <h2 className="text-lg font-semibold mb-2">Release Vehicle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <p className="mb-1 font-medium text-sm">
                  How was this vehicle released?
                </p>
                <div className="space-y-1 text-xs">
                  <label className="block">
                    <input type="radio" name="release" className="mr-1" />{" "}
                    Released - with Payment
                  </label>
                  <label className="block">
                    <input type="radio" name="release" className="mr-1" />{" "}
                    Released - to New Owner
                  </label>
                  <label className="block">
                    <input type="radio" name="release" className="mr-1" />{" "}
                    Released - Title Obtained
                  </label>
                  <label className="block">
                    <input type="radio" name="release" className="mr-1" />{" "}
                    Released - Title Surrendered
                  </label>
                  <label className="block">
                    <input type="radio" name="release" className="mr-1" />{" "}
                    Release - to Insurance
                  </label>
                  <label className="block">
                    <input type="radio" name="release" className="mr-1" />{" "}
                    Vehicle was scrapped
                  </label>
                  <label className="block">
                    <input type="radio" name="release" className="mr-1" /> Other
                    (please explain)
                  </label>
                  <label className="block">
                    <input type="radio" name="release" className="mr-1" />{" "}
                    Released - Promise to Pay
                  </label>
                </div>
              </div>

              <div>
                <div className="mb-2">
                  <label className="block font-medium mb-1 text-sm">
                    Release Date
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="border  px-1 py-0.5 w-full text-xs"
                    />
                    <input
                      type="time"
                      className="border  px-1 py-0.5 w-1/2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-sm">Total Amount Due</p>
                  <p className="text-red-600 text-lg font-semibold">$000.00</p>
                  <p className="text-xs text-gray-600">(0 days of storage)</p>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="mb-2 border-b flex text-xs font-medium space-x-3">
              <button
                className={`pb-1 ${
                  activeTab === 1
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => handleTabClick(1)}
              >
                1. Release Details
              </button>
              <button
                className={`pb-1 ${
                  activeTab === 2
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => handleTabClick(2)}
              >
                2. Payment Information
              </button>
              <button
                className={`pb-1 ${
                  activeTab === 3
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => handleTabClick(3)}
              >
                Notes (optional)
              </button>
            </div>

            {/* Tabs Content */}
            {activeTab === 1 && (
              <div className="">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="License #"
                    className="border px-2 py-1 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Birth Date"
                    className="border px-2 py-1 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="License Expiration Date"
                    className="border px-2 py-1 rounded text-xs"
                  />
                </div>

                <input
                  type="text"
                  placeholder="License Type (CA Driver's License, etc)"
                  className="border w-full px-2 py-1 rounded mb-2 text-xs"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="border px-2 py-1 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    className="border px-2 py-1 rounded text-xs"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Address"
                  className="border w-full px-2 py-1 rounded mb-2 text-xs"
                />
                <div className="flex flex-col md:flex-row gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="City"
                    className="border px-2 py-1 text-xs w-full md:w-[60%]"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="border px-2 py-1 text-xs w-full md:w-[20%]"
                  />
                  <input
                    type="text"
                    placeholder="Zip"
                    className="border px-2 py-1 text-xs w-full md:w-[20%]"
                  />
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="p-3 bg-white rounded-xl shadow-md">
                <h2 className="text-sm font-semibold mb-2 text-blue-700">
                  2. Payment Information
                </h2>

                <div className="mb-2">
                  <label className="block font-medium text-gray-700 mb-1 text-xs">
                    Payment Method
                  </label>
                  <div className="flex gap-4 text-xs">
                    <label className="flex items-center space-x-1">
                      <input type="radio" name="payment" checked />
                      <span>Single Payment</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input type="radio" name="payment" />
                      <span>Multiple Payments</span>
                    </label>
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block font-medium text-gray-700 mb-1 text-xs">
                    Payment #1 Type
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs">
                    <label className="flex items-center space-x-1">
                      <input type="radio" name="paymentType" checked />
                      <span>Not yet paid</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input type="radio" name="paymentType" />
                      <span>Cash</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input type="radio" name="paymentType" />
                      <span>Check</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input type="radio" name="paymentType" />
                      <span>Visa</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input type="radio" name="paymentType" />
                      <span>MasterCard</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input type="radio" name="paymentType" />
                      <span>Discover</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input type="radio" name="paymentType" />
                      <span>AMEX</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input type="radio" name="paymentType" />
                      <span>Debit Card</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1 text-xs">
                      Payment #1 Amount
                    </label>
                    <input
                      type="text"
                      className="w-full px-2 py-1 border  focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
                      value="415"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1 text-xs">
                      Reference Number (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-2 py-1 border  focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="p-3 bg-white rounded-xl shadow-md">
                <h2 className="text-sm font-semibold mb-2">Notes (optional)</h2>
                <textarea
                  className="w-full border px-2 py-1 rounded-md text-xs"
                  rows={4}
                  placeholder="Add any notes here..."
                ></textarea>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs">
              Release and Print
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">
              Release
            </button>
            <button
              onClick={() => onClose()}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReleaseVehicle;
