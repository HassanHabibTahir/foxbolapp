import React from 'react';

interface DisclaimerEditorProps {
  disclaimer: string;
  onChange: (value: string) => void;
}

export function DisclaimerEditor({ disclaimer, onChange }: DisclaimerEditorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        Create a disclaimer that will be shown on statements created for this account.
      </label>
      <textarea
        value={disclaimer}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Enter a statement disclaimer for this account"
      />
    </div>
  );
}