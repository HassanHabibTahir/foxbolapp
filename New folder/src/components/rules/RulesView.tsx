import React from 'react';
import { RulesList } from './RulesList';
import { AddRuleForm } from './AddRuleForm';
import { useAccountSettings } from '../../hooks/useAccountSettings';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../common/Toast';
import { Plus } from 'lucide-react';
import type { Rule, RuleFormData } from './types';

export function RulesView() {
  const accountId = '123'; // TODO: Get from context/props
  const { settings: rules, setSettings: setRules, saveSettings, loading, error } = 
    useAccountSettings<Rule[]>(
      accountId,
      'rules_settings',
      []
    );
  const [isAddingRule, setIsAddingRule] = React.useState(false);
  const { toast, showToast } = useToast();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error.message}</div>;
  }

  const handleAddRule = async (formData: RuleFormData) => {
    const newRule: Rule = {
      id: crypto.randomUUID(),
      name: formData.name,
      description: formData.description,
      isActive: true,
      createdAt: new Date()
    };

    const updatedRules = [...rules, newRule];
    try {
      await saveSettings(updatedRules);
      setRules(updatedRules);
      setIsAddingRule(false);
      showToast('Rule added successfully', 'success');
    } catch (error) {
      showToast('Error adding rule', 'error');
    }
  };

  const handleDeleteRule = async (id: string) => {
    const updatedRules = rules.filter(rule => rule.id !== id);
    try {
      await saveSettings(updatedRules);
      setRules(updatedRules);
      showToast('Rule deleted successfully', 'success');
    } catch (error) {
      showToast('Error deleting rule', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Account Rules</h2>
        {!isAddingRule && (
          <button
            onClick={() => setIsAddingRule(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Rule
          </button>
        )}
      </div>

      {isAddingRule ? (
        <AddRuleForm
          onSubmit={handleAddRule}
          onCancel={() => setIsAddingRule(false)}
        />
      ) : rules.length > 0 ? (
        <RulesList rules={rules} onDeleteRule={handleDeleteRule} />
      ) : (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No rules have been added yet.</p>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}