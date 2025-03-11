import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Tab {
  id: string;
  label: string;
  path: string;
}

interface TabsProps {
  tabs: Tab[];
}

export function Tabs({ tabs }: TabsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}