import React from 'react';
import { Save } from 'lucide-react';
import { saveDispatch, SavePayload } from '../lib/saveHandlers';
import toast from 'react-hot-toast';
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

      const result:any = await saveDispatch(payload);
      
      if (result.success) {
        toast.success(`aved successfully with foxtow_id:`+ result.foxtow_id);

        console.log('Saved successfully with foxtow_id:', result.foxtow_id);
      } else {
        toast.error(result.error?.message||'');
        // console.error('Save failed:', result.error?.message        );
      }
    }catch(e:any){
      console.log(e,"error")
      toast.error(e?.message );
      // Handle error
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