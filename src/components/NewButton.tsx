import React from 'react';
import { PlusCircle } from 'lucide-react';
import { createNewDispatch } from '../lib/dispatchHandlers';

interface NewButtonProps {
  onNew: (dispatchNumber: string) => void;
  className?: string;
}

const NewButton: React.FC<NewButtonProps> = ({ onNew, className = '' }) => {
  const [creating, setCreating] = React.useState(false);

  const handleNew = async () => {
    try {
      setCreating(true);
      const result = await createNewDispatch();
      
      if (result.success && result.dispatch_number) {
        onNew(result.dispatch_number  );
      } else {
        console.error('Failed to create new dispatch:', result.error);
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <button
      onClick={handleNew}
      disabled={creating}
      className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 ${className}`}
    >
      <PlusCircle className="w-4 h-4" />
      {creating ? 'Creating...' : 'New Call'}
    </button>
  );
};

export default NewButton;