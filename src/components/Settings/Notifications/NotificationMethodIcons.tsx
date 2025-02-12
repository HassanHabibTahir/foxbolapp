import React from 'react';
import { Mail, Smartphone, Monitor } from 'lucide-react';

export const NotificationMethodIcons = () => {
  return (
    <div className="flex items-center gap-8">
      <Mail className="w-5 h-5 text-gray-500" />
      <Smartphone className="w-5 h-5 text-gray-500" />
      <Monitor className="w-5 h-5 text-gray-500" />
    </div>
  );
};