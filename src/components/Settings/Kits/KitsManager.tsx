import React, { useState, useEffect } from 'react';
import { Kit } from './types';
import KitsForm from './KitsForm';
import KitsList from './KitsList';
import KitsSearch from './KitsSearch';
import { fetchKits, createKit, updateKit, deleteKit } from '../../../lib/services/kitService';
import toast from 'react-hot-toast';

const KitsManager: React.FC = () => {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedKit, setSelectedKit] = useState<Kit | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Load kits on component mount
  useEffect(() => {
    loadKits();
  }, []);

  const loadKits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchKits();
      setKits(data);
    } catch (err) {
      console.error('Failed to load kits:', err);
      setError('Failed to load kits. Please try again later.');
      toast.error('Failed to load kits. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKit = async (kit: Kit) => {
    try {
      setLoading(true);
      const newKit = await createKit(kit);
      setKits([newKit, ...kits]);
      toast.success('Kit created successfully!');
      setShowForm(false);
    } catch (err) {
      console.error('Failed to create kit:', err);
      toast.error('Failed to create kit. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateKit = async (kit: Kit) => {
    try {
      if (!kit.id) {
        throw new Error('Kit ID is required for update');
      }
      
      setLoading(true);
      const updatedKit = await updateKit(kit.id, kit);
      
      // Update the kits array with the updated kit
      setKits(kits.map(k => k.id === updatedKit.id ? updatedKit : k));
      
      toast.success('Kit updated successfully!');
      setSelectedKit(undefined);
      setShowForm(false);
    } catch (err) {
      console.error('Failed to update kit:', err);
      toast.error('Failed to update kit. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKit = async (id: string) => {
    try {
      setLoading(true);
      await deleteKit(id);
      setKits(kits.filter(kit => kit.id !== id));
      toast.success('Kit deleted successfully!');
    } catch (err) {
      console.error('Failed to delete kit:', err);
      toast.error('Failed to delete kit. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditKit = (kit: Kit) => {
    setSelectedKit(kit);
    setShowForm(true);
  };

  const handleAddNewKit = () => {
    setSelectedKit(undefined);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setSelectedKit(undefined);
    setShowForm(false);
  };

  const handleSubmitKit = async (kit: Kit) => {
    if (kit.id) {
      await handleUpdateKit(kit);
    } else {
      await handleCreateKit(kit);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Filter kits based on search term
  const filteredKits = kits.filter(kit => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (kit.kit?.toLowerCase() || '').includes(searchLower) ||
      (kit.cus?.toLowerCase() || '').includes(searchLower) ||
      (kit.class?.toLowerCase() || '').includes(searchLower) ||
      (kit.description?.toLowerCase() || '').includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Kit Management</h1>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <KitsSearch 
            searchTerm={searchTerm} 
            onSearchChange={handleSearchChange} 
            onClearSearch={handleClearSearch} 
          />
          
          <button
            onClick={showForm ? handleCancelForm : handleAddNewKit}
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
              showForm 
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {showForm ? 'Cancel' : 'Add New Kit'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
          <button 
            onClick={loadKits} 
            className="mt-2 text-sm font-medium text-red-700 hover:text-red-900"
          >
            Try Again
          </button>
        </div>
      )}

      {loading && !showForm && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Form section - now displayed above the list */}
      {showForm && (
        <div className="mb-8">
          <KitsForm 
            onSubmit={handleSubmitKit} 
            initialKit={selectedKit} 
          />
        </div>
      )}
      
      {/* List section - now always full width */}
      <div>
        {!loading && filteredKits.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Kits Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'No kits match your search criteria. Try a different search term or clear the search.'
                : 'There are no kits in the system yet. Click "Add New Kit" to create one.'}
            </p>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          !loading && (
            <KitsList 
              kits={filteredKits} 
              onEdit={handleEditKit} 
              onDelete={handleDeleteKit} 
            />
          )
        )}
      </div>
    </div>
  );
};

export default KitsManager;
