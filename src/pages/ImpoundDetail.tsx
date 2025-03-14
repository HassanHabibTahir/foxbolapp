import React, { useEffect, useState } from 'react';
import { FileText, Camera, Folder, Mail, Printer } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function ImpoundDetail() {
  const [dispatch, setDispatch] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [transaction, setTransaction] = useState<any>([]);
  const location = useLocation();
  const { dispatchNum ,foxtow_id} = location.state;

  const fetchDispatch = async (dispatchNum: string) => {
    const { data, error } = await supabase
      .from('towmast')
      .select('*')
      .eq('dispnum', dispatchNum)
      .eq('foxtow_id',foxtow_id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching dispatch:', error);
    } else {
      setDispatch(data);
    }
  };

  const fetchDriver = async (dispatchNum: string) => {
    const { data, error } = await supabase
      .from('towdrive')
      .select('*')
      .eq('dispnumdrv', dispatchNum)
      .maybeSingle();

    if (error) {
      console.error('Error fetching driver:', error);
    } else {
      setDriver(data);
    }
  };

  const fetchInvoice = async (dispatchNum: string) => {
    const { data, error } = await supabase
      .from('towinv')
      .select('*')
      .eq('dispnum', dispatchNum)
      .maybeSingle();

    if (error) {
      console.error('Error fetching invoice:', error);
    } else {
      setInvoice(data);
    }
  };

  const fetchTransaction = async (dispatchNum: string) => {
    const { data, error } = await supabase
      .from('towtrans')
      .select('*')
      .eq('dispnumtrs', dispatchNum);

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransaction(data || []);
    }
  };

  useEffect(() => {
    if (dispatchNum) {
      fetchDispatch(dispatchNum);
      fetchDriver(dispatchNum);
      fetchInvoice(dispatchNum);
      fetchTransaction(dispatchNum);
    }
  }, [dispatchNum]);

  const [selectedOption, setSelectedOption] = useState<any | null>(null)
  useEffect(() => {
      if (driver?.driver) {
        const fetchDriver = async () => {
          const { data, error } = await supabase.from("drivers").select().eq("driver_num", driver?.driver).single()

          if (!error && data) {
            setSelectedOption({
              value: data.driver_num,
              label: `${data.driver_fir} ${data.driver_las}`,
              driver: data,
            })
          }
        }

        fetchDriver()
      } else {
        setSelectedOption(null)
      }
    }, [driver?.driver])



  const formatVehicleDescription = (record: any) => {
    if (!record) return '';
    
    const parts = [
      record.yearcar,
      record.makecar,
      record.modelcar,
      record.colorcar
    ].filter(Boolean);
    
    return parts.join(' ');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const calculateDaysSince = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `(${diffDays} days)`;
  };

  const calculateTotal = () => {
    return transaction.reduce((acc: number, item: any) => acc + (item.quantity * item.price), 0);
  };




  return (
    <div className="min-h-screen bg-gray-50">
      {/* Action Buttons */}
      <div className="bg-white border-b px-4 py-2 flex gap-4 overflow-x-auto">
        <ActionButton icon={<FileText size={16} />} label="Modify Impound" dispatchNumber={dispatchNum}/>
        <ActionButton icon={<FileText size={16} />} label="Record Payment" />
        <ActionButton icon={<FileText size={16} />} label="Release Vehicle" />
        <ActionButton icon={<FileText size={16} />} label="Auction" />
        <ActionButton icon={<FileText size={16} />} label="Tow from Storage"   />
        <ActionButton icon={<Camera size={16} />} label="Upload Photos" />
        <ActionButton icon={<Folder size={16} />} label="Upload Files" />
        <ActionButton icon={<FileText size={16} />} label="Add Note" />
        <ActionButton icon={<Mail size={16} />} label="Email Invoice/Photos" />
        <ActionButton icon={<Printer size={16} />} label="Print Invoice" />
        <ActionButton icon={<Printer size={16} />} label="Print Summary" />
        <ActionButton icon={<Printer size={16} />} label="Print Property Release" />
      </div>

      {/* Main Content */}
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-6">
          Impound Details for #{dispatch?.dispnum} ({formatVehicleDescription(dispatch)})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Call Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-gray-100 px-4 py-2 rounded-t-lg">
              <h2 className="font-semibold">Call Details</h2>
            </div>
            <div className="p-4">
              <DetailRow 
                label="Impound Total" 
                value={invoice ? `$${invoice?.total?.toFixed(2)} as of ${formatDate(invoice?.invdate)}` : '-'} 
              />
              <DetailRow label="Storage Lot" value={dispatch?.lotsection || '-'} />
              <DetailRow 
                label="Date Impounded" 
                value={invoice?.dateStored ? 
                  `    ${formatDate(invoice.dateStored)} ${calculateDaysSince(invoice.dateStored)}` : 
                  '-'
                } 
              />
              <DetailRow label="Towed From" value={dispatch?.towedfrom || '-'} />
              <DetailRow label="Driver" value={selectedOption?.label || '-'} />
              <DetailRow label="Reason for Impound" value={dispatch?.reason || '-'} />
              <DetailRow label="Account" value={dispatch?.callname || '-'} />
              <DetailRow label="Call Number" value={dispatch?.callphone || '-'} />
              <DetailRow label="Stock Number" value={invoice?.invoicenum || '-'} />
              <DetailRow label="Lien Start" value={dispatch?.liendin ? formatDate(dispatch.liendin) : '-'} />
              <DetailRow label="Lien Clear" value={dispatch?.liendout ? formatDate(dispatch.liendout) : '-'} />
              <DetailRow label="Lien Type" value={dispatch?.lientype || '-'} />
            </div>
          </div>

          {/* Charges */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-gray-100 px-4 py-2 rounded-t-lg">
              <h2 className="font-semibold">Charges</h2>
            </div>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2">Item</th>
                    <th className="pb-2">Quantity</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.map((item: any, index: number) => (
                    <ChargeRow 
                      key={index}
                      item={item.description} 
                      quantity={item.quantity} 
                      price={item.price} 
                    />
                  ))}
                  <tr className="font-semibold">
                    <td colSpan={3} className="pt-4">Grand Total</td>
                    <td className="pt-4">${calculateTotal().toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-gray-100 px-4 py-2 rounded-t-lg">
              <h2 className="font-semibold">Vehicle Details</h2> 
            </div>
            <div className="p-4">
              <DetailRow label="Vehicle Description" value={formatVehicleDescription(dispatch)} />
              <DetailRow label="Plate #" value={dispatch?.licensenum || '-'} />
              <DetailRow label="VIN" value={dispatch?.vin || '-'} />
              <DetailRow label="Drive Type" value={dispatch?.type || '-'} />
              <DetailRow label="Have Keys" value={dispatch?.havekeys ? 'Yes' : 'No'} />
              <DetailRow label="Drivable" value={dispatch?.drivable ? 'Yes' : 'No'} />
            </div>
          </div>

          {/* Photographs */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-gray-100 px-4 py-2 rounded-t-lg">
              <h2 className="font-semibold">Photographs</h2>
            </div>
            <div className="p-4">
              <p className="text-sm mb-4">Click on the desired photo to view a larger copy of it.</p>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Files */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-gray-100 px-4 py-2 rounded-t-lg">
              <h2 className="font-semibold">Files</h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">
                There are no files to display. To add a file, click Upload Files at the top of this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, dispatchNumber }: { icon: React.ReactNode; label: string, dispatchNumber?: string }) {
  const navigate = useNavigate();

  const handleOnClick = (dispatchNum: any) => {
    if(label === 'Modify Impound') {
      navigate('/invoice', { state: { dispatchNum: dispatchNum } });
    }
  };
  return (
    <button onClick={() => {handleOnClick(dispatchNumber)}} className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded">
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row py-2 border-b last:border-b-0">
      <span className="font-medium w-48">{label}</span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}

function ChargeRow({ item, quantity, price }: { item: string; quantity: number; price: number }) {
  const lineTotal = quantity * price;
  return (
    <tr className="border-b">
      <td className="py-2">{item}</td>
      <td className="py-2">{quantity}</td>
      <td className="py-2">${price.toFixed(2)}</td>
      <td className="py-2">${lineTotal.toFixed(2)}</td>
    </tr>
  );
}

export default ImpoundDetail;