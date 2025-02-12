import React from 'react';

interface EmailSettingsProps {
  subject: string;
  message: string;
  onSubjectChange: (value: string) => void;
  onMessageChange: (value: string) => void;
}

export function EmailSettings({
  subject,
  message,
  onSubjectChange,
  onMessageChange
}: EmailSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">
        Specify the email text to use when sending an invoice to your customer.
      </h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm text-gray-700">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter email subject"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm text-gray-700">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter email message"
          />
        </div>
      </div>
    </div>
  );
}