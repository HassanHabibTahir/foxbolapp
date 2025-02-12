import React, { useState } from 'react';
import { AccountBasicInfo } from './AccountBasicInfo';
import { ContactInfo } from './ContactInfo';
import { AccountOptions } from './AccountOptions';
import { AddressForm } from './AddressForm';
import { CreditOptions } from './CreditOptions';

export function ModifyAccount() {
  const [formData, setFormData] = useState({
    accountType: 'Police Department',
    accountName: 'Richmond Police Department',
    contactName: '',
    phone: '(510) 621-1801',
    fax: '510-233-1214#0',
    email: '',
    emailResponse: 'verificationemail@yahoo.com',
    taxExempt: true,
    emailInvoices: false,
    disableAccount: false,
    addContactToCalls: false,
    requirePayment: false,
    physicalAddress: {
      street: '1701 Regatta Blvd',
      city: 'Richmond',
      state: 'CA',
      zipCode: '94804',
      isPickupLocation: false
    },
    billingAddress: {
      street: 'Public Works PO Box 4046 Richmond CA 94804, City of Richmond Public Works',
      city: 'Richmond',
      state: 'CA',
      zipCode: '94804',
      contactName: '',
      contactEmail: ''
    },
    openingBalance: '0.00',
    creditHold: false
  });

  const handleSave = async () => {
    try {
      // TODO: Implement save logic with Supabase
      console.log('Saving account:', formData);
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  const handleDelete = async () => {
    try {
      // TODO: Implement delete logic with Supabase
      console.log('Deleting account:', formData);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6 space-y-6">
          <AccountBasicInfo
            accountType={formData.accountType}
            accountName={formData.accountName}
            onAccountTypeChange={(value) => setFormData({...formData, accountType: value})}
            onAccountNameChange={(value) => setFormData({...formData, accountName: value})}
          />

          <ContactInfo
            contactName={formData.contactName}
            phone={formData.phone}
            fax={formData.fax}
            email={formData.email}
            emailResponse={formData.emailResponse}
            onContactNameChange={(value) => setFormData({...formData, contactName: value})}
            onPhoneChange={(value) => setFormData({...formData, phone: value})}
            onFaxChange={(value) => setFormData({...formData, fax: value})}
            onEmailChange={(value) => setFormData({...formData, email: value})}
            onEmailResponseChange={(value) => setFormData({...formData, emailResponse: value})}
          />

          <AccountOptions
            taxExempt={formData.taxExempt}
            emailInvoices={formData.emailInvoices}
            disableAccount={formData.disableAccount}
            addContactToCalls={formData.addContactToCalls}
            requirePayment={formData.requirePayment}
            onOptionChange={(option, value) => setFormData({...formData, [option]: value})}
          />

          <AddressForm
            title="Physical Address"
            street={formData.physicalAddress.street}
            city={formData.physicalAddress.city}
            state={formData.physicalAddress.state}
            zipCode={formData.physicalAddress.zipCode}
            onChange={(field, value) => 
              setFormData({
                ...formData, 
                physicalAddress: {...formData.physicalAddress, [field]: value}
              })
            }
            showPickupOption={true}
            isPickupLocation={formData.physicalAddress.isPickupLocation}
            onPickupLocationChange={(value) => 
              setFormData({
                ...formData,
                physicalAddress: {...formData.physicalAddress, isPickupLocation: value}
              })
            }
          />

          <AddressForm
            title="Billing Address"
            street={formData.billingAddress.street}
            city={formData.billingAddress.city}
            state={formData.billingAddress.state}
            zipCode={formData.billingAddress.zipCode}
            onChange={(field, value) => 
              setFormData({
                ...formData, 
                billingAddress: {...formData.billingAddress, [field]: value}
              })
            }
            isBillingAddress={true}
            billingContactName={formData.billingAddress.contactName}
            billingContactEmail={formData.billingAddress.contactEmail}
            onBillingContactNameChange={(value) =>
              setFormData({
                ...formData,
                billingAddress: {...formData.billingAddress, contactName: value}
              })
            }
            onBillingContactEmailChange={(value) =>
              setFormData({
                ...formData,
                billingAddress: {...formData.billingAddress, contactEmail: value}
              })
            }
          />

          <CreditOptions
            openingBalance={formData.openingBalance}
            creditHold={formData.creditHold}
            onOpeningBalanceChange={(value) => setFormData({...formData, openingBalance: value})}
            onCreditHoldChange={(value) => setFormData({...formData, creditHold: value})}
          />

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
            
            <div className="flex space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}