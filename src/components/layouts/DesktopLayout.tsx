import React from 'react';

interface DesktopLayoutProps {
  sections: React.ReactNode[];
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({ sections }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1200px] mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="space-y-8">
          {sections}
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;