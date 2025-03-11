import React from 'react';

interface ConnectionStatusProps {
  establishedDate: string;
  onDisconnect: () => void;
}

const ConnectionStatus = ({ establishedDate, onDisconnect }: ConnectionStatusProps) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-700 mb-4">Connection Status</h2>
      <div className="bg-gray-50 p-4 rounded flex justify-between items-center">
        <div>
          <p className="text-sm">
            Connection with Square is <span className="text-green-600">active</span>.
          </p>
          <p className="text-sm text-gray-500">
            The connection was established on {establishedDate}.
          </p>
        </div>
        <button
          onClick={onDisconnect}
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors"
        >
          Disconnect from Square
        </button>
      </div>
    </div>
  );
};

export default ConnectionStatus;