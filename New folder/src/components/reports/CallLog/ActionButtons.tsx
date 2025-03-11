import React from 'react';

interface ActionButtonsProps {
  onAction: (action: 'download' | 'send' | 'print' | 'cancel') => void;
}

export default function ActionButtons({ onAction }: ActionButtonsProps) {
  return (
    <div className="flex justify-between mt-8">
      <button
        onClick={() => onAction('download')}
        className="px-4 py-2 bg-transparent border border-white text-white hover:bg-white hover:text-emerald-800 transition-colors"
      >
        Download
      </button>
      <button
        onClick={() => onAction('send')}
        className="px-4 py-2 bg-white text-emerald-800 hover:bg-gray-100 transition-colors"
      >
        Send
      </button>
      <button
        onClick={() => onAction('print')}
        className="px-4 py-2 bg-amber-700 text-white hover:bg-amber-800 transition-colors"
      >
        Print
      </button>
      <button
        onClick={() => onAction('cancel')}
        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}