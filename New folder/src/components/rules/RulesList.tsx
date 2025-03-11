import React from 'react';
import { Rule } from './types';
import { Trash2 } from 'lucide-react';

interface RulesListProps {
  rules: Rule[];
  onDeleteRule: (id: string) => void;
}

export function RulesList({ rules, onDeleteRule }: RulesListProps) {
  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <div
          key={rule.id}
          className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm"
        >
          <div>
            <h3 className="text-sm font-medium text-gray-900">{rule.name}</h3>
            {rule.description && (
              <p className="mt-1 text-sm text-gray-500">{rule.description}</p>
            )}
          </div>
          <button
            onClick={() => onDeleteRule(rule.id)}
            className="p-2 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
}