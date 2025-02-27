import React, { forwardRef, useState, useEffect } from 'react';
import FormSection from './common/FormSection';

interface NotesSectionProps {
  value: string;
  onChange: (value: string) => void;
  onEnterPress?: () => void;
  onKeyDown?:any
}

const NotesSection = forwardRef<HTMLTextAreaElement, NotesSectionProps>(({ 
  value, 
  onChange,
  onEnterPress,
  onKeyDown
}, ref) => {
  const [localValue, setLocalValue] = useState(value);

  // Update local state when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = new Date();
    
    // Format day
    const day = now.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Format time
    const hour = now.getHours();
    const minute = now.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'pm' : 'am';
    const hour12 = hour % 12 || 12;
    const timeStr = `${hour12}:${minute}${ampm}`;
    
    // Format date
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    const dateStr = `${month}/${date}/${year}`;
    
    // Combine all parts with proper spacing
    const timestamp = `${day} ${timeStr} ${dateStr} - `;
    
    // Insert at cursor position or append to end
    const textarea = e.target as HTMLTextAreaElement;
    const cursorPos = textarea.selectionStart;
    const textBefore = localValue.substring(0, cursorPos);
    const textAfter = localValue.substring(textarea.selectionEnd);
    
    // Add newline if not at start and previous character isn't newline
    const newValue = cursorPos === 0 || textBefore.endsWith('\n') 
      ? `${textBefore}${timestamp}${textAfter}`
      : `${textBefore}\n${timestamp}${textAfter}`;
    
    setLocalValue(newValue);
    onChange(newValue);
    
    // Set cursor position after timestamp
    setTimeout(() => {
      const newCursorPos = cursorPos + timestamp.length + (cursorPos === 0 || textBefore.endsWith('\n') ? 0 : 1);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {



    // Handle Ctrl+Enter or Cmd+Enter to add timestamp
    // if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    //   e.preventDefault();
    //   const target = e.target as HTMLTextAreaElement;
    //   const event = new MouseEvent('contextmenu', {
    //     bubbles: true,
    //     cancelable: true,
    //     clientX: target.getBoundingClientRect().left,
    //     clientY: target.getBoundingClientRect().top
    //   });
    //   target.dispatchEvent(event);
    //   return;
    // }

    // Handle Enter without shift for form navigation
    // if (e.key === 'Enter' && !e.shiftKey && onEnterPress) {
    //   e.preventDefault();
    //   onEnterPress();
    // }
    // if (e.key === 'ArrowDown') {

      onKeyDown(e)  
    // }
    // else if (e.key === 'Enter') {
    //   return;
    // }
  };

  return (
    <FormSection title="E - Notes">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Note
          <span className="text-sm text-gray-500 ml-2">
            (Right-click or press Ctrl+Enter to insert a timestamp.<b> To move to the next field, press the Right Arrow key</b>.)
          </span>
        </label>
        <textarea 
         
          ref={ref}
          className="h-10 text-[14px] mt-1 block w-full rounded-md border border-gray-300 p-2 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            resize-y min-h-[8rem]"
          value={localValue}
          onChange={handleChange}
          onContextMenu={handleContextMenu}
          onKeyDown={handleKeyDown}
          placeholder="Enter notes here..."
          title="Right-click or Ctrl+Enter to insert current date/time"
        />
      </div>
    </FormSection>
  );
});

NotesSection.displayName = 'NotesSection';

export default NotesSection;