import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { NotificationMethod } from './NotificationTypes';

interface NotificationRowProps {
  title: string;
  manager: NotificationMethod;
  dispatcher: NotificationMethod;
  onToggle: (role: 'manager' | 'dispatcher', type: keyof NotificationMethod) => void;
}

export const NotificationRow = ({ title, manager, dispatcher, onToggle }: NotificationRowProps) => {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      <div className="flex-1">
        <button className="flex items-center text-gray-700 hover:text-gray-900">
          <span>{title}</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </button>
      </div>
      
      {/* Manager notifications */}
      <div className="flex gap-8">
        <input
          type="checkbox"
          checked={manager.email}
          onChange={() => onToggle('manager', 'email')}
          className="w-4 h-4 rounded border-gray-300"
        />
        <input
          type="checkbox"
          checked={manager.sms}
          onChange={() => onToggle('manager', 'sms')}
          className="w-4 h-4 rounded border-gray-300"
        />
        <input
          type="checkbox"
          checked={manager.desktop}
          onChange={() => onToggle('manager', 'desktop')}
          className="w-4 h-4 rounded border-gray-300"
        />
      </div>

      {/* Dispatcher notifications */}
      <div className="flex gap-8">
        <input
          type="checkbox"
          checked={dispatcher.email}
          onChange={() => onToggle('dispatcher', 'email')}
          className="w-4 h-4 rounded border-gray-300"
        />
        <input
          type="checkbox"
          checked={dispatcher.sms}
          onChange={() => onToggle('dispatcher', 'sms')}
          className="w-4 h-4 rounded border-gray-300"
        />
        <input
          type="checkbox"
          checked={dispatcher.desktop}
          onChange={() => onToggle('dispatcher', 'desktop')}
          className="w-4 h-4 rounded border-gray-300"
        />
      </div>

      <button className="p-2 text-gray-400 hover:text-gray-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};