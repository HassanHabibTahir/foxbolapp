import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileLayoutProps {
  sections: React.ReactNode[];
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ sections }) => {
  const [currentSection, setCurrentSection] = React.useState(0);

  const nextSection = () => {
    setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
  };

  const prevSection = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 bg-white z-10 shadow-sm">
        <div className="flex justify-between items-center p-4">
          <button 
            onClick={prevSection}
            disabled={currentSection === 0}
            className="p-2 disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="font-medium">
            Section {currentSection + 1} of {sections.length}
          </span>
          <button 
            onClick={nextSection}
            disabled={currentSection === sections.length - 1}
            className="p-2 disabled:opacity-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="pt-16 p-4">
        {sections[currentSection]}
      </div>
    </div>
  );
};

export default MobileLayout;