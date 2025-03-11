import React from 'react';

interface ActionButtonsProps {
  onAction: (action: 'screen' | 'printer' | 'others' | 'close') => void;
}

export default function ActionButtons({ onAction }: ActionButtonsProps) {
  return (
    <div className="flex justify-end space-x-4">
      <button
        onClick={() => onAction('screen')}
        className="px-6 py-2 bg-emerald-700 text-white hover:bg-emerald-600 transition-colors"
      >
        Screen
      </button>
      <button
        onClick={() => onAction('printer')}
        className="px-6 py-2 bg-white text-emerald-800 hover:bg-gray-100 transition-colors"
      >
        Printer
      </button>
      <button
        onClick={() => onAction('others')}
        className="px-6 py-2 bg-amber-700 text-white hover:bg-amber-600 transition-colors"
      >
        Others
      </button>
      <button
        onClick={() => onAction('close')}
        className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
      >
        Close
      </button>
    </div>
  );
}