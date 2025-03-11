import React from 'react';

interface ARActionButtonsProps {
  onAction: (action: 'screen' | 'printer' | 'others' | 'cancel') => void;
}

export default function ARActionButtons({ onAction }: ARActionButtonsProps) {
  return (
    <div className="flex justify-between mt-8">
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
        onClick={() => onAction('cancel')}
        className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}