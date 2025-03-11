import React from 'react';

interface TabletLayoutProps {
  sections: React.ReactNode[];
}

const TabletLayout: React.FC<TabletLayoutProps> = ({ sections }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            {section}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabletLayout;