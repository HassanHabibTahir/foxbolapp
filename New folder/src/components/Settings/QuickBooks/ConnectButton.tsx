import React from 'react';
import { Receipt } from 'lucide-react';

interface ConnectButtonProps {
  onClick: () => void;
}

const ConnectButton = ({ onClick }: ConnectButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
    >
      <Receipt className="w-5 h-5 mr-2" />
      Connect to QuickBooks
    </button>
  );
};

export default ConnectButton;