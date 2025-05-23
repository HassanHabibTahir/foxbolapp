import React from "react";

interface DesktopLayoutProps {
  sections: React.ReactNode[];
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({ sections }) => {
  return (
    <div className="min-h-screen  bg-gray-50 p-0 sm:p-6 overflow-hidden">
      <div className=" w-full max-w-[100%] sm:max-w-[90%] mx-auto bg-white rounded-lg shadow-lg p-8  relative">
        <div className="space-y-8 w-full">
          {sections}
        </div>
      </div>
     </div>
  );
};

export default DesktopLayout;
