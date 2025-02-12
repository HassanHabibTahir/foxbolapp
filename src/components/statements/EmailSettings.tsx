import React from 'react';

interface EmailSettingsProps {
  settings: {
    subject: string;
    message: string;
  };
  onChange: (settings: { subject: string; message: string }) => void;
}

export function EmailSettings({ settings, onChange }: EmailSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">
        Specify the email text to use when sending a statement to your customer.
      </h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm text-gray-700">Subject</label>
          <input
            type="text"
            id="subject"
            value={settings.subject}
            onChange={(e) => onChange({ ...settings, subject: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm text-gray-700">Message</label>
          <textarea
            id="message"
            value={settings.message}
            onChange={(e) => onChange({ ...settings, message: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}