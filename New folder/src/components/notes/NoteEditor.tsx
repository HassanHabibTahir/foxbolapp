import React, { useState, useEffect } from 'react';
import { Note } from './types';

interface NoteEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
  placeholder?: string;
}

export function NoteEditor({ initialContent = '', onSave, placeholder }: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleBlur = () => {
    if (content !== initialContent) {
      onSave(content);
    }
  };

  return (
    <div className="w-full">
      <textarea
        value={content}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full h-64 p-4 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        style={{ resize: 'vertical' }}
      />
    </div>
  );
}