import React from 'react';
import { Tag, TagCategory } from './types';

interface TagGroupProps {
  category: TagCategory;
  onTagToggle: (tagId: string) => void;
}

export function TagGroup({ category, onTagToggle }: TagGroupProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {category.tags.map((tag) => (
          <div key={tag.id} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id={tag.id}
                type="checkbox"
                checked={tag.isSelected}
                onChange={() => onTagToggle(tag.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <label
              htmlFor={tag.id}
              className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
            >
              {tag.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}