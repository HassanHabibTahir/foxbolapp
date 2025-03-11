import React from 'react';
import { useInvoiceDetails } from '../../../hooks/useInvoiceDetails';

interface InvoiceDetailsProps {
  invoiceId: string;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoiceId }) => {
  const { data, loading, error } = useInvoiceDetails(invoiceId);

  if (loading) {
    return (
      <div className="px-6 py-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-4">
        <div className="text-red-600">Failed to load invoice details</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-6 py-4">
        <div className="text-gray-500">No invoice details found</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Call Details</h3>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Vehicle</label>
            <div className="mt-1 text-sm text-gray-900">
              {data.yearcar} {data.makecar} {data.modelcar} ({data.colorcar})
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Towed From</label>
            <div className="mt-1 text-sm text-gray-900">{data.towedfrom}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Towed To</label>
            <div className="mt-1 text-sm text-gray-900">{data.towedto}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Driver</label>
            <div className="mt-1 text-sm text-gray-900">{data.driver}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Who Called</label>
            <div className="mt-1 text-sm text-gray-900">{data.whocalled}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Contact</label>
            <div className="mt-1 text-sm text-gray-900">{data.callphone}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;