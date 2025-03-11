import { LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-accent"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border py-1">
          <button className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-50">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
          <button className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-50 text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}