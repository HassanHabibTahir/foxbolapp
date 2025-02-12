import React from 'react';
import { Phone, Mail } from 'lucide-react';

interface ContactInfoProps {
  contactName: string;
  phone: string;
  fax: string;
  email: string;
  emailResponse: string;
  onContactNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onFaxChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onEmailResponseChange: (value: string) => void;
}

export function ContactInfo({
  contactName,
  phone,
  fax,
  email,
  emailResponse,
  onContactNameChange,
  onPhoneChange,
  onFaxChange,
  onEmailChange,
  onEmailResponseChange
}: ContactInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Contact Name</label>
        <input
          type="text"
          value={contactName}
          onChange={(e) => onContactNameChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fax</label>
          <input
            type="tel"
            value={fax}
            onChange={(e) => onFaxChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Send email response to:</label>
        <input
          type="email"
          value={emailResponse}
          onChange={(e) => onEmailResponseChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}