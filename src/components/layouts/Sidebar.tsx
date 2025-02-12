import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Map, 
  Building2, 
  Users, 
  FileText, 
  Settings,
  Warehouse
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-[#002B7F] text-white h-screen p-4">
      <div className="flex items-center mb-8">
        <Truck className="w-8 h-8 mr-2" />
        <span className="text-xl font-bold">FoxTow</span>
      </div>
      
      <nav>
        <SidebarItem icon={<LayoutDashboard />} label="Dashboard" />
        <SidebarItem icon={<Truck />} label="Dispatching" />
        <SidebarItem icon={<Map />} label="Map" />
        <SidebarItem icon={<Warehouse />} label="Impounds" />
        <SidebarItem icon={<Building2 />} label="Accounts" />
        <SidebarItem icon={<FileText />} label="Reports" />
        <SidebarItem icon={<Settings />} label="Settings" active />
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false }) => {
  return (
    <div className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${active ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>
      {icon}
      <span className="ml-3">{label}</span>
    </div>
  );
};

export default Sidebar;