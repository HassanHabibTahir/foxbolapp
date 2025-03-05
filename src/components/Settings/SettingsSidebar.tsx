import React from 'react';
import {
  FileText,
  Building2,
  Bell,
  Map,
  CreditCard,
  Users,
  Truck,
  BookOpen,
  Receipt,
  Square,
  FileSpreadsheet,
  Umbrella,
  Twitch,
  BadgeDollarSign,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface SettingsSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const SettingsSidebar = ({ currentPage, onPageChange }: SettingsSidebarProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <SidebarItem
          icon={<FileText size={18} />}
          label={t('sidebar.overview')}
          id="overview"
          active={currentPage === 'overview'}
          onClick={() => onPageChange('overview')}
        />
      </div>

      <div className="mb-4">
        <div className="text-sm font-semibold mb-2 text-gray-500">{t('sidebar.company')}</div>
        <SidebarItem
          icon={<Building2 size={18} />}
          label={t('sidebar.companyProfile')}
          id="company-profile"
          active={currentPage === 'company-profile'}
          onClick={() => onPageChange('company-profile')}
        />
        <SidebarItem
          icon={<Bell size={18} />}
          label={t('sidebar.notification')}
          id="notifications"
          active={currentPage === 'notifications'}
          onClick={() => onPageChange('notifications')}
        />
        <SidebarItem
          icon={<Map size={18} />}
          label={t('sidebar.gpsIntegration')}
          id="gps"
          active={currentPage === 'gps'}
          onClick={() => onPageChange('gps')}
        />
      </div>

      <div className="space-y-1">
        <SidebarItem
          icon={<CreditCard size={18} />}
          label={t('sidebar.pricing')}
          id="pricing"
          active={currentPage === 'pricing'}
          onClick={() => onPageChange('pricing')}
        />
        <SidebarItem
          icon={<Users size={18} />}
          label={t('sidebar.users')}
          id="users"
          active={currentPage === 'users'}
          onClick={() => onPageChange('users')}
        />
        <SidebarItem
          icon={<Users size={18} />}
          label={t('sidebar.drivers')}
          id="drivers"
          active={currentPage === 'drivers'}
          onClick={() => onPageChange('drivers')}
        />
        <SidebarItem
          icon={<Truck size={18} />}
          label={t('sidebar.trucks')}
          id="trucks"
          active={currentPage === 'trucks'}
          onClick={() => onPageChange('trucks')}
        />
        <SidebarItem
          icon={<Truck size={18} />}
          label={t('sidebar.dispatching')}
          id="dispatching"
          active={currentPage === 'dispatching'}
          onClick={() => onPageChange('dispatching')}
        />
        <SidebarItem
          icon={<Building2 size={18} />}
          label={t('sidebar.impounds')}
          id="impounds"
          active={currentPage === 'impounds'}
          onClick={() => onPageChange('impounds')}
        />
        <SidebarItem
          icon={<BookOpen size={18} />}
          label={t('sidebar.addressBook')}
          id="address-book"
          active={currentPage === 'address-book'}
          onClick={() => onPageChange('address-book')}
        />
        <SidebarItem
          icon={<Receipt size={18} />}
          label={t('sidebar.quickbooksSetup')}
          id="quickbooks"
          active={currentPage === 'quickbooks'}
          onClick={() => onPageChange('quickbooks')}
        />
        <SidebarItem
          icon={<Square size={18} />}
          label={t('sidebar.squareSetup')}
          id="square-setup"
          active={currentPage === 'square-setup'}
          onClick={() => onPageChange('square-setup')}
        />
        <SidebarItem
          icon={<FileSpreadsheet size={18} />}
          label={t('sidebar.statements')}
          id="statements"
          active={currentPage === 'statements'}
          onClick={() => onPageChange('statements')}
        />
        <SidebarItem
          icon={<Umbrella size={18} />}
          label={t('Kits')}
          id="kits"
          active={currentPage === 'kits'}
          onClick={() => onPageChange('kits')}
        />
        <SidebarItem
          icon={<Twitch size={18} />}
          label={t('Items')}
          id="items"
          active={currentPage === 'items'}
          onClick={() => onPageChange('items')}
        />
        <SidebarItem
          icon={<BadgeDollarSign size={18} />}
          label={t('Prices')}
          id="prices"
          active={currentPage === 'prices'}
          onClick={() => onPageChange('prices')}
        />

        <div className="mt-4 pt-4 border-t border-gray-200">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactElement;
  label: string;
  id: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, active = false, onClick }: SidebarItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-2 rounded-lg mb-1 cursor-pointer ${active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
        }`}
    >
      {React.cloneElement(icon, { className: active ? 'text-blue-600 w-5 h-5 mr-3' : 'w-5 h-5 mr-3' })}
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default SettingsSidebar;