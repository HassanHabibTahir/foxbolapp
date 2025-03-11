import React from 'react';
import { Bell, Cloud, FileText, LogOut } from 'lucide-react';

const Header = () => {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="text-sm">
        Certified Towing
        <div className="text-gray-500">Programmer1 (Manager)</div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full">
          <Cloud className="w-5 h-5" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full">
          <FileText className="w-5 h-5" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full">
          <Bell className="w-5 h-5" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full">
          <LogOut className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
          S
        </div>
      </div>
    </div>
  );
};

export default Header;