import React from 'react';
import { UsersList } from './UsersList';
import { AddUserModal } from './AddUserModal';
import { ExternalAccess } from './ExternalAccess';
import { useAccountSettings } from '../../hooks/useAccountSettings';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../common/Toast';
import { Plus } from 'lucide-react';
import type { User, ExternalAccessSettings } from './types';

interface UserSettings {
  users: User[];
  externalAccess: ExternalAccessSettings;
}

const DEFAULT_SETTINGS: UserSettings = {
  users: [],
  externalAccess: {
    enabled: false
  }
};

export function UsersView() {
  const accountId = '123'; // TODO: Get from context/props
  const { settings, setSettings, saveSettings, loading, error } = 
    useAccountSettings<UserSettings>(
      accountId,
      'user_settings',
      DEFAULT_SETTINGS
    );
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const { toast, showToast } = useToast();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error.message}</div>;
  }

  const handleAddUser = async (name: string, email: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      isActive: true
    };
    const updatedSettings = {
      ...settings,
      users: [...settings.users, newUser]
    };
    try {
      await saveSettings(updatedSettings);
      setSettings(updatedSettings);
      showToast('User added successfully', 'success');
    } catch (error) {
      showToast('Error adding user', 'error');
    }
  };

  const handleDeleteUser = async (id: string) => {
    const updatedSettings = {
      ...settings,
      users: settings.users.filter(user => user.id !== id)
    };
    try {
      await saveSettings(updatedSettings);
      setSettings(updatedSettings);
      showToast('User deleted successfully', 'success');
    } catch (error) {
      showToast('Error deleting user', 'error');
    }
  };

  const handleExternalAccessToggle = async (enabled: boolean) => {
    const updatedSettings = {
      ...settings,
      externalAccess: { enabled }
    };
    try {
      await saveSettings(updatedSettings);
      setSettings(updatedSettings);
      showToast('External access settings updated', 'success');
    } catch (error) {
      showToast('Error updating external access', 'error');
    }
  };

  return (
    <div className="p-6">
      <ExternalAccess
        settings={settings.externalAccess}
        onToggle={handleExternalAccessToggle}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Users</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add a new user
        </button>
      </div>

      <UsersList users={settings.users} onDeleteUser={handleDeleteUser} />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}