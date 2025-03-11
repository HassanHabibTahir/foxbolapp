import React from 'react';
import { TagGroup } from './TagGroup';
import { useAccountSettings } from '../../hooks/useAccountSettings';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../common/Toast';
import { TAG_CATEGORIES } from './types';
import type { TagCategory } from './types';

export function TagsView() {
  const accountId = '123'; // TODO: Get from context/props
  const { settings: categories, setSettings: setCategories, saveSettings, loading, error } = 
    useAccountSettings<TagCategory[]>(
      accountId,
      'tag_settings',
      TAG_CATEGORIES
    );
  const { toast, showToast } = useToast();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error.message}</div>;
  }

  const handleTagToggle = (tagId: string) => {
    setCategories(categories.map(category => ({
      ...category,
      tags: category.tags.map(tag => 
        tag.id === tagId ? { ...tag, isSelected: !tag.isSelected } : tag
      )
    })));
  };

  const handleSave = async () => {
    try {
      await saveSettings(categories);
      showToast('Tags saved successfully', 'success');
    } catch (error) {
      showToast('Error saving tags', 'error');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <p className="text-sm text-gray-700">
          Tag accounts for things you patrol them for, or anything else you want to record about this account and others. 
          You can later search for accounts by what they're tagged for.
        </p>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <TagGroup
            key={category.name}
            category={category}
            onTagToggle={handleTagToggle}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-end space-x-4">
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