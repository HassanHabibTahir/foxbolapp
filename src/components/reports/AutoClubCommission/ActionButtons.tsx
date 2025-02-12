import React from 'react';

interface ActionButtonsProps {
  onAction: (action: 'screen' | 'printer' | 'cancel') => void;
}

export default function ActionButtons({ onAction }: ActionButtonsProps) {
  return (
    <div className="flex justify-end space-x-4 mt-8">
      <button
        onClick={() => onAction('screen')}
        className="px-6 py-2 bg-white text-emerald-800 hover:bg-gray-100 transition-colors"
      >
        Print to Screen
      </button>
      <button
        onClick={() => onAction('printer')}
        className="px-6 py-2 bg-white text-emerald-800 hover:bg-gray-100 transition-colors"
      >
        Print to Printer
      </button>
      <button
        onClick={() => onAction('cancel')}
        className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}