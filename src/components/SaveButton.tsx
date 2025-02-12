import React from 'react';
import { Save } from 'lucide-react';
import { saveDispatch, SavePayload } from '../lib/saveHandlers';

interface SaveButtonProps {
  onSave: () => SavePayload;
  className?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave, className = '' }) => {
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = onSave();

      const result = await saveDispatch(payload);
      
      if (result.success) {
        // You might want to show a success message or update UI
        console.log('Saved successfully with foxtow_id:', result.foxtow_id);
      } else {
        // Handle error
        console.error('Save failed:', result.error);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 ${className}`}
    >
      <Save className="w-4 h-4" />
      {saving ? 'Saving...' : 'Save'}
    </button>
  );
};

export default SaveButton;