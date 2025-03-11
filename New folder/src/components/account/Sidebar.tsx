import React from 'react';
import { 
  Settings, Users, Tags, Book, FileText, 
  Receipt, Notebook, Building2, ScrollText, Cog
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'account', label: 'Account', icon: Settings },
  { id: 'pricing', label: 'Pricing', icon: Receipt },
  { id: 'rules', label: 'Rules', icon: ScrollText },
  { id: 'impounds', label: 'Impounds', icon: Building2 },
  { id: 'tags', label: 'Tags', icon: Tags },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'notes', label: 'Notes', icon: Notebook },
  { id: 'statements', label: 'Statements', icon: Book },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'advanced', label: 'Advanced', icon: Cog }
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-sm rounded-lg p-4">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentView === item.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}