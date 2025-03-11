import React from 'react';
import { NoteEditor } from './NoteEditor';
import { useAccountSettings } from '../../hooks/useAccountSettings';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../common/Toast';
import type { Note } from './types';

const DEFAULT_NOTE: Note = {
  id: crypto.randomUUID(),
  content: '',
  createdAt: new Date(),
  updatedAt: new Date()
};

export function NotesView() {
  const accountId = '123'; // TODO: Get from context/props
  const { settings: note, setSettings: setNote, saveSettings, loading, error } = 
    useAccountSettings<Note>(
      accountId,
      'note_settings',
      DEFAULT_NOTE
    );
  const { toast, showToast } = useToast();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error.message}</div>;
  }

  const handleSave = async () => {
    try {
      const updatedNote = {
        ...note,
        updatedAt: new Date()
      };
      await saveSettings(updatedNote);
      showToast('Note saved successfully', 'success');
    } catch (error) {
      showToast('Error saving note', 'error');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="mb-4">
        <p className="text-sm text-gray-700">
          Record any notes that you want to keep regarding this account. These notes are only visible to your employees.
        </p>
      </div>

      <NoteEditor
        initialContent={note.content}
        onSave={(content) => setNote({ ...note, content })}
        placeholder="Enter your notes here..."
      />

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}